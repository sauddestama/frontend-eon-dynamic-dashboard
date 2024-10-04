// src/components/settings/SheetPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface SheetPageProps {
  isOpen: boolean;
  onClose: () => void;
  page: Page | null;
  refreshPages: () => void;
}

// Fungsi untuk mengambil token dari cookies
const getTokenFromCookies = (): string | null => {
  const match = document.cookie.match(new RegExp("(^| )authToken=([^;]+)"));
  return match ? match[2] : null;
};

const SheetPage: React.FC<SheetPageProps> = ({
  isOpen,
  onClose,
  page,
  refreshPages,
}) => {
  const [name, setName] = useState(page?.name || "");
  const [fields, setFields] = useState<Field[]>(page?.fields || []);

  useEffect(() => {
    if (page) {
      setName(page.name);
      setFields(page.fields);
    } else {
      setName("");
      setFields([]);
    }
  }, [page]);

  const handleSave = async () => {
    try {
      const token = getTokenFromCookies(); // Ambil token dari cookies

      if (!token) {
        console.error("Token not found in cookies.");
        return;
      }

      if (page) {
        // Update page
        await axios.put(
          `http://localhost:5000/api/pages/${page._id}`,
          { name, fields },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new page
        await axios.post(
          "http://localhost:5000/api/pages",
          { name, fields },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      refreshPages(); // Refresh the list of pages
      onClose(); // Close the sheet
      // toast.success("Page saved successfully");
    } catch (error) {
      console.error("Error saving page:", error);
      // toast.error("Failed to save page");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{page ? "Edit Page" : "Add New Page"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Page Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>Fields</Label>
            {fields.map((field, index) => (
              <div key={index} className="flex space-x-2 my-2">
                <Input
                  placeholder="Field Name"
                  value={field.fieldName}
                  onChange={(e) =>
                    setFields((prev) =>
                      prev.map((f, i) =>
                        i === index ? { ...f, fieldName: e.target.value } : f
                      )
                    )
                  }
                />
                {/* Change Input to Select for fieldType */}
                <select
                  value={field.fieldType}
                  onChange={(e) =>
                    setFields((prev) =>
                      prev.map((f, i) =>
                        i === index ? { ...f, fieldType: e.target.value } : f
                      )
                    )
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Select Type</option>
                  <option value="Text">Text</option>
                  <option value="File">File</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFields((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                setFields([...fields, { fieldName: "", fieldType: "" }])
              }
            >
              Add Field
            </Button>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SheetPage;
