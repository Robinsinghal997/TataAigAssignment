const express = require("express");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const {
  newOrder,
  orderDetails,
  orderDetailsUser,
  allOrder,
  updateOrderStatus
} = require("../controller/orderController");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/orderDetails/:id").get(isAuthenticatedUser, orderDetails);
router.route("/me/orderDetails").get(isAuthenticatedUser, orderDetailsUser);
router
  .route("/admin/all/orders")
  .get(isAuthenticatedUser, authorizeRole("admin"), allOrder);
router
  .route("/admin/updateOrderStatus/:id")
  .patch(isAuthenticatedUser, authorizeRole("admin"), updateOrderStatus);

module.exports = router;
