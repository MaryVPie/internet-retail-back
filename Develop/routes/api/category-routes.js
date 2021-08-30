const router = require('express').Router();
const { Category, Product } = require('../../models');

/**
 * @swagger
 * /api/categories:
 *  get: 
 *    tags: 
 *      - categories
 *    description: Gets all categories
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully got all the categories
 *      500:
 *        description: Failed to get categories
 */
router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products

  try {
    let result = await Category.findAll({
      attributes: ['id', 'category_name'],
      include: Product 
    });
    
    console.log(result);
    // let jsonData = await result.json();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *  get: 
 *    tags: 
 *      - categories
 *    description: Gets a single category
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested category id 
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully got a single category
 *      500:
 *        description: Failed to get a single category
 */
router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
    attributes: ['id', 'category_name'],
    include: Product,
    where: {
      id: req.params.id
    }
  })
    .then(categoryData => {
      if (!categoryData) {
        res.status(404).json({ message: 'No Category found with this id' });
        return;
      }
      res.json(categoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

/**
 * @swagger
 * /api/categories:
 *  post: 
 *    tags: 
 *      - categories
 *    description: Create a single category
 *    parameters:
 *      - in: body
 *        type: object
 *        name: payload
 *        required: true
 *        description: category name provided
 *        properties:
 *          category_name:
 *            type: string
 *            description: category name provided
 *            required: true
 *            example: bla1
 *    produces:
 *      - application/json
 *    responses:
 *      201:
 *        description: Successfully created a single category
 *      500:
 *        description: Failed to create a single category
 */
router.post('/', async (req, res) => {
  // create a new category
  await CreateCat(req, res);
});

/**
 * @swagger
 * /api/categories/{id}:
 *  put: 
 *    tags: 
 *      - categories
 *    description: If id was provided updates existing category by that id, if not creates a new a single category
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested category id 
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully updated a single category
 *      201:
 *        description: Successfully created a single category
 *      500:
 *        description: Failed to create/update a single category
 *      404:
 *        description: No Category found with this id
 */
router.put('/:id?', async (req, res) => {
  console.log(req.params.id );
  if (req.params.id == null || req.params.id == '') {
    await CreateCat(req,res);
  } else {
    await UpdateCat(req,res);
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *  patch: 
 *    tags: 
 *      - categories
 *    description: Update a single category
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested category id  
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully updated a single category
 *      500:
 *        description: Failed to update a single category
 */
router.patch('/:id', async (req, res) => {
  // update a category by its `id` value
  await UpdateCat(req, res);
});

/**
 * @swagger
 * /api/categories/{id}:
 *  delete: 
 *    tags: 
 *      - categories
 *    description: Delete a single category
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested category id 
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully deleted a single category
 *      404:
 *        description: No Category found with this id
 *      500:
 *        description: Failed to delete a single category
 */
router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(categoryData => {
      if (!categoryData) {
        res.status(404).json({ message: 'No Category found with this id' });
        return;
      }
      res.json(categoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

async function UpdateCat(req, res) {
  try {
    let result = await Category.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    });

    if (!result[0]) {
      res.status(404).json({ message: 'No Category found with this id' });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

async function CreateCat(req, res) {
  try {
    let result = await Category.create({
      category_name: req.body.category_name
    });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

module.exports = router;