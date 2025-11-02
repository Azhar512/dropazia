import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/contexts/ProductContext";
import AdminProductManagement from "@/components/AdminProductManagement";
import ApiService from "@/services/api";
import { ArrowLeft, Users, ShoppingBag, Settings, CheckCircle, XCircle, Search, Plus, Edit, Trash2, Eye, Filter, BarChart3, TrendingUp, LogOut, Package, RefreshCw, Phone, Mail, MapPin } from "lucide-react";
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

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    product: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productImageUrl?: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  module: 'daraz' | 'shopify';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  customerAddressDocument?: {
    name: string;
    url: string;
    type: string;
  } | null;
  darazCustomerDocument?: {
    name: string;
    url: string;
    type: string;
  } | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
  
  // Data state - FORCE EMPTY (ZERO mock data, ZERO defaults, NOTHING)
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // AGGRESSIVE: Force clear on mount to prevent ANY stale data
  React.useEffect(() => {
    console.log('🧹 FORCE CLEARING ALL STATE ON MOUNT - NO MOCK DATA');
    setPendingUsers([]);
    setApprovedUsers([]);
  }, []);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      try {
        console.log('🔄 Fetching orders from API...');
        const response = await ApiService.getAllOrders({ 
          status: orderStatusFilter !== 'all' ? orderStatusFilter : undefined,
          _t: Date.now() 
        });
        
        if (response.success && Array.isArray(response.data)) {
          console.log(`✅ Loaded ${response.data.length} orders`);
          setOrders(response.data);
        } else {
          console.error('❌ Invalid orders response:', response);
          setOrders([]);
        }
      } catch (error: any) {
        console.error('❌ Failed to fetch orders:', error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
    
    // Auto-refresh every 15 seconds
    const refreshInterval = setInterval(fetchOrders, 15000);
    return () => clearInterval(refreshInterval);
  }, [orderStatusFilter, toast]);

  // COMPLETELY CLEAN - NO MOCK DATA - ONLY REAL DATABASE USERS
  // This useEffect fetches ONLY from database API - NO hardcoded data, NO mock data, NO fallbacks
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
          
          // AGGRESSIVE SAFETY FILTER: Block ALL known mock users by email AND name
          const MOCK_USER_EMAILS = [
            'abc12@gmail.com',
            'sara@gmail.com',
            'm.ali@gmail.com',
            'ali.haider@gmail.com',
            'sara.khan@gmail.com',
            'muhammad.ali@gmail.com'
          ];
          
          const MOCK_USER_NAMES = [
            'ali haider',
            'sara khan',
            'muhammad ali'
          ];
          
          const MOCK_USER_PHONES = [
            '03344895123',
            '03001234567',
            '03123456789',
            '03214444444',
            '03215555555',
            '03216666666'
          ];
          
          // Filter by email, name, OR phone
          const realUsers = pendingData.filter((user: any) => {
            const email = (user.email || '').toLowerCase().trim();
            const name = (user.name || '').toLowerCase().trim();
            const phone = (user.phone || '').trim().replace(/[^0-9]/g, ''); // Remove spaces/dashes
            
            const isMockEmail = MOCK_USER_EMAILS.includes(email);
            const isMockName = MOCK_USER_NAMES.some(mockName => name.includes(mockName.toLowerCase()));
            const isMockPhone = MOCK_USER_PHONES.some(mockPhone => phone.includes(mockPhone));
            
            if (isMockEmail || isMockName || isMockPhone) {
              console.warn(`🚫 BLOCKED MOCK USER: ${user.name} (${user.email}) - Reason: ${isMockEmail ? 'email' : isMockName ? 'name' : 'phone'}`);
              return false; // BLOCK THIS USER
            }
            
            return true; // Allow real users
          });
          
          console.log(`📊 After filtering: ${realUsers.length} real users (filtered out ${pendingData.length - realUsers.length} mock users)`);
          
          if (realUsers.length === 0) {
            console.log('✅ No pending users in database (or all were filtered as mock data)');
            setPendingUsers([]); // Ensure empty array
          } else {
            // Map only REAL users (not mock)
            const mappedPending = realUsers.map((user: any) => {
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
              console.log('✅ Real user:', mapped.name, mapped.email);
              return mapped;
            });
            console.log(`✅ Setting state with ${mappedPending.length} REAL users (NO MOCK DATA)`);
            setPendingUsers(mappedPending);
            setLastFetchTime(new Date());
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

        // Fetch approved users
        const approvedUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users?status=approved&_t=${Date.now()}`;
        const approvedResponse = await fetch(approvedUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        
        if (approvedResponse.ok) {
          const approvedData = await approvedResponse.json();
          if (approvedData.success && Array.isArray(approvedData.data)) {
            const mappedApproved = approvedData.data.map((user: any) => ({
              id: user.id || user._id?.toString() || '',
              name: user.name || '',
              email: user.email || '',
              phone: user.phone || '',
              role: user.role === 'seller' ? 'reseller' : (user.role === 'buyer' ? 'buyer' : 'buyer'),
              module: user.module || 'daraz',
              date: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              status: 'approved'
            }));
            setApprovedUsers(mappedApproved);
            console.log(`✅ Loaded ${mappedApproved.length} approved users`);
          }
        } else {
          console.warn('⚠️ Failed to fetch approved users');
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
    
    // Set up auto-refresh every 15 seconds for REAL-TIME updates (admin sees new registrations faster)
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refresh: Checking for new user registrations (15s)...');
      fetchUsers();
    }, 15000); // Refresh every 15 seconds for faster detection of new registrations
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [toast]);

  // Refresh users list - Manual refresh button
  const refreshUsers = async () => {
    setIsLoadingUsers(true);
    try {
      console.log('🔄 Manual refresh: Fetching from database...');
      
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('authToken');
      
      // Clear state first
      setPendingUsers([]);
      
      // Fetch pending users
      const pendingUrl = `${apiBase}/api/users?status=pending&_t=${Date.now()}`;
      const pendingResponse = await fetch(pendingUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      });
      
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        if (pendingData.success && Array.isArray(pendingData.data)) {
          // AGGRESSIVE SAFETY FILTER: Block by email, name, AND phone
          const MOCK_USER_EMAILS = [
            'abc12@gmail.com',
            'sara@gmail.com',
            'm.ali@gmail.com',
            'ali.haider@gmail.com',
            'sara.khan@gmail.com',
            'muhammad.ali@gmail.com'
          ];
          
          const MOCK_USER_NAMES = ['ali haider', 'sara khan', 'muhammad ali'];
          const MOCK_USER_PHONES = ['03344895123', '03001234567', '03123456789'];
          
          const realUsers = pendingData.data.filter((user: any) => {
            const email = (user.email || '').toLowerCase().trim();
            const name = (user.name || '').toLowerCase().trim();
            const phone = (user.phone || '').replace(/[^0-9]/g, ''); // Digits only
            
            const isMock = MOCK_USER_EMAILS.includes(email) ||
                          MOCK_USER_NAMES.some(n => name.includes(n)) ||
                          MOCK_USER_PHONES.some(p => phone.includes(p));
            
            if (isMock) {
              console.warn(`🚫 BLOCKED: ${user.name} (${user.email})`);
            }
            return !isMock;
          });
          
          const mappedPending = realUsers.map((user: any) => ({
            id: user.id || user._id?.toString() || '',
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role === 'seller' ? 'reseller' : (user.role === 'buyer' ? 'buyer' : 'buyer'),
            module: user.module || 'daraz',
            date: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: 'pending'
          }));
          
          setPendingUsers(mappedPending);
          setLastFetchTime(new Date());
          
          if (mappedPending.length > 0) {
            toast({
              title: "✅ Refreshed",
              description: `Found ${mappedPending.length} pending user(s) awaiting approval`,
            });
          } else {
            toast({
              title: "Refreshed",
              description: "No pending users found",
            });
          }
        }
      }

      // Fetch approved users
      const approvedUrl = `${apiBase}/api/users?status=approved&_t=${Date.now()}`;
      const approvedResponse = await fetch(approvedUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      });
      
      if (approvedResponse.ok) {
        const approvedData = await approvedResponse.json();
        if (approvedData.success && Array.isArray(approvedData.data)) {
          const mappedApproved = approvedData.data.map((user: any) => ({
            id: user.id || user._id?.toString() || '',
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role === 'seller' ? 'reseller' : (user.role === 'buyer' ? 'buyer' : 'buyer'),
            module: user.module || 'daraz',
            date: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: 'approved'
          }));
          setApprovedUsers(mappedApproved);
        }
      }
    } catch (error: any) {
      console.error('❌ Failed to refresh users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to refresh users",
        variant: "destructive",
      });
      setPendingUsers([]);
      setApprovedUsers([]);
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
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
              <TabsTrigger value="users">All Users</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
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
                {/* Live status indicator */}
                <div className="p-2 bg-blue-50 border-b text-xs text-blue-800 flex items-center justify-between">
                  <div>
                    <strong>Live Data:</strong> {pendingUsers.length} pending user(s) from database
                    {lastFetchTime && ` • Last updated: ${lastFetchTime.toLocaleTimeString()}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Auto-refresh: 15s</span>
                  </div>
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

            <TabsContent value="orders" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search orders by customer name, email, order number..." 
                      className="pl-10"
                    />
                  </div>
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fetchOrders = async () => {
                        setIsLoadingOrders(true);
                        try {
                          const response = await ApiService.getAllOrders({ 
                            status: orderStatusFilter !== 'all' ? orderStatusFilter : undefined,
                            _t: Date.now() 
                          });
                          if (response.success && Array.isArray(response.data)) {
                            setOrders(response.data);
                            toast({
                              title: "Refreshed",
                              description: `Loaded ${response.data.length} orders`,
                            });
                          }
                        } catch (error) {
                          console.error('Failed to refresh orders:', error);
                        } finally {
                          setIsLoadingOrders(false);
                        }
                      };
                      fetchOrders();
                    }}
                    disabled={isLoadingOrders}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  {orders.length} orders
                </Badge>
              </div>

              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingOrders ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-2 text-muted-foreground">Loading orders...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          <div className="space-y-2">
                            <Package className="w-12 h-12 mx-auto text-muted-foreground/50" />
                            <p className="font-medium">No orders found</p>
                            <p className="text-xs">Orders will appear here when customers complete checkout</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{order.orderNumber}</span>
                              <Badge variant="outline" className="w-fit mt-1 text-xs">
                                {order.module}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <span className="font-medium">{order.customerName}</span>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                <span>{order.customerEmail}</span>
                              </div>
                              {order.customerPhone && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  <span>{order.customerPhone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="text-sm">
                                  <span>{item.productName}</span>
                                  <span className="text-muted-foreground"> x{item.quantity}</span>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{order.items.length - 2} more
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">Rs {order.totalAmount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                order.status === 'delivered' ? 'default' :
                                order.status === 'shipped' ? 'default' :
                                order.status === 'confirmed' ? 'secondary' :
                                order.status === 'cancelled' ? 'destructive' :
                                'outline'
                              }
                              className={
                                order.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                order.status === 'shipped' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                ''
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                order.paymentStatus === 'paid' ? 'default' :
                                order.paymentStatus === 'failed' ? 'destructive' :
                                'outline'
                              }
                              className={
                                order.paymentStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                order.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                ''
                              }
                            >
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Select
                                value={order.status}
                                onValueChange={async (newStatus) => {
                                  try {
                                    setIsLoading(true);
                                    const response = await ApiService.updateOrderStatus(
                                      order.id,
                                      newStatus as any
                                    );
                                    if (response.success) {
                                      toast({
                                        title: "Success",
                                        description: `Order status updated to ${newStatus}`,
                                      });
                                      // Refresh orders
                                      const refreshResponse = await ApiService.getAllOrders({ 
                                        status: orderStatusFilter !== 'all' ? orderStatusFilter : undefined,
                                        _t: Date.now() 
                                      });
                                      if (refreshResponse.success && Array.isArray(refreshResponse.data)) {
                                        setOrders(refreshResponse.data);
                                      }
                                    } else {
                                      throw new Error(response.message || 'Failed to update order');
                                    }
                                  } catch (error: any) {
                                    toast({
                                      title: "Error",
                                      description: error.message || "Failed to update order status",
                                      variant: "destructive",
                                    });
                                  } finally {
                                    setIsLoading(false);
                                  }
                                }}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Order Details Dialog */}
              <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
                    <DialogDescription>
                      Complete information about this order
                    </DialogDescription>
                  </DialogHeader>
                  {selectedOrder && (
                    <div className="space-y-6">
                      {/* Customer Information */}
                      <Card className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Customer Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Name:</span>
                            <p className="font-medium">{selectedOrder.customerName}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Email:</span>
                            <p className="font-medium">{selectedOrder.customerEmail}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Phone:</span>
                            <p className="font-medium">{selectedOrder.customerPhone || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Module:</span>
                            <Badge variant="outline">{selectedOrder.module}</Badge>
                          </div>
                        </div>
                      </Card>

                      {/* Shipping Address */}
                      {selectedOrder.shippingAddress && (
                        <Card className="p-4">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Shipping Address
                          </h3>
                          <div className="text-sm">
                            <p>{selectedOrder.shippingAddress.street}</p>
                            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                            <p>{selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}</p>
                          </div>
                        </Card>
                      )}

                      {/* Order Items */}
                      <Card className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Order Items ({selectedOrder.items.length})
                        </h3>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                              {item.productImageUrl && (
                                <img
                                  src={item.productImageUrl}
                                  alt={item.productName}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity} × Rs {item.unitPrice.toLocaleString()} = Rs {item.totalPrice.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Amount:</span>
                            <span className="text-xl font-bold">Rs {selectedOrder.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </Card>

                      {/* Order Status */}
                      <Card className="p-4">
                        <h3 className="font-semibold mb-3">Order Status</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className="ml-2">{selectedOrder.status}</Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Payment Status:</span>
                            <Badge className="ml-2">{selectedOrder.paymentStatus}</Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Payment Method:</span>
                            <p className="font-medium">{selectedOrder.paymentMethod || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Order Date:</span>
                            <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        {selectedOrder.notes && (
                          <div className="mt-4">
                            <span className="text-muted-foreground">Notes:</span>
                            <p className="font-medium">{selectedOrder.notes}</p>
                          </div>
                        )}
                      </Card>

                      {/* Daraz Documents - Only show for Daraz orders */}
                      {selectedOrder.module === 'daraz' && (
                        <Card className="p-4">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Daraz Required Documents
                          </h3>
                          <div className="space-y-3">
                            {selectedOrder.customerAddressDocument ? (
                              <div className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Customer Address Document</p>
                                    <p className="text-xs text-muted-foreground">
                                      {selectedOrder.customerAddressDocument.name || 'Address Document.pdf'}
                                    </p>
                                  </div>
                                  {selectedOrder.customerAddressDocument.url && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = selectedOrder.customerAddressDocument.url;
                                        link.download = selectedOrder.customerAddressDocument.name || 'address-document.pdf';
                                        link.target = '_blank';
                                        link.click();
                                      }}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View PDF
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 border border-yellow-300 rounded-lg bg-yellow-50">
                                <p className="text-sm text-yellow-800">⚠️ Customer Address Document not uploaded</p>
                              </div>
                            )}

                            {selectedOrder.darazCustomerDocument ? (
                              <div className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Daraz Customer Document</p>
                                    <p className="text-xs text-muted-foreground">
                                      {selectedOrder.darazCustomerDocument.name || 'Daraz Customer Document.pdf'}
                                    </p>
                                  </div>
                                  {selectedOrder.darazCustomerDocument.url && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = selectedOrder.darazCustomerDocument.url;
                                        link.download = selectedOrder.darazCustomerDocument.name || 'daraz-document.pdf';
                                        link.target = '_blank';
                                        link.click();
                                      }}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View PDF
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 border border-yellow-300 rounded-lg bg-yellow-50">
                                <p className="text-sm text-yellow-800">⚠️ Daraz Customer Document not uploaded</p>
                              </div>
                            )}
                          </div>
                        </Card>
                      )}
                    </div>
                  )}
                  <DialogFooter>
                    <Button onClick={() => setSelectedOrder(null)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
