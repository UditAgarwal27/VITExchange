const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const token_model = require('../Models/token_model');
const internal_error_model = require('../Models/internal_errors');

exports.generate_access_token = (reg_no) => {
	//GENRATE USER TOKEN AND RETURN IT
	const expires_in = new Date().getTime() + parseInt(process.env.access_token_expiry_time);
	try{
		const access_token = jwt.sign({ reg_no: reg_no }, process.env.jwt_secret_key, { expiresIn: expires_in });
		const refresh_token = randtoken.uid(256);
		const new_token = new token_model({
			reg_no: reg_no.toLowerCase(),
			refresh_token: refresh_token
		})
		return { access_token, new_token, expires_in };
	}
	catch(err){
		const new_error = new internal_error_model({
			event:"Generating Access Tooken",
			error: err.message
		})
		new_error.save();
	}
}

exports.verify_user = (access_token, reg_no) => {
	try{
		const reg_no_generated = jwt.verify(access_token, process.env.jwt_secret_key);
		if (reg_no_generated.reg_no !== reg_no) return false;
		return true;
	}
	catch(err){
		const new_error = new internal_error_model({
			event:"Verifying User token",
			error: err.message
		})
		new_error.save();
	}
}