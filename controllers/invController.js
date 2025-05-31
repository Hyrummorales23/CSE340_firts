const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ****************************************
 *  Build inventory by classification view
 * ****************************************/
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* *********************************
 * Build inventory by detail view
 * *********************************/
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryItemById(inv_id)
  if (data) {
    const detailHTML = await utilities.buildInventoryDetail(data)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detailHTML,
    })
  } else {
    next({status: 404, message: 'Vehicle not found'})
  }
}

/**********************************************
 *Intentional Error for Server Error view Link
 **********************************************/
invCont.triggerError = async function(req, res, next) {
  // Intentionally throw an error
  throw new Error("Intentional 500 error triggered");
}

/**********************************
 *Build Inventory Management view
 **********************************/
 invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/**********************************
 *Build Add-classification view
 **********************************/
 invCont.addClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/**********************************
 * Add-classification Process
 **********************************/
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()
  
  const regResult = await invModel.addClassification(classification_name)
  
  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    nav = await utilities.getNav() // Refresh nav with new classification
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the classification addition failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

/**********************************
 *Build Add-Inventory view
 **********************************/
 invCont.addInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

/**********************************
 * Add-Inventory Process
 **********************************/
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  
  const {
    classification_id, inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  } = req.body
  
  const invResult = await invModel.addInventory({
    classification_id, inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  })
  
  if (invResult.rowCount > 0) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    let classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, the vehicle addition failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
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
}

module.exports = invCont
