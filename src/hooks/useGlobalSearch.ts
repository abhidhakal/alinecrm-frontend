import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../api/search.api';
import type { SearchResult } from '../api/search.api';
import { useAuth } from '../context/AuthContext';

// Hook customized for search behavior (debouncing included)
export function useGlobalSearch() {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(searchTerm);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const query = useQuery({
    queryKey: ['global-search', debouncedValue],
    queryFn: () => searchApi.search(debouncedValue),
    enabled: debouncedValue.length >= 2, // Only run if 2+ chars
    staleTime: 60 * 1000, // Keep results for 1 minute
  });

  // Transform results to point to list pages instead of detail pages
  const results = (query.data || []).map((result: SearchResult) => {
    let path = '';
    switch (result.type) {
      case 'lead':
        path = '/leads';
        break;
      case 'contact':
        path = '/contacts';
        break;
      case 'campaign':
        path = '/campaigns';
        break;
      case 'task':
        path = '/tasks';
        break;
      default:
        // Keep original link for unknown types
        return result;
    }

    const finalLink = isAdmin ? `/admin${path}` : path;
    return { ...result, link: finalLink };
  });

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading: query.isLoading && debouncedValue.length >= 2,
    isError: query.isError,
  };
}
