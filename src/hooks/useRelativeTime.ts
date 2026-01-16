import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function formatRelativeTime(date: Date | string | null): string {
  if (!date) return 'Never';

  const d = typeof date === 'string' ? new Date(date) : date;

  // Handle invalid dates
  if (isNaN(d.getTime())) return 'Unknown time';

  return formatDistanceToNow(d, { addSuffix: true });
}

export function useRelativeTime(date: Date | string | null): string {
  const [relativeTime, setRelativeTime] = useState(() => formatRelativeTime(date));

  useEffect(() => {
    setRelativeTime(formatRelativeTime(date));

    // Update every 30 seconds to keep it fresh
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(date));
    }, 30000);

    return () => clearInterval(interval);
  }, [date]);

  return relativeTime;
}
