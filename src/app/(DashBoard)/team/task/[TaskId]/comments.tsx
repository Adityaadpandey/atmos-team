import { createCommentOnTask, getCommentsOnTask } from "@/actions/comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/userProvider";
import { Loader2, MessageSquare, Send, XCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const TaskComments = ({ taskId }: { taskId: string }) => {
  const { userData } = useUser() as {
    userData: { avatar: string; name: string; email: string; id: string };
  };

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    loadComments();
  }, [taskId]);

  useEffect(() => {
    // Scroll to bottom when new comments are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [comments]);

  const loadComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedComments = await getCommentsOnTask(taskId);
      setComments(fetchedComments);
    } catch {
      setError("Failed to load comments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.id || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createCommentOnTask({
        taskId,
        text: newComment,
        authorId: userData.id,
      });

      setNewComment("");
      await loadComments();
    } catch {
      setError("Failed to post your comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffDays = Math.floor(
      (now.getTime() - commentDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return commentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return commentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-xl">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Comments
          {comments.length > 0 && (
            <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
              {comments.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col justify-between gap-4 p-0">
        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-500">
            <XCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Comments List */}
        <ScrollArea ref={scrollAreaRef} className="h-80">
          <div className="flex flex-col gap-3 p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span className="text-sm">Loading messages...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <MessageSquare className="h-8 w-8 text-gray-300" />
                <p className="text-sm">No comments yet</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`flex gap-2 ${
                    comment.author.id === userData.id ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={comment.author.imageUrl} />
                    <AvatarFallback className="">
                      {comment.author.firstName?.[0] ||
                        comment.author.username?.[0] ||
                        "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[70%] space-y-1 ${
                      comment.author.id === userData.id
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-3 py-2 ${
                        comment.author.id === userData.id
                          ? "text-blue-400"
                          : "text-white"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{comment.text}</p>
                    </div>
                    <div
                      className={`flex gap-2 text-[10px] text-gray-500 ${
                        comment.author.id === userData.id ? "justify-end" : ""
                      }`}
                    >
                      {comment.author.id !== userData.id && (
                        <span className="font-medium">
                          {comment.author.firstName || comment.author.username}
                        </span>
                      )}
                      <span>{formatTime(comment.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Comment Input */}
        <form onSubmit={handleSubmitComment} className="border-t p-4">
          <div className="relative rounded-lg bg-gray-50 p-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type a message..."
              className="min-h-[40px] resize-none border-none pr-12 focus-visible:ring-0"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !newComment.trim()}
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full p-0"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskComments;
