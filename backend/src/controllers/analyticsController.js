const OrderService = require('../models/Order');
const Product = require('../models/Product');

// Get analytics for a specific module
const getAnalytics = async (req, res) => {
  try {
    const { module } = req.params;
    const userId = req.user.id;

    // Get total views (simulated for now - could come from analytics service)
    const totalViews = 0;

    // Get products count for this module
    const productsCount = await Product.countDocuments({ 
      module, 
      status: 'active' 
    });

    // Get order stats for this module
    const orderStats = await OrderService.getStats(userId, module);

    // Get recent orders
    const orders = await OrderService.getByCustomerId(userId, 50, 0);
    const moduleOrders = orders.filter(order => order.module === module);

    // Calculate total revenue for this module
    const moduleRevenue = moduleOrders.reduce((sum, order) => {
      return sum + order.totalAmount;
    }, 0);

    const analytics = {
      totalViews,
      totalProducts: productsCount,
      totalRevenue: moduleRevenue,
      totalOrders: moduleOrders.length,
      orderStats: {
        delivered: moduleOrders.filter(o => o.status === 'delivered').length,
        shipped: moduleOrders.filter(o => o.status === 'shipped').length,
        pending: moduleOrders.filter(o => o.status === 'pending').length,
        cancelled: moduleOrders.filter(o => o.status === 'cancelled').length
      }
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics'
    });
  }
};

module.exports = {
  getAnalytics
};

