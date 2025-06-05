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
router.get("/", 
  utilities.checkLogin,
  utilities.checkAccountType("Employee", "Admin"),
  utilities.handleErrors(invController.buildManagement));
//Add-Classification View Route
router.get("/add-classification", 
  utilities.checkLogin,
  utilities.checkAccountType("Employee", "Admin"),
  utilities.handleErrors(invController.addClassificationView)
)
//Route to post the new Classification to the Database
router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)
//Add-Inventory View Route
router.get("/add-inventory", 
  utilities.checkLogin, 
  utilities.checkAccountType("Employee", "Admin"), 
  utilities.handleErrors(invController.addInventoryView))
//Route to post the new Inventory to the Database
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

//Route to getInventory by classificaiton_id in the Manage Inventory view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//Edit-Inventory View Route
router.get("/edit/:inv_id", 
  utilities.checkLogin,
  utilities.checkAccountType("Employee", "Admin"),
  utilities.handleErrors(invController.editInventoryView))
//Route to post the new Inventory to the Database
router.post(
  "/edit-inventory",
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.editInventory)
)

// Delete-Inventory View Route
router.get("/delete/:inv_id", 
  utilities.checkLogin,
  utilities.checkAccountType("Employee", "Admin"),
  utilities.handleErrors(invController.deleteInventoryView))
// Route to process the deletion
router.post(
  "/delete-inventory",
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;