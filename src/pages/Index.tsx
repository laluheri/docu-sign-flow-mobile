
import { Outlet } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default Index;
