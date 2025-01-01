import MenuOptions from "@/components/globals/app-sidebar";
import { ThemeProvider } from "@/components/globals/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/globals/navbar";

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
            <main>
              <Navbar />
              <div className="flex h-screen overflow-hidden">
                <MenuOptions />
                <div className="w-full">{children}</div>
              </div>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
