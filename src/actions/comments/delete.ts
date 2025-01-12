"use server";

import { db } from "@/lib/db";

export const deleteComment = async (commentId: string) => {
  try {
    const comment = await db.comment.delete({
      where: { id: commentId },
    });
    return comment;
  } catch {
    throw new Error("Failed to delete the comment. Please try again.");
  }
};
//   );
