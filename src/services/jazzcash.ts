// JazzCash Payment Gateway Integration
// This is a simplified implementation for demonstration purposes
// In production, you would need to implement proper security measures and server-side validation

export interface JazzCashConfig {
  merchantId: string;
  password: string;
  integritySalt: string;
  apiUrl: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

// Default configuration (replace with your actual JazzCash credentials)
const defaultConfig: JazzCashConfig = {
  merchantId: 'YOUR_MERCHANT_ID',
  password: 'YOUR_PASSWORD',
  integritySalt: 'YOUR_INTEGRITY_SALT',
  apiUrl: 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction',
  returnUrl: `${window.location.origin}/payment/success`,
  cancelUrl: `${window.location.origin}/payment/cancel`
};

// Generate a random string for transaction reference
const generateTransactionRef = (): string => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
};

// Generate integrity hash for security
const generateIntegrityHash = (data: any, salt: string): string => {
  // In production, this should be done server-side for security
  const sortedKeys = Object.keys(data).sort();
  const hashString = sortedKeys.map(key => `${key}=${data[key]}`).join('&') + salt;
  
  // Simple hash function (use proper crypto in production)
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
};

export class JazzCashService {
  private config: JazzCashConfig;

  constructor(config?: Partial<JazzCashConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  async initiatePayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const transactionRef = generateTransactionRef();
      
      const paymentData = {
        pp_MerchantID: this.config.merchantId,
        pp_Password: this.config.password,
        pp_Amount: paymentRequest.amount.toString(),
        pp_Currency: paymentRequest.currency,
        pp_TxnRefNo: transactionRef,
        pp_Description: paymentRequest.description,
        pp_TxnDateTime: new Date().toISOString(),
        pp_BillReference: paymentRequest.orderId,
        pp_ReturnURL: this.config.returnUrl,
        pp_CustomerName: paymentRequest.customerName,
        pp_CustomerEmail: paymentRequest.customerEmail,
        pp_CustomerPhone: paymentRequest.customerPhone,
        pp_CustomerAddress: paymentRequest.customerAddress,
        pp_Language: 'EN'
      };

      // Generate integrity hash
      const integrityHash = generateIntegrityHash(paymentData, this.config.integritySalt);
      paymentData.pp_IntegritySalt = integrityHash;

      // In a real implementation, you would send this to your backend
      // which would then communicate with JazzCash API
      console.log('Payment data to be sent to JazzCash:', paymentData);

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          // For demo purposes, we'll simulate a successful response
          resolve({
            success: true,
            paymentUrl: `${this.config.apiUrl}?${new URLSearchParams(paymentData).toString()}`,
            transactionId: transactionRef
          });
        }, 1000);
      });

    } catch (error) {
      console.error('JazzCash payment initiation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initiation failed'
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    try {
      // In production, this would verify the payment with JazzCash
      // For demo purposes, we'll simulate verification
      console.log('Verifying payment for transaction:', transactionId);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true); // Simulate successful verification
        }, 500);
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  // Get payment status
  async getPaymentStatus(transactionId: string): Promise<'pending' | 'completed' | 'failed'> {
    try {
      // In production, this would check with JazzCash API
      console.log('Checking payment status for transaction:', transactionId);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('completed'); // Simulate completed payment
        }, 500);
      });
    } catch (error) {
      console.error('Payment status check error:', error);
      return 'failed';
    }
  }
}

// Export a default instance
export const jazzCashService = new JazzCashService();

// Utility function to format currency
export const formatCurrency = (amount: number, currency: string = 'PKR'): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Utility function to validate payment data
export const validatePaymentData = (data: PaymentRequest): string[] => {
  const errors: string[] = [];

  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.push('Customer name is required');
  }

  if (!data.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) {
    errors.push('Valid email address is required');
  }

  if (!data.customerPhone || data.customerPhone.trim().length < 10) {
    errors.push('Valid phone number is required');
  }

  if (!data.customerAddress || data.customerAddress.trim().length < 10) {
    errors.push('Complete address is required');
  }

  return errors;
};
