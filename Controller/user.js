const router = require('express').Router();
const crypto = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');

const {validateuserregistraation, validateuserlogin, validateUserLogout }= require('../Middleware/uservalidation');

const usermodel = require('../Models/usermodel');
const tokenmodel = require('../Models/tokenmodel');

//register a user
router.post('/register', validateuserregistraation, async(req, res)=>{

    //COMPLETE USER INFORMATION SHOULD HAVE BEEN VALIDATED BY NOW;
    const userdetails = req.body;

    const {regno, firstname, lastname, password} = userdetails;

    //CHECK IF USER WITH THIS REGISTRATION NUMBER ALREADY EXIST IN OUR DATABASE OR NOT;
    const user = await usermodel.findOne({regno: regno.toLowerCase()})
    if(user) return res.status(400).json({msg:"User with this Registration number already exist"});

    //HASH THE PASSWORD AND SAVE THE USER
    await crypto.genSalt(10, async(err, salt)=>{
        if(err) return res.status(500).json({msg:"Server error in generating the salt for password"});
        await crypto.hash(password, salt, async (err, hashedPassword)=>{
            if(err) return res.status(500).json({msg:"Server error in hashing the password"});
            let newuser = new usermodel({
                regno: regno.toLowerCase(), firstname: firstname, lastname: lastname, password: hashedPassword
             })
            await newuser.save();
        })
    })


    //GENRATE USER TOKEN AND SAVE IT IN THE DATABASE;
    const expiresin = new Date().getTime() + parseInt(process.env.access_token_expity_time);
    const accesstoken = jwt.sign({regno: regno}, process.env.jwt_secret_key, {expiresIn: expiresin});
    if(!accesstoken) return res.status(500).json({msg:"Error in generating access token"});
    const refreshtoken = randtoken.uid(256);
    const newtoken = new tokenmodel({
        regno:regno.toLowerCase(),
        refreshtoken:refreshtoken
    })
    await newtoken.save()


    res.status(201).json({success:true, message:"The user has been successfully saved", accesstoken: accesstoken,
        regno: regno.toLowerCase(),expiresin: expiresin
    })
})




//login a user
router.get('/login', validateuserlogin, async(req, res)=>{
    const userDetails = req.body;
    const regno = userDetails.regno.toLowerCase();

    //CHECK IF USER WITH THIS REGISTRATION NUMBER EXIST IN OUR DATABASE OR NOT
    const user = await usermodel.findOne({regno: regno})
    if(!user) return res.status(400).json({msg:"User with this Registration number do not exist! Please try again"});


    //CHECK IF USER WITH THIS REGISTRATION IS ALREADY LOGGED OR NOT;
    const token = await tokenmodel.findOne({regno: regno})
    if(token) if(user) return res.status(400).json({msg:"User with this Registration number is already logged in"});


    //GENRATE USER TOKEN AND SAVE IT IN THE DATABASE;
    const expiresin = new Date().getTime() + parseInt(process.env.access_token_expity_time);
    const accesstoken = jwt.sign({regno: regno}, process.env.jwt_secret_key, {expiresIn: expiresin});
    if(!accesstoken) return res.status(500).json({msg:"Error in generating access token"});
    const refreshtoken = randtoken.uid(256);
    const newtoken = new tokenmodel({
        regno:regno,
        refreshtoken:refreshtoken
    })
    await newtoken.save()

    //RETURN THE DATA BACK TO THE USER;
    return res.status(200).json({
        success:true,
        message:"The user is successfully logged in",
        accessToken:accesstoken,
        regno:regno,
        expiresin: expiresin
    });
})



// LOGOUT A USER.
router.delete("/logout", validateUserLogout, async(req, res)=>{

    const regno = req.body.regno.toLowerCase();

    // //CHECK IF USER WITH THIS REGSITARTION NUMBER EXIST OR NOT
    const user = usermodel.findOne({regno: regno});
    if(!user) return res.status(400).json({msg:"User with this registration number do not exits. cannot logout"});

    // //CHECK IF USER IS LOGGED IN OR NOT;
    const token = tokenmodel.findOne({regno: regno});
    if(!token) return res.status(400).json({msg:"The user is already logged out!. Cannot logout again"});

    // //FIND THE USER AND DELETE THE TOKEN RECORD OF THAT USER;
    tokenmodel.findOneAndDelete({regno: regno.toLowerCase()})
    .then((deletedtoken)=>{
        if(deletedtoken) return res.status(200).json({
            success: true,
            msg:"The user has successfully logged out"
        })
    })
    .catch(err=>{
        return res.status(500).json({msg:"Some error occourd in logging out the user"});
    })
})


module.exports = router;