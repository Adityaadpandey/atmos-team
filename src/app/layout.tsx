import MenuOptions from "@/components/globals/app-sidebar";
import { ThemeProvider } from "@/components/globals/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const font = DM_Sans({ subsets: ["latin"] });

export const meta: Metadata = {
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
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex min-h-screen overflow-hidden">
              {/* Fixed Sidebar */}
              <div className="fixed bottom-0 left-0 top-0 w-16 p-4">
                <MenuOptions />
              </div>

              {/* Content Area */}
              <div className="ml-14 h-screen overflow-auto p-6">{children}</div>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
