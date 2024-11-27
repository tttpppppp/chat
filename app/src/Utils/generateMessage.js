const fomatTime = require('dateformat');
const createMessage = (message , username) =>{
    return {
        username,
        message,
        createAt :fomatTime("dd/MM/yyyy - hh:mm:ss",new Date())
    }
}

module.exports = {createMessage}