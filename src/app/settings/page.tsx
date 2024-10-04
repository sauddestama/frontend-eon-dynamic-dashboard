"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Shield } from "lucide-react";
import WithAdminAuth from "@/components/WithAdminAuth";

const SettingsOverviewPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" size={20} />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage user accounts and permissions</p>
            <Link
              href="/settings/users"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Go to Users
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" size={20} />
              Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configure and manage dynamic pages</p>
            <Link
              href="/settings/pages"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Go to Pages
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2" size={20} />
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Define and manage user roles and permissions</p>
            <Link
              href="/settings/roles"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Go to Roles
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WithAdminAuth(SettingsOverviewPage);
