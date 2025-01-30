'use client';

import { useState, useEffect } from 'react';

interface LikeButtonProps {
    id: string;
    type: 'post' | 'project';
}

export default function LikeButton({ id, type }: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch initial like count and status from the server
        const fetchLikes = async () => {
            try {
                const response = await fetch(`/api/likes?id=${id}&type=${type}`);
                const data = await response.json();
                setLikeCount(data.likes || 0);
                
                // For now, we'll still use localStorage just for tracking if the current user has liked
                const likedItems = JSON.parse(localStorage.getItem(`liked_${type}s`) || '{}');
                setLiked(!!likedItems[id]);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch likes:', error);
                setLoading(false);
            }
        };
        
        fetchLikes();
    }, [id, type]);

    const handleLike = async () => {
        if (loading) return;
        setLoading(true);
        const newLiked = !liked;
        setLiked(newLiked);

        // Update liked items in localStorage (just for tracking user's likes)
        const likedItems = JSON.parse(localStorage.getItem(`liked_${type}s`) || '{}');
        likedItems[id] = newLiked;
        localStorage.setItem(`liked_${type}s`, JSON.stringify(likedItems));

        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    type,
                    action: newLiked ? 'like' : 'unlike'
                })
            });
            
            const data = await response.json();
            setLikeCount(data.likes);
        } catch (error) {
            console.error('Failed to update likes:', error);
            // Revert the like state on error
            setLiked(!newLiked);
            likedItems[id] = !newLiked;
            localStorage.setItem(`liked_${type}s`, JSON.stringify(likedItems));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-full transition-all duration-300 ease-in-out self-start bg-slate-800/30 backdrop-blur-lg ${liked ? 'text-rose-200 scale-105' : 'text-slate-400 hover:text-rose-100'} ${loading ? 'opacity-90 cursor-not-allowed relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-rose-200/20 before:to-transparent before:animate-shimmer' : ''}`}
            aria-label={liked ? 'Unlike' : 'Like'}
            disabled={loading}
            style={loading ? { '--shimmer-duration': '1.5s' } as React.CSSProperties : undefined}
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