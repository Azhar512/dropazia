import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Search, Filter, ShoppingCart, Download, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import Cart from '@/components/Cart';
import { CATEGORIES } from '@/lib/categories';
import { Product } from '@/types/product';

const ShopifyProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProductsByModule } = useProducts();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Get Shopify products from shared context
  const shopifyProducts = getProductsByModule('shopify');

  // Filter products
  const filteredProducts = shopifyProducts.filter(product => {
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
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
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
            Shopify Products
          </h1>
          <p className="text-muted-foreground">Explore our curated collection from Shopify</p>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-8">
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
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {filteredProducts.length} products
            </Badge>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.images[0]?.url || '/placeholder.svg'} 
                  alt={product.images[0]?.alt || product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {product.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-secondary">
                    ₨{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{product.name}</DialogTitle>
                        <DialogDescription>
                          {product.description}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <img 
                              src={product.images[0]?.url || '/placeholder.svg'} 
                              alt={product.images[0]?.alt || product.name}
                              className="w-full h-48 object-cover rounded"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold">₨{product.price.toLocaleString()}</span>
                              <Badge variant="outline">{product.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Stock: {product.stock} available
                            </p>
                          </div>
                        </div>

                        {/* Download Options */}
                        <div className="space-y-2">
                          <h4 className="font-medium">Downloads</h4>
                          <div className="flex gap-2">
                            {product.images.map((image) => (
                              <Button
                                key={image.id}
                                size="sm"
                                variant="outline"
                                onClick={() => downloadImage(image)}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PNG
                              </Button>
                            ))}
                            {product.documents.map((doc) => (
                              <Button
                                key={doc.id}
                                size="sm"
                                variant="outline"
                                onClick={() => downloadDocument(doc)}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </Button>
                            ))}
                          </div>
                        </div>

                        <Button 
                          variant="secondary"
                          className="w-full"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
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

export default ShopifyProducts;
