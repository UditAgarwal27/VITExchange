
const {check_if_details_are_in_correct_format_on_registration, check_if_details_are_in_correct_format_on_login, check_if_details_are_in_correct_format_on_logout} = require('../Services/user');

exports.validate_user_registration = (req, res, next)=>{
    const user_details = req.body;

    const reg_no = user_details.reg_no;
    const password = user_details.password;

    if(reg_no === undefined || reg_no === null) return res.status(400).json({is_success:false, msg:"Registration Number is not provided"});
    if(password === undefined || password === null) return res.status(400).json({is_success:false, msg:"Password is not provided"});

    const format_response = check_if_details_are_in_correct_format_on_registration(reg_no.toLowerCase(), password);
    if(format_response.reg_no === false) return res.status(400).json({is_success:false, msg:"Registration Number is not in correct format"});
    if(format_response.password === false) return res.status(400).json({is_success:false, msg:"Password should be minimum 8 characters"});

    next();
}

exports.validate_user_login =  (req, res, next)=>{

    const user_details = req.body;

    const reg_no = user_details.reg_no;
    const password = user_details.password;

    if(reg_no === undefined || reg_no === null) return res.status(400).json({is_success:false, msg:"Registration Number is not provided"});
    if(password === undefined || password === null) return res.status(400).json({is_success:false, msg:"Password is not provided"});

    const format_response = check_if_details_are_in_correct_format_on_login(reg_no.toLowerCase(), password);
    if(format_response.reg_no === false) return res.status(400).json({is_success:false, msg:"Registration Number is not in correct format"});
    if(format_response.password === false) return res.status(400).json({is_success:false, msg:"Password should be minimum 8 characters"});

    next();
}

exports.validate_user_logout = (req, res, next)=>{
    const access_token_with_bearer = req.headers['access-token'];
    const access_token = (access_token_with_bearer === undefined || access_token_with_bearer === null) ? null :  access_token_with_bearer.split(" ")[1];

    const user_details = req.body;
    const reg_no = user_details.reg_no;

    if(access_token === undefined || access_token === null) return res.status(400).json({
        is_success:false,
        msg:"Access token was not provided"
    })
    if(reg_no === undefined || reg_no === null) return res.status(400).json({
        is_success:false,
        msg:"Registration number was not provided"
    })

    const format_response = check_if_details_are_in_correct_format_on_logout(reg_no.toLowerCase());
    if(format_response.reg_no === false) return res.status(400).json({is_success:false, msg:"Registration Number is not in correct format"});
    next();
}