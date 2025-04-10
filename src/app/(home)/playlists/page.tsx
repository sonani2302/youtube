import { PlaylistView } from "@/modules/playlist/ui/views/playlist-view"
import { HydrateClient } from "@/trpc/server"

const page = async () => {
  return (
    <div>
        <HydrateClient>
            <PlaylistView />
        </HydrateClient>
    </div>
  )
}

export default page
