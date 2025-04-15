
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Lock, ArrowRight, Eye, EyeOff, UserPlus, User, Mail, Hash } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/components/Toast";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, checkEnrollment } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false);
  const [enrollmentValid, setEnrollmentValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleEnrollmentCheck = async () => {
    if (!enrollmentNumber) return;
    
    setIsCheckingEnrollment(true);
    try {
      const isValid = await checkEnrollment(enrollmentNumber);
      setEnrollmentValid(isValid);
      
      if (!isValid) {
        showToast({
          type: "error",
          title: "Invalid Enrollment",
          description: "This enrollment number is not registered or already in use."
        });
      } else {
        showToast({
          type: "success",
          title: "Enrollment Verified",
          description: "Your enrollment number has been verified."
        });
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
      setEnrollmentValid(false);
    } finally {
      setIsCheckingEnrollment(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (password !== confirmPassword) {
      showToast({
        type: "error",
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again."
      });
      return;
    }
    
    if (password.length < 6) {
      showToast({
        type: "error",
        title: "Password Too Short",
        description: "Password must be at least 6 characters long."
      });
      return;
    }
    
    // Check enrollment again to be sure
    if (!enrollmentValid) {
      const isValid = await checkEnrollment(enrollmentNumber);
      if (!isValid) {
        showToast({
          type: "error",
          title: "Invalid Enrollment",
          description: "This enrollment number is not registered or already in use."
        });
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const success = await signup(name, email, enrollmentNumber, password);
      if (success) {
        navigate("/student-dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      showToast({
        type: "error",
        title: "Signup Failed",
        description: "An error occurred during signup. Please try again."
      });
    } finally {
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
            <CardTitle>Student Registration</CardTitle>
            <CardDescription>
              Create an account to use the Lost & Found system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 bg-white/70"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@mit.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-white/70"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="enrollmentNumber"
                      type="text"
                      placeholder="MIT2022001"
                      value={enrollmentNumber}
                      onChange={(e) => {
                        setEnrollmentNumber(e.target.value);
                        setEnrollmentValid(null);
                      }}
                      className={`pl-9 bg-white/70 ${
                        enrollmentValid === true ? "border-green-500" : 
                        enrollmentValid === false ? "border-red-500" : ""
                      }`}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleEnrollmentCheck}
                    disabled={isCheckingEnrollment || !enrollmentNumber}
                  >
                    {isCheckingEnrollment ? 
                      <div className="h-4 w-4 border-2 border-t-transparent border-mit-red rounded-full animate-spin"></div> 
                      : "Verify"
                    }
                  </Button>
                </div>
                {enrollmentValid === true && (
                  <p className="text-xs text-green-600">✓ Enrollment verified</p>
                )}
                {enrollmentValid === false && (
                  <p className="text-xs text-red-600">❌ Invalid enrollment number</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 bg-white/70"
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 bg-white/70"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-mit-red hover:bg-red-700" 
                disabled={loading || isCheckingEnrollment || enrollmentValid === false}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span>Create Account</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-mit-red hover:underline font-medium">
                Sign in
              </Link>
            </p>
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

export default Signup;
