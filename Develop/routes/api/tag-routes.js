const router = require('express').Router();
//const { where } = require('sequelize/types');
const { Tag, Product, ProductTag } = require('../../models');

/**
 * @swagger
 * /api/tags:
 *  get: 
 *    tags: 
 *      - tags
 *    description: Gets all tags
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully got all the tags
 *      500:
 *        description: Failed to get tags
 */
router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    let result = await Tag.findAll({
      attributes: ['id', 'tag_name'],
      include: Product, ProductTag 
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
 * /api/tags/{id}:
 *  get: 
 *    tags: 
 *      - tags
 *    description: Gets a single tag
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested tag id 
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully got a single tag
 *      500:
 *        description: Failed to get a single tag
 */
router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data

  Tag.findOne({
    attributes: ['id', 'tag_name'],
    include: Product, ProductTag,
    where: {
      id: req.params.id
    }
  })
    .then(tagData => {
      if (!tagData) {
        res.status(404).json({ message: 'No Tag found with this id' });
        return;
      }
      res.json(tagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

/**
 * @swagger
 * /api/tags:
 *  post: 
 *    tags: 
 *      - tags
 *    description: Create a single tag
 *    parameters:
 *      - in: body
 *        type: object
 *        name: payload
 *        required: true
 *        description: tag name provided
 *        properties:
 *          tag_name:
 *            type: string
 *            description: tag name provided
 *            required: true
 *            example: tag1
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully created a single tag
 *      500:
 *        description: Failed to create a single tag
 */
router.post('/', async (req, res) => {
  // create a new tag
  await CreateTag(req, res);
});

/**
 * @swagger
 * /api/tags/{id}:
 *  put: 
 *    tags: 
 *      - tags
 *    description: If id was provided updates existing tag by that id, if not creates a new a single tag
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested tag id 
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully updated a single tag
 *      201:
 *        description: Successfully created a single tag
 *      500:
 *        description: Failed to create/update a single tag
 *      404:
 *        description: No tag found with this id
 */
router.put('/:id?', async (req, res) => {
  // update a tag's name by its `id` value
  if (req.params.id == null || req.params.id == '') {
    await CreateTag(req,res);
  } else {
    await CreateTag(req,res);
  }
});

/**
 * @swagger
 * /api/tags/{id}:
 *  patch: 
 *    tags: 
 *      - tags
 *    description: Update a single tag
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested tag id  
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully updated a single tag
 *      500:
 *        description: Failed to update a single tag
 */
router.patch('/:id', async (req, res) => {
  // update a tag by its `id` value
  await UpdateTag(req, res);
});

/**
 * @swagger
 * /api/tags/{id}:
 *  delete: 
 *    tags: 
 *      - tags
 *    description: Delete a single tag
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: requested tag id 
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Successfully deleted a single tag
 *      404:
 *        description: No tag found with this id
 *      500:
 *        description: Failed to delete a single tag
 */
router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(tagData => {
      if (!tagData) {
        res.status(404).json({ message: 'No Tag found with this id' });
        return;
      }
      res.json(tagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

async function UpdateTag(req, res) {
  try {
    let result = await Tag.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    });

    if (!result[0]) {
      res.status(404).json({ message: 'No Tag found with this id' });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}
 
async function CreateTag(req, res) {
  try {
    let result = await Tag.create({
      tag_name: req.body.tag_name
    });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}
module.exports = router;
