const router = require('express').Router();

const token_model = require('../../Models/token_model');

const {generate_access_token} = require('../../Services/token');

router.get('', async(req, res)=>{

    const reg_no = req.body.reg_no;

    if (reg_no === null || reg_no === undefined) return res.status(400).json({msg:"Registration number required to generate new access token"});

    const {access_token, new_token, expires_in} = generate_access_token(reg_no);

    const deleted_token = token_model.findOneAndDelete({reg_no: reg_no});
    
    if(!deleted_token) return res.status(500).json({msg:"Server error in deleting the user Session"});

    await new_token.save()

    //RETURN THE DATA BACK TO THE USER;
    return res.status(200).json({
        success:true,
        access_token:access_token,
        reg_no:reg_no,
        expires_in: expires_in
    });
})


module.exports = router;