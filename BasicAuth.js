const express = require('express');
const passport = require('passport');
const session = require('express-session')
const cookieSession = require('cookie-session')
require('./GoogleAuth');
require('./GithubAuth');
const app = express()
require('dotenv').config()

app.use(cookieSession({
    maxAge: 15*60*60*1000,
    keys: [process.env.COOKIE_KEY] // encrypts the cookie in browser
}))

//app.use(session({ secret: "cats", resave: false }));
app.use(passport.initialize());
app.use(passport.session());

const mongoose = require('mongoose');
const User = require('./user');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_URI,()=>{
    console.log("connected to mongodb");
} , e=> console.error(e));

const cors = require('cors');
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());


function isLogged(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('/Login', async (req,res) => {
    console.log(req.body.name)
    await User.findOne({username: req.body.name}).then((currentUser)=>{
        
        
        if(currentUser)
        {
        console.log('user exists');
        res.send(200);
        }
        else
        {

            res.send('user does not exist');
            
        }
    })
    
})

app.post('/signup', (req,res) => {
 
        console.log(req.body.name)
           
            User({
                username: req.body.name,
                email : req.body.email,
                password: req.body.password
              }).save().then((newUser)=>{
                //console.log(profile)
                console.log('new user created '+newUser);
                res.send(200)
              })

    
})

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a><br/> <a href="/auth/github">Authenticate with Github</a>');
    
})


app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    }))


//github authentication
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', {  
        successRedirect: '/protected',
         failureRedirect: '/auth/failure' 
        }))


    //basic endpoints

    app.get('/auth/failure', (req, res) => {
        res.send("INVALID LOGIN")
    })
    
    app.get('/protected', isLogged, (req, res) => {
        res.send("hello u have successfully logged in! "+req.user.username);
        //res.send(`${req.user.displayname}`)
    })
    
    app.get('/logout', (req, res) => {
        req.logOut();
        res.send('Goodbye!');
    })
    

    const vercel_port = 'my-space-backend-ten.vercel.app'
app.listen(3000 || process.env.PORT || vercel_port, () => {
    console.log("listening at 3000");
})