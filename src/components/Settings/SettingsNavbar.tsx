"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SettingsNavbarProps {
  toggleSidebar: () => void;
}

const SettingsNavbar: React.FC<SettingsNavbarProps> = ({ toggleSidebar }) => {
  const router = useRouter();

  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden mr-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    </header>
  );
};

export default SettingsNavbar;
