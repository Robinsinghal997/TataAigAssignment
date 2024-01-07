// Createing token and saving in cookie

const sendToken = (user, stausCode, res) => {
  const token = user.getJWTToken();

  // option for Cookie
  const option = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(stausCode).cookie("token", token,option).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
