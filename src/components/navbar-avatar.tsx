"use client";

import { UserIcon, LogOutIcon, LogInIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/user-context';
import { useState, useCallback } from 'react';
import { AvatarImage } from '@radix-ui/react-avatar';

const NavbarAvatar = () => {
    const router = useRouter()
    const { user, isLoading, clearCache } = useUser();
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = useCallback(async () => {
        if (isLoggingOut) return; // Prevent double-click

        setIsLoggingOut(true)
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("Logout failed")
            }

            clearCache()
            toast.success("Logged out successfully")
            router.push("/login")
            router.refresh()
        } catch (error) {
            toast.error("Logout failed")
            console.error("Logout error:", error)
        } finally {
            setIsLoggingOut(false)
        }
    }, [isLoggingOut, clearCache, router])

    // Get user initials for avatar
    const getUserInitials = useCallback(() => {
        if (!user?.name) return user?.email?.substring(0, 2).toUpperCase() || 'U'
        const names = user.name.split(' ')
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase()
        }
        return user.name.substring(0, 2).toUpperCase()
    }, [user])

    if (isLoading) {
        return (
            <Button variant='secondary' size='icon' className='overflow-hidden rounded-full' disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
        )
    }

    if (!user?.email) {
        return (
            <Link href="/login">
                <Button variant="outline">
                    <LogInIcon className="mr-2 h-4 w-4" />
                    Sign In
                </Button>
            </Link>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='secondary' size='icon' className='overflow-hidden cursor-pointer rounded-full'>
                    <Avatar className="ring-2 ring-green-500 ring-offset-2 ring-offset-background">
                        <AvatarImage src={"https://github.com/shadcn.png"} alt={user?.name || 'User Avatar'} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center cursor-pointer">
                            <UserIcon className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="cursor-pointer"
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing out...
                            </>
                        ) : (
                            <>
                                <LogOutIcon className="mr-2 h-4 w-4" />
                                Sign Out
                            </>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NavbarAvatar