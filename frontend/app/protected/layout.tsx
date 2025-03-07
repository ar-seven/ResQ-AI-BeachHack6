"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from 'next-themes'; // Ensure this is imported
export default function Layout({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();
    return (
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system" >
        <html lang="en" suppressHydrationWarning>
          <body suppressHydrationWarning>
            <QueryClientProvider client={queryClient}>
              <SidebarProvider>
                <AppSidebar />
                {children}
              </SidebarProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </body>
        </html>
      </ThemeProvider>
  )
}
