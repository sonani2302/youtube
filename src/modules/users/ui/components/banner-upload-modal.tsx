import { trpc } from "@/trpc/client";
import { UploadDropzone } from "@/lib/uploadthing";
import { ResponsiveModal } from "@/components/responsive-modal";

interface BannerUploadModalProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const BannerUploadModal = ({
    userId,
    open,
    onOpenChange
}: BannerUploadModalProps) => {
    const utils = trpc.useUtils();

    const onUploadComplete = () => {
        utils.studio.getMany.invalidate();
        utils.users.getOne.invalidate({ id: userId });
        onOpenChange(false);
    }

    return (<>
        <ResponsiveModal
            title="uplaod a banner"
            open={open}
            onOpenChange={onOpenChange}

        >
            <UploadDropzone 
                endpoint="bannerUploader"
                onClientUploadComplete={onUploadComplete}
            />
        </ResponsiveModal>
    </>)
}