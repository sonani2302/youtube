import { DEFAULT_LIMIT } from "@/constans";
import { HydrateClient, trpc } from "@/trpc/server"

import { StudioView } from "@/modules/studio/ui/views/studio-view";

export const dynamic = 'force-dynamic'

export const Page = async () => {
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return(
    <div>
      <HydrateClient>
        <StudioView />
      </HydrateClient>
    </div>
 )
}

export default Page;