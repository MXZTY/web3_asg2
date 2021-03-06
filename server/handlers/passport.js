const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const { JWT_SECRET } = require('../configuration/index.js');
const user = require('../models/userSchema');

console.log(JWT_SECRET);

//JSON Web Tokens Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'), 
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        // Find the user specified in token 
        const user = await user.findById(payload.sub); 
       
        // if the user doesnt exist, return false instead of user
        if(!user){
            return done(null, false);
        }
        // else return the user with no errors
        done(null, user);
    } catch(error){
        done(error, false);
    }
}));


// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: '208048925927-9hhalutqphl06je9q3b13pv7nlepsvj8.apps.googleusercontent.com',
    clientSecret: 'rX5wzKPETVg-D-3EVXVDXV9O'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);


        // Check whether this current user exists in out DB
        const existingUser = await user.findOne({"google.id": profile.id });
        if(existingUser){
            console.log("User already exists in our DataBase");
            return done(null, existingUser);
        }
        console.log("User does not exist in our DataBase.... creating a new user in our db");

        // if its a new account
        const newUser = new user({
            //
            method: 'google',
            google: {//this is assigned from what you get back from google oauth
                //FORMAT >> userSchema structure: google structure 
                id: profile.id, 
                firstname:profile.name.givenName,
                lastname:profile.name.familyName,
                city:null,
                country:null,
                email: profile.emails[0].value,
                password:null,
            }
        });

        await newUser.save();
        done(null, newUser);
    } catch(error){
        done(error, false, error.message);
    }

}));



// LOCAL STRATEGY
passport.use(new LocalStrategy({
    //sign up sheet: schema placeholder
    usernameField: 'email'
}, async (email, password, done) => {
    try{
		console.log("using local strategy");
        //Find the user from the email field
        const localUser = await user.findOne({"local.email": email});
        // if not, handle it
        if(!localUser){
            return done(null, false);
        }

        // cheack if the password is correct. 
        const isMatch = await localUser.isValidPassword(password);

        // if not handle it. 
        if(!isMatch){
            return done(null, false);
        }

        //otherwise return the user. 
        done(null, localUser);

    } catch(error){
        done(error, false);
    }
}));

