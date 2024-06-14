const express = require('express');
const app = express();
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => { console.log("Connection to Mongodb established")},
    err => { console.log("Failed to connect to Mongodb", err)}
  );

  const cors = require('cors');
  app.use(cors({
    origin: '*'
}))

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

const user = require('./routes/user.route');
const company = require('./routes/company.route');
const errorHandler = require('./middlewares/errorHandler');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Final Project CF5 API',
    version: '1.0.0',
    description: 'API documentation for the final project Company Catalog project',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './models/*.js'],
};

const specs = swaggerJsdoc(options);

app.use('/', express.static('files'));
app.use('/api/users', user)
app.use('/api/company', company)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);

module.exports = app;