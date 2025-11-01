import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/contexts/ProductContext';
import { Plus, Edit, Trash2, Search, Filter, Package, AlertTriangle, Upload, Download, Eye } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { Product, ProductImage, ProductDocument } from '@/types/product';

interface AdminProductManagementProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

const AdminProductManagement = ({ products, onProductsChange }: AdminProductManagementProps) => {
  const { addProduct: addProductToContext, updateProduct: updateProductInContext, deleteProduct: deleteProductFromContext, refreshProducts } = useProducts();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    module: 'daraz' as 'daraz' | 'shopify',
    status: 'active' as 'active' | 'inactive' | 'draft'
  });

  // File upload states
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesModule = selectedModule === 'all' || product.module === selectedModule;
    return matchesSearch && matchesCategory && matchesModule;
  });

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setUploadedImages(prev => [...prev, ...imageFiles]);
  };

  // Handle document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const documentFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type.includes('document')
    );
    setUploadedDocuments(prev => [...prev, ...documentFiles]);
  };

  // Helper function to convert file to base64 data URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Add new product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert images to base64 data URLs for persistence
      const images: ProductImage[] = uploadedImages.length > 0 
        ? await Promise.all(
            uploadedImages.map(async (file, index) => {
              try {
                return {
                  id: `img-${Date.now()}-${index}`,
                  url: await fileToBase64(file),
                  alt: file.name,
                  isPrimary: index === 0,
                  type: file.type.split('/')[1] as 'png' | 'jpg' | 'jpeg' | 'webp' | 'svg'
                };
              } catch (error) {
                console.error('Error converting image to base64:', error);
                throw new Error(`Failed to process image: ${file.name}`);
              }
            })
          )
        : [{
            id: `img-placeholder-${Date.now()}`,
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIxNi41NjkgMTUwIDIzMCAxNjMuNDMxIDIzMCAxODBDMjMwIDE5Ni41NjkgMjE2LjU2OSAyMTAgMjAwIDIxMEMxODMuNDMxIDIxMCAxNzAgMTk2LjU2OSAxNzAgMTgwQzE3MCAxNjMuNDMxIDE4My40MzEgMTUwIDIwMCAxNTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNzAgMjgwSDIzMFYzMjBIMTcwVjI4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
            alt: 'No image available',
            isPrimary: true,
            type: 'svg'
          }];

      // Convert documents to base64 data URLs for persistence
      const documents: ProductDocument[] = await Promise.all(
        uploadedDocuments.map(async (file, index) => ({
          id: `doc-${Date.now()}-${index}`,
          name: file.name,
          url: await fileToBase64(file),
          type: file.type.split('/')[1] as 'pdf' | 'doc' | 'docx',
          size: file.size
        }))
      );

      // Prepare product data without id (backend will generate it)
      // Backend handles createdBy (from authenticated user), createdAt, updatedAt
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        module: newProduct.module,
        status: newProduct.status,
        images,
        documents
      };

      await addProductToContext(productData);
      
      // Refresh products from backend to ensure sync
      await refreshProducts();
      
      // Reset form
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        module: 'daraz',
        status: 'active'
      });
      setUploadedImages([]);
      setUploadedDocuments([]);
      setIsAddDialogOpen(false);

      toast({
        title: 'Product Added',
        description: `${productData.name} has been added successfully.`,
      });
    } catch (error: any) {
      console.error('❌ Product creation error:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to add product. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update product
  const handleUpdateProduct = async () => {
    if (!editingProduct || !editingProduct.name || !editingProduct.category || !editingProduct.price || !editingProduct.stock) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateProductInContext(editingProduct.id, editingProduct);
      
      // Refresh products from backend to ensure sync
      await refreshProducts();
      
      toast({
        title: 'Product Updated',
        description: `${editingProduct.name} has been updated successfully.`,
      });
      
      setEditingProduct(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      await deleteProductFromContext(productId);
      
      // Refresh products from backend to ensure sync
      await refreshProducts();
      
      toast({
        title: 'Product Deleted',
        description: 'Product has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get low stock products
  const lowStockProducts = products.filter(product => product.stock < 10);

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">Upload and manage products for both Daraz and Shopify modules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient hover-lift">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product with images and documents for your modules.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={newProduct.category} 
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (PKR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module">Module *</Label>
                <Select 
                  value={newProduct.module} 
                  onValueChange={(value: 'daraz' | 'shopify') => setNewProduct({ ...newProduct, module: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daraz">Daraz</SelectItem>
                    <SelectItem value="shopify">Shopify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newProduct.status} 
                  onValueChange={(value: 'active' | 'inactive' | 'draft') => setNewProduct({ ...newProduct, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                />
              </div>
              
              {/* File Upload Sections */}
              <div className="space-y-2 col-span-2">
                <Label>Product Images (PNG, JPG, JPEG)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {uploadedImages.map((file, index) => (
                      <Badge key={index} variant="outline">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Product Documents (PDF, DOC)</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={handleDocumentUpload}
                />
                {uploadedDocuments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {uploadedDocuments.map((file, index) => (
                      <Badge key={index} variant="outline">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product information and files.
              </DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select 
                    value={editingProduct.category} 
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (Rs) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock Quantity *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    placeholder="Enter stock quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-module">Module</Label>
                  <Select 
                    value={editingProduct.module} 
                    onValueChange={(value: 'daraz' | 'shopify') => setEditingProduct({ ...editingProduct, module: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daraz">Daraz</SelectItem>
                      <SelectItem value="shopify">Shopify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={editingProduct.status} 
                    onValueChange={(value: 'active' | 'inactive' | 'draft') => setEditingProduct({ ...editingProduct, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="card-gradient border-orange-200 animate-fade-in">
          <div className="flex items-center gap-3 p-4">
            <AlertTriangle className="w-5 h-5 text-orange-500 animate-pulse-glow" />
            <div>
              <p className="font-medium text-orange-800">Low Stock Alert</p>
              <p className="text-sm text-orange-600">
                {lowStockProducts.length} product(s) are running low on stock
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
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
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="daraz">Daraz</SelectItem>
                <SelectItem value="shopify">Shopify</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {filteredProducts.length} products
          </Badge>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Files</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-8 h-8" />
                      <p>No products found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images.length > 0 && (
                          <img 
                            src={product.images[0].url} 
                            alt={product.images[0].alt}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">₨{product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={product.stock < 10 ? 'text-red-500 font-semibold' : ''}>
                          {product.stock}
                        </span>
                        {product.stock < 10 && (
                          <Badge variant="destructive" className="text-xs">Low</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.module === 'daraz' ? 'default' : 'secondary'}>
                        {product.module}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.status === 'active' ? 'default' : 'outline'}
                        className={product.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.images.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {product.images.length} images
                          </Badge>
                        )}
                        {product.documents.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {product.documents.length} docs
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Product
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminProductManagement;
