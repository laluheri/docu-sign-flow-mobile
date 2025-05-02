
import { Home, FileText, User, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/requests" && location.pathname.startsWith("/requests")) return true;
    if (path === "/disposisi" && location.pathname.startsWith("/disposisi")) return true;
    if (path === "/profile" && location.pathname === "/profile") return true;
    return location.pathname === path;
  };

  return (
    <div className="bottom-navigation">
      <div className="bottom-navigation-container">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/"
            className={cn(
              "flex flex-col items-center space-y-1 px-4 py-2 rounded-md transition-colors",
              isActive("/")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Home size={24} />
            <span className="text-xs">Home</span>
          </Link>
          
          <Link
            to="/requests"
            className={cn(
              "flex flex-col items-center space-y-1 px-4 py-2 rounded-md transition-colors",
              isActive("/requests")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <FileText size={24} />
            <span className="text-xs">Requests</span>
          </Link>

          <Link
            to="/disposisi"
            className={cn(
              "flex flex-col items-center space-y-1 px-4 py-2 rounded-md transition-colors",
              isActive("/disposisi")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Mail size={24} />
            <span className="text-xs">Disposisi</span>
          </Link>

          <Link
            to="/profile"
            className={cn(
              "flex flex-col items-center space-y-1 px-4 py-2 rounded-md transition-colors",
              isActive("/profile")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <User size={24} />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
