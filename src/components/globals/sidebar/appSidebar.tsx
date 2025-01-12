"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  ChartBarBig,
  Command,
  GalleryVerticalEnd,
  Map,
  Home,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getLatestTask } from "@/actions/cron-tasks";

const TEAMS = [
  { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
  { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
  { name: "Evil Corp.", logo: Command, plan: "Free" },
];

const initialNavMain = [
  {
    title: "Dashboard",
    url: "/team",
    icon: SquareTerminal,
    isActive: true,
    items: [
      { title: "Team", url: "/team" },
      { title: "Personal", url: "/personal" },
      { title: "Assigned", url: "/assigned" },
    ],
  },
  {
    title: "Recent Task",
    url: "#",
    isActive: true,
    icon: BookOpen,
    items: [],
  },
  // {
  //   title: "Todays Tasks",
  //   url: "/today-task",
  //   isActive: true,
  //   icon: Bot,
  //   items: [
  //     { title: "View", url: "#" },
  //     { title: "Add", url: "#" },
  //   ],
  // },
];

const PROJECTS = [
  { name: "Time Line", url: "/today-task", icon: ChartBarBig },
  { name: "Home", url: "/", icon: Home },
  { name: "Mail", url: "#", icon: Map },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navMain, setNavMain] = React.useState(initialNavMain);

  React.useEffect(() => {
    const populateNavMain = async () => {
      const latestTasks = await getLatestTask();
      const topThreeTasks = latestTasks.slice(0, 3);
      const recentOnes = topThreeTasks.map((task) => ({
        title: task.title,
        url: `/team/task/${task.id}`, // Create URL using the task's id
      }));

      setNavMain((prevNavMain) => {
        const updatedNavMain = [...prevNavMain];
        updatedNavMain[1].items = recentOnes;
        return updatedNavMain;
      });
    };

    populateNavMain();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={TEAMS} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={PROJECTS} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
