"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeToggle } from "@/components/globals/theme-toggle";
import Category from "@/components/icons/category";
import Home from "@/components/icons/home";
import Payment from "@/components/icons/payment";
import Settings from "@/components/icons/settings";
import Workflows from "@/components/icons/workflows";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import clsx from "clsx";
import { Database, GitBranch, LucideMousePointerClick } from "lucide-react";

const menuOptions = [
  { name: "Dashboard", Component: Home, href: "/team" },
  { name: "Workflows", Component: Workflows, href: "/workflows" },
  { name: "Settings", Component: Settings, href: "/settings" },
  { name: "Connections", Component: Category, href: "/connections" },
  { name: "Billing", Component: Payment, href: "/billing" },
  //   { name: 'Templates', Component: Templates, href: '/templates' },
  //   { name: 'Logs', Component: Logs, href: '/logs' },
];

const MenuOptions = () => {
  const pathName = usePathname();

  return (
    <nav className="flex max-h-screen flex-col items-center justify-between">
      <div className="fixed flex flex-col items-center justify-center gap-5">
        <Link
          className="-pl-2 z-10 -mb-[23px] flex flex-row text-center text-sm font-bold text-[#9c4bff] dark:text-[#cea5ff]"
          href="/"
        >
          {"Arc Atmos"}
        </Link>
        <Separator className="h-[1.25px] bg-[#c596ff63] dark:bg-[#b77dff63]" />
        <TooltipProvider>
          {menuOptions.map((menuItem) => (
            <ul key={menuItem.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        "group flex h-8 w-8 scale-[1.5] cursor-pointer items-center justify-center rounded-lg p-[3px]",
                        {
                          "bg-[#EEE0FF] dark:bg-[#2F006B]": pathName.startsWith(
                            menuItem.href,
                          ),
                        },
                      )}
                    >
                      <menuItem.Component
                        selected={pathName.startsWith(menuItem.href)}
                      />
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-black/10 backdrop-blur-xl"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </ul>
          ))}
        </TooltipProvider>
        {/* <Separator /> */}

        <div className="relative">
          <div className="flex max-h-[220px] flex-col items-center gap-9 overflow-scroll rounded-full border-[1px] px-2 py-4 dark:bg-[#353346]/30">
            <div className="relative rounded-full border-[1px] p-2 dark:border-t-[2px] dark:border-t-[#353346] dark:bg-[#353346]/70">
              <LucideMousePointerClick className="dark:text-white" size={18} />
              <div className="absolute -bottom-[30px] left-1/2 h-6 translate-x-[-50%] transform border-l-2 border-muted-foreground/50" />
            </div>
            <div className="relative rounded-full border-[1px] p-2 dark:border-t-[2px] dark:border-t-[#353346] dark:bg-[#353346]/70">
              <GitBranch className="text-muted-foreground" size={18} />
              <div className="absolute -bottom-[30px] left-1/2 h-6 translate-x-[-50%] transform border-l-2 border-muted-foreground/50"></div>
            </div>
            <div className="relative rounded-full border-[1px] p-2 dark:border-t-[2px] dark:border-t-[#353346] dark:bg-[#353346]/70">
              <Database className="text-muted-foreground" size={18} />
              <div className="absolute -bottom-[30px] left-1/2 h-6 translate-x-[-50%] transform border-l-2 border-muted-foreground/50"></div>
            </div>
            <div className="relative rounded-full border-[1px] p-2 dark:border-t-[2px] dark:border-t-[#353346] dark:bg-[#353346]/70">
              <GitBranch className="text-muted-foreground" size={18} />
            </div>
          </div>
          {/* <Separator /> */}
        </div>
      </div>
      <div className="fixed bottom-0 my-2 flex flex-col gap-5 rounded-full border-[1px] p-2 py-2 dark:bg-[#353346]/30">
        <ModeToggle />

        <div className="flex items-center justify-center">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8",
                userButton:
                  " border border-neutral-200 dark:border-white/[0.2] rounded-full",
              },
            }}
          />
          {/* <User className="text-muted-foreground" size={18} /> */}
        </div>
      </div>
    </nav>
    // </Card>
  );
};

export default MenuOptions;
