import { z } from 'zod'
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";

import { db } from "@/db";
import { users, videoReactions, videos, videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const playlistsRouter = createTRPCRouter({
    getHistory: protectedProcedure
        .input(
            z.object({
                cursor: z.object({
                    id: z.string().uuid(),
                    viewedAt: z.date(),
                })
                .nullish(),
                limit: z.number().min(1).max(100),
            })
        )
        .query( async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { cursor, limit } = input;

            const viewerVideoViews = db.$with("viewer_video_views").as(
                db
                    .select({
                        videoId: videoViews.videoId,
                        viewedAt: videoViews.updatedAt,
                    })
                    .from(videoViews)
                    .where(eq(videoViews.userId, userId))

            )
    
            const data = await db
                .with(viewerVideoViews)
                .select({
                    ...getTableColumns(videos),
                    user: users,
                    viewedAt: viewerVideoViews.viewedAt,
                    viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
                    likeCount: db.$count(videoReactions, and(
                        eq(videoReactions.videoId, videos.id),
                        eq(videoReactions.type, "like"),
                    )),
                    dilikeCount: db.$count(videoReactions, and(
                        eq(videoReactions.videoId, videos.id),
                        eq(videoReactions.type, "dislike"),
                    )),
                })
                .from(videos)
                .innerJoin(users, eq(videos.userId, users.id))
                .innerJoin(viewerVideoViews, eq(videos.id, viewerVideoViews.videoId))
                .where(and(
                    eq(videos.visibility, "public"),
                    cursor  
                        ? or (
                            lt(viewerVideoViews.viewedAt, cursor.viewedAt),
                            and(
                                eq(viewerVideoViews.viewedAt, cursor.viewedAt),
                                lt(videos.id, cursor.id)
                            )
                        )
                    : undefined,
                )).orderBy(desc(viewerVideoViews.viewedAt), desc(videos.id))
                // Add 1 to the limit to check if we there is more data
                .limit(limit + 1)
    
            const hasMore = data.length > limit;
    
            //remove the last item if there is more data
            const items = hasMore ? data.slice(0, -1): data;
    
            //set the next cursor to the last item if there is more data
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore
                ?{
                    id: lastItem.id,
                    viewedAt: lastItem.updatedAt,
                }
                :null
    
            return {
                items,
                nextCursor,
            };
        }),
})