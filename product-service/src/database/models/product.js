const mongoose = require('mongoose');

const ProductModel = new mongoose.Schema(
		{
            name: String,
            description: String,
            price: Number,
            category: String,
		}
		
);
module.exports = mongoose.model("product" , ProductModel );