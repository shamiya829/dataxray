import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Search, Loader2, Sparkles, Wand2 } from './Icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onOptimize: (query: string) => Promise<string>;
  isLoading: boolean;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onOptimize, isLoading, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Sync internal state if parent updates query (e.g. after optimization)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch(value);
    }
  };

  const handleSearchClick = () => {
    if (value.trim()) {
      onSearch(value);
    }
  };

  const handleOptimizeClick = async () => {
    if (!value.trim() || isOptimizing) return;
    
    setIsOptimizing(true);
    try {
      const optimized = await onOptimize(value);
      setValue(optimized);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto w-full group">
      {/* Decorative shadow for light mode */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative flex items-center bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/50 overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <div className="pl-4 text-gray-400">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        
        <input
          type="text"
          className="w-full bg-transparent px-4 py-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
          placeholder="Search for datasets (e.g., 'Global CO2 Emissions CSV')"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || isOptimizing}
        />
        
        {/* Optimize Button */}
        <div className="flex items-center space-x-1 pr-2">
          <button
            onClick={handleOptimizeClick}
            disabled={isLoading || isOptimizing || !value.trim()}
            className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
               value.trim() && !isOptimizing
                ? 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Optimize Query with AI"
          >
            {isOptimizing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span className="text-xs font-semibold hidden sm:inline-block">Optimize</span>
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <button
            onClick={handleSearchClick}
            disabled={isLoading || !value.trim()}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            Search
          </button>
        </div>
      </div>
      
      {/* Helper text */}
      <div className="absolute top-full mt-2 w-full flex justify-end">
        <span className="text-xs text-gray-400 flex items-center">
          <Wand2 className="w-3 h-3 mr-1" /> Try optimizing specifically for data formats
        </span>
      </div>
    </div>
  );
};

export default SearchBar;