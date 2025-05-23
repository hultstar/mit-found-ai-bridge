import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Item, mockItems, mockClaims } from "@/data/mockData";
import { MapPin, Calendar, Mail, ArrowLeft, Flag, AlertTriangle, Share2, Navigation, Globe } from "lucide-react";
import { showToast } from "@/components/Toast";
import AIResponseBox from "@/components/AIResponseBox";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRelatedAI, setShowRelatedAI] = useState(false);
  const [showMapPreview, setShowMapPreview] = useState(true); // Set to true by default to show map
  const [mapView, setMapView] = useState<"standard" | "satellite" | "streets">("streets");
  
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const foundItem = mockItems.find(item => item.id === id);
      setItem(foundItem || null);
      setLoading(false);
      
      if (!foundItem) {
        showToast({
          type: "error",
          title: "Item Not Found",
          description: "The requested item could not be found."
        });
        navigate("/");
      }
      
      // Show AI section after a brief delay
      if (foundItem) {
        setTimeout(() => {
          setShowRelatedAI(true);
        }, 2000);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id, navigate]);
  
  // Find if there's a claim for this item
  const relatedClaim = mockClaims.find(claim => claim.itemId === id);
  
  // Find similar items (just for display)
  const similarItems = mockItems
    .filter(i => i.id !== id && (
      i.location === item?.location || 
      i.type === item?.type ||
      i.title.includes(item?.title.split(' ')[0] || '')
    ))
    .slice(0, 2);
  
  const handleShare = () => {
    // In a real app, this would copy a link to clipboard
    showToast({
      type: "success",
      title: "Link Copied",
      description: "Item link copied to clipboard."
    });
  };
  
  // Check if the item has coordinates for geotagging
  const hasCoordinates = item?.coordinates && 
    item.coordinates.latitude && 
    item.coordinates.longitude;

  // Get the map style based on the current view selection
  const getMapStyle = () => {
    switch(mapView) {
      case "satellite":
        return "mapbox://styles/mapbox/satellite-streets-v11";
      case "standard":
        return "mapbox://styles/mapbox/light-v11";
      case "streets":
      default:
        return "mapbox://styles/mapbox/streets-v11";
    }
  };
  
  // Generate map image URL with the appropriate style
  const getMapImageUrl = () => {
    if (!hasCoordinates || !item?.coordinates) return "";
    
    const style = getMapStyle();
    const { longitude, latitude } = item.coordinates;
    const styleId = style.split('/').pop();
    
    return `https://api.mapbox.com/styles/v1/mapbox/${styleId}/static/pin-s+ff0000(${longitude},${latitude})/${longitude},${latitude},15,0/600x300@2x?access_token=pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHdqYnk5NzMwNjdhMnBsajVybDRjZ3dqIn0.q5e4h5BiEjzwRLZz-G_vTg`;
  };
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-t-mit-red border-r-mit-red border-b-transparent border-l-transparent animate-spin mb-4"></div>
        <div className="text-gray-500">Loading item details...</div>
      </div>
    );
  }
  
  if (!item) {
    return null;
  }
  
  const badgeVariant = item.type === "Lost" 
    ? "bg-red-100 text-red-800 border-red-200" 
    : "bg-green-100 text-green-800 border-green-200";
  
  const statusBadge = 
    item.status === "Pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
    item.status === "Claimed" ? "bg-blue-100 text-blue-800 border-blue-200" :
    "bg-purple-100 text-purple-800 border-purple-200";
  
  return (
    <div className="max-w-5xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="overflow-hidden rounded-lg shadow-md glass">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-auto object-cover"
          />
          
          {/* Map preview toggle button if coordinates exist */}
          {hasCoordinates && (
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white"
                onClick={() => setShowMapPreview(!showMapPreview)}
              >
                <Navigation className="h-4 w-4 mr-2" />
                {showMapPreview ? "Hide Map" : "Show Location"}
              </Button>
            </div>
          )}
        </div>
        
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{item.title}</h1>
              <Badge className={badgeVariant}>
                {item.type}
              </Badge>
            </div>
            
            <div className="mb-4 flex items-center gap-2">
              <Badge className={statusBadge} variant="outline">
                {item.status}
              </Badge>
              
              {/* Display geotag badge if coordinates exist */}
              {hasCoordinates && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200" variant="outline">
                  <Navigation className="h-3 w-3 mr-1" /> Geotagged
                </Badge>
              )}
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-mit-red" />
                <span>{item.location}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 text-mit-red" />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-start text-gray-600">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-mit-red" />
                <span>{item.contactEmail}</span>
              </div>
              
              {/* Display coordinates if they exist */}
              {hasCoordinates && (
                <div className="flex items-start text-gray-600">
                  <Navigation className="h-5 w-5 mr-2 mt-0.5 text-mit-red" />
                  <span>Coordinates: {item.coordinates.latitude.toFixed(4)}, {item.coordinates.longitude.toFixed(4)}</span>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{item.description}</p>
            </div>
            
            <div className="flex flex-col space-y-3">
              {item.status === "Pending" ? (
                <Button 
                  onClick={() => navigate(`/claim/${item.id}`)}
                  className="w-full bg-mit-red hover:bg-red-700"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Claim This Item
                </Button>
              ) : (
                <Button disabled className="w-full opacity-70 cursor-not-allowed">
                  {item.status === "Claimed" ? "Item Has Been Claimed" : "Item Resolved"}
                </Button>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    showToast({
                      type: "info",
                      title: "Item Reported",
                      description: "This item has been reported to the admin for review."
                    });
                  }}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Map preview section - Enhanced with style options */}
      {hasCoordinates && (
        <div className={`mt-6 p-4 bg-white rounded-lg shadow-md ${showMapPreview ? 'block' : 'hidden'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Globe className="h-5 w-5 mr-2 text-mit-red" />
              Location Map
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Map Style:</span>
              <div className="flex space-x-1">
                {["streets", "satellite", "standard"].map((style) => (
                  <Button 
                    key={style}
                    variant={mapView === style ? "default" : "outline"}
                    size="sm"
                    className={mapView === style ? "bg-mit-red hover:bg-red-700" : ""}
                    onClick={() => setMapView(style as "streets" | "satellite" | "standard")}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img 
              src={getMapImageUrl()}
              alt="Location map"
              className="w-full h-auto"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 flex items-center">
            <Navigation className="h-4 w-4 mr-1 text-gray-400" />
            This map shows the approximate location where the item was {item.type === "Lost" ? "last seen" : "found"}.
            {item.type === "Lost" ? 
              " The item may have been lost somewhere along the path to this location." : 
              " You can use these coordinates to precisely locate the item."}
          </p>
        </div>
      )}
      
      {showRelatedAI && (
        <div className="mt-12 animate-fade-in">
          <h2 className="text-xl font-bold mb-4">Related Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedClaim && (
              <AIResponseBox
                title="AI Claim Analysis"
                confidence={relatedClaim.aiConfidence}
                reason={relatedClaim.aiReason}
              />
            )}
            
            {similarItems.length > 0 && (
              <AIResponseBox
                title="Similar Items Found"
                confidence={78}
                reason={`${similarItems.length} similar items found that might be related. The most relevant are: "${similarItems[0].title}" and "${similarItems.length > 1 ? similarItems[1].title : ''}". These items share similarities in description, location, or timing.`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
