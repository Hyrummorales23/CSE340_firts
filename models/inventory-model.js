const pool = require("../database/")

/* ******************************
 *  Get all classification data
 * ******************************/
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* **********************************************************************
 *  Get all inventory items and classification_name by classification_id
 * **********************************************************************/
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/********************************************
 * Get all inventory items by inventory_id
 ********************************************/
async function getInventoryItemById(inv_id) {
  try {
    // Validate inv_id is a number
    if (isNaN(inv_id)) {
      throw new Error("Invalid inventory ID")
    }

    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,
      [inv_id]
    )
    
    if (data.rows.length === 0) {
      return null
    }
    
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryItemById error: " + error)
    return null
  }
}

/**************************
 * Add new Classification
 **************************/
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/**************************
 * Add New Inventory
 **************************/
async function addInventory(invData) {
  try {
    const sql = `INSERT INTO inventory (
      inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, 
      inv_color, classification_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    
    return await pool.query(sql, [
      invData.inv_make,
      invData.inv_model,
      invData.inv_year,
      invData.inv_description,
      invData.inv_image,
      invData.inv_thumbnail,
      invData.inv_price,
      invData.inv_miles,
      invData.inv_color,
      invData.classification_id
    ])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Edit Inventory Data
 * ************************** */
async function editInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    console.log("Model received parameters:", {
      inv_id, inv_make, inv_model, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_year,
      inv_miles, inv_color, classification_id
    });

    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      parseFloat(inv_price),
      parseInt(inv_year),
      parseInt(inv_miles),
      inv_color,
      parseInt(classification_id),
      parseInt(inv_id)
    ]);
    
    console.log("Update result:", data.rows[0]); // Debug log
    return data.rows.length > 0 ? data.rows[0] : null
  } catch (error) {
    console.error("model error: " + error);
    throw error;
  }
}
/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1 RETURNING *'
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("deleteInventoryItem error: " + error)
    throw error
  }
}

/* **************************************
* Delete all vehicles in a classification
**************************************/
async function deleteVehiclesByClassification(classification_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE classification_id = $1 RETURNING *'
    const data = await pool.query(sql, [classification_id])
    return data
  } catch (error) {
    console.error("deleteVehiclesByClassification error: " + error)
    throw error
  }
}

/* **************************************
* Delete a classification
**************************************/
async function deleteClassification(classification_id) {
  try {
    const sql = 'DELETE FROM classification WHERE classification_id = $1 RETURNING *'
    const data = await pool.query(sql, [classification_id])
    return data
  } catch (error) {
    console.error("deleteClassification error: " + error)
    throw error
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryItemById, 
  addClassification, 
  addInventory, 
  editInventory,
  deleteInventoryItem,
  deleteVehiclesByClassification,
  deleteClassification
}