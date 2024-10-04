export interface PagePermission {
  pageId: string;
  actions: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

export interface Role {
  id: string;
  name: string;
  pagePermissions: PagePermission[];
}

export type RoleWithoutId = Omit<Role, "id">;
