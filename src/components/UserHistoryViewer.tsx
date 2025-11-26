import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  ShoppingBag, 
  Heart, 
  RotateCcw, 
  TrendingUp, 
  User,
  Calendar,
  Package,
  DollarSign,
  Loader2
} from 'lucide-react';
import ApiService from '@/services/api';
import { toast } from 'sonner';

interface UserWithStats {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  module?: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
}

interface UserHistory {
  user: any;
  orders: any[];
  totalOrders: number;
  totalSpent: number;
  ordersByStatus: Record<string, number>;
  wishlist: any[];
  returns: any[];
}

const UserHistoryViewer = () => {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserHistory | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllUsersWithStats();
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadUserHistory = async (userId: string) => {
    try {
      setLoadingHistory(true);
      const response = await ApiService.getUserPurchaseHistory(userId);
      if (response.success) {
        setSelectedUser(response.data);
        setIsHistoryDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to load user history:', error);
      toast.error('Failed to load user purchase history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Purchase History</h2>
          <p className="text-muted-foreground">View detailed purchase history for all users</p>
        </div>
        <Button onClick={loadUsers} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Users Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                        {user.phone && (
                          <span className="text-xs text-muted-foreground">{user.phone}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.module ? (
                        <Badge variant={user.module === 'daraz' ? 'default' : 'secondary'}>
                          {user.module}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.isActive ? 'default' : 'secondary'}
                        className={user.isActive ? 'bg-green-500' : ''}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {user.totalOrders}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatCurrency(user.totalSpent)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadUserHistory(user.id)}
                        disabled={loadingHistory}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View History
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* User History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {selectedUser?.user?.name}'s Purchase History
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{selectedUser.totalOrders}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(selectedUser.totalSpent)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Heart className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wishlist Items</p>
                      <p className="text-2xl font-bold">{selectedUser.wishlist?.length || 0}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <RotateCcw className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Returns</p>
                      <p className="text-2xl font-bold">{selectedUser.returns?.length || 0}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Separator />

              {/* Orders List */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order History
                </h3>
                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUser.orders.map((order) => (
                      <Card key={order.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-lg">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-green-600">
                              {formatCurrency(order.total_amount)}
                            </p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant={getStatusBadgeVariant(order.status)}>
                                {order.status}
                              </Badge>
                              <Badge variant="outline">
                                {order.payment_status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Payment: {order.payment_method}</p>
                          <p>Module: <Badge variant={order.module === 'daraz' ? 'default' : 'secondary'} className="ml-1">{order.module}</Badge></p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No orders found for this user
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserHistoryViewer;

