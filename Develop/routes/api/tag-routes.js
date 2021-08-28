const router = require('express').Router();
//const { where } = require('sequelize/types');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
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

router.post('/', async (req, res) => {
  // create a new tag
  await CreateTag(req, res);
});

router.put('/:id?', async (req, res) => {
  // update a tag's name by its `id` value
  if (req.params.id == null || req.params.id == '') {
    await CreateTag(req,res);
  } else {
    await CreateTag(req,res);
  }
});

router.patch('/:id', async (req, res) => {
  // update a tag by its `id` value
  await UpdateTag(req, res);
});

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
