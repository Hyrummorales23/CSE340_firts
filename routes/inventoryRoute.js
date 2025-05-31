// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require('../utilities/management-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//Route to build inventory by detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId)


//intentional error trigger
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));


// Inventory Management Route
router.get("/management", utilities.handleErrors(invController.buildManagement));
//Add-Classification View Route
router.get("/add-classification", utilities.handleErrors(invController.addClassificationView))
//Route to post the new Classification to the Database
router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

module.exports = router;