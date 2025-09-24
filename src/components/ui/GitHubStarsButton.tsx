'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Github, Star } from 'lucide-react';

interface GitHubStarsButtonProps {
  repoUrl: string;
  className?: string;
}

export function GitHubStarsButton({ repoUrl, className = '' }: GitHubStarsButtonProps) {
  const [starCount, setStarCount] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Extract owner and repo from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      const [, owner, repo] = match;
      
      // Fetch star count from GitHub API
      fetch(`https://api.github.com/repos/${owner}/${repo}`)
        .then(response => response.json())
        .then(data => {
          if (data.stargazers_count !== undefined) {
            setStarCount(data.stargazers_count);
          }
        })
        .catch(error => {
          console.error('Error fetching GitHub stars:', error);
        });
    }
  }, [repoUrl]);

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.open(repoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={`gap-2 glass border-blue-500/30 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 ${className}`}
    >
      <Github className="h-4 w-4 text-blue-300" />
      <span className="text-sm font-medium text-slate-200">GitHub</span>
      {isClient && starCount !== null && (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-current text-blue-400" />
          <span className="text-xs text-blue-300/80">{starCount.toLocaleString()}</span>
        </div>
      )}
    </Button>
  );
}
