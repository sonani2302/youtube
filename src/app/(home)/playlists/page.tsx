import { DEFAULT_LIMIT } from "@/constans"
import { HydrateClient, trpc } from "@/trpc/server"
import { PlaylistView } from "@/modules/playlist/ui/views/playlist-view"

export const dynamic = "force-dynamic";

const page = async () => {
  void trpc.playlists.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT})

  return (
    <div>
        <HydrateClient>
            <PlaylistView />
        </HydrateClient>
    </div>
  )
}

export default page
