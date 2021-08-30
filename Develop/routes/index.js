const router = require('express').Router();
const apiRoutes = require('./api');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

router.use('/api', apiRoutes);

// // Plug in swagger ui
// router.use('/api-docs', swaggerUi.serve);
// router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router;