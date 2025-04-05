import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const subscriptionsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({ userId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { userId } = input;

            if(userId === ctx.user.id) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }

            const [createdSubscriptions] = await db
                .insert(subscriptions)
                .values({ viewerId: ctx.user.id, creatorId: userId })
                .returning()

            return createdSubscriptions;
        }
    ),
    remove: protectedProcedure
        .input(z.object({ userId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { userId } = input;

            if(userId === ctx.user.id) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }

            const [deletedSubscriptions] = await db
                .delete(subscriptions)
                .where(
                    and(
                        eq(subscriptions.viewerId, ctx.user.id),
                        eq(subscriptions.creatorId, userId)
                    )
                )
                .returning();

            return deletedSubscriptions;
        }
    ),
});