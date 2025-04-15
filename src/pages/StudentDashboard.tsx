
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Package, Bell, Search } from "lucide-react";
import { mockItems } from "@/data/mockData";
import ItemCard from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/Toast";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  // Filter items by search query
  const filteredItems = mockItems.filter(item => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.description.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // User's reported items (mock data)
  const userReportedItems = mockItems
    .slice(0, 2)
    .map(item => ({ ...item, reportedByUser: true }));
  
  const handleNotificationSettings = () => {
    showToast({
      type: "success",
      title: "Notification Settings",
      description: "Your notification settings have been updated"
    });
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-gray-500">Manage your lost and found items</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-mit-red text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              2
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate("/profile")}
          >
            <User className="h-4 w-4" />
            <span>{user.name}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <Card className="glass">
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
          <CardDescription>Your student information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-mit-red flex items-center justify-center text-white text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Enrollment Number</p>
                  <p className="font-medium">{user.enrollmentNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <div className="flex items-center">
                    <span className={`inline-block h-2 w-2 rounded-full mr-2 ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <span>{user.isVerified ? 'Verified' : 'Pending Verification'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="my-items">My Items</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="flex-1 glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userReportedItems.length}</div>
                <p className="text-sm text-gray-500">Items you've reported</p>
              </CardContent>
            </Card>
            
            <Card className="flex-1 glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1</div>
                <p className="text-sm text-gray-500">Claims awaiting response</p>
              </CardContent>
            </Card>
            
            <Card className="flex-1 glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Found Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1</div>
                <p className="text-sm text-gray-500">Items returned to you</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent lost and found activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-50">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">You reported an item as lost</p>
                    <p className="text-sm text-gray-500">Your MacBook Pro was reported as lost at the Main Library</p>
                    <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-50">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Possible match found!</p>
                    <p className="text-sm text-gray-500">A MacBook Pro was found in the Student Center that might be yours</p>
                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Browse Recent Items</h2>
            <Button variant="outline" onClick={() => navigate("/")}>
              View All Items
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockItems.slice(0, 3).map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my-items" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Reported Items</h2>
            <Button variant="default" className="bg-mit-red hover:bg-red-700" onClick={() => navigate("/report")}>
              Report New Item
            </Button>
          </div>
          
          <div className="relative max-w-sm mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search my items..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {userReportedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userReportedItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  actions={
                    <div className="flex justify-between mt-3">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/item/${item.id}`)}>
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Mark as Found
                      </Button>
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No items reported</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  You haven't reported any lost or found items yet. 
                  If you've lost something, please report it.
                </p>
                <Button onClick={() => navigate("/report")}>
                  Report an Item
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Get notified about item matches via email</p>
                </div>
                <Button onClick={handleNotificationSettings}>Enable</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Browser Notifications</p>
                  <p className="text-sm text-gray-500">Get notified about item matches via browser</p>
                </div>
                <Button variant="outline" onClick={handleNotificationSettings}>Disable</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Digest</p>
                  <p className="text-sm text-gray-500">Receive a daily summary of activities</p>
                </div>
                <Button onClick={handleNotificationSettings}>Enable</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Change Password
              </Button>
              
              <Button className="w-full" variant="outline">
                Update Profile Information
              </Button>
              
              <Button className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" variant="outline">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
