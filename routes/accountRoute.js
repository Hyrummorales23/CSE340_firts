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

// Account-Update View Route
router.get("/update/:account_id", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
)
//Account-Update Process route
router.post("/update",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)
//Update-password Process route
router.post("/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Add logout route
router.get("/logout", 
  utilities.handleErrors(accountController.accountLogout))

module.exports = router