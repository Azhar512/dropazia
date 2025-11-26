import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Loader2, XCircle } from 'lucide-react';
import PayFastService from '@/services/payfast';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Get payment ID from URL parameters
      const paymentId = searchParams.get('payment_id') || searchParams.get('pf_payment_id');
      
      if (!paymentId) {
        setError('Payment ID not found');
        setVerifying(false);
        return;
      }

      // Verify payment with backend
      const result = await PayFastService.verifyPayment(paymentId);

      if (result.success) {
        setPaymentData(result.data);
        toast.success('Payment verified successfully!');
      } else {
        setError('Payment verification failed');
        toast.error('Payment verification failed');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Failed to verify payment');
      toast.error('Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="p-8 max-w-md w-full text-center">
          <Loader2 className="w-16 h-16 animate-spin text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
          <p className="text-muted-foreground">Please wait while we verify your payment</p>
        </Card>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <Card className="p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Verification Failed</h2>
          <p className="text-muted-foreground mb-6">{error || 'Unable to verify your payment'}</p>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/daraz-orders')} className="flex-1">
              View Orders
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isPaid = paymentData.paymentStatus === 'paid';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="mb-4">
            {isPaid ? (
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            ) : (
              <Package className="w-20 h-20 text-orange-500 mx-auto" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isPaid ? 'Payment Successful!' : 'Order Received!'}
          </h1>
          <p className="text-muted-foreground">
            {isPaid 
              ? 'Your payment has been processed successfully' 
              : 'Your order is being processed'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Number:</span>
            <span className="font-semibold">{paymentData.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Status:</span>
            <span className="font-semibold capitalize">{paymentData.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status:</span>
            <span className={`font-semibold capitalize ${isPaid ? 'text-green-600' : 'text-orange-600'}`}>
              {paymentData.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-bold text-lg">Rs {Number(paymentData.amount).toLocaleString()}</span>
          </div>
          {paymentData.paymentReference && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference:</span>
              <span className="font-mono text-sm">{paymentData.paymentReference}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button onClick={() => navigate('/daraz-orders')} className="w-full" size="lg">
            <Package className="w-5 h-5 mr-2" />
            View My Orders
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" className="w-full" size="lg">
            Continue Shopping
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>What's Next?</strong> You'll receive a confirmation email shortly. 
            Track your order status in the "My Orders" section.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

