const regNoRegex = new RegExp("[0-9]{2}[a-z]{3}[0-9]{4}");
const emailRegex = new RegExp("[a-z]{1,100}\.[a-z]{1,100}20[2-9]{1}[0-9]{1}(@vitstudent.ac.in)$");


/////////////////////////////CHECK IF USER DETAILS ARE IN CORRECT FORMAT///////////////////////////////

exports.checkIfDetailsAreInCorrectFormatOnRegistration = (regno, password)=>{

    const formatResponse = {
        password: true,
        regno: true,
    }
    if (password.length < 8)  formatResponse.password = false;
    if (!regNoRegex.test(regno)) formatResponse.regno = false;
    return formatResponse;
}

exports.checkIfDetailsAreInCorrectFormatOnLogin = (regno, password)=>{
    const formatResponse = {
        password: true,
        regno: true,
    }
    if (password.length < 8)  formatResponse.password = false;
    if (!regNoRegex.test(regno)) formatResponse.regno = false;
    return formatResponse;
}

exports.checkIfDetailsAreInCorrectFormatOnLogout = (regno)=>{
    const formatResponse = {
        regno: true,
    }
    if (!regNoRegex.test(regno)) formatResponse.regno = false;
    return formatResponse;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
