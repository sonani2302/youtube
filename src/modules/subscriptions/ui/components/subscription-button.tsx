import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface SubscriptionButtonProps{
    onclick: ButtonProps["onClick"];
    disabled: boolean;
    isSubscribed: boolean;
    className?: string;
    size?: ButtonProps["size"];
}

export const SubscriptionButton = ({
    onclick,
    disabled,
    isSubscribed,
    className,
    size
}: SubscriptionButtonProps) => {
    return(<>
        <Button
            size={size}
            variant={isSubscribed ? "secondary": "default"}
            className={cn("rounded-full", className)}
            onClick={onclick}
            disabled={disabled}
        >
            {isSubscribed ? "Unsubscribe": "Subscribe"}
        </Button>
    </>)
}