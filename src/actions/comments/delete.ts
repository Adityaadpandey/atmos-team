"use server";

import { db } from "@/lib/db";

export const deleteComment = async (commentId: string) => {
  try {
    // Delete the comment from the database using the provided comment ID
    const comment = await db.comment.delete({
      where: { id: commentId }, // Specify the comment to delete by its ID
    });

    return comment; // Return the deleted comment details
  } catch {
    // Handle any errors that occur during the deletion process
    throw new Error("Failed to delete the comment. Please try again.");
  }
};
