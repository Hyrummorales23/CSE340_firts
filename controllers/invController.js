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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
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
    // Add classificationSelect here
    const classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect, // Include this
      errors: null // Also include errors
    })
  } else {
    req.flash("notice", "Sorry, the classification addition failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null // Make sure errors is included here too
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
    // Add classificationSelect here
    const classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect, // Include this in the rendered data
      errors: null // Also include errors to prevent potential undefined errors
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

/* ********************************************
 *  Return Inventory by Classification As JSON
 * *******************************************/
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/**********************************
 *Build Edit-Inventory view
 **********************************/
 invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    // Validate the ID is a number
    if (isNaN(inv_id)) {
      throw new Error("Invalid inventory ID")
    }
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryItemById(inv_id)
    // Check if item exists
    if (!itemData) {
      throw new Error("Inventory item not found")
    }
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    next(error)
  }
}

/**********************************
 * Edit-Inventory Process
 **********************************/
invCont.editInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  
  const {
    inv_id, // This must come first to match model function
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id // This should be last
  } = req.body;

  console.log("Updating vehicle ID:", inv_id); // Debug log
  console.log("New classification ID:", classification_id); // Debug log

  const updateResult = await invModel.editInventory(
      parseInt(inv_id), // First parameter must be inv_id
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      parseFloat(inv_price),
      parseInt(inv_year),
      parseInt(inv_miles),
      inv_color,
      parseInt(classification_id) // Last parameter
    );
  
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash(
      "notice",
      `The ${itemName} was successfully updated.`
    )
    res.redirect("/inv/")
  } else {
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the vehicle update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/**********************************
 * Build Delete Confirmation View
 **********************************/
invCont.deleteInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    // Validate the ID is a number
    if (isNaN(inv_id)) {
      throw new Error("Invalid inventory ID")
    }
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryItemById(inv_id)
    // Check if item exists
    if (!itemData) {
      throw new Error("Inventory item not found")
    }
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price
    })
  } catch (error) {
    next(error)
  }
}

/**********************************
 * Process Inventory Deletion
 **********************************/
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)
    
    if (deleteResult.rowCount === 1) {
      const itemData = await invModel.getInventoryItemById(inv_id)
      const itemName = itemData ? `${itemData.inv_make} ${itemData.inv_model}` : 'Vehicle'
      req.flash("notice", `The ${itemName} was successfully deleted.`)
      res.redirect("/inv/")
    } else {
      throw new Error("Delete failed - no rows affected")
    }
  } catch (error) {
    req.flash("notice", "Sorry, the deletion failed.")
    res.redirect(`/inv/delete/${req.body.inv_id}`)
  }
}

module.exports = invCont
