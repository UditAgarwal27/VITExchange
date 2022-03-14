
const {checkIfDetailsAreInCorrectFormatOnRegistration, checkIfDetailsAreInCorrectFormatOnLogin, checkIfDetailsAreInCorrectFormatOnLogout} = require('../Services/user');

exports.validateuserregistraation = (req, res, next)=>{
    const userDetails = req.body;

    const regno = userDetails.regno;
    const password = userDetails.password;

    if(regno === undefined || regno === null) return res.status(400).json({msg:"regno not provided"});
    if(password === undefined || password === null) return res.status(400).json({msg:"password not provided"});

    const formatResponse = checkIfDetailsAreInCorrectFormatOnRegistration(regno.toLowerCase(), password);
    if(formatResponse.regno === false) return res.status(400).json({msg:"Registration Number is not in correct format"});
    if(formatResponse.password === false) return res.status(400).json({msg:"Password should be minimum 8 characters"});

    next();
}

exports.validateuserlogin =  (req, res, next)=>{

    const userDetails = req.body;

    const regno = userDetails.regno;
    const password = userDetails.password;

    if(regno === undefined || regno === null) return res.status(400).json({msg:"Registration Number is not provided"});
    if(password === undefined || password === null) return res.status(400).json({msg:"Password is not provided"});

    const formatResponse = checkIfDetailsAreInCorrectFormatOnLogin(regno.toLowerCase(), password);
    if(formatResponse.regno === false) return res.status(400).json({msg:"Registration Number is not in correct format"});
    if(formatResponse.password === false) return res.status(400).json({msg:"Password should be minimum 8 characters"});

    next();
}

exports.validateUserLogout = (req, res, next)=>{
    const accessTokenWithBearer = req.headers['access-token'];
    const accessToken = (accessTokenWithBearer === undefined || accessTokenWithBearer === null) ? null :  accessTokenWithBearer.split(" ")[1];

    const userDetails = req.body;
    const regno = userDetails.regno;

    if(accessToken === undefined || accessToken === null) return res.status(400).json({
        msg:"Access token was not provided"
    })
    if(regno === undefined || regno === null) return res.status(400).json({
        msg:"Registration number was not provided"
    })

    const formatResponse = checkIfDetailsAreInCorrectFormatOnLogout(regno.toLowerCase());
    if(formatResponse.regno === false) return res.status(400).json({msg:"Registration Number is not in correct format"});
    next();

}