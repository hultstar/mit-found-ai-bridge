
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

interface AIResponseBoxProps {
  title: string;
  confidence: number;
  reason: string;
  className?: string;
}

const AIResponseBox = ({ title, confidence, reason, className }: AIResponseBoxProps) => {
  const [isTyping, setIsTyping] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Simulate AI "typing" effect
  useEffect(() => {
    if (currentIndex < reason.length) {
      const typingTimer = setTimeout(() => {
        setDisplayText(prev => prev + reason[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 15); // Typing speed
      
      return () => clearTimeout(typingTimer);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, reason]);
  
  // Determine color based on confidence level
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "bg-green-100 text-green-800";
    if (confidence >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className={`overflow-hidden border-t-4 border-t-mit-red glass ${className}`}>
      <CardHeader className="bg-slate-50/80 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Bot className="h-4 w-4 mr-2 text-mit-red" />
            {title}
          </CardTitle>
          <Badge className={getConfidenceColor(confidence)}>
            {confidence}% Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 text-sm relative">
        <p className="text-gray-700">
          {displayText}
          {isTyping && <span className="animate-pulse">|</span>}
        </p>
        
        {!isTyping && confidence >= 85 && (
          <div className="absolute -right-1 -bottom-1 text-green-600">
            <Lightbulb className="h-5 w-5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIResponseBox;
