const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "E-commerce API",
      description: "Internet retail, also known as e-commerce, is the largest sector of the electronics industry, generating an estimated $29 trillion in 2019. E-commerce platforms like Shopify and WooCommerce provide a suite of services to businesses of all sizes. It describes the aforementioned API",
      contact: {
        name: "MVPie"
      },
      servers: [`http://localhost:${PORT}`]
    }
  },
  apis: ["routes/api/*-routes.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(routes);

// Force false so data doesn't get dropped on every sync
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
});
