const mongoose = require("mongoose");
// structer of inventory
const inventorySchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  restock: Boolean,
});

module.exports = mongoose.model("Inventory", inventorySchema);
