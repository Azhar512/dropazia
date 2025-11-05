// Check Products Urgent - Supabase PostgreSQL
require('dotenv').config();

const { connectDB } = require('./config/database-supabase');
const Product = require('./models/Product');
const User = require('./models/User');
const OrderService = require('./models/Order');

const checkDatabase = async () => {
  try {
    await connectDB();
    
    console.log('\n🔍 URGENT DATABASE CHECK\n');
    console.log('='.repeat(50));
    
    // Check products
    const products = await Product.find({});
    const productCount = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    
    console.log(`\n📦 PRODUCTS:`);
    console.log(`   Total Products: ${productCount}`);
    console.log(`   Active Products: ${activeProducts}`);
    
    if (productCount > 0) {
      console.log(`\n📋 ALL PRODUCTS IN DATABASE:`);
      products.forEach((product, index) => {
        const formattedProduct = Product.formatProduct(product);
        console.log(`   ${index + 1}. ${formattedProduct.name}`);
        console.log(`      Category: ${formattedProduct.category || 'N/A'}`);
        console.log(`      Price: Rs ${formattedProduct.price || 0}`);
        console.log(`      Module: ${formattedProduct.module || 'N/A'}`);
        console.log(`      Status: ${formattedProduct.status || 'N/A'}`);
        console.log(`      Created: ${formattedProduct.createdAt ? new Date(formattedProduct.createdAt).toLocaleString() : 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('   ❌ NO PRODUCTS FOUND - Database is empty');
    }
    
    // Check users
    const users = await User.find({});
    const userCount = users.length;
    console.log(`\n👤 USERS: ${userCount}`);
    
    // Check orders
    const orders = await OrderService.getAll(1000, 0);
    const orderCount = orders.length;
    console.log(`📋 ORDERS: ${orderCount}`);
    
    console.log('\n' + '='.repeat(50));
    
    if (productCount === 0) {
      console.log('\n❌ CONFIRMED: No products found in database.');
      console.log('⚠️ Products have been deleted and cannot be recovered (backups are inactive).');
      console.log('💡 You will need to re-upload your products.');
    } else {
      console.log('\n✅ GOOD NEWS: Products still exist in database!');
      console.log('💡 They should appear in your admin dashboard.');
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    const { closeDB } = require('./config/database-supabase');
    await closeDB();
    process.exit(0);
  }
};

checkDatabase();
