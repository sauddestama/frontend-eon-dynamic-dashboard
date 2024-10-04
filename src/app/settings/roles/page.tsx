"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RoleForm from "@/components/Settings/RoleForm";
import { Role, RoleWithoutId, PagePermission } from "@/types/role";

interface Page {
  _id: string;
  name: string;
}

export const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleWithoutId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageIdToName, setPageIdToName] = useState<{ [key: string]: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  const getTokenFromCookies = (): string | null => {
    const match = document.cookie.match(new RegExp("(^| )authToken=([^;]+)"));
    return match ? match[2] : null;
  };

  const fetchPages = useCallback(async () => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Token tidak ditemukan.");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/pages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pages: Page[] = response.data;
      const mapping: { [key: string]: string } = {};
      pages.forEach((page) => {
        mapping[page._id] = page.name;
      });
      setPageIdToName(mapping);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Gagal mengambil data halaman";
        toast.error(errorMessage);
      } else {
        toast.error("Terjadi kesalahan tak terduga saat mengambil halaman");
      }
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Token tidak ditemukan.");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Gagal mengambil data role";
        toast.error(errorMessage);
      } else {
        toast.error("Terjadi kesalahan tak terduga saat mengambil role");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await fetchPages();
      await fetchRoles();
    };
    initializeData();
  }, [fetchPages, fetchRoles]);

  const handleEditRole = (role: Role) => {
    const roleWithoutId: RoleWithoutId = {
      name: role.name,
      pagePermissions: role.pagePermissions,
    };
    setSelectedRole(roleWithoutId);
    setIsDialogOpen(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Token tidak ditemukan.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/roles/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRoles(roles.filter((role) => role.id !== roleId));
      toast.success(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Gagal menghapus role";
        toast.error(errorMessage);
      } else {
        toast.error("Terjadi kesalahan tak terduga saat menghapus role");
      }
    }
  };

  const handleAddRole = () => {
    setSelectedRole({
      name: "",
      pagePermissions: [],
    });
    setIsDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (selectedRole) {
      try {
        const token = getTokenFromCookies();
        if (!token) {
          toast.error("Token tidak ditemukan.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        if ("id" in selectedRole && selectedRole.id) {
          await axios.put(
            `http://localhost:5000/api/roles/${selectedRole.id}`,
            selectedRole,
            { headers }
          );
          toast.success("Role berhasil diperbarui");
        } else {
          await axios.post("http://localhost:5000/api/roles", selectedRole, {
            headers,
          });
          toast.success("Role berhasil ditambahkan");
        }

        fetchRoles();
        setIsDialogOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || "Gagal menyimpan role";
          toast.error(errorMessage);
        } else {
          toast.error("Terjadi kesalahan tak terduga saat menyimpan role");
        }
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Roles Management</h1>
      <div className="mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddRole}>Add Role</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedRole ? "Edit Role" : "Add New Role"}
              </DialogTitle>
            </DialogHeader>
            {selectedRole && (
              <RoleForm
                role={selectedRole}
                setRole={(newRole) => setSelectedRole(newRole as RoleWithoutId)}
                onSave={handleSaveRole}
                onCancel={() => setIsDialogOpen(false)}
                availablePages={Object.entries(pageIdToName)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Allowed Pages</TableHead>
              <TableHead>Allowed Buttons</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  {role.pagePermissions.length > 0
                    ? role.pagePermissions
                        .map(
                          (permission) =>
                            pageIdToName[permission.pageId] || permission.pageId
                        )
                        .join(", ")
                    : "No pages allowed"}
                </TableCell>
                <TableCell>
                  {role.pagePermissions.length > 0
                    ? role.pagePermissions.map((permission: PagePermission) => (
                        <div key={permission.pageId} className="mb-1">
                          <span className="font-semibold">
                            {pageIdToName[permission.pageId] ||
                              permission.pageId}
                            :
                          </span>{" "}
                          {Object.entries(permission.actions)
                            .filter(([, value]) => value)
                            .map(([action]) => action)
                            .join(", ")}
                        </div>
                      ))
                    : "No buttons allowed"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditRole(role)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteRole(role.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default RolesManagement;
