// C:\next-js-project\EON-Dynamic-Dashboard\frontend\src\types\user.ts
export interface User {
  _id: string;
  username: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Perbaikan: Menambahkan _id sebagai properti opsional pada UserWithoutId
export type UserWithoutId = Omit<User, "_id"> & { _id?: string };
