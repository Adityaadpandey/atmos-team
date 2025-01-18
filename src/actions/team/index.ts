"use server";

import { db } from "@/lib/db";

// Function to create a new team with a name and members
export async function createTeam({
  teamName, // Name of the team to be created
  teamMembers, // List of member IDs to be added to the team
}: {
  teamName: string;
  teamMembers: string[];
}) {
  // Create a new team in the database and connect members by their IDs
  const team = await db.team.create({
    data: {
      name: teamName, // Set the team name
      members: {
        connect: teamMembers.map((memberId) => ({
          id: memberId, // Connect each member by their ID
        })),
      },
    },
  });

  return team; // Return the created team
}

// Function to retrieve a team by its ID
export async function getTeam(teamId: string) {
  // Find the team in the database by its ID
  const team = await db.team.findUnique({
    where: {
      id: teamId, // Specify the team ID to find
    },
  });

  return team; // Return the found team
}
