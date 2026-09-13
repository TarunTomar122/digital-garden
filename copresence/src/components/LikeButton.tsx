"use client";

import { useEffect, useRef, useState } from "react";

type LikeButtonProps = {
  id: string;
  type?: "writings" | "blog" | "post" | "project";
};

export default function LikeButton({ id, type = "writings" }: LikeButtonProps) {
  const mapKey = `liked_${type}s`;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pop, setPop] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchLikes = async () => {
      try {
        const res = await fetch(
          `/api/likes?id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}`
        );
        const data = await res.json();
        if (cancelled) return;
        setLikeCount(typeof data.likes === "number" ? data.likes : 0);

        const likedItems = JSON.parse(localStorage.getItem(mapKey) || "{}");
        setLiked(!!likedItems[id]);
      } catch {
        // fail quietly — likes are decoration, not content
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLikes();
    return () => {
      cancelled = true;
    };
  }, [id, type, mapKey]);

  const handleLike = () => {
    const newLiked = !liked;

    const likedItems = JSON.parse(localStorage.getItem(mapKey) || "{}");
    likedItems[id] = newLiked;
    localStorage.setItem(mapKey, JSON.stringify(likedItems));

    setLiked(newLiked);
    setLikeCount((prev) => Math.max(0, prev + (newLiked ? 1 : -1)));
    if (newLiked) {
      setPop(true);
      window.setTimeout(() => setPop(false), 400);
    }

    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            type,
            action: newLiked ? "like" : "unlike",
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (typeof data.likes === "number") setLikeCount(data.likes);
        }
      } catch {
        // keep the optimistic state; next page load will resync
      }
    }, 500);
  };

  return (
    <button
      onClick={handleLike}
      className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1 text-sm leading-none transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-sm ${
        liked
          ? "border-ink bg-ink text-paper"
          : "border-line bg-card text-ink hover:border-line-strong"
      } ${loading ? "opacity-60" : ""}`}
      aria-label={liked ? "Unlike" : "Like"}
      aria-pressed={liked}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        className={`w-3.5 h-3.5 ${pop ? "like-pop" : ""}`}
        strokeWidth={liked ? 0 : 1.5}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span>{likeCount}</span>
    </button>
  );
}
