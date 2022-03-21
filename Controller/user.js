const router = require('express').Router();
const crypto = require('bcryptjs');

const {validate_user_registration, validate_user_login, validate_user_logout }= require('../Middleware/user_validation');
const {generate_access_token, verify_user} = require('../Services/token');

const user_model = require('../Models/user_model');
const token_model = require('../Models/token_model');

//register a user
router.post('/register', validate_user_registration, async(req, res)=>{

    //COMPLETE USER INFORMATION SHOULD HAVE BEEN VALIDATED BY NOW;
    const user_details = req.body;
    const {reg_no, first_name, last_name, password} = user_details;

    //CHECK IF USER WITH THIS REGISTRATION NUMBER ALREADY EXIST IN OUR DATABASE OR NOT;
    const user = await user_model.findOne({reg_no: reg_no.toLowerCase()})
    if(user) return res.status(400).json({is_success:false, msg:"User with this Registration number already exist"});

    //GENRATE USER TOKEN
    const {access_token, new_token, expires_in} = generate_access_token(reg_no);
    if(!access_token || !new_token.refresh_token) return res.status(500).json({is_success:false, msg:"Server error in generating tokens"});

    //HASH THE PASSWORD AND SAVE THE USER AND THE REFRESH TOKEN
    await crypto.genSalt(10, async(err, salt)=>{
        if(err) return res.status(500).json({msg:"Server error in generating the salt for password"});
        await crypto.hash(password, salt, async (err, hashed_password)=>{
            if(err) return res.status(500).json({msg:"Server error in hashing the password"});
            let new_user = new user_model({
                reg_no: reg_no.toLowerCase(), first_name: first_name, last_name: last_name, password: hashed_password
             })
            await new_user.save();
            await new_token.save()
        })
    })
    res.status(201).json({is_success:true, message:"The user has been successfully saved", access_token: access_token,
        reg_no: reg_no.toLowerCase(),expires_in: expires_in
    })
})



//login a user
router.get('/login', validate_user_login, async(req, res)=>{
    const user_details = req.body;
    const reg_no = user_details.reg_no.toLowerCase();

    //CHECK IF USER WITH THIS REGISTRATION NUMBER EXIST IN OUR DATABASE OR NOT
    const existing_user = await user_model.findOne({reg_no: reg_no})
    if(!existing_user) return res.status(400).json({is_success:false, msg:"User with this Registration number do not exist! Please try again"});


    //CHECK IF USER WITH THIS REGISTRATION IS ALREADY LOGGED OR NOT;
    const token = await token_model.findOne({reg_no: reg_no})
    if(token) return res.status(400).json({is_success:false, msg:"User with this Registration number is already logged in"});


    //GENRATE USER TOKEN AND SAVE IT IN THE DATABASE;
    const {access_token, new_token, expires_in} = generate_access_token(reg_no);
    if(!access_token || !new_token.refresh_token) return res.status(500).json({is_success:false, msg:"Server error in generating tokens"});
    await new_token.save()

    //RETURN THE DATA BACK TO THE USER;
    return res.status(200).json({
        is_success:true,
        message:"The user is successfully logged in",
        access_token:access_token,
        reg_no:reg_no,
        expires_in: expires_in
    });
})



// LOGOUT A USER.
router.delete("/logout", validate_user_logout, async(req, res)=>{
    const reg_no = req.body.reg_no.toLowerCase();
    const access_token_with_bearer = req.headers['access-token'];
    const access_token = access_token_with_bearer.split(" ")[1];

    // //CHECK IF USER WITH THIS REGSITARTION NUMBER EXIST OR NOT
    const user = user_model.findOne({reg_no: reg_no});
    if(!user) return res.status(400).json({is_success: false, msg:"User with this registration number do not exits. cannot logout"});

    // //CHECK IF USER IS LOGGED IN OR NOT;
    const token = await token_model.findOne({reg_no: reg_no.toLowerCase()});
    if(!token) return res.status(400).json({is_success: false, msg:"The user is already logged out!. Cannot logout again"});

    //CHECK IF CORRECT USER (ASSOCIATED WITH THE SENT ACCESS TOKEN) IS TRYING TO LOGOUT;
    if(!verify_user(access_token, reg_no))  return res.status(403).json({is_success: false, msg:"Invalid token! User not authorized to logout"});


    // //FIND THE USER AND DELETE THE TOKEN RECORD OF THAT USER;
    await token_model.findOneAndDelete({reg_no: reg_no.toLowerCase()})
    .then((deleted_token)=>{
        if(deleted_token) res.status(200).json({
            is_success: true,
            msg:"The user has successfully logged out"
        })
    })
    .catch(err=>{
         res.status(500).json({is_success:false, msg:"Some error occourd in logging out the user"});
    })
})


module.exports = router;