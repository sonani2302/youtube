import { cn } from "@/lib/utils";

import { cva, VariantProps } from "class-variance-authority";
import { Avatar, AvatarImage } from "./ui/avatar";

const avtarVariants = cva("", {
    variants: {
        size: {
            default: "h-9 w-9",
            xs: "h-4 w-4",
            sm: "h-6 2-6",
            lg: "h-10 w-10",
            xl: "h-[160px] w-[160px]"
        }
    },
    defaultVariants: {
        size: "default"
    },
})

interface UserAvtarProps extends VariantProps<typeof avtarVariants> {
    imageUrl: string;
    name: string;
    className?: string;
    onclick?: () => void
}

export const UserAvtar = ({
    imageUrl,
    name,
    size,
    className,
    onclick
}: UserAvtarProps) => {
    return(<>
        <Avatar className={cn(avtarVariants({ size, className }))} onClick={onclick}>
            <AvatarImage src={imageUrl} alt={name} />
        </Avatar>
    </>)
}   