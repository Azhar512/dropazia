import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Package, 
  Settings, 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  Truck, 
  CreditCard, 
  Smartphone,
  CheckCircle2,
  Users,
  BarChart3,
  Zap,
  Lock,
  Store,
  MessageCircle,
  Crown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CATEGORIES } from "@/lib/categories";
import { getCategoryImage } from "@/lib/categoryImages";
import WhatsAppButton from "@/components/WhatsAppButton";
import DarazLogo from "@/components/DarazLogo";
import ShopifyLogo from "@/components/ShopifyLogo";
import DropaziaLogo from "@/components/DropaziaLogo";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [superAdminKeySequence, setSuperAdminKeySequence] = useState<string[]>([]);
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [showSuperAdminAccess, setShowSuperAdminAccess] = useState(false);

  // Handle module click - products are open to everyone
  const handleModuleClick = (module: 'daraz' | 'shopify') => {
    // Navigate directly to products - no authentication required
    navigate(`/${module}-products`);
  };

  // Secret key sequence: 'admin' (case insensitive)
  const secretSequence = ['a', 'd', 'm', 'i', 'n'];
  // Secret key sequence: 'aneeq' (case insensitive) for Super Admin
  const superAdminSecretSequence = ['a', 'n', 'e', 'e', 'q'];

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      // Handle Admin sequence
      setKeySequence(prev => {
        const newSequence = [...prev, key].slice(-secretSequence.length);
        
        // Check if the sequence matches 'admin'
        if (newSequence.join('') === secretSequence.join('')) {
          setShowAdminAccess(true);
          return [];
        }
        
        return newSequence;
      });

      // Handle Super Admin sequence
      setSuperAdminKeySequence(prev => {
        const newSequence = [...prev, key].slice(-superAdminSecretSequence.length);
        
        // Check if the sequence matches 'aneeq'
        if (newSequence.join('') === superAdminSecretSequence.join('')) {
          setShowSuperAdminAccess(true);
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-blue-50">
      <WhatsAppButton phoneNumber="+923256045679" message="Hello! I'm interested in Dropazia." />
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Dropazia
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-orange-500 transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-orange-500 transition-colors">Reviews</a>
              {!user && (
                <Button onClick={() => handleModuleClick('daraz')} className="bg-orange-500 hover:bg-orange-600">
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-6 bg-orange-100 text-orange-600 border-orange-200">
              Join the E-commerce Revolution
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Buy or Resell the best products
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                in Pakistan
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 animate-slide-up">
              Unlock your earning potential by joining the Dropazia community, where you can choose from multiple marketplace integrations and start your online business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
                onClick={() => handleModuleClick('daraz')}
              >
                <DarazLogo className="h-8 w-8" />
                <span>Daraz Module</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
                onClick={() => handleModuleClick('shopify')}
              >
                <ShopifyLogo className="h-8 w-8" />
                <span>Shopify Module</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Hero Illustration Placeholder - 3D Shopping Elements */}
          <div className="relative max-w-4xl mx-auto mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Shopping Cart Illustration */}
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag className="w-24 h-24 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Multi-Channel Shopping</h3>
                <p className="text-gray-600">Access Daraz and Shopify products from one platform</p>
              </div>

              {/* Delivery Illustration */}
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
                  <Truck className="w-24 h-24 text-purple-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Swift and reliable logistics for your business</p>
              </div>

              {/* Payment Illustration */}
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-4">
                  <CreditCard className="w-24 h-24 text-orange-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
                <p className="text-gray-600">JazzCash and EasyPaisa integration for Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">150K+</div>
              <div className="text-gray-600">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">2</div>
              <div className="text-gray-600">Marketplace Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">100%</div>
              <div className="text-gray-600">Secure Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionize Section */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Revolutionize Your E-Commerce Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sync products from marketplaces that people love from Daraz and Shopify
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-600">Multi-Channel</Badge>
              <h3 className="text-3xl font-bold mb-4">
                Multi-Channel Product Management
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Dropazia, Pakistan's top e-commerce platform, offers seamless integration across diverse marketplaces, empowering you to meet varied consumer needs in Pakistan.
              </p>
              <Button 
                className="bg-orange-500 hover:bg-orange-600"
              onClick={() => handleModuleClick('daraz')}
            >
                Explore Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-12 shadow-xl">
              <Globe className="w-32 h-32 text-blue-500 mx-auto" />
            </div>
                </div>
                
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 shadow-xl order-2 md:order-1">
              <BarChart3 className="w-32 h-32 text-purple-500 mx-auto" />
            </div>
            <div className="order-1 md:order-2">
              <Badge className="mb-4 bg-orange-100 text-orange-600">Centralized Dashboard</Badge>
              <h3 className="text-3xl font-bold mb-4">
                Effortless Product Export & Management
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Dropazia's user-friendly interface lets you manage your entire e-commerce operation. Browse products, set prices, process orders, and track shipments from one central dashboard.
              </p>
                <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => handleModuleClick('shopify')}
                >
                Manage Products
                <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
                </div>
                
          <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
              <Badge className="mb-4 bg-orange-100 text-orange-600">Prepaid Orders</Badge>
              <h3 className="text-3xl font-bold mb-4">
                Multi-Store Tools & Logistics
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Dropazia partnership unlocks opportunities with prepaid orders, eliminating payment hassles. Manage multiple stores to expand your reach. Our logistics network ensures swift delivery, satisfying customers while you focus on growth.
              </p>
                <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => handleModuleClick('daraz')}
                >
                Explore Products
                <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-12 shadow-xl">
              <Truck className="w-32 h-32 text-orange-500 mx-auto" />
            </div>
          </div>
                </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to run your e-commerce business
                    </p>
                  </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {allFeatures.map((feature, idx) => (
              <Card key={idx} className="p-8 hover:shadow-2xl transition-all hover:-translate-y-2 border-2 hover:border-orange-200">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
              </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our Users Say
          </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied sellers and buyers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-8 bg-white shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex text-orange-500">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2 key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your e-commerce journey in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join in on Something Big
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold mb-2">150K+</div>
              <div className="text-orange-100">Products Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2+</div>
              <div className="text-orange-100">Marketplace Integrations</div>
            </div>
          </div>
          <p className="text-xl mb-8 text-orange-50">
            Generate Income with our Multi-Channel E-Commerce Platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-orange-500 hover:bg-orange-50 px-8 py-6 text-lg shadow-xl"
              onClick={() => handleModuleClick('daraz')}
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              onClick={() => handleModuleClick('shopify')}
            >
              View Products
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section with Images - Markaz Style */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              All Categories
            </h2>
          </div>
          
          {/* Horizontal Scrollable Categories */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('categories-scroll');
                if (container) {
                  container.scrollBy({ left: -300, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
            </button>

            {/* Categories Scroll Container */}
            <div
              id="categories-scroll"
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-12"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {CATEGORIES.map((category) => (
                <div
                  key={category}
                  className="flex flex-col items-center cursor-pointer group min-w-[120px]"
                  onClick={() => {
                    navigate(`/daraz-products?category=${encodeURIComponent(category)}`);
                  }}
                >
                  {/* Circular Image Container */}
                  <div className="w-24 h-24 rounded-full bg-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden mb-3 flex items-center justify-center">
                    <img 
                      src={getCategoryImage(category)}
                      alt={category}
                      className="w-full h-full object-cover rounded-full"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Category Label */}
                  <h3 className="text-sm font-medium text-center text-gray-700 group-hover:text-orange-500 transition-colors capitalize leading-tight px-2">
                    {category}
                  </h3>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('categories-scroll');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Hide scrollbar for webkit browsers */}
        <style>{`
          #categories-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Dropazia
                </h3>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Bringing the e-commerce revolution to Pakistan. A marketplace where you find the best products your customers need.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://wa.me/923256045679" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <span className="text-white font-bold text-sm">f</span>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-white font-bold text-sm">IG</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-orange-400">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#how-it-works" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Features
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Reviews
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleModuleClick('daraz'); }} className="hover:text-orange-400 transition-colors flex items-center gap-2 cursor-pointer">
                    <ArrowRight className="w-4 h-4" />
                    Browse Products
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-orange-400">Modules</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleModuleClick('daraz'); }} 
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Daraz Integration
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleModuleClick('shopify'); }} 
                    className="hover:text-orange-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Shopify Integration
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Product Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Order Tracking
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-orange-400">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="https://wa.me/923256045679" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    WhatsApp Support
                  </a>
                </li>
                <li>
                  <a href="mailto:support@dropazia.com" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left">
                Copyright © {new Date().getFullYear()} Dropazia. Pakistan. All rights reserved.
              </p>
              <div className="flex gap-6 text-gray-400 text-sm">
                <span>Made with ❤️ in Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Hidden Admin Access - Only shows when 'admin' sequence is entered */}
      {showAdminAccess && (
        <Card 
          className="fixed bottom-8 right-8 p-6 card-gradient hover-lift cursor-pointer border-2 border-orange-500 animate-bounce-in card-glow shadow-2xl z-50 max-w-sm"
          onClick={() => navigate('/admin-login?type=admin')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-orange-500">Admin Dashboard</h3>
                <Badge variant="outline" className="border-orange-500 text-orange-500 text-xs">Admin</Badge>
              </div>
              <p className="text-sm text-gray-600">Manage user approvals and platform settings</p>
            </div>
            <ArrowRight className="w-5 h-5 text-orange-500" />
          </div>
        </Card>
      )}

      {/* Hidden Super Admin Access - Only shows when 'aneeq' sequence is entered */}
      {showSuperAdminAccess && (
        <Card 
          className="fixed bottom-8 left-8 p-6 card-gradient hover-lift cursor-pointer border-2 border-yellow-500 animate-bounce-in card-glow shadow-2xl z-50 max-w-sm bg-gradient-to-br from-yellow-50 to-orange-50"
          onClick={() => navigate('/admin-login?type=super-admin')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-yellow-600">Super Admin Dashboard</h3>
                <Badge variant="outline" className="border-yellow-500 text-yellow-600 text-xs">Super Admin</Badge>
              </div>
              <p className="text-sm text-gray-600">Manage admins and oversee entire platform</p>
            </div>
            <ArrowRight className="w-5 h-5 text-yellow-600" />
          </div>
        </Card>
      )}
    </div>
  );
};

const allFeatures = [
  {
    icon: Store,
    title: "Multi-Store Management",
    description: "Manage multiple stores from one centralized dashboard. Expand your reach effortlessly."
  },
  {
    icon: TrendingUp,
    title: "Real-Time Analytics",
    description: "Track your sales, profits, and performance with detailed analytics and reports."
  },
  {
    icon: Package,
    title: "Order Management",
    description: "Track and fulfill orders from a unified dashboard. Never miss a sale."
  },
  {
    icon: Zap,
    title: "Quick Sync",
    description: "Seamlessly sync products across Daraz and Shopify platforms in real-time."
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "JazzCash and EasyPaisa integration for secure transactions in Pakistan."
  },
  {
    icon: Truck,
    title: "Logistics Network",
    description: "Swift delivery network ensures customer satisfaction while you focus on growth."
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a community of sellers and get support from our dedicated team."
  },
  {
    icon: Globe,
    title: "Marketplace Integration",
    description: "Connect with Daraz and Shopify to access millions of products."
  },
  {
    icon: BarChart3,
    title: "Profit Tracking",
    description: "Monitor your profits, margins, and financial performance easily."
  }
];

const testimonials = [
  {
    name: "Ayesha Khan",
    location: "Pakistan",
    quote: "Dropazia has transformed my e-commerce experience! The integration with Daraz and Shopify was seamless, and I love the variety of products available. Their support team is always ready to help."
  },
  {
    name: "Rajesh Sharma",
    location: "India",
    quote: "Starting my e-commerce business with Dropazia was a game-changer. The platform is user-friendly, and I appreciate the multi-channel sync, which helps me cater to my customers better. Highly recommended!"
  },
  {
    name: "Maria Santos",
    location: "Philippines",
    quote: "I was hesitant about multi-channel selling initially, but Dropazia made it so simple. The product selection is fantastic, and I can easily manage everything through their platform. Plus, the profit margins are generous!"
  }
];

const howItWorks = [
  {
    title: "Sign Up & Connect",
    description: "Create your account and connect your Daraz or Shopify marketplace. Get approved by our admin team."
  },
  {
    title: "Browse & Manage Products",
    description: "Browse thousands of products, sync inventory, set prices, and manage your catalog from one dashboard."
  },
  {
    title: "Sell & Earn",
    description: "Process orders, track shipments, and collect payments. Focus on growing your business while we handle the platform."
  }
];

export default Landing;
