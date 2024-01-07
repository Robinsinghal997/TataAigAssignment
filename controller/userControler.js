const ErrorHandler = require("../Utils/errorhandler");
const sendToken = require("../Utils/jwtToken");
const sendemail = require("../Utils/sendEmail");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const getDataUri = require("../Utils/getDataUri");

// Register a user

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { username, email, password } = req.body;
  const file = req.file;
  if ((!username, !email, !password)) {
    return next(new ErrorHandler("Please add all fields", 400));
  }
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User All ready register", 404));
  }
  if (!file) {
    user = await User.create({
      username,
      email,
      password,
    });
  } else {
    const fileUrl = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
      folder: "TataAig/user",
    });
    user = await User.create({
      username,
      email,
      password,
      avtar: {
        publicId: mycloud.public_id,
        Url: mycloud.secure_url,
      },
    });
  }

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking id user has given email and password  both

  if (!email || !password) {
    return next(new ErrorHandler(400, "Please enter email and password"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler(401, "Invalid Email or Password"));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler(401, "Invalid Email or Password"));
  }

  sendToken(user, 200, res);
});

// logout user

exports.logoutuser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logout SuccessFully",
  });
});


// forget password and send link in user email

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler(404, "User not Found"));
  }

  // get reset password Token

  const restToken = user.getResetpasswordToken();

  await user.save();

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${restToken}`;

  const message = `Your password Token is :- \n\n ${resetPasswordUrl} \n\n if you have not required this email then please Ignore it `;
  try {
    await sendemail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successFully`,
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler(500, error.message));
  }
});

// reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler(400, "reset password token has been Expired"));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler(400, "password does not match "));
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// get User Details by self

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const userDetails = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    userDetails,
  });
});

// Update Password for user

exports.UpdatePassword = catchAsyncError(async (req, res, next) => {
  const userDetails = await User.findById(req.user._id).select("+password");

  const passwordMatch = await userDetails.comparePassword(req.body.oldPassword);

  if (!passwordMatch) {
    return next(new ErrorHandler(401, "Passwoed Invalid"));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler(401, "newPassword and confirmPassword dose not match")
    );
  }
  userDetails.password = req.body.newPassword;

  await userDetails.save();

  res.status(200).json({
    success: true,
    userDetails,
  });
});

// Update User Profile

exports.UpdateProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });
  if (user.email === req.body.email) {
    return next(new ErrorHandler(400, "Email Already Exist"));
  }

  user.email = req.body.email;
  user.username = req.body.name;
  user.save();

  res.status(200).json({
    success: true,
    message: "Profile Updated SuccessFully",
  });
});


// logout user

exports.createAdmin = catchAsyncError(async (req, res, next) => {
 const user = await User.findById(req.user._id);

 if(user.role === "admin"){
  return next(new ErrorHandler(404, "You are already admin"));
 }
if(!user){
  return next(new ErrorHandler(400, "User not found"));
}
 user.role = "admin";
 user.save();
  res.status(200).json({
    success: true,
    message: `hello ${user.username} now you are a Adim you can access all routes`,
  });
});