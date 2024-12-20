const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Products');


// Define routes
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product with an image
router.post('/', async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
  
    const imagePath= req.body.image;
    const newProduct = new Product({
      name:name,
      description:description,
      image: imagePath,
      price:price,
    });

    await newProduct.save();
    console.log('New Product:', newProduct);
    res.status(201).json({ message: 'Product added successfully!' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Error adding product' });
  }
});

// Update an existing product with an image
router.put('/:id', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imagePath= req.body.image;
    console.log("Doing update");
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        image: imagePath, 
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully!', product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    console.log("Doing delete");
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get a specific product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
