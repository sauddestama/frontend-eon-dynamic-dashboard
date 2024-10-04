// C:\next-js-project\EON-Dynamic-Dashboard\frontend\src\components\DynamicForm\DynamicForm.tsx

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageData } from "@/app/dashboard/[pageUrl]/page";

interface FieldDetail {
  fieldName: string;
  fieldType: string;
}

interface DynamicFormProps {
  isOpen: boolean;
  initialData?: PageData;
  fields: FieldDetail[];
  onSubmit: (formData: PageData) => void;
  onCancel: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  isOpen,
  initialData = {},
  fields = [],
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<PageData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      setFormData((prev) => ({
        ...prev,
        [name]: files && files.length > 0 ? files[0] : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {Object.keys(initialData).length ? "Edit Data" : "Add New Data"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {fields && fields.length > 0 ? (
            fields.map((field) => (
              <div key={field.fieldName} className="form-group">
                <Label htmlFor={field.fieldName}>{field.fieldName}</Label>
                {field.fieldType === "Text" ? (
                  <Input
                    id={field.fieldName}
                    name={field.fieldName}
                    value={
                      formData[field.fieldName] !== undefined
                        ? String(formData[field.fieldName])
                        : ""
                    }
                    onChange={handleChange}
                    className="mt-1"
                  />
                ) : field.fieldType === "File" ? (
                  <Input
                    id={field.fieldName}
                    name={field.fieldName}
                    type="file"
                    onChange={handleChange}
                    className="mt-1"
                  />
                ) : null}
              </div>
            ))
          ) : (
            <p>No fields available.</p>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicForm;
