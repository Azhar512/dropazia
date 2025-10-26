import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

const ShopifyAuth = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 shadow-elevated">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopify Module</h1>
          <p className="text-muted-foreground">Sign in or create your account</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm module="shopify" onSuccess={handleAuthSuccess} />
          </TabsContent>

          <TabsContent value="register">
            <Alert className="mb-6 border-secondary/20 bg-secondary/5">
              <Info className="h-4 w-4 text-secondary" />
              <AlertDescription className="text-sm">
                After registration, your account requires admin approval before you can login
              </AlertDescription>
            </Alert>
            <RegisterForm module="shopify" onSuccess={handleAuthSuccess} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ShopifyAuth;
