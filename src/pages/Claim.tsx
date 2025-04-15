
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bot, Shield, Check, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { mockItems, mockClaims } from "@/data/mockData";
import { showToast } from "@/components/Toast";
import AIResponseBox from "@/components/AIResponseBox";
import { Separator } from "@/components/ui/separator";

const Claim = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [message, setMessage] = useState("");
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  
  // Find the item and related mock claim
  const item = mockItems.find(item => item.id === id);
  const mockClaim = mockClaims.find(claim => claim.itemId === id);
  
  useEffect(() => {
    if (!item) {
      showToast({
        type: "error",
        title: "Item Not Found",
        description: "The requested item could not be found."
      });
      navigate("/");
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [item, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form verification and AI analysis
    setTimeout(() => {
      setShowAIResponse(true);
      setSubmitting(false);
      
      // After showing AI response, wait and show success
      setTimeout(() => {
        setClaimSubmitted(true);
      }, 3000);
    }, 1500);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-t-mit-red border-r-mit-red border-b-transparent border-l-transparent animate-spin mb-4"></div>
        <div className="text-gray-500">Loading claim form...</div>
      </div>
    );
  }
  
  if (!item) {
    return null;
  }
  
  if (claimSubmitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="glass p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">Claim Submitted Successfully!</CardTitle>
          <CardDescription className="text-gray-600 mb-6">
            Your claim for "{item.title}" has been submitted and will be reviewed by an administrator.
          </CardDescription>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6 max-w-md mx-auto text-left">
            <div className="flex items-start">
              <Bot className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">AI Verification Result</h3>
                <p className="text-sm text-blue-700">Confidence: {mockClaim?.aiConfidence || 85}%</p>
                <p className="text-sm text-blue-600 mt-1">{mockClaim?.aiReason || "Details provided seem to match the item description. The timeline and location information are consistent with the reported item."}</p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-6">
            <p>Claim ID: <span className="font-medium">CLM-{Math.floor(Math.random() * 10000)}</span></p>
            <p>You will receive an email notification when your claim is reviewed.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline"
              onClick={() => navigate(`/item/${item.id}`)}
            >
              Back to Item
            </Button>
            <Button 
              className="bg-mit-red hover:bg-red-700" 
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Item
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="form-glass">
            <CardHeader>
              <CardTitle>Claim Item: {item.title}</CardTitle>
              <CardDescription>
                Please provide information to verify your ownership of this item.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@mit.edu" 
                      className="bg-white/60"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Ownership Verification</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Please describe specific details about the item that would prove it belongs to you..." 
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-white/60 resize-none"
                      required 
                    />
                    <div className="flex items-start gap-2 mt-2">
                      <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="text-sm text-gray-500">
                        <p>Include details that only the owner would know, such as:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Specific markings or damage</li>
                          <li>Contents inside (if applicable)</li>
                          <li>Serial number or identifying features</li>
                          <li>When and where you last had the item</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {showAIResponse && (
                    <div className="animate-fade-in mt-4">
                      <AIResponseBox
                        title="AI Ownership Verification"
                        confidence={mockClaim?.aiConfidence || 85}
                        reason={mockClaim?.aiReason || "Details provided seem to match the item description. The timeline and location information are consistent with the reported item."}
                      />
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-mit-red hover:bg-red-700" 
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      <span>Submit Claim</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:row-span-1">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Item Summary</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="mb-2">
                <div className="w-full h-32 overflow-hidden rounded-md mb-3">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold truncate">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.type} on {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              
              <Separator className="my-3" />
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Verified Process</p>
                    <p className="text-gray-500">All claims are verified by our staff and AI system</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">False Claims Notice</p>
                    <p className="text-gray-500">Submitting false claims is against university policy</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 text-xs text-gray-500 rounded-b-lg">
              <div className="flex items-center justify-center w-full">
                <Bot className="h-3 w-3 mr-1" />
                <span>AI-powered verification helps ensure accuracy</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Claim;
