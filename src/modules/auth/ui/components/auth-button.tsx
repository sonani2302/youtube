"use client"
import { Button } from "@/components/ui/button"
import { UserCircleIcon } from "lucide-react"
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs"

export const AuthButton = () => {
    // TODO: Add different auth states
    return(<>
    {/* state1 */}
     <SignedOut>
        <SignInButton mode="modal">
            <Button
                variant="outline"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
            > 
                    <UserCircleIcon />
                    Sign in
            </Button>
       </SignInButton>
    </SignedOut>

    {/* state2 */}
    <SignedIn>
        <UserButton/>
        {/* TODO: Add menu items for menu items and user profile */}
    </SignedIn>
    </>)
}