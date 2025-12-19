"use client";

import { useEffect, useRef, useState } from "react";

type LikeButtonProps = {
  id: string;
  type?: "writings" | "blog" | "post" | "project";
};

export default function LikeButton({ id, type = "writings" }: LikeButtonProps) {
  // Keep the previous behavior: store a map per type in localStorage
  const mapKey = `liked_${type}s`; // e.g. liked_posts, liked_projects, liked_writingss
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/likes?id=${encodeURIComponent(id)}&type=${encodeURIComponent('writings')}`);
        const data = await res.json();
        console.log("Fetched likes:", data);
        setLikeCount(typeof data.likes === "number" ? data.likes : 0);

        const likedItems = JSON.parse(localStorage.getItem(mapKey) || "{}");
        setLiked(!!likedItems[id]);
      } catch (e) {
        console.error("Failed to fetch likes:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLikes();
  }, [id, type, mapKey]);

  const updateServer = async (newLiked: boolean) => {
    const didIChangeSomething = localStorage.getItem("didIChangeSomething") === "true";
    if (!didIChangeSomething) return false;
    localStorage.setItem("didIChangeSomething", "false");

    const response = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type, action: newLiked ? "like" : "unlike" }),
    });

    if (!response.ok) {
      console.error("Failed to update likes:", response.statusText);
      // revert local map if server call failed
      const likedItems = JSON.parse(localStorage.getItem(mapKey) || "{}");
      likedItems[id] = !newLiked;
      localStorage.setItem(mapKey, JSON.stringify(likedItems));
    } else {
      try {
        const data = await response.json();
        if (typeof data.likes === "number") setLikeCount(data.likes);
      } catch {}
    }
    return true;
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLoading(true);

    const likedItems = JSON.parse(localStorage.getItem(mapKey) || "{}");
    likedItems[id] = newLiked;
    localStorage.setItem(mapKey, JSON.stringify(likedItems));

    setLikeCount((prev) => prev + (newLiked ? 1 : -1));
    setLiked(newLiked);

    const didIChange = localStorage.getItem("didIChangeSomething") === "true";
    localStorage.setItem("didIChangeSomething", didIChange ? "false" : "true");

    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(async () => {
      await updateServer(newLiked);
    }, 500);

    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer rounded-full transition-all duration-300 ease-in-out self-start border
        ${liked ? "bg-foreground text-background" : "bg-transparent text-foreground border-foreground/30"}
        ${loading ? "opacity-50" : ""}`}
      aria-label={liked ? "Unlike" : "Like"}
      disabled={loading}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        className={`w-4 h-4 transition-transform duration-300 ease-in-out ${loading ? "opacity-70" : ""}`}
        strokeWidth={liked ? 0 : 1.5}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className="text-xs font-light tracking-wide">{likeCount}</span>
    </button>
  );
}


