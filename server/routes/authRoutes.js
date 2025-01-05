const express = require("express");
const { signup, login, googleAuth } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/google-auth", googleAuth);

module.exports = router;
