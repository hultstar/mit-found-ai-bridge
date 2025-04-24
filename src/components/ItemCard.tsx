import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Item } from "@/data/mockData";

interface ItemCardProps {
  item: Item;
  actions?: React.ReactNode;  // Added this line to fix the build error
}

const ItemCard = ({ item, actions }: ItemCardProps) => {
  const navigate = useNavigate();
  
  const badgeVariant = item.type === "Lost" 
    ? "bg-red-100 text-red-800 border-red-200" 
    : "bg-green-100 text-green-800 border-green-200";

  const statusBadgeVariant = 
    item.status === "Pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
    item.status === "Claimed" ? "bg-blue-100 text-blue-800 border-blue-200" :
    "bg-purple-100 text-purple-800 border-purple-200";
  
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
