"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios"; // Hapus AxiosError dari impor ini
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
import SheetPage from "@/components/Settings/SheetPage";
import { toast } from "react-toastify";

interface Field {
  fieldName: string;
  fieldType: string;
}

interface Page {
  _id?: string;
  name: string;
  fields: Field[];
  url?: string;
}

export const PagesManagement: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getTokenFromCookies = (): string | null => {
    const match = document.cookie.match(new RegExp("(^| )authToken=([^;]+)"));
    return match ? match[2] : null;
  };

  const fetchPages = useCallback(async () => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        console.error("No token found in cookies");
        toast.error("Token tidak ditemukan.");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/pages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPages(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Gagal mengambil data halaman";
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        toast.error("Terjadi kesalahan tak terduga saat mengambil halaman");
      }
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setIsSheetOpen(true);
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        console.error("No token found in cookies");
        toast.error("Token tidak ditemukan.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/pages/${pageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPages(pages.filter((page) => page._id !== pageId));
      toast.success(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Gagal menghapus halaman";
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        toast.error("Terjadi kesalahan tak terduga saat menghapus halaman");
      }
    }
  };

  const handleAddPage = () => {
    setSelectedPage(null);
    setIsSheetOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Pages Management</h1>
      <Button onClick={handleAddPage} className="mb-4">
        Add Page
      </Button>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Page Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Fields</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page._id}>
              <TableCell>{page.name}</TableCell>
              <TableCell>{page.url}</TableCell>
              <TableCell>
                {page.fields
                  .map((f) => `${f.fieldName} (${f.fieldType})`)
                  .join(", ")}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditPage(page)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeletePage(page._id as string)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isSheetOpen && (
        <SheetPage
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          page={selectedPage}
          refreshPages={fetchPages}
        />
      )}
    </div>
  );
};

export default PagesManagement;
