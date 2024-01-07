const Order = require("../models/orderModels");
const User = require("../models/userModel");
const ApiFeatures = require("../Utils/apiFeatures");
const ErrorHandler = require("../Utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { updateStock } = require("../Utils/someExtraFunction");
const Product = require("../models/productModel");

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;


  orderItems.forEach(async (order) => {
    const product = await Product.findById(order.product);
    if (!product) {
      return next(new ErrorHandler(500, "Product not found"));
    }
    if (product.Stock < order.quantity) {
      return next(new ErrorHandler(500, "Product is out of stock"));
    }
  });
 
  const order = await Order.create({
    shippingInfo,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get order Details

exports.orderDetails = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "username email"
  );
  if (!order) {
    return next(new ErrorHandler(500, "Order not found with this Id "));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// get all orders for particular user
exports.orderDetailsUser = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});

// get all orders for admin

exports.allOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  const resultPerPage = 10;

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  const api = new ApiFeatures(Order.find(), req.query).pagination(
    resultPerPage
  );
  const order = await api.query;

  res.status(200).json({
    success: true,
    totalAmount,
    order,
  });
});

// Update Order Status for admin

exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (!order) {
    return next(new ErrorHandler(500, "Order not found with this Id "));
  }

  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler(
        404,
        "Order is already delivered this product you can not change "
      )
    );
  }
  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });
  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save();
  res.status(200).json({
    success: true,
    order,
  });
});
