const passport = require('passport');
const User = require('./user');
require('dotenv').config()


const GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://reckno-authentication.onrender.com/auth/github/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        
        console.log(profile);
        await User.findOne({username: profile.username}).then((currentUser)=>{
            if(currentUser)
            {
                //already have user in db
                console.log(profile.username)
                console.log('user exists');
                done(null,currentUser)
            }
            else
            {
              
                console.log(profile.username)
                 User({
                    username: profile.displayName,
                    id: profile.id,
                    email: "null"
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
 
    done(null,user.id); //error , id
})

//get id from cookie
passport.deserializeUser((id,done)=>{

  
  
User.findById(id).then((user)=>{
    done(null,user)
})

})
