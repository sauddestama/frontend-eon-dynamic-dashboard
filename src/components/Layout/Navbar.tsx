// src/components/Layout/Navbar.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import untuk logo
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/AuthContext"; // Import useAuth dari context
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronDown,
  Menu,
  Settings,
  LogOut,
  Search,
} from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const router = useRouter();
  const { logout, username } = useAuth(); // Access `username` from AuthContext

  // Create initials from the username
  const initials = username
    ? username
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase())
        .join("")
    : "JD"; // Default to "JD"

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Kiri: Menu toggle button */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo dan teks EON Dashboard - hanya muncul pada mode mobile */}
          <div className="flex items-center space-x-2 md:hidden">
            <Image
              src="/logo.png" // Path untuk logo Anda
              alt="EON Logo"
              width={28} // Sesuaikan lebar logo
              height={28} // Sesuaikan tinggi logo
            />
            <span className="text-xl font-semibold">EON</span>
          </div>

          {/* Search bar yang disembunyikan pada mode mobile */}
          <div className="hidden md:flex items-center w-full">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-md px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Kanan: Bell icon dan user profile */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {initials}
                  </span>
                </div>
                <span className="hidden md:inline">{username}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
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
    </header>
  );
};

export default Navbar;
