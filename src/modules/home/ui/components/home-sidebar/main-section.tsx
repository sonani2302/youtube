"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react"

import { useAuth, useClerk } from "@clerk/nextjs"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const items = [
    {
        title: "Home",
        url: "/",
        icon: HomeIcon,
    },
    {
        title: "Subscriptions",
        url: "/feed/subscriptions",
        icon: PlaySquareIcon,
        auth: true,
    },
    {
        title: "Trending",
        url: "/feed/trending",
        icon: FlameIcon,
    },
]


export const MainSection = () => {
    const { isSignedIn } = useAuth();
    const clerk = useClerk();
    const pathname = usePathname();

    return(<>
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                                tooltip={item.title}
                                asChild
                                isActive={pathname === item.url} 
                                onClick={(e) => {
                                    if(!isSignedIn && item.auth) {
                                        e.preventDefault();
                                        return clerk.openSignIn();
                                    }
                                }} 
                            >
                                <Link href={item.url}
                                    className="flex items-center gap-4"
                                >
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>

                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    </>)
}