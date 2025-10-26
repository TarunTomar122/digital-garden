'use client';

import { useEffect, useRef } from 'react';

interface InstagramEmbedProps {
  url: string;
}

export default function InstagramEmbed({ url }: InstagramEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram embed script and process embeds
    const loadInstagram = () => {
      if (typeof window !== 'undefined') {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        } else {
          const script = document.createElement('script');
          script.src = '//www.instagram.com/embed.js';
          script.async = true;
          script.onload = () => {
            if (window.instgrm) {
              window.instgrm.Embeds.process();
            }
          };
          document.body.appendChild(script);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadInstagram, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={embedRef} className="my-6">
      <blockquote 
        className="instagram-media" 
        data-instgrm-captioned 
        data-instgrm-permalink={url}
        data-instgrm-version="14" 
        style={{ 
          background: '#FFF', 
          border: 0, 
          borderRadius: '3px', 
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', 
          margin: '1px auto', 
          padding: 0, 
          width: '100%',
          minHeight: '630px'
        }}
      >
        <div style={{ padding: '16px' }}>
          <a 
            href={url}
            style={{ 
              background: '#FFFFFF', 
              lineHeight: 0, 
              padding: '0 0', 
              textAlign: 'center', 
              textDecoration: 'none', 
              width: '100%' 
            }} 
            target="_blank"
            rel="noopener noreferrer"
          >
            View this post on Instagram
          </a>
        </div>
      </blockquote>
    </div>
  );
}

// Extend window type for Instagram embed script
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}
