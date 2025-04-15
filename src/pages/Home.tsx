
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Check, Book, Bot, MapPin } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import { locations, mockItems } from "@/data/mockData";
import { Link } from "react-router-dom";
import AIResponseBox from "@/components/AIResponseBox";
import { mockAIResponses } from "@/data/mockData";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter ? item.location === locationFilter : true;
    const matchesType = typeFilter ? item.type === typeFilter : true;
    
    return matchesSearch && matchesLocation && matchesType;
  });
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API call
  };
  
  const lostCount = mockItems.filter(item => item.type === "Lost").length;
  const foundCount = mockItems.filter(item => item.type === "Found").length;
  
  return (
    <div>
      {/* Hero Section */}
      <div className="relative -mt-8 mb-16 pb-16 pt-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/70 -z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f')] bg-cover bg-center opacity-20 -z-20"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            MIT-ADT University Lost & Found
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Find what you've lost or report what you've found on campus. Our AI-powered system helps connect people with their belongings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-mit-red hover:bg-red-700">
              <Link to="/report">Report an Item</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-mit-red text-mit-red hover:bg-mit-red/10">
              <a href="#items-section">Browse Items</a>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 flex flex-col items-center">
              <div className="bg-red-100 p-2 rounded-full mb-2">
                <MapPin className="h-5 w-5 text-mit-red" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{mockItems.length}</span>
              <span className="text-sm text-gray-600">Total Items</span>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 flex flex-col items-center">
              <div className="bg-red-100 p-2 rounded-full mb-2">
                <Book className="h-5 w-5 text-mit-red" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{lostCount}</span>
              <span className="text-sm text-gray-600">Lost Items</span>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 flex flex-col items-center">
              <div className="bg-red-100 p-2 rounded-full mb-2">
                <Check className="h-5 w-5 text-mit-red" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{foundCount}</span>
              <span className="text-sm text-gray-600">Found Items</span>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 flex flex-col items-center">
              <div className="bg-red-100 p-2 rounded-full mb-2">
                <Bot className="h-5 w-5 text-mit-red" />
              </div>
              <span className="text-2xl font-bold text-gray-900">85%</span>
              <span className="text-sm text-gray-600">AI Success Rate</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Items Section */}
      <div id="items-section" className="max-w-5xl mx-auto mb-12 scroll-mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Browse Lost & Found Items</h2>
          
          <form onSubmit={handleSearch} className="w-full md:w-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for items..."
                  className="pl-9 md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Found">Found</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No items found matching your search criteria.</p>
                </div>
              )}
            </div>
            
            {filteredItems.length > 0 && filteredItems.length < mockItems.length && (
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  Showing {filteredItems.length} of {mockItems.length} items
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setLocationFilter("");
                  setTypeFilter("");
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* AI Feature Section */}
      <div className="max-w-5xl mx-auto mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI-Powered Lost & Found</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our system uses advanced AI to match lost items with found reports, verify claims, and increase the chances of recovering your belongings.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 glass rounded-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Bot className="mr-2 h-5 w-5 text-mit-red" />
              Item Matching
            </h3>
            <p className="text-gray-600 mb-4">
              Our AI can detect potential matches between lost and found items based on descriptions, locations, and timing.
            </p>
            <AIResponseBox
              title="AI Item Matching Example"
              confidence={mockAIResponses.itemMatching.confidence}
              reason={mockAIResponses.itemMatching.reason}
            />
          </div>
          
          <div className="p-6 glass rounded-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Bot className="mr-2 h-5 w-5 text-mit-red" />
              Claim Verification
            </h3>
            <p className="text-gray-600 mb-4">
              When someone claims an item, our AI analyzes the claim against the item description to verify ownership.
            </p>
            <AIResponseBox
              title="AI Claim Verification Example"
              confidence={mockAIResponses.claimVerification.confidence}
              reason={mockAIResponses.claimVerification.reason}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
