// C:\next-js-project\EON-Dynamic-Dashboard\frontend\src\app\dashboard\[pageName]\page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/utils/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";

import { Pencil, Trash, Plus } from "lucide-react"; // Import Plus icon
import DynamicForm from "@/components/DynamicForm/DynamicForm";
import "react-toastify/dist/ReactToastify.css";

export interface PageData {
  [key: string]: string | number | boolean | File | undefined;
  _id?: string;
}

interface Actions {
  create: boolean;
  update: boolean;
  delete: boolean;
}

interface PageStructure {
  fields: Array<{ fieldName: string; fieldType: string }>;
  collectionName: string;
}

const DynamicPage: React.FC = () => {
  const { pageName } = useParams();
  const router = useRouter();
  const { token, userId, logout } = useAuth();
  const [data, setData] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actions, setActions] = useState<Actions | null>(null);
  const [fields, setFields] = useState<PageStructure["fields"]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [currentItem, setCurrentItem] = useState<PageData | null>(null);

  // Get the actual pageName value from URL params
  const pageNameStr = Array.isArray(pageName) ? pageName[0] : pageName;
  // Change to formattedPageName to use with hyphen (e.g., "dokumen-akademik")
  const formattedPageName = pageNameStr?.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    if (!formattedPageName || !userId) {
      console.warn(
        "pageName atau userId tidak didefinisikan, tidak melakukan fetch"
      );
      return;
    }

    const fetchPageData = async () => {
      try {
        const roleResponse = await axios.get(
          `http://localhost:5000/api/pages/role?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token || ""}`,
            },
          }
        );

        // Find the correct page based on URL
        const currentPagePermissions = roleResponse.data.find(
          (page: { url: string }) => page.url === `/${formattedPageName}`
        );

        if (!currentPagePermissions) {
          console.warn("Halaman ini tidak memiliki izin akses.");
          setLoading(false);
          return;
        }

        setActions(currentPagePermissions.actions);

        // Use formattedPageName in API request to get the data
        const dataResponse = await axios.get<{
          fields: PageStructure["fields"];
          data: PageData[];
        }>(`http://localhost:5000/api/dynamic/${formattedPageName}`, {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        });

        setData(dataResponse.data.data);
        setFields(dataResponse.data.fields);
      } catch (error: unknown) {
        console.error("Error fetching dynamic data:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error("Sesi login Anda telah habis. Silakan login kembali.", {
              position: "top-right",
              autoClose: 3000,
            });
            logout();
            setTimeout(() => {
              router.push("/auth");
            }, 3000);
          } else {
            setError(
              `Error: ${error.response?.status} - ${
                error.response?.data.message || error.message
              }`
            );
          }
        } else {
          setError("Gagal memuat data halaman");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [formattedPageName, token, userId, router, logout]);

  const handleAddClick = () => {
    setFormMode("add");
    setCurrentItem(null);
    setShowForm(true);
  };

  const handleEditClick = (item: PageData) => {
    setFormMode("edit");
    setCurrentItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: PageData) => {
    if (formMode === "add") {
      setData([...data, formData]);
    } else if (formMode === "edit") {
      setData(
        data.map((item) => (item._id === formData._id ? formData : item))
      );
    }
    setShowForm(false);
  };

  const handleDelete = async (item: PageData) => {
    try {
      if (item._id) {
        await axios.delete(
          `http://localhost:5000/api/dynamic/${formattedPageName}/${item._id}`,
          {
            headers: {
              Authorization: `Bearer ${token || ""}`,
            },
          }
        );
        setData(data.filter((d) => d._id !== item._id));
      }
    } catch (err: unknown) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const createEnabled = actions?.create;
  const updateEnabled = actions?.update;
  const deleteEnabled = actions?.delete;

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">{pageNameStr}</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium"> Data {pageNameStr}</h2>
            <div className="mb-4 flex justify-end">
              {createEnabled && (
                <Button onClick={handleAddClick} className="button-primary">
                  <Plus className="mr-2 h-4 w-4" /> Add Data
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500">
                {fields.map((field) => (
                  <th key={field.fieldName} className="pb-4 font-medium">
                    {field.fieldName}
                  </th>
                ))}
                {(updateEnabled || deleteEnabled) && (
                  <th className="pb-4 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="border-t">
                    {fields.map((field) => (
                      <td key={field.fieldName} className="py-4">
                        {String(item[field.fieldName] || "")}
                      </td>
                    ))}
                    {(updateEnabled || deleteEnabled) && (
                      <td className="py-4">
                        <div className="flex space-x-2">
                          {updateEnabled && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditClick(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {deleteEnabled && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      fields.length + (updateEnabled || deleteEnabled ? 1 : 0)
                    }
                    className="text-center text-gray-500 py-4"
                  >
                    No data available in {pageNameStr}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DynamicForm
        isOpen={showForm}
        initialData={currentItem || {}}
        fields={fields}
        onSubmit={handleFormSubmit}
        onCancel={() => setShowForm(false)}
      />
    </div>
  );
};

export default DynamicPage;
