"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, MessageSquareDashed } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CommentForm } from "@/components/educator/comment-form";
import {
  commentKeys,
  commentsApi,
  educatorName,
  formatCommentDate,
} from "@/lib/api/comments";

export type CommentCardProps = {
  sessionId: number;
  /** Set to omit the input form (learner read-only view). */
  readOnly?: boolean;
  /** Educator currently logged in. Required when not readOnly. */
  currentEducatorId?: number;
  /** Display name of the logged-in educator. */
  currentEducatorName?: string;
  title?: string;
};

export function CommentCard({
  sessionId,
  readOnly,
  currentEducatorId,
  currentEducatorName,
  title = readOnly ? "교수자 코멘트" : "코멘트",
}: CommentCardProps) {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: commentKeys.list(sessionId),
    queryFn: () => commentsApi.list(sessionId),
    enabled: Number.isFinite(sessionId),
  });

  const addMutation = useMutation({
    mutationFn: (content: string) => {
      if (currentEducatorId == null) {
        return Promise.reject(new Error("missing educator id"));
      }
      return commentsApi.add(sessionId, {
        content,
        educator_id: currentEducatorId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(sessionId),
      });
    },
  });

  const comments = commentsQuery.data ?? [];

  return (
    <Card className="flex flex-col gap-3.5">
      <div className="flex items-center gap-1.5">
        <MessageSquare className="h-4 w-4 shrink-0 text-navy-700" aria-hidden />
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        {comments.length > 0 && (
          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-muted px-1.5 text-label-sm font-medium text-fg-muted">
            {comments.length}
          </span>
        )}
      </div>
      <div className="h-px bg-border" />

      {commentsQuery.isLoading ? (
        <div className="flex items-center gap-2 text-[13px] text-fg-muted">
          <Spinner size={14} /> 코멘트를 불러오고 있어요
        </div>
      ) : commentsQuery.isError ? (
        <p className="text-[13px] text-danger">
          코멘트를 불러오지 못했어요.
        </p>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center text-fg-subtle">
          <MessageSquareDashed className="h-6 w-6" aria-hidden />
          <p className="text-[13px]">아직 등록된 코멘트가 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((c) => {
            const name = c.educator_name || educatorName(c.educator_id);
            return (
              <div key={c.id} className="flex gap-2.5">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-50 text-[12px] font-semibold text-navy-800"
                >
                  {(name.trim()[0] || "교").toUpperCase()}
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[13px] font-medium text-foreground">
                      {name}
                    </span>
                    <span className="text-label-sm font-normal text-fg-subtle tracking-normal">
                      · {formatCommentDate(c.created_at)}
                    </span>
                  </div>
                  <p className="text-[13px] text-fg-muted leading-5 whitespace-pre-wrap">
                    {c.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!readOnly && (
        <>
          <div className="h-px bg-border" />
          <CommentForm onSubmit={(text) => addMutation.mutate(text)} />
          {addMutation.isError && (
            <p className="text-label-sm text-danger tracking-normal">
              코멘트를 등록할 수 없어요. 잠시 후 다시 시도해 주세요.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
