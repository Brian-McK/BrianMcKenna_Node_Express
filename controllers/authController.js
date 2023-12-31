const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKeyJwtToken = process.env.JWT_Key;
const secretKeyRefreshToken = process.env.REFRESH_KEY;
const { validateUser } = require("../validators/validateUser");

exports.authenticateUser = async (req, res) => {
  try {
    const {
      error,
      value: { username, password },
    } = validateUser(req.body);

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const findUser = await User.findOne({ username: username });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      findUser.passwordHashed
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const jwtToken = jwt.sign(
      { userId: findUser._id, username: findUser.username },
      secretKeyJwtToken,
      {
        expiresIn: "900000",
      }
    );

    const refreshToken = jwt.sign(
      { userId: findUser._id, username: findUser.username },
      secretKeyRefreshToken,
      {
        expiresIn: "1 days",
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    // TODO - add refresh token to token reuse db

    res.json({
      message: "User authenticated successfully",
      authenticated: {
        username: findUser.username,
        jwtToken: jwtToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  res.cookie("refreshToken", "", { expires: new Date(0) });
  res.json({ message: "HTTP-only cookie removed" });
};

exports.refreshToken = async (req, res) => {
  const { username } = req.body;

  try {
    const cookieRefreshToken = req.cookies.refreshToken;

    if (cookieRefreshToken == null) {
      return res
        .status(401)
        .json({ message: "No refresh token, Unauthorized access" });
    }

    const findUser = await User.findOne({ username });

    if (!findUser) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    // TODO - token reuse detection - check token not been used

    res.send(cookieRefreshToken);
  } catch (error) {
    res.json({ message: error.message });
  }
};
