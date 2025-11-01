import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Trash2, Loader2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import UserSidebar from '@/components/UserSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { toast } from 'sonner';

const DarazWishlists = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlist, isLoading, refreshWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Detect module from URL
  const module = window.location.pathname.includes('shopify') ? 'shopify' : 'daraz';
  const basePath = module === 'shopify' ? '/shopify' : '/daraz';

  useEffect(() => {
    if (user) {
      refreshWishlist(module);
    }
  }, [user, module, refreshWishlist]);

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product: any) => {
    try {
      addToCart(product, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const wishlistItems = wishlist.filter(item => item.module === module);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${module === 'shopify' ? 'from-purple-50 to-purple-100' : 'from-orange-50 to-orange-100'}`}>
      <UserSidebar module={module} />
      <WhatsAppButton phoneNumber="+923256045679" message="Hello! I need help with my wishlist." />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`${basePath}-products`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${module === 'shopify' ? 'from-purple-500 to-blue-600' : 'from-orange-500 to-red-600'} bg-clip-text text-transparent`}>
              My Wishlist
            </h1>
            <p className="text-muted-foreground">Your saved {module.charAt(0).toUpperCase() + module.slice(1)} products</p>
          </div>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading wishlist...</p>
          </Card>
        ) : wishlistItems.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h3>
            <p className="text-muted-foreground mb-6">Save products you like to view them later</p>
            <Button onClick={() => navigate(`${basePath}-products`)}>
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => {
              const product = item.product;
              if (!product) return null;
              
              return (
                <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-muted">
                    <img 
                      src={product.images?.[0]?.url || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-full h-full object-cover" 
                    />
                    <Badge className="absolute top-2 right-2 bg-red-500">Wishlist</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary">
                        ₨{product.price?.toLocaleString() || '0'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Stock: {product.stock || 0}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mb-2"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-full text-red-600 hover:text-red-700"
                      onClick={() => handleRemove(product._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove from Wishlist
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DarazWishlists;

