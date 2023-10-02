const handleRegister = (req, res, db, bcrypt) => { 
    const {name, email, password} = req.body;
    if (!name || !email || !password) {  //中身が空だと真
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')  //insert で更新された行のデータを取得
        .then(loginEmail => {
            //returnでresolveを返さないと先に次の.thenに行ってしまう可能性がある
            return trx('users')  
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            }).then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => res.status(400).json('unable to join.'));

    

    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // });
};

module.exports = {
    handleRegister: handleRegister
};