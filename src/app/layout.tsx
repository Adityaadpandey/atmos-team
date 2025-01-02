// layout.tsx
import MenuOptions from "@/components/globals/app-sidebar";
import { ThemeProvider } from "@/components/globals/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import ClientLayout from "./client-layout";
import "./globals.css";

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
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
