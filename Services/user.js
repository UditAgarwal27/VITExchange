const reg_no_regex = new RegExp("[0-9]{2}[a-z]{3}[0-9]{4}");
const email_regex = new RegExp("[a-z]{1,100}\.[a-z]{1,100}20[2-9]{1}[0-9]{1}(@vitstudent.ac.in)$");


/////////////////////////////CHECK IF USER DETAILS ARE IN CORRECT FORMAT///////////////////////////////

exports.check_if_details_are_in_correct_format_on_registration = (reg_no, password)=>{

    const format_response = {
        password: true,
        reg_no: true,
    }
    if (password.length < 8)  format_response.password = false;
    if (!reg_no_regex.test(reg_no)) format_response.reg_no = false;
    return format_response;
}

exports.check_if_details_are_in_correct_format_on_login = (reg_no, password)=>{
    const format_response = {
        password: true,
        reg_no: true,
    }
    if (password.length < 8)  format_response.password = false;
    if (!reg_no_regex.test(reg_no)) format_response.reg_no = false;
    return format_response;
}

exports.check_if_details_are_in_correct_format_on_logout = (reg_no)=>{
    const format_response = {
        reg_no: true,
    }
    if (!reg_no_regex.test(reg_no)) format_response.reg_no = false;
    return format_response;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
