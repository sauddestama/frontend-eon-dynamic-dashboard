// File: frontend/src/app/settings/users/page.tsx

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
import UserForm from "@/components/Settings/UserForm";
import { User, UserWithoutId } from "@/types/user";

interface Role {
  _id: string;
  name: string;
}

interface ApiUser {
  _id: string;
  username: string;
  email: string;
  role?: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithoutId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTokenFromCookies = (): string | null => {
    const match = document.cookie.match(new RegExp("(^| )authToken=([^;]+)"));
    return match ? match[2] : null;
  };

  const fetchRoles = useCallback(async (): Promise<Role[]> => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Token tidak ditemukan.");
        return [];
      }

      const response = await axios.get<Role[]>(
        "http://localhost:5000/api/roles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRoles(response.data);
      return response.data;
    } catch {
      toast.error("Gagal mengambil data peran");
      return [];
    }
  }, []);

  const fetchUsers = useCallback(async (roles: Role[]) => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Token tidak ditemukan.");
        return;
      }

      const response = await axios.get<ApiUser[]>(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const usersWithRoles = response.data.map((user) => {
        const role = roles.find((r) => r._id === user.role);
        return {
          ...user,
          role: role ? role : { _id: "", name: "No Role" },
        };
      });

      setUsers(usersWithRoles);
    } catch {
      toast.error("Gagal mengambil data pengguna");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect untuk memastikan fetchUsers hanya dipanggil setelah roles selesai diambil
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      const fetchedRoles = await fetchRoles();
      await fetchUsers(fetchedRoles);
    };
    initializeData();
  }, [fetchRoles, fetchUsers]);

  const handleEditUser = (user: User) => {
    setSelectedUser({
      _id: user._id, // Perbaikan untuk menambahkan _id pada state
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Token tidak ditemukan.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users.filter((user) => user._id !== userId));
      toast.success(response.data.message);
    } catch {
      toast.error("Gagal menghapus pengguna");
    }
  };

  const handleAddUser = () => {
    setSelectedUser({
      username: "",
      email: "",
      role: { _id: "", name: "" },
    });
    setIsDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (selectedUser) {
      try {
        const token = getTokenFromCookies();
        if (!token) {
          toast.error("Token tidak ditemukan.");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        if (selectedUser._id) {
          // Update user jika _id ada
          await axios.put(
            `http://localhost:5000/api/users/${selectedUser._id}`,
            { ...selectedUser, role: selectedUser.role._id },
            { headers }
          );
          toast.success("Pengguna berhasil diperbarui");
        } else {
          // Tambah user baru
          await axios.post(
            "http://localhost:5000/api/users/register",
            { ...selectedUser, role: selectedUser.role._id },
            { headers }
          );
          toast.success("Pengguna berhasil ditambahkan");
        }

        fetchRoles().then((roles) => fetchUsers(roles)); // Fetch ulang data
        setIsDialogOpen(false);
      } catch {
        toast.error("Gagal menyimpan pengguna");
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">User Management</h1>
      <div className="mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedUser && selectedUser._id
                  ? "Edit User"
                  : "Add New User"}
              </DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <UserForm
                user={selectedUser}
                setUser={(newUser) => setSelectedUser(newUser as UserWithoutId)}
                onSave={handleSaveUser}
                onCancel={() => setIsDialogOpen(false)}
                roles={roles}
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
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role?.name || "No Role"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteUser(user._id)}
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

export default UserManagement;
