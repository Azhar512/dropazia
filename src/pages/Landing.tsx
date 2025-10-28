import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, Settings, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [showAdminAccess, setShowAdminAccess] = useState(false);

  // Handle module click - require authentication
  const handleModuleClick = (module: 'daraz' | 'shopify') => {
    if (!user) {
      // Redirect to login page for that module
      navigate(module === 'daraz' ? '/daraz' : '/shopify');
    } else {
      // User is logged in, navigate to products
      navigate(`/${module}-products`);
    }
  };

  // Secret key sequence: 'admin' (case insensitive)
  const secretSequence = ['a', 'd', 'm', 'i', 'n'];

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setKeySequence(prev => {
        const newSequence = [...prev, key].slice(-secretSequence.length);
        
        // Check if the sequence matches
        if (newSequence.join('') === secretSequence.join('')) {
          setShowAdminAccess(true);
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4" style={{background: 'var(--gradient-hero)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 mb-4 animate-bounce-in">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg hover-scale" style={{background: 'var(--gradient-daraz)'}}>
                  <span className="text-white font-bold text-2xl">D</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white animate-slide-up">
                  Dropazia
                </h1>
              </div>
              <p className="text-xl text-white/90 mb-2 animate-slide-up">Your E-commerce Partner</p>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              Multi-Module E-Commerce Platform
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-up">
              Choose your marketplace integration and start selling across multiple channels
            </p>
          </div>

          {/* Module Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            {/* Daraz Module */}
            <Card 
              className="group p-8 card-gradient hover-lift cursor-pointer border-2 hover:border-primary animate-fade-in"
              onClick={() => handleModuleClick('daraz')}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg" style={{background: 'var(--gradient-daraz)'}}>
                  {/* Daraz Logo SVG */}
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="8" fill="white"/>
                    <path d="M8 12h24v2H8v-2zm0 4h24v2H8v-2zm0 4h16v2H8v-2zm0 4h20v2H8v-2z" fill="#FF6B35"/>
                    <circle cx="30" cy="18" r="3" fill="#FF6B35"/>
                    <path d="M28 20l2-2 2 2" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gradient-daraz mb-3">Daraz Module</h3>
                  <p className="text-muted-foreground mb-6">
                    Sync products, manage inventory, and fulfill orders directly from Daraz marketplace
                  </p>
                </div>

                <Button 
                  size="lg" 
                  className="w-full btn-gradient hover-lift"
                >
                  View Daraz Products
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>

            {/* Shopify Module */}
            <Card 
              className="group p-8 card-gradient hover-lift cursor-pointer border-2 hover:border-secondary animate-fade-in"
              onClick={() => handleModuleClick('shopify')}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg" style={{background: 'var(--gradient-shopify)'}}>
                  {/* Shopify Logo SVG */}
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="8" fill="white"/>
                    <path d="M12 8h16v24H12V8zm2 2v20h12V10H14zm2 2h8v2h-8v-2zm0 4h8v2h-8v-2zm0 4h6v2h-6v-2z" fill="#96BF48"/>
                    <circle cx="28" cy="12" r="2" fill="#96BF48"/>
                    <path d="M26 14l2-2 2 2" stroke="#96BF48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gradient-shopify mb-3">Shopify Module</h3>
                  <p className="text-muted-foreground mb-6">
                    Connect your Shopify store for seamless two-way product and order synchronization
                  </p>
                </div>

                <Button 
                  size="lg" 
                  className="w-full btn-accent-gradient hover-lift"
                >
                  View Shopify Products
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Hidden Admin Access - Only shows when secret sequence is entered */}
          {showAdminAccess && (
            <Card 
              className="group p-8 card-gradient hover-lift cursor-pointer border-2 hover:border-accent max-w-2xl mx-auto mt-8 animate-bounce-in card-glow"
              onClick={() => navigate('/admin-login')}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 shadow-lg animate-pulse-glow" style={{background: 'var(--gradient-shopify)'}}>
                  <Settings className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gradient-shopify">Admin Dashboard</h3>
                    <Badge variant="outline" className="border-accent text-accent animate-pulse-glow">Admin Only</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Manage user approvals, oversee products, configure platform settings
                  </p>
                  <div className="mt-3 p-3 rounded-lg animate-pulse-glow" style={{background: 'var(--gradient-accent)', opacity: 0.1}}>
                    <p className="text-sm font-semibold" style={{color: 'hsl(var(--secondary))'}}>
                      <strong>Admin Access Unlocked!</strong> Click to access admin dashboard
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-2 group-hover:text-accent transition-all shrink-0" />
              </div>
            </Card>
          )}

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Powerful Features for Modern E-Commerce
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-card transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: ShoppingBag,
    title: "Multi-Channel Sync",
    description: "Seamlessly sync products across Daraz and Shopify platforms"
  },
  {
    icon: Package,
    title: "Order Management",
    description: "Track and fulfill orders from a unified dashboard"
  },
  {
    icon: ShoppingBag,
    title: "Inventory Control",
    description: "Real-time inventory updates across all channels"
  }
];

export default Landing;
