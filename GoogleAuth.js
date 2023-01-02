const passport = require('passport');
const User = require('./user');
require('dotenv').config()

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://reckno-authentication.onrender.com/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {

    //   console.log(profile)

    await User.findOne({email: profile.email}).then((currentUser)=>{
        if(currentUser)
        {
            //already have user in db
            //console.log(profile)
            console.log('user exists');
            done(null,currentUser)
        }
        else
        {
          
             User({
                username: profile.displayName,
                email: profile.email,
                id: "null"
              }).save().then((newUser)=>{
                //console.log(profile)
                console.log('new user created '+newUser);
                done(null, newUser);
              })
          
        }
    })
  }
));

//stuffs little info form user profile and put it into cookie
passport.serializeUser((user,done)=>{
 
   console.log(user);
    done(null,user._id); //error , id
})

//get id from cookie
passport.deserializeUser((id,done)=>{

User.findById(id).then((user)=>{
    done(null,user)
})

})

