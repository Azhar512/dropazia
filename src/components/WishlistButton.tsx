import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface WishlistButtonProps {
  productId: string;
  module: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

export const WishlistButton = ({ productId, module, size = 'default', variant = 'ghost' }: WishlistButtonProps) => {
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);

  const isLiked = isInWishlist(productId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      setIsLoading(true);
      if (isLiked) {
        await removeFromWishlist(productId);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId, module);
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={isLiked ? 'text-red-500 hover:text-red-600' : ''}
    >
      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
    </Button>
  );
};

