const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl : { rejectUnauthorized: false },
      host : process.env.DATABASE_HOST,
      port : 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
    }
});

//console.log(db.select('*').from('users'));


const app = express();
//middleware settings
app.use(express.json()); //parce the json of body on POST
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get('/', (req, res) => {
    res.json('root');
})

app.post('/signin', (req, res) => signIn.handleSignIn(req, res, db, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db));

app.put('/image', (req, res) => image.handleImage(req, res, db));

app.post('/imageUrl',(req, res) => image.handleAPICall(req, res));

const port = process.env.PORT;

app.listen(port || 3000, () => {
    console.log(`app is running on port ${port}`);
});

// end points
// signin ok no post       done
// register user post      done
// profile/userid user get
// image update user put 
// 
