"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings, Users, FileText, Shield, X } from "lucide-react";

interface SettingsSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  isOpen,
  toggleSidebar,
}) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4">
          <span className="text-xl font-semibold">Settings</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-5">
          <Link
            href="/settings"
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 ${
              isActive("/settings")
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-700 hover:text-white"
            }`}
          >
            <Settings className="mr-2" size={20} />
            General
          </Link>
          <Link
            href="/settings/users"
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 ${
              isActive("/settings/users")
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-700 hover:text-white"
            }`}
          >
            <Users className="mr-2" size={20} />
            Users
          </Link>
          <Link
            href="/settings/pages"
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 ${
              isActive("/settings/pages")
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FileText className="mr-2" size={20} />
            Pages
          </Link>
          <Link
            href="/settings/roles"
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 ${
              isActive("/settings/roles")
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-700 hover:text-white"
            }`}
          >
            <Shield className="mr-2" size={20} />
            Roles
          </Link>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default SettingsSidebar;
