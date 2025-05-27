//Needed resources
const utilities = require('../utilities')

/* *********************************
 * Function to build the Login view
 * *********************************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

module.exports = {buildLogin}