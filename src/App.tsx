import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import DarazAuth from "./pages/DarazAuth";
import ShopifyAuth from "./pages/ShopifyAuth";
import UserDashboard from "./pages/UserDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import DarazProducts from "./pages/DarazProducts";
import ShopifyProducts from "./pages/ShopifyProducts";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/daraz" element={<DarazAuth />} />
              <Route path="/shopify" element={<ShopifyAuth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/daraz-products" element={<DarazProducts />} />
              <Route path="/shopify-products" element={<ShopifyProducts />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
