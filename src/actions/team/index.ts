"use server";

import { db } from "@/lib/db";

export async function createTeam({
  teamName,
  teamMembers,
}: {
  teamName: string;
  teamMembers: string[];
}) {
  const team = await db.team.create({
    data: {
      name: teamName,
      members: {
        connect: teamMembers.map((memberId) => ({
          id: memberId,
        })),
      },
    },
  });

  return team;
}

export async function getTeam(teamId: string) {
  const team = await db.team.findUnique({
    where: {
      id: teamId,
    },
  });

  return team;
}
