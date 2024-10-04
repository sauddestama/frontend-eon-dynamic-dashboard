import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserWithoutId } from "@/types/user";

interface Role {
  _id: string;
  name: string;
}

interface UserFormProps {
  user: UserWithoutId;
  setUser: React.Dispatch<React.SetStateAction<UserWithoutId>>;
  onSave: () => void;
  onCancel: () => void;
  roles: Role[];
}

function UserForm({ user, setUser, onSave, onCancel, roles }: UserFormProps) {
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
          value={user.password || ""}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={user.role._id}
          onValueChange={(value) =>
            setUser({
              ...user,
              role: {
                _id: value,
                name: roles.find((r) => r._id === value)?.name || "",
              },
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role._id} value={role._id}>
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
  );
}

export default UserForm;
