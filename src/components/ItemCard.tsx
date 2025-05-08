
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Eye, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Item } from "@/data/mockData";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ItemCardProps {
  item: Item;
  actions?: React.ReactNode;
}

const ItemCard = ({ item, actions }: ItemCardProps) => {
  const navigate = useNavigate();
  const [showMapPreview, setShowMapPreview] = useState(false);
  
  const badgeVariant = item.type === "Lost" 
    ? "bg-red-100 text-red-800 border-red-200" 
    : "bg-green-100 text-green-800 border-green-200";

  const statusBadgeVariant = 
    item.status === "Pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
    item.status === "Claimed" ? "bg-blue-100 text-blue-800 border-blue-200" :
    "bg-purple-100 text-purple-800 border-purple-200";
  
  // Check if the item has coordinates
  const hasCoordinates = item.coordinates && 
    item.coordinates.latitude && 
    item.coordinates.longitude;
  
  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className={badgeVariant}>
            {item.type}
          </Badge>
        </div>
        
        {hasCoordinates && (
          <div 
            className="absolute bottom-2 right-2 bg-black/50 rounded-full p-2 cursor-pointer hover:bg-black/70 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowMapPreview(!showMapPreview);
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Navigation className="h-5 w-5 text-white" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>View precise location</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        {showMapPreview && hasCoordinates && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-10">
            <div className="bg-white rounded-lg p-2 w-full max-w-xs mb-2">
              <img 
                src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${item.coordinates.longitude},${item.coordinates.latitude})/${item.coordinates.longitude},${item.coordinates.latitude},15,0/300x150@2x?access_token=pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHdqYnk5NzMwNjdhMnBsajVybDRjZ3dqIn0.q5e4h5BiEjzwRLZz-G_vTg`}
                alt="Location map"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="text-white text-sm text-center">
              <p>Coordinates: {item.coordinates.latitude.toFixed(4)}, {item.coordinates.longitude.toFixed(4)}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-white border-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMapPreview(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
          <Badge className={statusBadgeVariant} variant="outline">
            {item.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{item.location}</span>
          {hasCoordinates && (
            <Badge className="ml-2 bg-slate-100 text-slate-700 border-slate-200 text-xs" variant="outline">
              Geotagged
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{new Date(item.date).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {item.description}
        </p>
      </CardContent>
      <CardFooter>
        {actions ? (
          actions
        ) : (
          <Button 
            className="w-full bg-mit-red hover:bg-red-700" 
            onClick={() => navigate(`/item/${item.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
