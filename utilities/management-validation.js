const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")
const validate = {}

// Add to existing validation file or create new one
validate.classificationRules = () => {
    return [
      body("classification_name")
        .trim()
        .notEmpty()
        .withMessage("Classification name is required")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("No spaces or special characters allowed")
    ]
  }
  
  validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      return res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: errors.array(),
        classification_name
      })
    }
    next()
  }

  module.exports = validate