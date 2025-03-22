import { VideosSection } from "../sections/videos-section";

export const StudioView = () => {
    return(<>
        <div>
            <div className="fkex flex-col gap-y-6 pt-2.5">
                <h1 className="text-2xl font-bold">Channel Content</h1>
                <p className="text-sx text-muted-foreground">Manage your channel content and videos</p>
            </div>
            <VideosSection />
        </div>
    </>)
}