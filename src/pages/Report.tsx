
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, MapPin, CalendarIcon, Bot, Info, CheckCircle2 } from "lucide-react";
import { showToast } from "@/components/Toast";
import { locations } from "@/data/mockData";
import AIResponseBox from "@/components/AIResponseBox";
import { mockAIResponses } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Report = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [description, setDescription] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      
      // After showing success state, redirect
      setTimeout(() => {
        showToast({
          type: "success",
          title: "Report Submitted Successfully",
          description: "Your item has been reported to the Lost & Found system."
        });
        navigate("/");
      }, 3000);
    }, 1500);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (e.target.value.length > 50) {
      setShowAISummary(true);
    } else {
      setShowAISummary(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="glass p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">Report Submitted Successfully!</CardTitle>
          <CardDescription className="text-gray-600 mb-6">
            Your item has been reported to the MIT-ADT University Lost & Found system. You will receive updates via email.
          </CardDescription>
          <div className="bg-slate-50 p-4 rounded-lg mb-6 max-w-md mx-auto">
            <p className="text-sm text-gray-600">Report ID: <span className="font-semibold">LF-{Math.floor(Math.random() * 10000)}</span></p>
            <p className="text-sm text-gray-600">Submitted on: <span className="font-semibold">{new Date().toLocaleDateString()}</span></p>
          </div>
          <Button 
            className="bg-mit-red hover:bg-red-700 px-8" 
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="form-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Report Lost or Found Item</span>
            {selectedType === "Lost" && (
              <Badge className="bg-red-100 text-red-800 border-red-200">Lost Item</Badge>
            )}
            {selectedType === "Found" && (
              <Badge className="bg-green-100 text-green-800 border-green-200">Found Item</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Fill out this form to report an item that you have lost or found on campus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={selectedType || "lost"} onValueChange={(value) => setSelectedType(value)}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="Lost" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800">I Lost Something</TabsTrigger>
              <TabsTrigger value="Found" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">I Found Something</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {formStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="title">Item Title</Label>
                    <Input id="title" placeholder="e.g., Blue Backpack" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Provide a detailed description of the item..." 
                      rows={4}
                      value={description}
                      onChange={handleDescriptionChange}
                      required 
                    />
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Info className="h-3 w-3 mr-1" />
                      Include color, brand, distinguishing features, and contents
                    </p>
                  </div>
                  
                  {showAISummary && (
                    <div className="animate-fade-in">
                      <AIResponseBox
                        title="AI Description Summary"
                        confidence={mockAIResponses.descriptionSummary.confidence}
                        reason={mockAIResponses.descriptionSummary.summary}
                      />
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Bot className="h-3 w-3 mr-1 text-mit-red" />
                        <span>AI has summarized your description for better matching</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Location">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>Select Location</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map(location => (
                            <SelectItem key={location} value={location}>{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="date" 
                          type="date" 
                          className="pl-9"
                          defaultValue={new Date().toISOString().split('T')[0]}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full bg-mit-red hover:bg-red-700"
                    onClick={() => setFormStep(2)}
                  >
                    Continue
                  </Button>
                </div>
              )}
              
              {formStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input id="email" type="email" placeholder="your.email@mit.edu" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-slate-50/70">
                      <Upload className="h-8 w-8 text-mit-red/70 mb-2" />
                      <div className="text-sm text-gray-500 text-center">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </div>
                      <Input id="image" type="file" className="hidden" />
                      <div className="mt-2 flex gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => document.getElementById("image")?.click()}
                        >
                          Select File
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-gray-500"
                        >
                          Use Camera
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Info className="h-3 w-3 mr-1" />
                      A clear image increases the chances of finding/claiming
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => setFormStep(1)}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-mit-red hover:bg-red-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Report"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-8 p-5 glass rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Bot className="mr-2 h-5 w-5 text-mit-red" />
          How AI Helps Find Your Items
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Our AI system analyzes descriptions, locations, and images to match lost items with found reports. It also helps verify ownership claims for enhanced security.
        </p>
        <div className="text-xs text-gray-500">
          Note: All personal information is kept confidential and used only for matching purposes.
        </div>
      </div>
    </div>
  );
};

export default Report;

const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};
