const ApiFeatures = require("../Utils/apiFeatures");
const ErrorHandler = require("../Utils/errorhandler");
const getDataUri = require("../Utils/getDataUri");
const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModel");
const cloudinary = require("cloudinary");

// create products

exports.createProducts = catchAsyncError(async (req, res, next) => {
  const { name, description, price, Stock } = req.body;
  const files = req.files;
  const images = [];
  const uploadfile = async (fileUrl) => await cloudinary.v2.uploader.upload(fileUrl.content, {
    folder: "TataAig/user", 
  });

  for (let i = 0; i < files.length; i++) {
    const fileUrl = await getDataUri(files[i]);
    const mycloud = await uploadfile(fileUrl);
    images.push({
      publicId: mycloud.public_id,
      Url: mycloud.secure_url,
    });
  }

const product = await Product.create({
  name,
  description,
  price,
  Stock,
  user: req.user._id,
  images,
});
res.status(200).json({
  status: true,
  product,
});
});

exports.getAllProducts = catchAsyncError(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const api = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const product = await api.query;
  res.status(200).json({
    status: true,
    product,
    productCount,
  });
});

exports.UpdateProduct = catchAsyncError(async (req, res, next) => {
  var product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(500, "Product not found"));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: true,
    product,
  });
});

exports.DeleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(404, "Product not found"));
  }

  await Product.findByIdAndRemove(req.params.id);
  res.status(200).json({
    status: true,
    messege: "products is deleted Success Fully",
  });
});

exports.productDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(500, "Product not found"));
  }
  res.status(200).json({
    status: true,
    product,
  });
});

// create  new Reviews and update

exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productid } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.username,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productid);
  if (!product) {
    return next(new ErrorHandler(404, "Product not found"));
  }
  const isReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReview) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  let totalreviews = product.reviews.length;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / totalreviews;

  await product.save();
  return res.status(200).json({
    success: true,
    message: "review posted SuccessFully",
  });
});

// get all reviews for single products

exports.getProductAllReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler(404, "Product not found"));
  }
  return res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.producdId);
  if (!product) {
    return next(new ErrorHandler(404, "Product not found"));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.reviewId.toString()
  );
  let avg = 0;
  let totalreviews = reviews.length;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = reviews.length == 0 ? 0 : avg / totalreviews;
  product.reviews = reviews;
  product.numOfReviews = reviews.length;
  await product.save();
  return res.status(200).json({
    success: true,
  });
});
