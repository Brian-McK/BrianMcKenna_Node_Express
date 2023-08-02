const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateUser } = require("../validators/validateUser");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  res.json(res.user);
};

exports.createUser = async (req, res) => {
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

    if (findUser) {
      return res.status(404).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const user = new User({
      username: username,
      passwordHashed: hashedPassword,
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
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

    const userToUpdate = res.user;

    if (username) {
      if (username !== userToUpdate.username) {
        const existingUserUsername = await User.findOne({ username: username });
        if (existingUserUsername) {
          return res
            .status(409)
            .json({ message: "User with this username already exists" });
        }
        userToUpdate.username = username;
      }
    }

    if (password) {
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      userToUpdate.passwordHashed = hashedPassword;
    }

    const updatedUser = await userToUpdate.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await res.user.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
