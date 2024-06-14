const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { companyValidationRules } = require('../validators/companyValidator');
const validate = require('../validators/validate');
const authorize = require('../middlewares/authorize');

router.post('/register', companyController.register);
router.post('/authenticate', companyController.authenticate);

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: API endpoints for companies
 */

/**
 * @swagger
 * /api/company:
 *   get:
 *     tags: [Companies]
 *     summary: Get all companies
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */
router.get('/', authorize(['admin', 'user', 'company']), companyController.findAll);

/**
 * @swagger
 * /api/company/{companyName}:
 *   get:
 *     tags: [Companies]
 *     summary: Get a company by name
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the company
 *     responses:
 *       200:
 *         description: The requested company
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */
router.get('/:companyName', authorize(['admin', 'user', 'company']), companyController.findOne);

/**
 * @swagger
 * /api/company:
 *   post:
 *     tags: [Companies]
 *     summary: Create a new company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: The created company
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */
router.post('/', authorize(['admin', 'company']), companyValidationRules('create'), validate, companyController.create);

/**
 * @swagger
 * /api/company/{companyName}:
 *   put:
 *     tags: [Companies]
 *     summary: Update a company by name
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: The updated company
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */
router.put('/:companyName', authorize(['admin', 'company']), companyValidationRules('update'), validate, companyController.update);

/**
 * @swagger
 * /api/company/{companyName}:
 *   delete:
 *     tags: [Companies]
 *     summary: Delete a company by name
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the company
 *     responses:
 *       200:
 *         description: The deleted company
 */
router.delete('/:companyName', authorize(['admin', 'company']), companyController.delete);

/**
 * @swagger
 * /api/company/authenticate:
 *   post:
 *     tags: [Companies]
 *     summary: Authenticate a company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company authenticated
 */
router.post('/authenticate', companyController.authenticate);

module.exports = router;