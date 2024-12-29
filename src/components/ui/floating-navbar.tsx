"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, JSX } from "react";

interface NavItem {
  name: string;
  link: string;
  icon?: JSX.Element;
}

interface FloatingNavProps {
  navItems: NavItem[];
  className?: string;
}

export const FloatingNav = ({ navItems, className = "" }: FloatingNavProps) => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const { scrollY } = useScroll();

  // Use Framer Motion's built-in scroll handling
  useMotionValueEvent(scrollY, "change", (latest: any) => {
    // Show nav when scrolling up or near the top
    const previous = scrollY.getPrevious();
    setVisible(previous > latest || latest < 10);
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ opacity: 1, y: 0 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className={`fixed inset-x-0 top-10 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-transparent bg-white py-2 pl-8 pr-4 shadow-lg dark:border-white/[0.2] dark:bg-black ${className} `}
      >
        {navItems.map((navItem) => (
          <NavLink
            key={navItem.link}
            item={navItem}
            isActive={pathname === navItem.link}
          />
        ))}

        <AuthSection />
      </motion.nav>
    </AnimatePresence>
  );
};

// Separate NavLink component for better organization
const NavLink = ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
  <Link
    href={item.link}
    className={`relative flex items-center space-x-1 text-sm ${
      isActive
        ? "text-gray-800 dark:text-gray-200"
        : "text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300"
    } `}
  >
    <span className="block sm:hidden">{item.icon}</span>
    <span className="hidden sm:block">{item.name}</span>

    {isActive && (
      <motion.span
        layoutId="activeNav"
        className="w-100 absolute inset-x-0 -bottom-px mx-auto h-px bg-gradient-to-r from-primary from-transparent via-orange-300 to-primary-foreground to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
    )}
  </Link>
);

// Separate AuthSection component for better organization
const AuthSection = () => (
  <>
    <SignedIn>
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonAvatarBox: "h-8 w-8",
            userButton:
              "p-2 border border-neutral-200 dark:border-white/[0.2] rounded-full",
          },
        }}
      />
    </SignedIn>

    <SignedOut>
      <SignInButton>
        <button className="relative rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-black dark:border-white/[0.2] dark:text-white">
          <span>Login</span>
          <motion.span
            className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-red-500 to-transparent"
            animate={{
              opacity: [0.5, 1, 0.5],
              transition: { duration: 2, repeat: Infinity },
            }}
          />
        </button>
      </SignInButton>
    </SignedOut>
  </>
);
