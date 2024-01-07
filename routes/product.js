const express = require("express");
const {
  getAllProducts,
  createProducts,
  UpdateProduct,
  DeleteProduct,
  productDetails,
  createProductReview,
  getProductAllReviews,
  deleteReviews,
} = require("../controller/productContoller");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const { multipalUpload, singleUpload } = require("../middleware/Multer");
const router = express.Router();

router
  .route("/admin/products/new")
  .post(multipalUpload, isAuthenticatedUser, authorizeRole("admin"), createProducts);

router.route("/products").get(getAllProducts);
router
  .route("/admin/product/:id")
  .patch(isAuthenticatedUser, authorizeRole("admin"), UpdateProduct)
  .delete(isAuthenticatedUser, authorizeRole("admin"), DeleteProduct);
router.route("/product/:id").get(productDetails);
router.route("/review").post(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getProductAllReviews);
router.route("/delete/review").delete(isAuthenticatedUser, deleteReviews);

module.exports = router;
