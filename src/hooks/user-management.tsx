"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Trash } from "lucide-react"

interface User {
  id: string;
  username: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: string;
  name: string;
}

interface UserFormProps {
  user: {
    username: string;
    email: string;
    password: string;
    role: string;
  };
  setUser: React.Dispatch<React.SetStateAction<{
    username: string;
    email: string;
    password: string;
    role: string;
  }>>;
  roles: Role[];
  onSave: () => void;
  onCancel: () => void;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  })

  useEffect(() => {
    // Fetch users and roles from API
    // This is a mock implementation. Replace with actual API calls.
    setUsers([
      {
        id: "1",
        username: "johndoe",
        email: "john@example.com",
        role: { id: "1", name: "Admin" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        username: "janedoe",
        email: "jane@example.com",
        role: { id: "2", name: "Editor" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
    setRoles([
      { id: "1", name: "Admin" },
      { id: "2", name: "Editor" },
      { id: "3", name: "Viewer" },
    ])
  }, [])

  const handleAddUser = () => {
    if (newUser.username && newUser.email && newUser.password && newUser.role) {
      const user: User = {
        id: String(users.length + 1),
        username: newUser.username,
        email: newUser.email,
        role: roles.find(role => role.id === newUser.role) || { id: "", name: "" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setUsers([...users, user])
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "",
      })
      setIsAddModalOpen(false)
    }
  }

  const handleEditUser = () => {
    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)))
      setEditingUser(null)
    }
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">User Management</h1>
      <div className="mb-4">
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <UserForm
              user={newUser}
              setUser={setNewUser}
              roles={roles}
              onSave={handleAddUser}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role.name}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      {editingUser && (
                        <UserForm
                          user={{
                            username: editingUser.username,
                            email: editingUser.email,
                            password: "",
                            role: editingUser.role.id,
                          }}
                          setUser={(newValues) => setEditingUser({ ...editingUser, ...newValues })}
                          roles={roles}
                          onSave={handleEditUser}
                          onCancel={() => setEditingUser(null)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function UserForm({ user, setUser, roles, onSave, onCancel }: UserFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={user.role}
          onValueChange={(value) => setUser({ ...user, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  )
}