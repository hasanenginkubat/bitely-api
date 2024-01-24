const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const { getProduct, addProduct, getProductById, deleteProduct } = require("../controllers/dynamo");

router.get("/", async (req, res) => {
  try {
    const products = await getProduct();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error. Unable to retrieve products.' });
  }
});

router.post('/addProduct', upload.single('image'), async (req, res) => {
  try {
    const product = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      image: req.file,
      date: new Date().toISOString(),
    };

    const result = await addProduct(product);

    res.status(201).json({ message: 'Product added successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the product. Please try again later.', details: error.message });
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (product && product.Item) {
      res.status(200).json(product.Item);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error. Unable to retrieve product details.' });
  }
});

router.delete("/productDelete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProduct(id);

    if (result && result.Attributes) {
      res.status(200).json({ message: 'Product deleted successfully', deletedProduct: result.Attributes });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the product. Please try again later.', details: error.message });
  }
});

module.exports = router;
