'use client';

import { useState, useEffect, useRef } from 'react';

interface LikeButtonProps {
    id: string;
    type: 'post' | 'project';
}

export default function LikeButton({ id, type }: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const timeoutId = useRef<NodeJS.Timeout | null>(null); // Reference to store timeout ID

    // Fetch initial like count and status from the server or localStorage
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await fetch(`/api/likes?id=${id}&type=${type}`);
                const data = await response.json();
                setLikeCount(data.likes || 0);
                
                // Check if user has already liked
                const likedItems = JSON.parse(localStorage.getItem(`liked_${type}s`) || '{}');
                setLiked(!!likedItems[id]);
            } catch (error) {
                console.error('Failed to fetch likes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikes();
    }, [id, type]);

    // Handle like button click
    const handleLike = () => {
        if (loading) return; // Prevent click if already loading

        const newLiked = !liked;
        
        // Optimistic UI update: Update immediately
        setLiked(newLiked);
        setLikeCount((prev) => prev + (newLiked ? 1 : -1));

        // Update localStorage for immediate feedback
        const likedItems = JSON.parse(localStorage.getItem(`liked_${type}s`) || '{}');
        likedItems[id] = newLiked;
        localStorage.setItem(`liked_${type}s`, JSON.stringify(likedItems));

        // Clear the previous timeout if any
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        // Set a new timeout for the server update
        timeoutId.current = setTimeout(async () => {
            try {
                setLoading(true); // Set loading state while waiting for the request
                // Send request to the server to update likes
                const response = await fetch('/api/likes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id,
                        type,
                        action: newLiked ? 'like' : 'unlike',
                    }),
                });

                const data = await response.json();
                setLikeCount(data.likes);
            } catch (error) {
                console.error('Failed to update likes:', error);
                // If error occurs, revert the like state
                setLiked(!newLiked);
                setLikeCount((prev) => prev - (newLiked ? 1 : -1)); // Revert like count

                const likedItems = JSON.parse(localStorage.getItem(`liked_${type}s`) || '{}');
                likedItems[id] = !newLiked;
                localStorage.setItem(`liked_${type}s`, JSON.stringify(likedItems));
            } finally {
                setLoading(false);
            }
        }, 500); // Delay before server request to debounce rapid clicks
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-full transition-all duration-300 ease-in-out self-start bg-slate-800/30 backdrop-blur-lg 
                ${liked ? 'text-rose-200 scale-105' : 'text-slate-400 hover:text-rose-100'} 
                ${loading ? 'opacity-90' : ''}
            `}
            aria-label={liked ? 'Unlike' : 'Like'}
            disabled={loading}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                className="w-4 h-4 transition-transform duration-300 ease-in-out transform hover:scale-110"
                strokeWidth={liked ? '0' : '1.5'}
            >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-xs font-light tracking-wide">{likeCount}</span>
        </button>
    );
}
