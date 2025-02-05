import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";
import { Home, Users, User, Bell, LogOut } from "lucide-react";

const Navbar = () => {
  const { data: authUser } = useQuery({queryKey: ["authUser"]});
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!authUser,
  });

  const { data: connectionRequests = [] } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/connections/requests");
      return res.data;
    },
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });    
    },
  });

  const unreadNotificationCount = Array.isArray(notifications)
  ? notifications.filter((notif) => !notif.read).length
  : 0;
  const unreadConnectionRequestCount = connectionRequests.length;

  return (
    <nav className="bg-secondary shadow-md sticky top-0 z-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-1">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="transition-transform duration-300 hover:scale-105">
              <img className="h-19 w-32 rounded " src="/OneConnect_Logo.jpg" alt="OneConnect Logo" />
            </Link>
          </div>

          {/* Navbar Links */}
          <div className="flex items-center gap-3 md:gap-6">
            {authUser ? (
              <>
                <Link to="/" className="text-natural flex flex-col items-center hover:text-blue-500 transition-all duration-300">
                  <Home size={22} />
                  <span className="text-xs hidden md:block font-medium">Home</span>
                </Link>

                <Link to="/network" className="text-natural flex flex-col items-center relative hover:text-blue-500 transition-all duration-300">
                  <Users size={22} />
                  <span className="text-xs hidden md:block font-medium">My Network</span>
                  {unreadConnectionRequestCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:right-4 bg-red-500 text-white text-xs rounded-full size-4 flex items-center justify-center shadow-lg">
                      {unreadConnectionRequestCount}
                    </span>
                  )}
                </Link>

                <Link to="/notifications" className="text-natural flex flex-col items-center relative hover:text-blue-500 transition-all duration-300">
                  <Bell size={22} />
                  <span className="text-xs hidden md:block font-medium">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:right-4 bg-red-500 text-white text-xs rounded-full size-4 flex items-center justify-center shadow-lg">
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>

                <Link to={`/profile/${authUser.username}`} className="text-natural flex flex-col items-center hover:text-blue-500 transition-all duration-300">
                  <User size={22} />
                  <span className="text-xs hidden md:block font-medium">Me</span>
                </Link>

                <button
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-200 px-3 py-1 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-300"
                  onClick={() => logout()}
                >
                  <LogOut size={22} />
                  <span className="hidden md:inline font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost hover:bg-gray-200 px-4 py-2 rounded-md transition-all duration-300">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary px-4 py-2 rounded-md shadow-lg transition-all duration-300 hover:bg-blue-600">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
