const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

/**
 * @swagger
 * /api/products:
 *  get: 
 *    tags: 
 *      - products
 *    description: Gets all products
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully got all the products
 *      500:
 *        description: Failed to get products
 */
// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    let result = await Product.findAll({
      attributes: ['id', 'product_name'],
      include: Category, Tag, ProductTag 
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
 * /api/products/{id}:
 *  get: 
 *    tags: 
 *      - products
 *    description: Gets a single product
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested product id 
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully got a single product
 *      500:
 *        description: Failed to get a single product
 */
// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findOne({
    attributes: ['id', 'product_name'],
    include: Category, Tag, ProductTag,
    where: {
      id: req.params.id
    }
  })
    .then(productData => {
      if (!productData) {
        res.status(404).json({ message: 'No Product found with this id' });
        return;
      }
      res.json(productData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

/**
 * @swagger
 * /api/products:
 *  post: 
 *    tags: 
 *      - products
 *    description: Create a single product
 *    parameters:
 *      - in: body
 *        type: object
 *        name: payload
 *        required: true
 *        description: product name provided
 *        properties:
 *          product_name:
 *            type: string
 *            description: product name provided
 *            required: true
 *            example: bla1
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully created a single product
 *      500:
 *        description: Failed to create a single product
 */
// create new product
router.post('/', async (req, res) => {

  await CreateProduct(req, res);
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  
});

/**
 * @swagger
 * /api/products/{id}:
 *  put: 
 *    tags: 
 *      - products
 *    description: If id was provided updates existing product by that id, if not creates a new a single product
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested products id 
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully updated a single product
 *      201:
 *        description: Successfully created a single product
 *      500:
 *        description: Failed to create/update a single product
 *      404:
 *        description: No product found with this id
 */
// update product
router.put('/:id', (req, res) => {
  // update product data
  console.log(req.body);
  console.log(req.params);
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds != null ?
       req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        }) : [];
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => req.body.tagIds == null || !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

/**
 * @swagger
 * /api/products/{id}:
 *  delete: 
 *    tags: 
 *      - products
 *    description: Delete a single product
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested product id 
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully deleted a single product
 *      404:
 *        description: No product found with this id
 *      500:
 *        description: Failed to delete a single product
 */
router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(productData => {
      if (!productData) {
        res.status(404).json({ message: 'No Product found with this id' });
        return;
      }
      res.json(productData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

async function CreateProduct(req, res) {

  try {
    let product = await Product.create(req.body);

    if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        let tags = await ProductTag.bulkCreate(productTagIdArr);
        return res.status(200).json(tags);
      }
      res.status(200).json(product);

  } catch (error) {
      console.log(err);
      res.status(400).json(err);
  }
 
}
module.exports = router;
