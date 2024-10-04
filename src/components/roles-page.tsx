"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
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

interface Role {
  id: number
  name: string
  allowedPages: {
    [key: string]: {
      access: boolean
      buttons: {
        add: boolean
        edit: boolean
        delete: boolean
      }
    }
  }
}

const availablePages = [
  "Dashboard",
  "Users",
  "Roles",
  "Products",
  "Orders",
  "Settings",
]

export function RolesPageComponent() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "Admin",
      allowedPages: {
        Dashboard: { access: true, buttons: { add: true, edit: true, delete: true } },
        Users: { access: true, buttons: { add: true, edit: true, delete: true } },
        Roles: { access: true, buttons: { add: true, edit: true, delete: true } },
        Products: { access: false, buttons: { add: false, edit: false, delete: false } },
        Orders: { access: false, buttons: { add: false, edit: false, delete: false } },
        Settings: { access: false, buttons: { add: false, edit: false, delete: false } },
      },
    },
    {
      id: 2,
      name: "Editor",
      allowedPages: {
        Dashboard: { access: true, buttons: { add: true, edit: true, delete: false } },
        Users: { access: true, buttons: { add: false, edit: true, delete: false } },
        Roles: { access: false, buttons: { add: false, edit: false, delete: false } },
        Products: { access: false, buttons: { add: false, edit: false, delete: false } },
        Orders: { access: false, buttons: { add: false, edit: false, delete: false } },
        Settings: { access: false, buttons: { add: false, edit: false, delete: false } },
      },
    },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const [newRole, setNewRole] = useState<Omit<Role, "id">>({
    name: "",
    allowedPages: Object.fromEntries(
      availablePages.map((page) => [
        page,
        { access: false, buttons: { add: false, edit: false, delete: false } },
      ])
    ),
  })

  const handleAddRole = () => {
    if (newRole.name) {
      setRoles([...roles, { ...newRole, id: roles.length + 1 }])
      setNewRole({
        name: "",
        allowedPages: Object.fromEntries(
          availablePages.map((page) => [
            page,
            { access: false, buttons: { add: false, edit: false, delete: false } },
          ])
        ),
      })
      setIsAddModalOpen(false)
    }
  }

  const handleEditRole = () => {
    if (editingRole) {
      setRoles(roles.map((role) => (role.id === editingRole.id ? editingRole : role)))
      setEditingRole(null)
    }
  }

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter((role) => role.id !== id))
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Roles Management</h1>
      <div className="mb-4">
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>Add Role</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <RoleForm
              role={newRole}
              setRole={setNewRole}
              onSave={handleAddRole}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
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
                {Object.entries(role.allowedPages)
                  .filter(([, { access }]) => access)
                  .map(([page]) => page)
                  .join(", ")}
              </TableCell>
              <TableCell>
                {Object.entries(role.allowedPages)
                  .filter(([, { access }]) => access)
                  .map(([page, { buttons }]) => (
                    <div key={page} className="mb-1">
                      <span className="font-semibold">{page}:</span>{" "}
                      {Object.entries(buttons)
                        .filter(([, value]) => value)
                        .map(([button]) => button)
                        .join(", ")}
                    </div>
                  ))}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingRole(role)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                      </DialogHeader>
                      {editingRole && (
                        <RoleForm
                          role={editingRole}
                          setRole={setEditingRole}
                          onSave={handleEditRole}
                          onCancel={() => setEditingRole(null)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
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
    </div>
  )
}

interface RoleFormProps {
  role: Omit<Role, "id">
  setRole: React.Dispatch<React.SetStateAction<Omit<Role, "id">>>
  onSave: () => void
  onCancel: () => void
}

function RoleForm({ role, setRole, onSave, onCancel }: RoleFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Role Name</Label>
        <Input
          id="name"
          value={role.name}
          onChange={(e) => setRole({ ...role, name: e.target.value })}
        />
      </div>
      <div>
        <Label className="mb-2 block">Allowed Pages and Buttons</Label>
        <div className="space-y-2">
          {availablePages.map((page) => (
            <div key={page} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 w-1/3">
                <Checkbox
                  id={`page-${page}`}
                  checked={role.allowedPages[page].access}
                  onCheckedChange={(checked) => {
                    setRole({
                      ...role,
                      allowedPages: {
                        ...role.allowedPages,
                        [page]: {
                          ...role.allowedPages[page],
                          access: checked as boolean,
                        },
                      },
                    })
                  }}
                />
                <Label htmlFor={`page-${page}`}>{page}</Label>
              </div>
              <div className="flex items-center space-x-4">
                {Object.entries(role.allowedPages[page].buttons).map(([button, value]) => (
                  <div key={button} className="flex items-center space-x-2">
                    <Switch
                      id={`button-${page}-${button}`}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setRole({
                          ...role,
                          allowedPages: {
                            ...role.allowedPages,
                            [page]: {
                              ...role.allowedPages[page],
                              buttons: {
                                ...role.allowedPages[page].buttons,
                                [button]: checked,
                              },
                            },
                          },
                        })
                      }
                      disabled={!role.allowedPages[page].access}
                    />
                    <Label htmlFor={`button-${page}-${button}`}>{button}</Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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