'use client'

import { Sidebar } from '@/components/shared/sidebar'
import { SidebarProvider, useSidebar } from '@/components/dashboard/sidebar-context'
import { cn } from '@/lib/utils'

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { collapsed } = useSidebar()

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main
                className={cn(
                    'transition-all duration-300',
                    collapsed ? 'lg:pl-16' : 'lg:pl-64'
                )}
            >
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardContent>
                {children}
            </DashboardContent>
        </SidebarProvider>
    )
}
