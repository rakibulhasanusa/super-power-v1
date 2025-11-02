"use client";
import { UserIcon, SettingsIcon, BellIcon, LogOutIcon, CreditCardIcon, LogInIcon, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import Link from 'next/link';

const listItems = [
    {
        icon: UserIcon,
        property: 'Profile'
    },
    {
        icon: LogOutIcon,
        property: 'Sign Out'
    }
]

const NavbarAvatar = () => {
    const router = useRouter()
    const { user, isLoading, error, clearCache } = useUser();

    const handleLogout = async () => {
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
        } catch (error) {
            toast.error("Logout failed")
            console.error("Logout error:", error)
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </main>
        )
    }
    return (
        <>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='secondary' size='icon' className='overflow-hidden rounded-full'>
                            <Avatar className="ring-2 ring-green-500 ring-offset-2 ring-offset-background">
                                {/* <AvatarImage src="https://github.com/leerob.png" alt="@leerob" /> */}
                                <AvatarFallback>LR</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-56'>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem >
                                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                                    <Link href="/dashboard/profile">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                    <LogOutIcon className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </DropdownMenuItem>

                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link href="/login">
                    <Button variant={"outline"}>
                        <LogInIcon className="mr-2 h-4 w-4" />
                        Sign In
                    </Button>
                </Link>
            )}
        </>
    )
}

export default NavbarAvatar
