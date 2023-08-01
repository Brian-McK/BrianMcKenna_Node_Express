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
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const findUser = await User.findOne({ username: username });

    if (findUser) {
      return res.status(404).json({ message: "User already exists" });
    }

    const { error, value } = validateUser({ username, password });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(value.password, saltRounds);

    const user = new User({
      username: value.username,
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
    const { username, password } = req.body;
    const userToUpdate = res.user;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const { error } = validateUser({ username, password });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    userToUpdate.username = username;

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    userToUpdate.passwordHashed = hashedPassword;

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
