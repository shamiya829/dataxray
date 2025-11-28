import React, { useState } from 'react';
import { findDatasets, optimizeDatasetQuery } from './services/geminiService';
import { GroundingChunk, PLATFORMS, Platform } from './types';
import SearchBar from './components/SearchBar';
import DatasetCard from './components/DatasetCard';
import { BrainCircuit, Filter, Terminal, Database, Sparkles } from './components/Icons';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(PLATFORMS[0]);
  const [results, setResults] = useState<GroundingChunk[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setQuery(searchQuery);
    setHasSearched(true);
    setResults([]); // Clear previous results immediately
    setSummary('');

    try {
      const data = await findDatasets(searchQuery, selectedPlatform.querySuffix);
      setResults(data.sources);
      setSummary(data.summary);
    } catch (err) {
      setError("Failed to fetch datasets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async (currentQuery: string) => {
    const optimized = await optimizeDatasetQuery(currentQuery);
    return optimized;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">DataXray</h1>
              <p className="text-[10px] text-blue-600 font-bold tracking-widest uppercase">Dataset Discovery</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-500">
             <span className="flex items-center hover:text-gray-900 transition">
                <Terminal className="w-4 h-4 mr-1.5" /> API Powered
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search Section */}
        <div className={`transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${hasSearched ? 'mb-10 translate-y-0' : 'mb-32 mt-20 translate-y-0'}`}>
          {!hasSearched && (
            <div className="text-center mb-10 space-y-4 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Unlock the World's Data
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Use AI-powered X-Ray search to find hidden datasets across Kaggle, GitHub, Government portals, and academic repositories instantly.
              </p>
            </div>
          )}

          <div className="relative z-10">
            <SearchBar 
              onSearch={handleSearch} 
              onOptimize={handleOptimize} 
              isLoading={loading} 
              initialValue={query}
            />
          </div>

          {/* Platform Filters */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border shadow-sm ${
                  selectedPlatform.id === platform.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 animate-pulse font-medium text-sm tracking-wide">Scanning repositories for '{query}'...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center max-w-lg mx-auto">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {!loading && hasSearched && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
            
            {/* Left Column: AI Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24 ring-1 ring-black/5">
                <div className="flex items-center space-x-2 mb-5 pb-4 border-b border-gray-100">
                  <div className="bg-blue-50 p-1.5 rounded-md">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">AI Analysis</h3>
                </div>
                
                <div className="prose prose-sm prose-blue text-gray-600 leading-relaxed max-w-none">
                  {summary ? (
                    <div className="markdown-content" dangerouslySetInnerHTML={{ __html: summary
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
                      .replace(/\n/g, '<br />') 
                    }} />
                  ) : (
                    <p className="italic text-gray-400">No summary available.</p>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                     <span className="bg-gray-100 px-2 py-1 rounded">Focus: {selectedPlatform.name}</span>
                     <span>{results.length} results</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dataset Cards */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                   <Filter className="w-5 h-5 mr-2 text-gray-400" />
                   Discovered Datasets
                </h3>
              </div>
              
              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((chunk, idx) => (
                    <DatasetCard key={idx} source={chunk} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                     <Database className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium text-lg">No direct datasets found.</p>
                  <p className="text-gray-500 text-sm mt-2 max-w-xs text-center">
                    Try using the <span className="text-blue-600 font-semibold">Optimize</span> button to refine your query.
                  </p>
                </div>
              )}
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default App;