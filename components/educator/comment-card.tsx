"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CommentForm } from "@/components/educator/comment-form";

export type Comment = {
  author: string;
  date: string;
  body: string;
};

export type CommentCardProps = {
  sessionId: string;
  currentAuthor: string;
  initialComments: Comment[];
};

function todayLabel() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function CommentCard({
  sessionId,
  currentAuthor,
  initialComments,
}: CommentCardProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const onAdd = (body: string) => {
    // TODO(Stage D): POST /sessions/{sessionId}/comments + refetch list
    void sessionId;
    setComments((prev) => [
      ...prev,
      { author: currentAuthor, date: todayLabel(), body },
    ]);
  };

  return (
    <Card className="flex flex-col gap-3.5">
      <h2 className="text-[15px] font-semibold text-foreground">코멘트</h2>
      <div className="h-px bg-border" />

      {comments.length === 0 ? (
        <p className="text-[13px] text-fg-subtle">
          아직 등록된 코멘트가 없어요
        </p>
      ) : (
        comments.map((c, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-[13px] font-medium text-foreground">
                {c.author}
              </span>
              <span className="text-label-sm font-normal text-fg-subtle tracking-normal">
                {c.date}
              </span>
            </div>
            <p className="text-[13px] text-fg-muted leading-5 whitespace-pre-wrap">
              {c.body}
            </p>
          </div>
        ))
      )}

      <div className="h-px bg-border" />

      <CommentForm onSubmit={onAdd} />
    </Card>
  );
}
