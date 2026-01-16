import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '../hooks/useGlobalSearch';

interface GlobalSearchInputProps {
  className?: string;
  placeholder?: string;
}

export default function GlobalSearchInput({
  className = "",
  placeholder = "Search anything"
}: GlobalSearchInputProps) {
  const { searchTerm, setSearchTerm, results, isLoading } = useGlobalSearch();
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSearchResultClick = (link: string) => {
    navigate(link);
    setSearchTerm(''); // Clear search on navigation
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSearchTerm]);

  return (
    <div className={`relative group ${className}`} ref={searchRef}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4 opacity-50 group-focus-within:opacity-100 transition-opacity" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-[220px] rounded-full border border-gray-100 bg-gray-50/50 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100"
      />

      {/* Search Results Dropdown */}
      {(results.length > 0 || isLoading || (searchTerm.length >= 2 && results.length === 0)) && (
        <div className="absolute top-full right-0 mt-2 w-[320px] rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="py-2">
            {isLoading && (
              <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </div>
            )}

            {!isLoading && results.length === 0 && (
              <div className="py-8 text-center text-sm text-gray-500">
                No results found for "{searchTerm}"
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="max-h-[300px] overflow-y-auto">
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                  Top Results
                </div>
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSearchResultClick(result.link)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex items-start gap-3 group/item"
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 text-gray-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                      {/* Icon based on type */}
                      {result.type === 'lead' && <img src="/icons/filter-icon.svg" className="w-4 h-4" />}
                      {result.type === 'contact' && <img src="/icons/contact-icon.svg" className="w-4 h-4" />}
                      {result.type === 'task' && <img src="/icons/task-icon.svg" className="w-4 h-4" />}
                      {result.type === 'campaign' && <img src="/icons/megaphone-icon.svg" className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-gray-900 group-hover/item:text-primary transition-colors truncate">
                          {result.title}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                          {result.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate flex items-center gap-2">
                        {result.subtitle}
                        {result.status && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className={
                              result.status === 'CLOSED_WON' ? 'text-emerald-600' :
                                result.status === 'CLOSED_LOST' ? 'text-red-500' :
                                  'text-blue-500'
                            }>{result.status}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
