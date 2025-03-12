"use client";

import { File, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/utils/uploadthing";
import { $Enums, FileType } from "@prisma/client";
import { Button } from "./ui/button";

interface FileUploadProps {
  onChange: (
    value: { name: string; url: string; type: $Enums.FileType }[]
  ) => void;
  value: { name: string; url: string; type: $Enums.FileType }[];
}

export const FileUpload = ({ onChange, value }: FileUploadProps) => {
  const [selectedType, setSelectedType] = useState<FileType | undefined>(
    undefined
  );

  return (
    <div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {value.map((file, index) => (
            <div
              key={file.url}
              className="relative w-[100px] h-[100px] rounded-lg"
            >
              {file.type === "IMAGE" ? (
                <Image
                  src={file.url}
                  alt={`Uploaded file ${index + 1}`}
                  className="object-cover rounded-lg"
                  fill
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-slate-100 rounded-lg">
                  <span className="text-sm text-slate-600">
                    <File className="h-4 w-4" />
                    {file.name}
                  </span>
                </div>
              )}
              <button
                onClick={() =>
                  onChange(value.filter((f) => f.url !== file.url))
                }
                className="absolute -top-2 -right-2 p-1 bg-rose-500 rounded-full text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedType && value.length < 10 ? (
        <UploadDropzone
          endpoint={
            selectedType === "IMAGE" ? "imageUploader" : "documentUploader"
          }
          onClientUploadComplete={(res) => {
            const newFiles = res?.map((r) => ({
              name: r.name,
              url: r.url,
              type: selectedType,
            }));

            const updatedFiles = [...value, ...newFiles];
            onChange(updatedFiles);
            setSelectedType(undefined);
          }}
          onUploadError={(error: Error) => {
            console.log(`ERROR! ${error.message}`);
          }}
        />
      ) : (
        value.length < 10 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedType("IMAGE")}
              className={cn(selectedType === "IMAGE" && "bg-slate-200")}
            >
              Image
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedType("PDF")}
              className={cn(selectedType === "PDF" && "bg-slate-200")}
            >
              PDF
            </Button>
          </div>
        )
      )}
    </div>
  );
};
