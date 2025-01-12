// layout.tsx
import { ThemeProvider } from "@/components/globals/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/hooks/Alert-Provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/globals/sidebar/appSidebar";
import { UserProvider } from "@/hooks/userProvider";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My App",
  description: "A description of my app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${font.className} overflow-x-hidden`}>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <AlertProvider>
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarTrigger className="" />
                  <div className="h-full w-full max-w-full px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                  </div>
                </SidebarProvider>
              </AlertProvider>
            </ThemeProvider>
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
