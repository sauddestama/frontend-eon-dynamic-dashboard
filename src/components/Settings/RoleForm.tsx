import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RoleWithoutId, PagePermission } from "@/types/role";

interface RoleFormProps {
  role: RoleWithoutId;
  setRole: React.Dispatch<React.SetStateAction<RoleWithoutId>>;
  onSave: () => void;
  onCancel: () => void;
  availablePages: [string, string][]; // [pageId, pageName][]
}

function RoleForm({
  role,
  setRole,
  onSave,
  onCancel,
  availablePages,
}: RoleFormProps) {
  const handlePagePermissionChange = (pageId: string, checked: boolean) => {
    if (checked) {
      setRole((prevRole) => ({
        ...prevRole,
        pagePermissions: [
          ...prevRole.pagePermissions,
          { pageId, actions: { create: false, update: false, delete: false } },
        ],
      }));
    } else {
      setRole((prevRole) => ({
        ...prevRole,
        pagePermissions: prevRole.pagePermissions.filter(
          (p) => p.pageId !== pageId
        ),
      }));
    }
  };

  const handleActionChange = (
    pageId: string,
    action: keyof PagePermission["actions"],
    checked: boolean
  ) => {
    setRole((prevRole) => ({
      ...prevRole,
      pagePermissions: prevRole.pagePermissions.map((p) =>
        p.pageId === pageId
          ? { ...p, actions: { ...p.actions, [action]: checked } }
          : p
      ),
    }));
  };

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
          {availablePages.map(([pageId, pageName]) => {
            const pagePermission = role.pagePermissions.find(
              (p) => p.pageId === pageId
            );
            return (
              <div key={pageId} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 w-1/3">
                  <Checkbox
                    id={`page-${pageId}`}
                    checked={!!pagePermission}
                    onCheckedChange={(checked) =>
                      handlePagePermissionChange(pageId, checked as boolean)
                    }
                  />
                  <Label htmlFor={`page-${pageId}`}>{pageName}</Label>
                </div>
                {pagePermission && (
                  <div className="flex items-center space-x-4">
                    {Object.entries(pagePermission.actions).map(
                      ([action, value]) => (
                        <div
                          key={action}
                          className="flex items-center space-x-2"
                        >
                          <Switch
                            id={`action-${pageId}-${action}`}
                            checked={value}
                            onCheckedChange={(checked) =>
                              handleActionChange(
                                pageId,
                                action as keyof PagePermission["actions"],
                                checked
                              )
                            }
                          />
                          <Label htmlFor={`action-${pageId}-${action}`}>
                            {action}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

export default RoleForm;
