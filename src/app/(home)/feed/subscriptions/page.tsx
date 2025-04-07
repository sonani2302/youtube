import { DEFAULT_LIMIT } from "@/constans";
import { HydrateClient, trpc } from "@/trpc/server"
import { TrendingView } from "@/modules/home/ui/views/trending-view";
import { SubscribedView } from "@/modules/home/ui/views/subscribed-view";

export const dynamic = "force-dynamic";

export const Page = async () => {
  void trpc.videos.getManySubscribed.prefetch({ limit: DEFAULT_LIMIT });

  return(
    <div>
      <HydrateClient>
        <SubscribedView />
      </HydrateClient>
    </div>
 )
}

export default Page;