const router = require('express').Router();

const tokenmodel = require('../../Models/tokenmodel');

const {generateAccessToken} = require('../../Services/token');

router.get('', async(req, res)=>{

    const regno = req.body.regno;

    if (regno === null || regno === undefined) return res.status(400).json({msg:"Registration number required to generate new access token"});

    const {accesstoken, newtoken, expiresin} = generateAccessToken(regno);

    const deletedToken = tokenmodel.findOneAndDelete({regno: regno});
    
    if(!deletedToken) return res.status(500).json({msg:"Server error in deleting the user Session"});

    await newtoken.save()

    //RETURN THE DATA BACK TO THE USER;
    return res.status(200).json({
        success:true,
        accessToken:accesstoken,
        regno:regno,
        expiresin: expiresin
    });
})


module.exports = router;