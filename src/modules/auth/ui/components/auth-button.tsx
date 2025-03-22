"use client"
import { ClapperboardIcon, UserCircleIcon } from "lucide-react"
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"

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
        <UserButton>
            <UserButton.MenuItems>
                {/* TODO: Add user profile menu button*/}
                <UserButton.Link 
                    label="Studio"
                    href="/studio"
                    labelIcon={<ClapperboardIcon className="size-4" />}
                />
                <UserButton.Action label="manageAccount" />
            </UserButton.MenuItems>
        </UserButton>
    </SignedIn>
    </>)
}