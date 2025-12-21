const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocerydb';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    // Seed initial products if none exist
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      const sampleProducts = [
        // Fruits
        { name: 'Organic Apples', price: 3.99, category: 'Fruits', description: 'Fresh organic red apples', weight: '1kg', stock: 50, image: 'https://via.placeholder.com/250x200?text=Apples' },
        { name: 'Bananas', price: 0.99, category: 'Fruits', description: 'Ripe yellow bananas', weight: '1kg', stock: 40, image: 'https://via.placeholder.com/250x200?text=Bananas' },
        { name: 'Oranges', price: 2.99, category: 'Fruits', description: 'Sweet navel oranges', weight: '1kg', stock: 35, image: 'https://via.placeholder.com/250x200?text=Oranges' },
        { name: 'Strawberries', price: 4.99, category: 'Fruits', description: 'Fresh strawberries', weight: '250g', stock: 28, image: 'https://via.placeholder.com/250x200?text=Strawberries' },
        { name: 'Grapes', price: 3.49, category: 'Fruits', description: 'Seedless green grapes', weight: '500g', stock: 30, image: 'https://via.placeholder.com/250x200?text=Grapes' },
        { name: 'Pineapple', price: 2.99, category: 'Fruits', description: 'Sweet tropical pineapple', weight: '1pc', stock: 15, image: 'https://via.placeholder.com/250x200?text=Pineapple' },

        // Vegetables
        { name: 'Spinach', price: 1.49, category: 'Vegetables', description: 'Fresh green spinach leaves', weight: '200g', stock: 60, image: 'https://via.placeholder.com/250x200?text=Spinach' },
        { name: 'Tomatoes', price: 2.29, category: 'Vegetables', description: 'Juicy red tomatoes', weight: '500g', stock: 55, image: 'https://via.placeholder.com/250x200?text=Tomatoes' },
        { name: 'Broccoli', price: 1.99, category: 'Vegetables', description: 'Crisp broccoli florets', weight: '300g', stock: 30, image: 'https://via.placeholder.com/250x200?text=Broccoli' },
        { name: 'Carrots', price: 1.29, category: 'Vegetables', description: 'Crunchy orange carrots', weight: '500g', stock: 50, image: 'https://via.placeholder.com/250x200?text=Carrots' },
        { name: 'Potatoes', price: 1.99, category: 'Vegetables', description: 'Fresh potatoes', weight: '2kg', stock: 45, image: 'https://via.placeholder.com/250x200?text=Potatoes' },
        { name: 'Onions', price: 1.49, category: 'Vegetables', description: 'Yellow onions', weight: '1kg', stock: 40, image: 'https://via.placeholder.com/250x200?text=Onions' },
        { name: 'Lettuce', price: 1.79, category: 'Vegetables', description: 'Crisp romaine lettuce', weight: '1head', stock: 25, image: 'https://via.placeholder.com/250x200?text=Lettuce' },
        { name: 'Cucumbers', price: 1.99, category: 'Vegetables', description: 'Fresh cucumbers', weight: '500g', stock: 35, image: 'https://via.placeholder.com/250x200?text=Cucumbers' },

        // Dairy
        { name: 'Whole Milk', price: 2.49, category: 'Dairy', description: 'Fresh whole milk', weight: '1L', stock: 30, image: 'https://via.placeholder.com/250x200?text=Whole+Milk' },
        { name: 'Cheddar Cheese', price: 4.99, category: 'Dairy', description: 'Sharp cheddar cheese', weight: '200g', stock: 15, image: 'https://via.placeholder.com/250x200?text=Cheddar+Cheese' },
        { name: 'Eggs', price: 3.49, category: 'Dairy', description: 'Farm fresh eggs', weight: '12pcs', stock: 45, image: 'https://via.placeholder.com/250x200?text=Eggs' },
        { name: 'Greek Yogurt', price: 3.99, category: 'Dairy', description: 'Creamy Greek yogurt', weight: '500g', stock: 20, image: 'https://via.placeholder.com/250x200?text=Greek+Yogurt' },
        { name: 'Butter', price: 2.99, category: 'Dairy', description: 'Salted butter', weight: '250g', stock: 25, image: 'https://via.placeholder.com/250x200?text=Butter' },

        // Meat & Poultry
        { name: 'Chicken Breast', price: 7.99, category: 'Meat', description: 'Boneless chicken breast', weight: '500g', stock: 25, image: 'https://via.placeholder.com/250x200?text=Chicken+Breast' },
        { name: 'Ground Beef', price: 8.99, category: 'Meat', description: 'Lean ground beef', weight: '500g', stock: 18, image: 'https://via.placeholder.com/250x200?text=Ground+Beef' },
        { name: 'Salmon Fillet', price: 12.99, category: 'Meat', description: 'Fresh salmon fillet', weight: '300g', stock: 10, image: 'https://via.placeholder.com/250x200?text=Salmon+Fillet' },
        { name: 'Turkey Bacon', price: 5.99, category: 'Meat', description: 'Low-fat turkey bacon', weight: '200g', stock: 20, image: 'https://via.placeholder.com/250x200?text=Turkey+Bacon' },

        // Bakery
        { name: 'Whole Wheat Bread', price: 1.99, category: 'Bakery', description: 'Healthy whole wheat bread', weight: '500g', stock: 20, image: 'https://via.placeholder.com/250x200?text=Whole+Wheat+Bread' },
        { name: 'White Bread', price: 1.49, category: 'Bakery', description: 'Soft white bread', weight: '500g', stock: 25, image: 'https://via.placeholder.com/250x200?text=White+Bread' },
        { name: 'Croissants', price: 3.99, category: 'Bakery', description: 'Buttery croissants', weight: '4pcs', stock: 15, image: 'https://via.placeholder.com/250x200?text=Croissants' },

        // Grains & Cereals
        { name: 'Brown Rice', price: 2.99, category: 'Grains', description: 'Nutritious brown rice', weight: '1kg', stock: 35, image: 'https://via.placeholder.com/250x200?text=Brown+Rice' },
        { name: 'Oats', price: 1.79, category: 'Grains', description: 'Rolled oats', weight: '500g', stock: 40, image: 'https://via.placeholder.com/250x200?text=Oats' },
        { name: 'Quinoa', price: 4.49, category: 'Grains', description: 'Protein-rich quinoa', weight: '500g', stock: 25, image: 'https://via.placeholder.com/250x200?text=Quinoa' },
        { name: 'Pasta', price: 1.99, category: 'Grains', description: 'Spaghetti pasta', weight: '500g', stock: 30, image: 'https://via.placeholder.com/250x200?text=Pasta' },

        // Beverages
        { name: 'Orange Juice', price: 3.49, category: 'Beverages', description: 'Fresh orange juice', weight: '1L', stock: 20, image: 'https://via.placeholder.com/250x200?text=Orange+Juice' },
        { name: 'Coffee', price: 5.99, category: 'Beverages', description: 'Ground coffee beans', weight: '250g', stock: 15, image: 'https://via.placeholder.com/250x200?text=Coffee' },
        { name: 'Green Tea', price: 2.99, category: 'Beverages', description: 'Organic green tea bags', weight: '20pcs', stock: 25, image: 'https://via.placeholder.com/250x200?text=Green+Tea' },

        // Snacks
        { name: 'Almonds', price: 6.99, category: 'Snacks', description: 'Raw almonds', weight: '200g', stock: 20, image: 'https://via.placeholder.com/250x200?text=Almonds' },
        { name: 'Dark Chocolate', price: 3.49, category: 'Snacks', description: '70% dark chocolate', weight: '100g', stock: 30, image: 'https://via.placeholder.com/250x200?text=Dark+Chocolate' },
        { name: 'Popcorn', price: 1.99, category: 'Snacks', description: 'Microwave popcorn', weight: '3pcs', stock: 40, image: 'https://via.placeholder.com/250x200?text=Popcorn' },

        // Pantry Staples
        { name: 'Olive Oil', price: 7.99, category: 'Pantry', description: 'Extra virgin olive oil', weight: '500ml', stock: 15, image: 'https://via.placeholder.com/250x200?text=Olive+Oil' },
        { name: 'Honey', price: 4.99, category: 'Pantry', description: 'Pure honey', weight: '500g', stock: 20, image: 'https://via.placeholder.com/250x200?text=Honey' },
        { name: 'Peanut Butter', price: 2.99, category: 'Pantry', description: 'Creamy peanut butter', weight: '500g', stock: 25, image: 'https://via.placeholder.com/250x200?text=Peanut+Butter' },
        { name: 'Canned Tomatoes', price: 1.49, category: 'Pantry', description: 'Diced tomatoes', weight: '400g', stock: 35, image: 'https://via.placeholder.com/250x200?text=Canned+Tomatoes' }
      ];
      await Product.insertMany(sampleProducts);
      console.log('Sample products seeded');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
