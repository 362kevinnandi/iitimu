import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface AttachmentProps {
  name: string;
  type: string;
  url: string;
}
export const TaskAttachments = ({
  attachments,
}: {
  attachments: AttachmentProps[];
}) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {attachments?.map((file) => (
            <div className="relative group cursor-pointer" key={file.url}>
              {/* <img
                src={file.type === "IMAGE" ? file.url : "/pdf.png"}
                alt="Attachment"
                className="w-full h-32 object-contain rounded-lg"
              /> */}
              <Image
                src={file.type === "PDF" ? "/pdf.png" : file.url}
                alt={"attachment "}
                width={80}
                height={128}
                className="w-full  h-32 object-contain rounded-lg"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <span className="text-white text-sm">View</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {attachments?.length === 0 && (
          <div className="flex items-center justify-center h-20">
            <p className="text-sm text-muted-foreground">
              No attachments found
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
