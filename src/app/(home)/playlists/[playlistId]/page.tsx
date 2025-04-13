import { DEFAULT_LIMIT } from "@/constans";

import { HydrateClient, trpc } from "@/trpc/server";

import { HistoryView } from "@/modules/playlist/ui/views/history-view";
import { VideosView } from "@/modules/playlist/ui/views/videos-view";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ playlistId: string }>
}

const Page = async ({
    params,
}: PageProps) => {
    const { playlistId } = await params;

    void trpc.playlists.getOne.prefetch({ id: playlistId })
    void trpc.playlists.getVideos.prefetchInfinite({playlistId, limit: DEFAULT_LIMIT })

    return(<>
        <HydrateClient>
            <VideosView playlistId={playlistId} />
        </HydrateClient>
    </>);
}

export default Page;