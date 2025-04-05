import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquareDotIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { UserAvtar } from "@/components/user-avtar";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuTrigger,
    DropdownMenuContent, 
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";

import { CommentsGetManyOutput } from "../../types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

interface CommentItemProps {
    comment: CommentsGetManyOutput["items"][number];
};

export const CommentItem = ({
    comment,
}: CommentItemProps) => {
    const { userId } = useAuth();

    const clerk = useClerk();
    const utils = trpc.useUtils();
    const remove = trpc.comments.remove.useMutation({
        onSuccess: () => {
            toast.success("Comment deleted");
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            toast.error("Something went wrong")
            if(error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }

    });

    return(<>
        <div>
            <div className="flex gap-4">
                <Link href={`users/${comment.userId}`}>
                    <UserAvtar 
                        size={"lg"}
                        imageUrl={comment.user.imageUrl}
                        name={comment.user.name}
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={`/users/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm pb=0.5">
                                {comment.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.createdAt, {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm">{comment.value}</p>
                    {/* Todo: Reactions */}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size="icon" className="size-8">
                                <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
                            <MessageSquareDotIcon className="size-4" />
                            Reply
                        </DropdownMenuItem>
                        {comment.user.clerkId === userId && (
                            <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                                <Trash2Icon className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => {}}>
                            <MessageSquareDotIcon className="size-4" />
                            Reply
                        </DropdownMenuItem>
                    </DropdownMenuContent>

                </DropdownMenu>
            </div>
        </div>
    </>)
} 