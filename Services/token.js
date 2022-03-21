const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const tokenmodel = require('../Models/tokenmodel');

exports.generateAccessToken = (regno)=>{
    //GENRATE USER TOKEN AND RETURN IT
    const expiresin = new Date().getTime() + parseInt(process.env.access_token_expity_time);
    const accesstoken = jwt.sign({regno: regno}, process.env.jwt_secret_key, {expiresIn: expiresin});
    const refreshtoken = randtoken.uid(256);
    const newtoken = new tokenmodel({
        regno:regno.toLowerCase(),
        refreshtoken:refreshtoken
    })
    return {accesstoken, newtoken, expiresin};
}