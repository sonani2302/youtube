"use client"

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useAuth, useClerk } from "@clerk/nextjs"
import {  HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react"
import Link from "next/link"

const items = [
    {
        title: "History",
        url: "/playlists/history",
        icon: HistoryIcon,
        auth: true
    },
    {
        title: "Liked videos",
        url: "/playlists/liked",
        icon: ThumbsUpIcon,
        auth: true
    },
    {
        title: "All playlists",
        url: "/playlists",
        icon: ListVideoIcon,
        auth:true
    },
]

export const PersonalSection = () => {
    const { isSignedIn } = useAuth();
    const clerk = useClerk();

    return(<>
        <SidebarGroup>
            <SidebarGroupLabel>You</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                                tooltip={item.title}
                                asChild
                                isActive={false} //TODO: Change to look at current path name
                                onClick={(e) => {
                                    if(!isSignedIn && item.auth) {
                                        e.preventDefault();
                                        return clerk.openSignIn();
                                    }
                                }} //TODO: Do something on click
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