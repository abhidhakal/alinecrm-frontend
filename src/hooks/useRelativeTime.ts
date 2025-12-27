import { useState, useEffect } from 'react';

export function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Never';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return 'less than 30 seconds ago';
  if (diffInSeconds < 60) return 'less than 1 minute ago';
  if (diffInSeconds < 300) return 'less than 5 minutes ago';

  return 'more than 5 minutes ago';
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
