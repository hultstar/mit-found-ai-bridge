
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Lock, ArrowRight, Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        if (email === "admin@mit.edu") {
          navigate("/admin");
        } else {
          navigate("/student-dashboard");
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-red-500 mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-blue-500 mix-blend-multiply filter blur-xl"></div>
      </div>
      
      <div className="w-full max-w-md px-4 z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <MapPin className="h-8 w-8 text-mit-red" />
            <span className="text-2xl font-bold text-gray-800 ml-2">MIT Lost & Found</span>
          </Link>
        </div>
        
        <Card className="border-t-4 border-t-mit-red glass-form">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Sign in to access the Lost & Found system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={activeTab === "admin" ? "admin@mit.edu" : "student@mit.edu"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/70"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/70"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-mit-red hover:underline">
                    Forgot password?
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-mit-red hover:bg-red-700" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                )}
              </Button>
            </form>
            
            {activeTab === "student" && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">Don't have an account?</p>
                <Button 
                  variant="outline" 
                  className="mt-2 w-full border-mit-red text-mit-red hover:bg-mit-red/10"
                  onClick={() => navigate("/signup")}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Student Account
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <div className="text-sm text-gray-500">
              <p className="flex items-center justify-center">
                <Lock className="h-4 w-4 mr-1 text-mit-red" />
                {activeTab === "admin" ? (
                  "Demo credentials: admin@mit.edu / any password"
                ) : (
                  "Demo student login: Use any registered enrollment number"
                )}
              </p>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-mit-red">
            Return to Lost & Found Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
