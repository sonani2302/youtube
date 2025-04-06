import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

// TODO: Change to videos get many
export type VideoGetOneOutput = inferRouterOutputs<AppRouter>["videos"]["getOne"];
export type VideoGetManyOutput = inferRouterOutputs<AppRouter>["suggestions"]["getMany"];