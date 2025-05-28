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

/* ******************************************
 * Function to deliver the registration view
 * *****************************************/
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  }

module.exports = {buildLogin, buildRegister}