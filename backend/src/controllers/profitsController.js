const OrderService = require('../models/Order');

// Get profits for a specific module
const getProfits = async (req, res) => {
  try {
    const { module } = req.params;
    const userId = req.user.id;

    // Get all orders for this user and module
    const orders = await OrderService.getByCustomerId(userId, 1000, 0);
    const moduleOrders = orders.filter(order => order.module === module);

    // Calculate total revenue
    const totalRevenue = moduleOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate total expenses (simplified - 20% of revenue as expenses)
    // In a real application, this would come from expense tracking
    const totalExpenses = totalRevenue * 0.2;

    // Calculate total profit
    const totalProfit = totalRevenue - totalExpenses;

    // Calculate profits for different time periods
    const now = new Date();
    const thisWeekStart = new Date(now.setDate(now.getDate() - 7));
    const lastMonthStart = new Date(now.setMonth(now.getMonth() - 1));
    const twoMonthsAgoStart = new Date(now.setMonth(now.getMonth() - 2));

    const thisWeekOrders = moduleOrders.filter(order => 
      new Date(order.createdAt) >= thisWeekStart
    );
    const lastMonthOrders = moduleOrders.filter(order => 
      new Date(order.createdAt) >= lastMonthStart && 
      new Date(order.createdAt) < thisWeekStart
    );
    const previousMonthOrders = moduleOrders.filter(order => 
      new Date(order.createdAt) >= twoMonthsAgoStart && 
      new Date(order.createdAt) < lastMonthStart
    );

    const calculatePeriodProfit = (orders) => {
      const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      return {
        revenue,
        expenses: revenue * 0.2,
        profit: revenue - (revenue * 0.2)
      };
    };

    const thisWeek = calculatePeriodProfit(thisWeekOrders);
    const lastMonth = calculatePeriodProfit(lastMonthOrders);
    const previousMonth = calculatePeriodProfit(previousMonthOrders);

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const weeklyChange = calculateChange(thisWeek.profit, previousMonth.profit);
    const monthlyChange = calculateChange(lastMonth.profit, previousMonth.profit);

    const profitData = {
      summary: {
        totalProfit,
        totalRevenue,
        totalExpenses
      },
      periods: {
        thisWeek: {
          profit: thisWeek.profit,
          change: `${weeklyChange > 0 ? '+' : ''}${weeklyChange}%`,
          isPositive: weeklyChange >= 0
        },
        lastMonth: {
          profit: lastMonth.profit,
          change: `${monthlyChange > 0 ? '+' : ''}${monthlyChange}%`,
          isPositive: monthlyChange >= 0
        },
        previousMonth: {
          profit: previousMonth.profit,
          change: '0%',
          isPositive: true
        }
      }
    };

    res.json({
      success: true,
      data: profitData
    });

  } catch (error) {
    console.error('Get profits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profits'
    });
  }
};

module.exports = {
  getProfits
};

