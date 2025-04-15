
import { toast } from "sonner";
import { Check, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ShowToastProps {
  type: ToastType;
  title: string;
  description?: string;
}

export const showToast = ({ type, title, description }: ShowToastProps) => {
  const icon = {
    success: <Check className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  }[type];

  toast[type](title, {
    description,
    icon
  });
};
