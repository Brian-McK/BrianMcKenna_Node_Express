const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  res.json(res.user);
};

exports.createUser = async (req, res) => {
  const user = new User({
    username: req.body.username,
    passwordHashed: req.body.passwordHashed,
  });

  // hash the password here

  try {
    const newUser = await user.save();
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, passwordHashed } = req.body;
    const userToUpdate = res.user;

    if (name) {
      userToUpdate.name = name;
    }

    if (passwordHashed) {
      userToUpdate.passwordHashed = passwordHashed;
    }

    const updatedUser = await userToUpdate.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await res.user.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted user" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
