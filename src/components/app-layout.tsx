'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Header } from '@/components/header';
import { Logo } from '@/components/icons/logo';
import { Home, PlusCircle, User, List, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Ontdek', icon: Home },
    { href: '/my-activities', label: 'Activiteiten', icon: List },
    { href: '/create-activity', label: 'Aanmaken', icon: PlusCircle },
    { href: '/chats', label: 'Chats', icon: MessageSquare },
    { href: '/profile', label: 'Profiel', icon: User },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/">
                <Logo />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                 <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/')}
                      tooltip={{ children: item.label }}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             {/* Can add footer items here if needed */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-background">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">{children}</main>
        </SidebarInset>
      </div>
      <BottomNavBar />
    </SidebarProvider>
  );
}


function BottomNavBar() {
    const pathname = usePathname();
  
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border shadow-t-lg z-20">
        <nav className="flex justify-around items-center h-full">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
                "flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors",
                (pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/')) ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}>
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    );
  }
  
