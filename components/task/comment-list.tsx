import { Comment } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ProfileAvatar } from "../user-avatar";

export interface CommentProps extends Comment {
  user: { id: string; name: string; image: string };
}

export const CommentList = ({ comments }: { comments: CommentProps[] }) => {
  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
        <div key={comment.id} className="space-y-4">
          <div className="flex items-start gap-3">
            <ProfileAvatar
              name={comment.user.name}
              url={comment.user.image || undefined}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
