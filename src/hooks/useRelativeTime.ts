import { useState, useEffect } from 'react';

export function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Never';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 5) return 'just now';
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes === 1) return '1 minute ago';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  return `${diffInDays} days ago`;
}

export function useRelativeTime(date: Date | null): string {
  const [relativeTime, setRelativeTime] = useState(() => formatRelativeTime(date));
  
  useEffect(() => {
    setRelativeTime(formatRelativeTime(date));
    
    // Update every second for the first minute, then every minute
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(date));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [date]);
  
  return relativeTime;
}
