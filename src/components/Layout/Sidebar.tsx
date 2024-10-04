// C:\next-js-project\EON-Dynamic-Dashboard\frontend\src\components\Layout\Sidebar.tsx

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAuth } from "@/utils/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface Page {
  id: string;
  name: string;
  url: string;
  actions: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

const colorClasses = [
  "bg-purple-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-green-500",
  "bg-red-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { userId, token, logout } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const router = useRouter();

  const fetchPages = useCallback(async () => {
    if (!userId || !token) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/pages/role?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        // Token is expired or invalid
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.", {
          position: "top-right",
          autoClose: 3000,
        });
        logout();
        router.push("/auth");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setPages(data);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  }, [userId, token, logout, router]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="EON Logo" width={32} height={32} />
          <span className="text-xl font-semibold">EON</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="mt-6">
        <ul>
          {pages.length > 0 ? (
            pages.map((page, index) => (
              <li key={page.id}>
                <Link
                  href={`/dashboard/${page.name
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-md text-white font-semibold ${
                      colorClasses[index % colorClasses.length]
                    }`}
                  >
                    {page.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-3">{page.name}</span>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No pages available</li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
