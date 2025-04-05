"use client"

import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constans";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";

interface CommentsSection{
    videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSection) => {
    return(<>
        <Suspense fallback={<CommentsSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    </>)
}

export const CommentsSectionSkeleton = () => {
    return(<>
        <div className="mt-6 flex justify-center items-center">
            <Loader2Icon className="text-muted-foreground size-7 animate-spin" />
        </div>
    </>)
}

export const CommentsSectionSuspense = ({ videoId }: CommentsSection) => {
    const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery({ 
        videoId,
        limit: DEFAULT_LIMIT
     }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
     });

    return(<>
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                <h1 className="text-xl font-bold">
                    {comments.pages[0].totalCount} Comments
                </h1>
                <CommentForm videoId={videoId} />
                <div className="flex flex-col gap-4 mt-4">
                    {comments.pages.flatMap((page) => page.items).map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                        />
                    ))}
                    <InfiniteScroll 
                        hasNextPage={query.hasNextPage}
                        isFetchingNextPage={query.isFetchingNextPage}
                        fetchNextPage={query.fetchNextPage}
                    />
                </div>
            </div>
        </div>
    </>)
};