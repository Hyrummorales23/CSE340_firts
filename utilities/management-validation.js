const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")
const validate = {}

//Validation Rules for Adding a New Classification
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

//Add New Classification process (sticky form)
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

//Add new Inventory Rules
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required"),
    body("inv_make")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters"),
    body("inv_model")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters"),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("inv_price")
      .isDecimal()
      .withMessage("Price must be a valid number"),
    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be between 1900-2099"),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number"),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required")
  ]
}

// Add New Inventory Process (sticky form)
validate.checkInventoryData = async (req, res, next) => {
  const { 
    classification_id, inv_make, inv_model, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color 
  } = req.body
  
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    return res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
  }
  next()
}

module.exports = validate