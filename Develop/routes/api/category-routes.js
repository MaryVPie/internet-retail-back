const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

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

router.post('/', async (req, res) => {
  // create a new category
  await CreateCat(req, res);
});

router.put('/:id?', async (req, res) => {
  console.log(req.params.id );
  if (req.params.id == null || req.params.id == '') {
    await CreateCat(req,res);
  } else {
    await UpdateCat(req,res);
  }
});

router.patch('/:id', async (req, res) => {
  // update a category by its `id` value
  await UpdateCat(req, res);
});

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