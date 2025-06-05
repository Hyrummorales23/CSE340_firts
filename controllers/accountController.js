//Needed resources
const utilities = require('../utilities')
const accountModel = require("../models/account-model")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* *********************************
 * Function to build the Login view
 * *********************************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email: ''
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

// Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    return res.redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ************************************************
* Function to deliver the ACCOUNT MANAGEMENT view
* ************************************************/
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null
  })
}

/* ************************************************
* Function to deliver the UPDATE ACCOUNT view
* ************************************************/
async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData: res.locals.accountData
  })
}

/* ************************************************
* Function to Process the ACCOUNT MANAGEMENT Update
* ************************************************/
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    const accountData = await accountModel.getAccountById(account_id)
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 3600 * 1000 
    })
    req.flash("notice", "Account updated successfully")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* ************************************************
* Function to Process the ACCOUNT PASSWORD Update
* ************************************************/
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body
  
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password change")
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null
    })
  }

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (updateResult) {
    req.flash("notice", "Password updated successfully")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null
    })
  }
}

/* **********************
* Process Logout Request
* ***********************/
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out")
  res.redirect("/")
}

module.exports = {buildLogin, buildRegister, registerAccount, 
  accountLogin, buildAccountManagement, buildUpdateView,
  updateAccount, updatePassword, accountLogout}