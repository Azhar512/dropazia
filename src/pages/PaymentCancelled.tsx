import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ShoppingCart, Home } from 'lucide-react';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mb-4">
            <XCircle className="w-20 h-20 text-orange-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-muted-foreground">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-2">What happened?</h3>
          <p className="text-sm text-muted-foreground">
            You cancelled the payment process or closed the payment window. 
            Your order has not been placed.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={() => navigate('/checkout')} className="w-full" size="lg">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => navigate('/cart')} variant="outline" className="w-full" size="lg">
            Return to Cart
          </Button>
          <Button onClick={() => navigate('/')} variant="ghost" className="w-full" size="lg">
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need Help?</strong> If you're experiencing issues with payment, 
            please contact our support team.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentCancelled;

