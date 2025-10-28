import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

const WhatsAppButton = ({ phoneNumber, message = "Hello! I have a question about your products." }: WhatsAppButtonProps) => {
  // Remove any non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      onClick={() => window.open(whatsappUrl, '_blank')}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-green-500 hover:bg-green-600 text-white"
      size="icon"
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp - 03274996979"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};

export default WhatsAppButton;

