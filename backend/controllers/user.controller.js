const User = require('../models/user.model');
const logger = require('../logger/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, name, surname, email, role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const newUser = new User({ username, password, name, surname, email, role });

        const user = await newUser.save();
        res.status(201).json({ data: user });
        logger.info("User registered successfully");
    } catch (err) {
        res.status(400).json({ message: err.message });
        logger.error("Error registering user", err);
    }
};

exports.authenticate = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, jwtSecret, { expiresIn: '2h' });

        res.status(200).json({ message: 'Authentication successful', token });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred during authentication', error: err.message });
    }
};

exports.findAll = async(req, res) => {
  console.log("Find all users");

  const { page = 1, limit = 10, role } = req.query;
  const filter = role ? { role } : {};

  try {
      const users = await User.find(filter)
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();
      const count = await User.countDocuments(filter);

      res.status(200).json({
          data: users,
          totalPages: Math.ceil(count / limit),
          currentPage: page
      });
      logger.debug("Success in reading all users");
      logger.info("Success in reading all users");
  } catch (err) {
      console.log(`Problem in reading users, ${err}`);
      logger.error(`Problem in reading all users , ${err}`);
      res.status(500).json({ message: err.message });
  }
};

exports.findOne = async(req, res) => {
    const username = req.params.username;
    try {
        const result = await User.findOne({ username: username });
        res.status(200).json({ data: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
        logger.error(`Problem in reading user`, err);
    }
};

exports.create = async(req, res) => {
    const { username, password, name, surname, email, role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const newUser = new User({ username, password, name, surname, email, role });

        const result = await newUser.save();
        res.status(201).json({ data: result });
        logger.info("User created successfully");
    } catch (err) {
        res.status(400).json({ message: err.message });
        logger.error("Problem in saving user", err);
    }
};

exports.update = async (req, res) => {
    const username = req.params.username;
    const { name, surname, email } = req.body;

    try {
        const result = await User.findOneAndUpdate(
            { username: username },
            { name, surname, email },
            { new: true }
        );
        if (result) {
            res.status(200).json({ data: result });
            logger.info("User updated successfully");
        } else {
            res.status(404).json({ message: 'User not found' });
            logger.warn(`Update failed, user with username ${username} not found`);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
        logger.error("Problem in updating user", err);
    }
};

exports.delete = async (req, res) => {
    const username = req.params.username;

    try {
        const result = await User.findOneAndDelete({ username: username });
        if (result) {
            res.status(200).json({ data: result });
            logger.info("User deleted successfully");
        } else {
            res.status(404).json({ message: 'User not found' });
            logger.warn(`Delete failed, user with username ${username} not found`);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
        logger.error("Problem in deleting user", err);
    }
};