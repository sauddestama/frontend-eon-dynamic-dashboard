// src/components/Settings/PageForm.tsx
import React, { useState } from "react";

interface Field {
  fieldName: string;
  fieldType: string;
}

interface PageData {
  id?: string;
  name: string;
  url: string;
  fields: Field[];
}

interface PageFormProps {
  page?: PageData;
  onSubmit: (pageData: PageData) => void;
}

export default function PageForm({ page, onSubmit }: PageFormProps) {
  const [pageData, setPageData] = useState<PageData>(
    page || { name: "", url: "", fields: [] }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPageData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldChange = (index: number, field: Field) => {
    const newFields = [...pageData.fields];
    newFields[index] = field;
    setPageData((prev) => ({ ...prev, fields: newFields }));
  };

  const addField = () => {
    setPageData((prev) => ({
      ...prev,
      fields: [...prev.fields, { fieldName: "", fieldType: "string" }],
    }));
  };

  const removeField = (index: number) => {
    setPageData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(pageData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">
          Page Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={pageData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="url" className="block mb-1">
          URL
        </label>
        <input
          type="text"
          id="url"
          name="url"
          value={pageData.url}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <h3 className="font-bold mb-2">Fields</h3>
        {pageData.fields.map((field, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              value={field.fieldName}
              onChange={(e) =>
                handleFieldChange(index, {
                  ...field,
                  fieldName: e.target.value,
                })
              }
              placeholder="Field Name"
              className="flex-1 px-3 py-2 border rounded"
            />
            <select
              value={field.fieldType}
              onChange={(e) =>
                handleFieldChange(index, {
                  ...field,
                  fieldType: e.target.value,
                })
              }
              className="px-3 py-2 border rounded"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
            </select>
            <button
              type="button"
              onClick={() => removeField(index)}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addField}
          className="px-3 py-2 bg-green-500 text-white rounded"
        >
          Add Field
        </button>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {page ? "Update Page" : "Create Page"}
      </button>
    </form>
  );
}
