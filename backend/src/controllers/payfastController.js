const crypto = require('crypto');
const { connectDB } = require('../config/database-supabase');
const Order = require('../models/Order');

// PayFast configuration
const getPayFastConfig = () => {
  return {
    merchantId: process.env.PAYFAST_MERCHANT_ID || '',
    merchantKey: process.env.PAYFAST_MERCHANT_KEY || '',
    passphrase: process.env.PAYFAST_PASSPHRASE || '',
    sandbox: process.env.PAYFAST_MODE !== 'production'
  };
};

/**
 * Generate MD5 signature for PayFast
 */
const generateSignature = (data, passphrase = '') => {
  // Create parameter string
  let paramString = '';
  const sortedKeys = Object.keys(data).sort();
  
  sortedKeys.forEach(key => {
    if (key !== 'signature' && data[key] !== '' && data[key] !== null && data[key] !== undefined) {
      paramString += `${key}=${encodeURIComponent(String(data[key]).trim()).replace(/%20/g, '+')}&`;
    }
  });

  // Remove last ampersand
  paramString = paramString.slice(0, -1);

  // Add passphrase if provided
  if (passphrase) {
    paramString += `&passphrase=${encodeURIComponent(passphrase.trim())}`;
  }

  // Generate MD5 hash
  return crypto.createHash('md5').update(paramString).digest('hex');
};

/**
 * Validate PayFast data
 */
const validatePayFastData = (pfData, pfParamString, pfPassphrase = '') => {
  // Calculate security signature
  const tempParamString = pfPassphrase
    ? `${pfParamString}&passphrase=${encodeURIComponent(pfPassphrase.trim())}`
    : pfParamString;

  const signature = crypto.createHash('md5').update(tempParamString).digest('hex');

  return pfData.signature === signature;
};

/**
 * Validate server IP (PayFast whitelisted IPs)
 */
const validatePayFastIP = (ip) => {
  const validHosts = [
    'www.payfast.co.za',
    'sandbox.payfast.co.za',
    'w1w.payfast.co.za',
    'w2w.payfast.co.za'
  ];

  // PayFast IP addresses
  const validIPs = [
    '197.97.145.144',
    '197.97.145.145',
    '197.97.145.146',
    '197.97.145.147',
    '197.97.145.148',
    '197.97.145.149'
  ];

  return validIPs.includes(ip);
};

/**
 * Generate payment signature (called from frontend)
 */
const generatePaymentSignature = async (req, res) => {
  try {
    const config = getPayFastConfig();
    
    if (!config.merchantId || !config.merchantKey) {
      return res.status(500).json({
        success: false,
        message: 'PayFast is not configured. Please add credentials to environment variables.'
      });
    }

    const paymentData = req.body;

    // Generate signature
    const signature = generateSignature(paymentData, config.passphrase);

    res.json({
      success: true,
      signature
    });
  } catch (error) {
    console.error('Generate signature error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate payment signature',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Handle PayFast ITN (Instant Transaction Notification)
 * This is called by PayFast servers when payment is completed
 */
const handlePayFastNotify = async (req, res) => {
  try {
    await connectDB();
    const config = getPayFastConfig();
    
    const pfData = req.body;
    const pfParamString = Object.keys(pfData)
      .filter(key => key !== 'signature')
      .sort()
      .map(key => `${key}=${encodeURIComponent(String(pfData[key]).trim()).replace(/%20/g, '+')}`)
      .join('&');

    console.log('PayFast ITN received:', {
      payment_status: pfData.payment_status,
      m_payment_id: pfData.m_payment_id,
      amount_gross: pfData.amount_gross
    });

    // 1. Verify signature
    const isValid = validatePayFastData(pfData, pfParamString, config.passphrase);
    
    if (!isValid) {
      console.error('Invalid PayFast signature');
      return res.status(400).send('Invalid signature');
    }

    // 2. Verify source IP (optional but recommended)
    const sourceIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // In production, uncomment this:
    // if (!validatePayFastIP(sourceIP)) {
    //   console.error('Invalid source IP:', sourceIP);
    //   return res.status(400).send('Invalid source IP');
    // }

    // 3. Verify payment amount matches order
    const orderId = pfData.custom_str1; // We stored order ID here
    const { getPool } = require('../config/database-supabase');
    const pool = getPool();
    
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 OR order_number = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      console.error('Order not found:', orderId);
      return res.status(404).send('Order not found');
    }

    const order = orderResult.rows[0];
    const expectedAmount = parseFloat(order.total_amount).toFixed(2);
    const receivedAmount = parseFloat(pfData.amount_gross).toFixed(2);

    if (expectedAmount !== receivedAmount) {
      console.error('Amount mismatch:', { expected: expectedAmount, received: receivedAmount });
      return res.status(400).send('Amount mismatch');
    }

    // 4. Update order based on payment status
    let newStatus = order.status;
    let newPaymentStatus = order.payment_status;

    switch (pfData.payment_status) {
      case 'COMPLETE':
        newStatus = 'confirmed';
        newPaymentStatus = 'paid';
        break;
      case 'FAILED':
        newPaymentStatus = 'failed';
        break;
      case 'CANCELLED':
        newStatus = 'cancelled';
        newPaymentStatus = 'failed';
        break;
      default:
        newPaymentStatus = 'pending';
    }

    // Update order in database
    await pool.query(
      `UPDATE orders 
       SET status = $1, 
           payment_status = $2, 
           payment_reference = $3,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4`,
      [newStatus, newPaymentStatus, pfData.pf_payment_id, order.id]
    );

    console.log('Order updated:', {
      orderId: order.id,
      status: newStatus,
      paymentStatus: newPaymentStatus,
      reference: pfData.pf_payment_id
    });

    // 5. Send success response to PayFast
    res.status(200).send('OK');

  } catch (error) {
    console.error('PayFast notify error:', error);
    res.status(500).send('Internal server error');
  }
};

/**
 * Verify payment status (called from frontend after redirect)
 */
const verifyPayment = async (req, res) => {
  try {
    await connectDB();
    const { paymentId } = req.params;

    const { getPool } = require('../config/database-supabase');
    const pool = getPool();

    // Find order by payment ID or order ID
    const orderResult = await pool.query(
      `SELECT * FROM orders 
       WHERE id = $1 
       OR order_number = $1 
       OR payment_reference = $1`,
      [paymentId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const order = orderResult.rows[0];

    res.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        amount: order.total_amount,
        paymentReference: order.payment_reference
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get PayFast configuration status
 */
const getPayFastStatus = async (req, res) => {
  try {
    const config = getPayFastConfig();
    
    res.json({
      success: true,
      data: {
        configured: !!(config.merchantId && config.merchantKey),
        sandbox: config.sandbox,
        merchantId: config.merchantId ? `${config.merchantId.substring(0, 4)}...` : 'Not set'
      }
    });
  } catch (error) {
    console.error('Get PayFast status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get PayFast status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  generatePaymentSignature,
  handlePayFastNotify,
  verifyPayment,
  getPayFastStatus
};

