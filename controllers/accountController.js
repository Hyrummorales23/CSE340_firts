//Needed resources
const utilities = require('../utilities')
const accountModel = require("../models/account-model")
const { validationResult } = require("express-validator")

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

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/****************
 * Login Process
 ****************/
async function loginAccount(req, res) {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("./account/login", {
      title: "Login",
      errors: errors.array(),
      account_email: req.body.account_email,
    })
  }

  // If no errors, continue login logic (for now you can just send success)
  res.send("Login successful (validation passed)")
}

module.exports = {buildLogin, buildRegister, registerAccount, loginAccount}