const Company = require('../models/company.model');
const logger = require('../logger/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { companyName, password, email, address, phone, role } = req.body;

  if (!['company', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
  }

  try {
      const newCompany = new Company({ companyName, password, email, address, phone, role });

      const company = await newCompany.save();
      res.status(201).json({ data: company });
      logger.info("Company registered successfully");
  } catch (err) {
      res.status(400).json({ message: err.message });
      logger.error("Error registering company", err);
  }
};

exports.authenticate = async (req, res) => {
  const { companyName, password } = req.body;

  try {
    const company = await Company.findOne({ companyName });
    if (!company) {
      return res.status(401).json({ message: 'Authentication failed. Company not found.' });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
    }

    const token = jwt.sign({ id: company._id, role: 'company', companyName: company.companyName }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({ message: 'Authentication successful', token });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred during authentication', error: err.message });
  }
};

exports.findAll = async(req, res) => {
  console.log("Find all companies");

    const { page = 1, limit = 10, companyName } = req.query;
    const filter = companyName ? { companyName: new RegExp(companyName, 'i') } : {};

    try {
        const companies = await Company.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Company.countDocuments(filter);

        res.status(200).json({
            data: companies,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
        logger.debug("Success in reading all companies");
        logger.info("Success in reading all companies");
    } catch (err) {
        console.log(`Problem in reading companies, ${err}`);
        logger.error(`Problem in reading all companies , ${err}`);
        res.status(500).json({ message: err.message });
    }
}

exports.findOne = async(req, res) => {
  console.log("Find a company");

  const companyName = req.params.companyName;
  try {
    const result = await Company.findOne({ companyName: companyName })
    if (!result) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
    logger.error(`Problem in reading company`, err);
  }
}

exports.create = async(req, res) => {
  console.log("Insert company");

  const { companyName, password, email, address, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCompany = new Company({ companyName, password: hashedPassword, email, address, phone });

    const result = await newCompany.save();
    res.status(201).json({ data: result });
    logger.info("Company created successfully");
  } catch (err) {
    res.status(400).json({ message: err.message });
    logger.error("Problem in saving company", err);
  }
}

exports.update = async (req, res) => {
  const companyName = req.params.companyName;

  console.log("Update company with name:", companyName);

  const { email, address, phone } = req.body;

  try {
    const result = await Company.findOneAndUpdate(
      { companyName: companyName },
      { email, address, phone },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ data: result });
    logger.info("Company updated successfully");
  } catch (err) {
    res.status(400).json({ message: err.message });
    logger.error("Problem in updating company", err);
  }
};

exports.delete = async(req, res) => {
  const companyName = req.params.companyName;

  console.log("Delete company:", companyName);

  try {
    const result = await Company.findOneAndDelete({ companyName: companyName });
    if (!result) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ data: result });
    logger.info("Company deleted successfully");
  } catch (err) {
    res.status(400).json({ message: err.message });
    logger.error("Problem in deleting company", err);
  }
};