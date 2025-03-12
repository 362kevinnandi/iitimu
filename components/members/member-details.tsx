import { Trash2Icon, UserRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  removeUserFromWorkspace,
  updateProjectAccess,
  updateUserAccessLevel,
} from "@/app/actions/workspace";
import { useConfirmation } from "@/hooks/use-confirmation";
import { WorkspaceMembersProps } from "@/utils/types";
import { $Enums, AccessLevel } from "@prisma/client";

import { ConfirmationDialog } from "../confirmation-dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { ProfileAvatar } from "../user-avatar";

interface ProjectProps {
  id: string;
  name: string;
}

export const MemberDetails = ({
  selectedMember,
  projects,
  setSelectedMember,
}: {
  selectedMember: WorkspaceMembersProps;
  projects: ProjectProps[];
  setSelectedMember: (member: WorkspaceMembersProps | null) => void;
}) => {
  const router = useRouter();

  const [assignedProjects, setAssignedProjects] = useState<string[]>(
    selectedMember.projectAccess
      .filter((p) => p.hasAccess)
      .map((p) => p.projectId)
  );

  const { isOpen, confirm, handleConfirm, handleCancel, confirmationOptions } =
    useConfirmation();

  const [isPending, setIsPending] = useState(false);

  const handleRemoveUser = async () => {
    confirm({
      title: "Remove workspace member",
      message:
        "This action cannot be undone. This will permanently remove this user from your workspace.",
      onConfirm: async () => {
        try {
          setIsPending(true);
          await removeUserFromWorkspace(
            selectedMember.workspaceId,
            selectedMember.id
          );
          toast.success("The user has been removed from your workspace");
          setSelectedMember(null);
          router.refresh();
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to remove user"
          );
        } finally {
          setIsPending(false);
        }
      },
    });
  };

  const handleSaveChanges = async () => {
    try {
      setIsPending(true);
      await updateProjectAccess(
        selectedMember.workspaceId,
        selectedMember.id,
        assignedProjects
      );

      setSelectedMember({
        ...selectedMember,
        projectAccess: assignedProjects.map((p) => ({
          id: p,
          projectId: p,
          hasAccess: true,
        })),
      });
      router.refresh();
      toast.success("Project access updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update project access"
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleChangeAccessLevel = async (accessLevel: $Enums.AccessLevel) => {
    try {
      setIsPending(true);
      await updateUserAccessLevel(
        selectedMember.workspaceId,
        selectedMember.id,
        accessLevel
      );
      setSelectedMember({
        ...selectedMember,
        accessLevel,
      });
      router.refresh();
      toast.success("Access level updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update access level"
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 md:pl-6">
      <Card>
        <CardHeader>
          <CardTitle>Member Details</CardTitle>
          <CardDescription>
            View and manage {selectedMember.user.name}'s access and projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <ProfileAvatar
                name={selectedMember.user.name}
                url={selectedMember.user.image}
              />

              <div>
                <p className="font-semibold">{selectedMember.user.name}</p>
                <p className="text-xs md:text-sm text-gray-500 line-clamp-1">
                  {selectedMember.user.email}
                </p>
                <Badge variant={selectedMember.accessLevel}>
                  {selectedMember.accessLevel}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size={"sm"} variant="outline">
                    <UserRoundIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex flex-col gap-2 w-36"
                  align="end"
                >
                  {Object.keys(AccessLevel).map((level) => (
                    <Button
                      key={level}
                      size={"sm"}
                      variant={
                        selectedMember.accessLevel === level
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleChangeAccessLevel(level as $Enums.AccessLevel)
                      }
                    >
                      {level}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>

              <Button
                onClick={handleRemoveUser}
                disabled={isPending}
                size={"sm"}
                variant="destructive"
              >
                <Trash2Icon />
                <span className="hidden 2xl:flex">Remove User</span>
              </Button>
            </div>
          </div>

          <Separator />
          <div>
            <Label>Assigned Projects</Label>
            <div className="border rounded-lg overflow-hidden mt-2">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      Project
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      Access
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects?.map((project) => (
                    <tr key={project.id} className="border-t">
                      <td className="px-4 py-2">{project.name}</td>
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={assignedProjects.includes(project.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignedProjects((prev) => [
                                ...prev,
                                project.id,
                              ]);
                            } else {
                              setAssignedProjects(
                                assignedProjects.filter((p) => p !== project.id)
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isPending}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={confirmationOptions?.title || ""}
        message={confirmationOptions?.message || ""}
      />
    </div>
  );
};
