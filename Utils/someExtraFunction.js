const Product = require("../models/productModel");

exports.updateStock = async function (productId, quantity) {
  const product = await Product.findById(productId);
  product.Stock -= quantity;
  await product.save();
};