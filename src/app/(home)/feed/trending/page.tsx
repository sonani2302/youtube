import { DEFAULT_LIMIT } from "@/constans";
import { TrendingView } from "@/modules/home/ui/views/trending-view";
import { HydrateClient, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic";

export const Page = async () => {
  void trpc.videos.getManyTrending.prefetch({ limit: DEFAULT_LIMIT });

  return(
    <div>
      <HydrateClient>
        <TrendingView />
      </HydrateClient>
    </div>
 )
}

export default Page;