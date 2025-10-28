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
import { Button } from '@/components/ui/button';
import { Home, PlusCircle, User, List } from 'lucide-react';

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
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/'}
                  tooltip={{ children: 'Ontdek' }}
                >
                  <Link href="/">
                    <Home />
                    <span>Ontdek</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/my-activities'}
                  tooltip={{ children: 'Mijn Activiteiten' }}
                >
                  <Link href="/my-activities">
                    <List />
                    <span>Mijn Activiteiten</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/create-activity'}
                  tooltip={{ children: 'Activiteit Aanmaken' }}
                >
                  <Link href="/create-activity">
                    <PlusCircle />
                    <span>Activiteit Aanmaken</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/profile'}
                  tooltip={{ children: 'Profiel' }}
                >
                  <Link href="/profile">
                    <User />
                    <span>Profiel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             {/* Can add footer items here if needed */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-background">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
