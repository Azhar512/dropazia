// PayFast Payment Gateway Integration
// Documentation: https://developers.payfast.co.za/

export interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  sandbox?: boolean;
}

export interface PayFastPaymentData {
  // Merchant details
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;

  // Customer details
  name_first: string;
  name_last: string;
  email_address: string;
  cell_number?: string;

  // Transaction details
  m_payment_id: string; // Unique payment ID
  amount: string; // Amount in ZAR/PKR
  item_name: string;
  item_description?: string;

  // Custom fields
  custom_str1?: string; // Can use for order ID
  custom_str2?: string; // Can use for user ID
  custom_str3?: string; // Can use for module (daraz/shopify)
  custom_int1?: number;

  // Security
  signature?: string;
}

class PayFastService {
  private config: PayFastConfig;
  private apiUrl: string;

  constructor() {
    const isProduction = import.meta.env.VITE_PAYFAST_MODE === 'production';
    
    this.config = {
      merchantId: import.meta.env.VITE_PAYFAST_MERCHANT_ID || '',
      merchantKey: import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '',
      passphrase: import.meta.env.VITE_PAYFAST_PASSPHRASE || '',
      returnUrl: `${window.location.origin}/payment-success`,
      cancelUrl: `${window.location.origin}/payment-cancelled`,
      notifyUrl: `${import.meta.env.VITE_API_URL}/api/payfast/notify`,
      sandbox: !isProduction
    };

    this.apiUrl = this.config.sandbox 
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';
  }

  /**
   * Prepare payment data for PayFast
   */
  preparePaymentData(orderData: {
    orderId: string;
    userId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    module: string;
    itemDescription?: string;
  }): PayFastPaymentData {
    const [firstName, ...lastNameParts] = orderData.customerName.split(' ');
    const lastName = lastNameParts.join(' ') || firstName;

    const paymentData: PayFastPaymentData = {
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
      return_url: this.config.returnUrl,
      cancel_url: this.config.cancelUrl,
      notify_url: this.config.notifyUrl,
      
      name_first: firstName,
      name_last: lastName,
      email_address: orderData.customerEmail,
      cell_number: orderData.customerPhone,
      
      m_payment_id: orderData.orderId,
      amount: orderData.amount.toFixed(2),
      item_name: `Order #${orderData.orderId}`,
      item_description: orderData.itemDescription || `${orderData.module} order`,
      
      custom_str1: orderData.orderId,
      custom_str2: orderData.userId,
      custom_str3: orderData.module,
    };

    return paymentData;
  }

  /**
   * Submit payment to PayFast (redirect user)
   */
  submitPayment(paymentData: PayFastPaymentData): void {
    // Create form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = this.apiUrl;

    // Add all fields to form
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
    });

    // Submit form
    document.body.appendChild(form);
    form.submit();
  }

  /**
   * Initiate payment process
   */
  async initiatePayment(orderData: {
    orderId: string;
    userId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    module: string;
    itemDescription?: string;
  }): Promise<void> {
    try {
      // Prepare payment data
      const paymentData = this.preparePaymentData(orderData);

      // Generate signature on backend for security
      // In production, call backend API to generate signature
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payfast/generate-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate payment signature');
      }

      const { signature } = await response.json();
      paymentData.signature = signature;

      // Submit to PayFast
      this.submitPayment(paymentData);
    } catch (error) {
      console.error('PayFast payment initiation error:', error);
      throw error;
    }
  }

  /**
   * Verify payment status (call backend)
   */
  async verifyPayment(paymentId: string): Promise<{ success: boolean; data?: any }> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payfast/verify/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('PayFast verification error:', error);
      return { success: false };
    }
  }

  /**
   * Check if PayFast is configured
   */
  isConfigured(): boolean {
    return !!(this.config.merchantId && this.config.merchantKey);
  }

  /**
   * Get payment form URL for manual submission
   */
  getPaymentUrl(): string {
    return this.apiUrl;
  }
}

export default new PayFastService();

