import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Package, 
  Truck, 
  Shield, 
  Star,
  Check,
  X,
  TrendingUp
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import WhatsAppButton from '@/components/WhatsAppButton';
import UserSidebar from '@/components/UserSidebar';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const foundProduct = products.find(p => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          if (user) {
            const wishlistStatus = await isInWishlist(foundProduct.id);
            setIsWishlisted(wishlistStatus);
          }
        } else {
          toast.error('Product not found');
          navigate('/daraz-products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, products, user, isInWishlist, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleWishlistToggle = async () => {
    if (!product || !user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id, product.module || 'daraz');
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/daraz-products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Card>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: 'https://via.placeholder.com/400', alt: product.name }];

  const primaryImage = images[selectedImage]?.url || images[0]?.url;
  const inStock = (product.stock || 0) > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserSidebar module={product.module || 'daraz'} />
      <WhatsAppButton 
        phoneNumber="+923256045679" 
        message={`Hello! I'm interested in ${product.name}`} 
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/${product.module || 'daraz'}-products`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <Card className="p-6">
            <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-white">
              <img
                src={primaryImage}
                alt={images[selectedImage]?.alt || product.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx 
                        ? 'border-orange-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className={isWishlisted ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
                <Badge variant={product.module === 'daraz' ? 'default' : 'secondary'}>
                  {product.module === 'daraz' ? 'Daraz' : 'Shopify'}
                </Badge>
                {inStock ? (
                  <Badge className="bg-green-500">
                    <Check className="w-3 h-3 mr-1" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-orange-500">
                  Rs {product.price.toLocaleString()}
                </span>
                {product.profit > 0 && (
                  <span className="text-lg text-gray-500">
                    + Rs {product.profit.toLocaleString()} profit
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.5</span>
                <span className="text-sm">(120 reviews)</span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3">Specifications</h3>
                <div className="space-y-2">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">{spec.name}:</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!inStock || quantity >= (product.stock || 0)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  {product.stock > 0 && (
                    <span className="text-sm text-gray-600">
                      {product.stock} available
                    </span>
                  )}
                </div>
              </div>

              {/* Mode Selection for Shopify */}
              {product.module === 'shopify' ? (
                <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Purchase Mode</span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleAddToCart}
                      disabled={!inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy for Self
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => navigate(`/resell/${product.id}`)}
                      disabled={!inStock}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Resell Now
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    onClick={handleAddToCart}
                    disabled={!inStock}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      handleAddToCart();
                      navigate('/checkout');
                    }}
                    disabled={!inStock}
                  >
                    Buy Now
                  </Button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-orange-500" />
                <div>
                  <div className="font-semibold text-sm">Free Shipping</div>
                  <div className="text-xs text-gray-600">On orders over Rs 5,000</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-orange-500" />
                <div>
                  <div className="font-semibold text-sm">Fast Delivery</div>
                  <div className="text-xs text-gray-600">3-5 business days</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-orange-500" />
                <div>
                  <div className="font-semibold text-sm">Secure Payment</div>
                  <div className="text-xs text-gray-600">100% protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={relatedProduct.images?.[0]?.url || 'https://via.placeholder.com/300'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <p className="text-orange-500 font-bold">Rs {relatedProduct.price.toLocaleString()}</p>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

