import { HistoryVideosSection } from "../section/history-videos-section";
import { PlaylistHeaderSection } from "../section/playlist-header-section";
import { VideosSection } from "../section/videos-section";

interface PageProps {
    playlistId: string;
}


export const VideosView = ({
    playlistId
}: PageProps) => {
    return(<>
        <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
            <PlaylistHeaderSection playlistId={playlistId} />
            <VideosSection playlistId={playlistId} />
        </div>
    </>)
}