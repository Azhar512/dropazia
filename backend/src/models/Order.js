const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },
  productSku: String,
  productImageUrl: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const shippingAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'Pakistan'
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: String,
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  paymentReference: String,
  module: {
    type: String,
    enum: ['daraz', 'shopify'],
    required: true
  },
  notes: String,
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  shippedAt: Date,
  deliveredAt: Date
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

class OrderService {
  // Create new order
  static async create(orderData) {
    try {
      const order = new Order(orderData);
      await order.save();
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get order by ID
  static async getById(orderId) {
    try {
      const order = await Order.findById(orderId)
        .populate('customer', 'name email phone')
        .populate('items.product', 'name sku');

      return order;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  // Get orders by customer
  static async getByCustomerId(customerId, limit = 50, offset = 0) {
    try {
      const orders = await Order.find({ customer: customerId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

      return orders;
    } catch (error) {
      console.error('Error getting customer orders:', error);
      throw error;
    }
  }

  // Update order status
  static async updateStatus(orderId, status, paymentStatus = null) {
    try {
      const updateData = { status };
      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        updateData,
        { new: true }
      );

      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Get order statistics
  static async getStats(customerId, module = null) {
    try {
      const matchCondition = module 
        ? { customer: mongoose.Types.ObjectId(customerId), module }
        : { customer: mongoose.Types.ObjectId(customerId) };

      const stats = await Order.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            shippedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
            },
            processingOrders: {
              $sum: {
                $cond: [
                  { $in: ['$status', ['pending', 'confirmed']] },
                  1,
                  0
                ]
              }
            },
            totalSpent: { $sum: '$totalAmount' }
          }
        }
      ]);

      return stats.length > 0 ? stats[0] : {
        totalOrders: 0,
        deliveredOrders: 0,
        shippedOrders: 0,
        processingOrders: 0,
        totalSpent: 0
      };
    } catch (error) {
      console.error('Error getting order stats:', error);
      throw error;
    }
  }

  // Get all orders (admin)
  static async getAll(limit = 50, offset = 0, status = null) {
    try {
      const filter = status ? { status } : {};
      const orders = await Order.find(filter)
        .populate('customer', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

      return orders;
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }
}

module.exports = OrderService;