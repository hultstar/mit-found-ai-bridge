
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Eye, Check, X, Filter, ArrowUpDown, SearchIcon, Bot, Bell, User, LogOut, ChevronDown, PenSquare, Trash2, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockItems, mockClaims, mockAIResponses } from "@/data/mockData";
import { showToast } from "@/components/Toast";
import AIResponseBox from "@/components/AIResponseBox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Admin = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAIMatch, setShowAIMatch] = useState(false);
  const [showAIClaimDialog, setShowAIClaimDialog] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("items");
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Sort and filter items
  const sortedItems = [...mockItems].sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];
    
    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc" 
        ? fieldA.localeCompare(fieldB) 
        : fieldB.localeCompare(fieldA);
    }
    
    return 0;
  });
  
  // Filter items by status and search query
  const filteredItems = sortedItems.filter(item => {
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    const matchesSearch = searchQuery 
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    return matchesStatus && matchesSearch;
  });
  
  // Filter claims by search query
  const filteredClaims = mockClaims.filter(claim => {
    const claimItem = mockItems.find(item => item.id === claim.itemId);
    const matchesSearch = searchQuery
      ? (claimItem?.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         claim.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
         claim.message.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    return matchesSearch;
  });
  
  const toggleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handleApprove = (claimId: string) => {
    showToast({
      type: "success",
      title: "Claim Approved",
      description: "The claim has been approved and the user has been notified."
    });
  };
  
  const handleReject = (claimId: string) => {
    showToast({
      type: "info",
      title: "Claim Rejected",
      description: "The claim has been rejected and the user has been notified."
    });
  };
  
  const handleLogout = () => {
    showToast({
      type: "success",
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    navigate("/login");
  };
  
  const openClaimDetails = (claimId: string) => {
    setSelectedClaimId(claimId);
    setShowAIClaimDialog(true);
  };
  
  // Get current selected claim
  const selectedClaim = selectedClaimId 
    ? mockClaims.find(claim => claim.id === selectedClaimId) 
    : null;
  
  // Get item for selected claim
  const selectedClaimItem = selectedClaim 
    ? mockItems.find(item => item.id === selectedClaim.itemId) 
    : null;
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-t-mit-red border-r-mit-red border-b-transparent border-l-transparent animate-spin mb-4"></div>
        <div className="text-gray-500">Loading admin dashboard...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage lost and found items and claims</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-mit-red text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Admin</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Card className="flex-1 glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockItems.length}</div>
            <p className="text-sm text-gray-500">Items in the system</p>
          </CardContent>
        </Card>
        
        <Card className="flex-1 glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockClaims.filter(c => c.status === "Pending").length}</div>
            <p className="text-sm text-gray-500">Claims awaiting review</p>
          </CardContent>
        </Card>
        
        <Card className="flex-1 glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AI Match Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">72%</div>
            <p className="text-sm text-gray-500">Successful item matching</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="relative max-w-sm">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              {activeTab === "items" && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Claimed">Claimed</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Dialog open={showAIMatch} onOpenChange={setShowAIMatch}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Bot className="h-4 w-4 mr-2 text-mit-red" />
                    AI Match
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>AI Item Matching</DialogTitle>
                    <DialogDescription>
                      Analyze potential matches between lost and found items
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Comparing Items:</p>
                      
                      <div className="bg-slate-50 p-3 rounded-md space-y-3">
                        <div className="flex gap-3">
                          <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src="https://images.unsplash.com/photo-1592286927505-1def25115df8" 
                              alt="iPhone" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{mockAIResponses.itemMatching.items[0]}</p>
                            <p className="text-xs text-gray-500">Lost - Cafeteria</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src="https://images.unsplash.com/photo-1585060544812-6b45742d762f" 
                              alt="iPhone" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{mockAIResponses.itemMatching.items[1]}</p>
                            <p className="text-xs text-gray-500">Found - Main Building</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <AIResponseBox
                      title="AI Match Analysis"
                      confidence={mockAIResponses.itemMatching.confidence}
                      reason={mockAIResponses.itemMatching.reason}
                    />
                    
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={() => setShowAIMatch(false)}>
                        Close
                      </Button>
                      <Button className="bg-mit-red hover:bg-red-700">
                        Notify Owners
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        <TabsContent value="items" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">ID</TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center hover:text-gray-900"
                          onClick={() => toggleSort("title")}
                        >
                          Title
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center hover:text-gray-900"
                          onClick={() => toggleSort("location")}
                        >
                          Location
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center hover:text-gray-900"
                          onClick={() => toggleSort("date")}
                        >
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
                          <TableCell>
                            <Badge className={item.type === "Lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                              {item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={
                              item.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                              item.status === "Claimed" ? "bg-blue-100 text-blue-800" :
                              "bg-green-100 text-green-800"
                            }>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => navigate(`/item/${item.id}`)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                title="Edit Item"
                              >
                                <PenSquare className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete Item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No items found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-gray-500">
                Showing {filteredItems.length} of {mockItems.length} items
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="claims" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">ID</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Claimant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>AI Confidence</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClaims.length > 0 ? (
                      filteredClaims.map((claim) => {
                        const claimItem = mockItems.find(item => item.id === claim.itemId);
                        return (
                          <TableRow key={claim.id}>
                            <TableCell>{claim.id}</TableCell>
                            <TableCell className="font-medium">{claimItem?.title || "Unknown Item"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>{claim.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(claim.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge className={
                                claim.aiConfidence >= 85 ? "bg-green-100 text-green-800" :
                                claim.aiConfidence >= 70 ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }>
                                {claim.aiConfidence}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                claim.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                claim.status === "Approved" ? "bg-green-100 text-green-800" :
                                "bg-red-100 text-red-800"
                              }>
                                {claim.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="View Claim Details"
                                  onClick={() => openClaimDetails(claim.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {claim.status === "Pending" && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                      title="Approve Claim"
                                      onClick={() => handleApprove(claim.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      title="Reject Claim"
                                      onClick={() => handleReject(claim.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No claims found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-gray-500">
                Showing {filteredClaims.length} of {mockClaims.length} claims
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Claim Details Dialog */}
      <Dialog open={showAIClaimDialog} onOpenChange={setShowAIClaimDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Claim Details</DialogTitle>
            <DialogDescription>
              Review the claim details and AI verification
            </DialogDescription>
          </DialogHeader>
          
          {selectedClaim && selectedClaimItem && (
            <div className="space-y-4 py-2">
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedClaimItem.image} 
                    alt={selectedClaimItem.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedClaimItem.title}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedClaimItem.type} on {new Date(selectedClaimItem.date).toLocaleDateString()} at {selectedClaimItem.location}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Badge className={selectedClaimItem.type === "Lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                      {selectedClaimItem.type}
                    </Badge>
                    <Badge className={
                      selectedClaim.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      selectedClaim.status === "Approved" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }>
                      {selectedClaim.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Claimant Information</div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-sm"><span className="font-medium">Email:</span> {selectedClaim.email}</p>
                  <p className="text-sm"><span className="font-medium">Date:</span> {new Date(selectedClaim.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Claim Message</div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-sm italic">{selectedClaim.message}</p>
                </div>
              </div>
              
              <AIResponseBox
                title="AI Ownership Verification"
                confidence={selectedClaim.aiConfidence}
                reason={selectedClaim.aiReason}
              />
              
              {selectedClaim.status === "Pending" ? (
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => handleReject(selectedClaim.id)}>
                    <X className="h-4 w-4 mr-2" />
                    Reject Claim
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedClaim.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Claim
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => setShowAIClaimDialog(false)}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
