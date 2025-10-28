import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  ShoppingCart, 
  BarChart3, 
  DollarSign, 
  Heart, 
  BookOpen,
  Menu,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserSidebarProps {
  module: 'daraz' | 'shopify';
}

const UserSidebar = ({ module }: UserSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'orders',
      label: 'My Orders',
      icon: ShoppingCart,
      description: 'View and track your orders',
      action: () => navigate(`/${module}-orders`)
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'View your sales analytics',
      action: () => navigate(`/${module}-analytics`)
    },
    {
      id: 'profits',
      label: 'Profits',
      icon: DollarSign,
      description: 'Track your profits and earnings',
      action: () => navigate(`/${module}-profits`)
    },
    {
      id: 'wishlists',
      label: 'Wishlists',
      icon: Heart,
      description: 'Your saved products',
      action: () => navigate(`/${module}-wishlists`)
    },
    {
      id: 'returns',
      label: 'Returns',
      icon: RotateCcw,
      description: 'Manage product returns',
      action: () => navigate(`/${module}-returns`)
    },
    {
      id: 'university',
      label: 'University',
      icon: BookOpen,
      description: 'Learning resources and tutorials',
      action: () => {
        // Placeholder for university links
        setIsOpen(false);
      }
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
            {module === 'daraz' ? 'Daraz' : 'Shopify'} Hub
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start h-auto py-4 px-4 hover:bg-primary/5"
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserSidebar;

