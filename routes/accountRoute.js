// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route for data validation before processing registration
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt with validation and controller
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build the ACCOUNT MANAGEMENT view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

module.exports = router