import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, Search, Filter, ShoppingCart, Download, Eye, Heart, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import Cart from '@/components/Cart';
import UserSidebar from '@/components/UserSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { WishlistButton } from '@/components/WishlistButton';
import { CATEGORIES } from '@/lib/categories';
import { getCategoryImage } from '@/lib/categoryImages';
import { Product } from '@/types/product';
import { toast } from 'sonner';

const DarazProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProductsByModule, products } = useProducts();
  const { addToCart } = useCart();
  const { refreshWishlist } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Get Daraz products from shared context
  const darazProducts = getProductsByModule('daraz');
  
  // Debug log
  console.log('Daraz products:', darazProducts);
  console.log('Total products in context:', products.length);
  console.log('User status:', user?.status, 'User role:', user?.role);

  // Refresh wishlist on mount (for logged-in users)
  React.useEffect(() => {
    if (user) {
      refreshWishlist('daraz');
    }
  }, [user, refreshWishlist]);

  // Filter products
  const filteredProducts = darazProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add to cart function
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  // Download image
  const downloadImage = (image: any) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.alt}.png`;
    link.click();
  };

  // Download document
  const downloadDocument = (document: any) => {
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.click();
  };

  // Copy product name
  const copyProductName = async (productName: string, productId: string) => {
    try {
      await navigator.clipboard.writeText(productName);
      setCopiedId(productId);
      toast.success("Product name copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Could not copy to clipboard");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <UserSidebar module="daraz" />
      <WhatsAppButton phoneNumber="+923256045679" message="Hello! I need help with Daraz products." />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-4">
            <Cart />
            {user ? (
              <div className="text-sm text-muted-foreground">
                Welcome, {user.name}
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/daraz')}
                className="btn-gradient"
              >
                Login to Add to Cart
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Daraz Products
          </h1>
          <p className="text-muted-foreground">Discover amazing products from our Daraz collection</p>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {filteredProducts.length} products
            </Badge>
          </div>
        </Card>

        {/* Categories Section - Horizontal Scrollable - Full Width */}
        <div className="mb-8 relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          {/* Left Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById('daraz-categories-scroll');
              if (container) {
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }
            }}
            className="absolute left-0 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Categories Scroll Container */}
          <div
            id="daraz-categories-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 pl-12 pr-12"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* All Categories Option */}
            <div
              className="flex flex-col items-center cursor-pointer group min-w-[120px]"
              onClick={() => setSelectedCategory('all')}
            >
              <div className={`w-24 h-24 rounded-full bg-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden mb-3 flex items-center justify-center ${selectedCategory === 'all' ? 'ring-4 ring-orange-500' : ''}`}>
                <div className="text-4xl font-bold text-orange-500">All</div>
              </div>
              <h3 className={`text-sm font-medium text-center capitalize leading-tight px-2 ${selectedCategory === 'all' ? 'text-orange-500 font-semibold' : 'text-gray-700 group-hover:text-orange-500'} transition-colors`}>
                All Categories
              </h3>
            </div>

            {CATEGORIES.map((category) => (
              <div
                key={category}
                className="flex flex-col items-center cursor-pointer group min-w-[120px]"
                onClick={() => setSelectedCategory(category)}
              >
                {/* Circular Image Container */}
                <div className={`w-24 h-24 rounded-full bg-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden mb-3 flex items-center justify-center ${selectedCategory === category ? 'ring-4 ring-orange-500' : ''}`}>
                  <img 
                    src={getCategoryImage(category)}
                    alt={category}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                
                {/* Category Label */}
                <h3 className={`text-sm font-medium text-center capitalize leading-tight px-2 ${selectedCategory === category ? 'text-orange-500 font-semibold' : 'text-gray-700 group-hover:text-orange-500'} transition-colors`}>
                  {category}
                </h3>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById('daraz-categories-scroll');
              if (container) {
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }
            }}
            className="absolute right-0 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Hide scrollbar for webkit browsers */}
        <style>{`
          #daraz-categories-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Products Grid - Full Width - Markaz Style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden relative bg-gray-50">
                <img 
                  src={product.images[0]?.url || '/placeholder.svg'} 
                  alt={product.images[0]?.alt || product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-1.5 right-1.5" onClick={(e) => e.stopPropagation()}>
                  <WishlistButton productId={product.id} module="daraz" />
                </div>
              </div>
              
              {/* Product Info - Compact */}
              <div className="p-2.5 sm:p-3">
                {/* Product Name */}
                <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-1.5 text-gray-900 leading-tight">
                  {product.name}
                </h3>
                
                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold text-orange-500">
                    Rs{product.price.toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyProductName(product.name, product.id);
                    }}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === product.id ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>

                {/* Add to Cart Button */}
                <Button 
                  size="sm" 
                  className="w-full mt-2 h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DarazProducts;
