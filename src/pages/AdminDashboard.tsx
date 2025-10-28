import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/contexts/ProductContext";
import AdminProductManagement from "@/components/AdminProductManagement";
import { ArrowLeft, Users, ShoppingBag, Settings, CheckCircle, XCircle, Search, Plus, Edit, Trash2, Eye, Filter, BarChart3, TrendingUp, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";

// Types
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "buyer" | "reseller";
  module: "daraz" | "shopify";
  date: string;
  status?: "pending" | "approved" | "rejected";
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  // For testing purposes, we'll make the admin dashboard accessible
  // In production, uncomment the authentication checks below
  
  // Redirect if not admin
  // React.useEffect(() => {
  //   if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
  //     navigate('/');
  //   }
  // }, [isAuthenticated, authLoading, user, navigate]);

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate('/');
  };

  // Show loading while checking authentication
  // if (authLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="flex flex-col items-center gap-4">
  //         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  //         <p className="text-muted-foreground">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Don't render if not authenticated or not admin
  // if (!isAuthenticated || user?.role !== 'admin') {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //     <div className="text-center">
  //       <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
  //       <p className="text-muted-foreground mb-4">
  //         You need admin privileges to access this dashboard.
  //       </p>
  //       <Button onClick={() => navigate('/')}>
  //         Go to Home
  //       </Button>
  //     </div>
  //   </div>
  // );
  // }
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  
  // Data state
  const [pendingUsers, setPendingUsers] = useState<User[]>([
    { id: 1, name: "Ali Haider", email: "abc12@gmail.com", phone: "03344895123", role: "buyer", module: "shopify", date: "2025-01-23", status: "pending" },
    { id: 2, name: "Sara Khan", email: "sara@gmail.com", phone: "03001234567", role: "reseller", module: "daraz", date: "2025-01-23", status: "pending" },
    { id: 4, name: "Muhammad Ali", email: "m.ali@gmail.com", phone: "03123456789", role: "buyer", module: "daraz", date: "2025-01-24", status: "pending" },
  ]);

  const [approvedUsers, setApprovedUsers] = useState<User[]>([
    { id: 3, name: "Ahmed Ali", email: "ahmed@gmail.com", phone: "03111234567", role: "buyer", module: "shopify", date: "2025-01-20", status: "approved" },
    { id: 5, name: "Fatima Khan", email: "fatima@gmail.com", phone: "03212345678", role: "reseller", module: "daraz", date: "2025-01-18", status: "approved" },
  ]);

  // Use products from shared context
  const allProducts = products;

  // Filtered data
  const filteredPendingUsers = pendingUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const filteredApprovedUsers = approvedUsers.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.phone.includes(userSearchTerm)
  );

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(productSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // User management functions
  const handleApprove = async (userId: number) => {
    setIsLoading(true);
    try {
      const userToApprove = pendingUsers.find(user => user.id === userId);
      if (userToApprove) {
        // Move user from pending to approved
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        setApprovedUsers(prev => [...prev, { ...userToApprove, status: "approved" }]);
        
        toast({
          title: "User Approved",
          description: `${userToApprove.name} has been approved successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (userId: number) => {
    setIsLoading(true);
    try {
      const userToReject = pendingUsers.find(user => user.id === userId);
      if (userToReject) {
        // Remove user from pending list
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        
        toast({
          title: "User Rejected",
          description: `${userToReject.name} has been rejected.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Product management functions
  const handleDeleteProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      deleteProduct(productId);
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    setIsLoading(true);
    try {
      updateProduct(productId, { stock: newStock });
      toast({
        title: "Stock Updated",
        description: "Product stock has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name || 'Admin User'}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage users, products, and platform settings</p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-elevated hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">{pendingUsers.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-elevated hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved Users</p>
                <p className="text-2xl font-bold">{approvedUsers.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-elevated hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <ShoppingBag className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{allProducts.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-elevated hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Settings className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold">{allProducts.filter(p => p.stock < 10).length}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 shadow-elevated">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
              <TabsTrigger value="users">All Users</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search pending users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  {filteredPendingUsers.length} pending
                </Badge>
              </div>

              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No pending users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPendingUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.module === "daraz" ? "default" : "secondary"}>
                            {user.module}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.date}</TableCell>
                        <TableCell className="text-right space-x-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="default"
                                  disabled={isLoading}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Approve User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to approve {user.name}? This action will grant them access to the platform.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleApprove(user.id)}>
                                    Approve User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="destructive"
                                  disabled={isLoading}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reject {user.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleReject(user.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Reject User
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
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  {filteredApprovedUsers.length} users
                </Badge>
              </div>

              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Returns</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApprovedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.module === "daraz" ? "default" : "secondary"}>
                            {user.module}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">0</Badge>
                        </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                        </TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

                <TabsContent value="products" className="space-y-4">
                  <AdminProductManagement
                    products={allProducts}
                    onProductsChange={(newProducts) => {
                      // This will be handled by the shared context
                    }}
                  />
                </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User Analytics */}
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">User Growth</h3>
                      <p className="text-sm text-muted-foreground">Last 30 days</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">New Users</span>
                      <span className="font-semibold text-green-600">+{pendingUsers.length + approvedUsers.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Approved Users</span>
                      <span className="font-semibold">{approvedUsers.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pending Approval</span>
                      <span className="font-semibold text-orange-600">{pendingUsers.length}</span>
                    </div>
                  </div>
                </Card>

                {/* Product Analytics */}
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <ShoppingBag className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Product Overview</h3>
                      <p className="text-sm text-muted-foreground">Inventory status</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Products</span>
                      <span className="font-semibold">{allProducts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Low Stock Items</span>
                      <span className="font-semibold text-red-600">{allProducts.filter(p => p.stock < 10).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Price</span>
                      <span className="font-semibold">₨{Math.round(allProducts.reduce((sum, p) => sum + p.price, 0) / allProducts.length).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                {/* Module Distribution */}
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <BarChart3 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Module Distribution</h3>
                      <p className="text-sm text-muted-foreground">User & product spread</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Daraz Users</span>
                      <span className="font-semibold">{[...pendingUsers, ...approvedUsers].filter(u => u.module === 'daraz').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Shopify Users</span>
                      <span className="font-semibold">{[...pendingUsers, ...approvedUsers].filter(u => u.module === 'shopify').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Daraz Products</span>
                      <span className="font-semibold">{allProducts.filter(p => p.module === 'daraz').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Shopify Products</span>
                      <span className="font-semibold">{allProducts.filter(p => p.module === 'shopify').length}</span>
                    </div>
                </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Recent Activity</h3>
                    <p className="text-sm text-muted-foreground">Latest platform activities</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { action: "New user registration", user: "Ali Haider", time: "2 hours ago", type: "user" },
                    { action: "Product added", user: "Summer Dress", time: "4 hours ago", type: "product" },
                    { action: "User approved", user: "Sara Khan", time: "1 day ago", type: "approval" },
                    { action: "Stock updated", user: "Men's Watch", time: "2 days ago", type: "product" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'product' ? 'bg-green-500' :
                        'bg-orange-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
              </div>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
