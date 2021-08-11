const express = require("express");
const jwt = require("jsonwebtoken");

const { hashPassword, hashCompare } = require("../utils/hashing");
const { validateEmail } = require("../utils/email");
const User = require("../model/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, pass } = req.body;

  if (!name)
    return res
      .status(400)
      .json({ success: false, message: "'name' is missing" });
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "'email' is missing" });
  else if (!validateEmail(email))
    return res
      .status(400)
      .json({ success: false, message: "'email' is not valid" });
  if (!pass)
    return res
      .status(400)
      .json({ success: false, message: "'pass' is missing" });
  else if (pass.length < 6)
    return res.status(400).json({
      success: false,
      message: "'pass' should be 6 or more characters",
    });

  try {
    const hashedPass = await hashPassword(pass);
    if (!hashedPass)
      return res
        .status(500)
        .json({ success: false, message: "Some error ocurred" });
    const user = new User({ name, email, pass: hashedPass });
    const result = await user.save();

    const payload = {
      userId: result._id,
      name: result.name,
      role: result.role,
    };

    //token expires in 15 min
    const token = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: 60 * 15,
    });

    res
      .status(201)
      .json({ success: true, message: "Successfully Registered", token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "'email' is missing" });
  if (!pass)
    return res
      .status(400)
      .json({ success: false, message: "'pass' is missing" });
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Incorrect email or password" });

  const match = await hashCompare(pass, user.pass);
  if (!match)
    return res
      .status(401)
      .json({ success: false, message: "Incorrect email or password" });

  const payload = {
    userId: user._id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 60 * 15 });

  res.status(200).json({ success: true, message: "Successful Login", token });
});

module.exports = router;
