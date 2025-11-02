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
import ApiService from "@/services/api";
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
  
  // Data state - ALWAYS start empty (no mock data)
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  // Fetch users from API - CRITICAL: Always fetch from database, never use cached/mock data
  useEffect(() => {
    const fetchUsers = async () => {
      // NUCLEAR OPTION: Force clear state immediately
      setPendingUsers([]);
      setApprovedUsers([]);
      setIsLoadingUsers(true);
      
      try {
        console.log('🔄 ==========================================');
        console.log('🔄 FETCHING USERS FROM DATABASE (REAL API CALL)');
        console.log('🔄 VERSION: 2.0 - FORCE REFRESH');
        console.log('🔄 ==========================================');
        console.log('🔄 Time:', new Date().toISOString());
        console.log('🔄 Build timestamp:', import.meta.env.VITE_BUILD_TIME || 'not set');
        
        // CRITICAL: Clear any existing state first to prevent showing stale data
        // Force React to re-render with empty array
        await new Promise(resolve => setTimeout(resolve, 100));
        setPendingUsers([]);
        setApprovedUsers([]);
        
        console.log('🔄 Fetching pending users from API...');
        const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users?status=pending&_nocache=${Date.now()}`;
        console.log('🔄 API URL:', apiUrl);
        
        // Fetch directly with fetch to bypass any service caching
        const pendingResponse = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store' // Force no cache
        }).then(res => res.json()).catch(err => {
          console.error('❌ Direct fetch error:', err);
          // Fallback to ApiService
          return ApiService.getUsers({ status: 'pending', _t: Date.now() });
        });
        
        // CRITICAL: Log the full response to see what we're getting
        console.log('📥 ==========================================');
        console.log('📥 FULL API RESPONSE:');
        console.log('📥 ==========================================');
        console.log(JSON.stringify(pendingResponse, null, 2));
        console.log('📥 ==========================================');
        
        // Verify response structure
        if (!pendingResponse) {
          console.error('❌ API returned NULL or UNDEFINED');
          throw new Error('API returned null response');
        }
        
        if (pendingResponse && pendingResponse.success) {
          const pendingData = pendingResponse.data || [];
          console.log(`✅ API returned ${pendingData.length} pending users from DATABASE`);
          
          if (pendingData.length === 0) {
            console.warn('⚠️ DATABASE HAS NO PENDING USERS');
            console.warn('⚠️ This is CORRECT - there are no pending users in the database');
            console.warn('⚠️ When users register, they will appear here');
            setPendingUsers([]); // Ensure empty array
          } else {
            // Map users from database response
            const mappedPending = pendingData.map((user: any) => {
              const mapped = {
                id: user.id || user._id?.toString() || '',
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role === 'seller' ? 'reseller' : (user.role === 'buyer' ? 'buyer' : 'buyer'),
                module: user.module || 'daraz',
                date: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                status: 'pending'
              };
              console.log('📋 Mapped user from database:', mapped.name, mapped.email);
              return mapped;
            });
            console.log(`📋 Setting state with ${mappedPending.length} REAL users from database`);
            setPendingUsers(mappedPending);
            setLastFetchTime(new Date());
            console.log('✅ Pending users state updated with REAL data');
          }
        } else {
          console.error('❌ API response invalid:', pendingResponse);
          setPendingUsers([]); // Set to empty on error
          
          toast({
            title: "API Error",
            description: pendingResponse?.message || "Unable to load pending users from database.",
            variant: "destructive",
          });
        }

        console.log('🔄 Fetching approved users...');
        // Fetch approved users
        const approvedResponse = await ApiService.getUsers({ status: 'approved' });
        console.log('📥 Approved users response:', approvedResponse);
        
        if (approvedResponse && approvedResponse.success && approvedResponse.data) {
          console.log(`✅ Found ${approvedResponse.data.length} approved users`);
          const mappedApproved = approvedResponse.data.map((user: any, index: number) => ({
            id: user.id || user._id || `approved-${index}`,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role === 'seller' ? 'reseller' : (user.role === 'buyer' ? 'buyer' : 'buyer'),
            module: user.module || 'daraz',
            date: user.date || (user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
            status: 'approved'
          }));
          setApprovedUsers(mappedApproved);
        } else {
          console.warn('⚠️ No approved users found or invalid response:', approvedResponse);
          setApprovedUsers([]);
        }
      } catch (error: any) {
        console.error('❌ Failed to fetch users:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          response: error.response
        });
        toast({
          title: "Error",
          description: error.message || "Failed to load users. Please check console for details.",
          variant: "destructive",
        });
        setPendingUsers([]);
        setApprovedUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    // Fetch users immediately
    fetchUsers();
    
    // Set up auto-refresh every 30 seconds to show new registrations in real-time
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing users (30s interval)...');
      fetchUsers();
    }, 30000); // Refresh every 30 seconds
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [toast]);

  // Refresh users list (same logic as useEffect)
  const refreshUsers = async () => {
    setIsLoadingUsers(true);
    try {
      console.log('🔄 Manual refresh: Fetching pending users...');
      const pendingResponse = await ApiService.getUsers({ status: 'pending' });
      console.log('📥 Refresh - Pending users response:', pendingResponse);
      
      if (pendingResponse && pendingResponse.success) {
        const pendingData = pendingResponse.data || [];
        console.log(`✅ Refresh - Found ${pendingData.length} pending users`);
        
        const mappedPending = pendingData.map((user: any, index: number) => ({
          id: user.id || user._id || `pending-${index}`,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role === 'seller' ? 'reseller' : (user.role === 'buyer' ? 'buyer' : 'buyer'),
          module: user.module || 'daraz',
          date: user.date || (user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          status: 'pending'
        }));
        setPendingUsers(mappedPending);
        
        toast({
          title: "Refreshed",
          description: `Found ${pendingData.length} pending users`,
        });
      }

      console.log('🔄 Manual refresh: Fetching approved users...');
      const approvedResponse = await ApiService.getUsers({ status: 'approved' });
      if (approvedResponse && approvedResponse.success) {
        const approvedData = approvedResponse.data || [];
        const mappedApproved = approvedData.map((user: any, index: number) => ({
          id: user.id || user._id || `approved-${index}`,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role === 'seller' ? 'reseller' : (user.role === 'buyer' ? 'buyer' : 'buyer'),
          module: user.module || 'daraz',
          date: user.date || (user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          status: 'approved'
        }));
        setApprovedUsers(mappedApproved);
      }
    } catch (error: any) {
      console.error('❌ Failed to refresh users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to refresh users",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

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
  const handleApprove = async (userId: number | string) => {
    setIsLoading(true);
    try {
      const userToApprove = pendingUsers.find(user => user.id === userId || user.id.toString() === userId.toString());
      if (!userToApprove) {
        throw new Error('User not found');
      }

      // Call API to update user status
      const response = await ApiService.updateUserStatus(userToApprove.id.toString(), 'approved');
      
      if (response.success) {
        toast({
          title: "User Approved",
          description: `${userToApprove.name} has been approved successfully.`,
        });
        // Refresh users list
        await refreshUsers();
      } else {
        throw new Error(response.message || 'Failed to approve user');
      }
    } catch (error: any) {
      console.error('Approve user error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (userId: number | string) => {
    setIsLoading(true);
    try {
      const userToReject = pendingUsers.find(user => user.id === userId || user.id.toString() === userId.toString());
      if (!userToReject) {
        throw new Error('User not found');
      }

      // Call API to update user status
      const response = await ApiService.updateUserStatus(userToReject.id.toString(), 'rejected');
      
      if (response.success) {
        toast({
          title: "User Rejected",
          description: `${userToReject.name} has been rejected.`,
          variant: "destructive",
        });
        // Refresh users list
        await refreshUsers();
      } else {
        throw new Error(response.message || 'Failed to reject user');
      }
    } catch (error: any) {
      console.error('Reject user error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject user. Please try again.",
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
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={refreshUsers}
                         disabled={isLoadingUsers}
                       >
                         {isLoadingUsers ? (
                           <>Refreshing...</>
                         ) : (
                           <>Refresh</>
                         )}
                       </Button>
                       {lastFetchTime && (
                         <span className="text-xs text-muted-foreground">
                           Last refresh: {lastFetchTime.toLocaleTimeString()}
                         </span>
                       )}
                       <Badge variant="outline" className="px-3 py-1">
                         {filteredPendingUsers.length} pending
                       </Badge>
                     </div>

              <div className="rounded-lg border">
                {/* DEBUG INFO - Remove in production */}
                <div className="p-2 bg-yellow-50 border-b text-xs text-yellow-800">
                  <strong>Debug:</strong> Showing {filteredPendingUsers.length} of {pendingUsers.length} pending users from database
                  {lastFetchTime && ` (Last fetch: ${lastFetchTime.toLocaleTimeString()})`}
                </div>
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
                    {isLoadingUsers ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-2 text-muted-foreground">Loading users from database...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredPendingUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="space-y-2">
                            <p className="text-muted-foreground font-medium">No pending users found</p>
                            <p className="text-xs text-muted-foreground">
                              This means there are no users with status "pending" in the database.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              When users register, they will appear here automatically.
                            </p>
                          </div>
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
                  {pendingUsers.length === 0 && approvedUsers.length === 0 && !isLoadingUsers ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No activity yet</p>
                      <p className="text-xs mt-2">Activity will appear here as users register and interact with the platform</p>
                    </div>
                  ) : (
                    <>
                      {pendingUsers.slice(0, 5).map((pendingUser) => (
                        <div key={pendingUser.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">New user registration</p>
                            <p className="text-xs text-muted-foreground">{pendingUser.name} ({pendingUser.email}) • Pending approval</p>
                          </div>
                        </div>
                      ))}
                      {pendingUsers.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No pending users at the moment
                        </div>
                      )}
                    </>
                  )}
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
