import React from 'react';
import { ExternalLink, Database, Github, FileSpreadsheet } from './Icons';
import { GroundingChunk } from '../types';

interface DatasetCardProps {
  source: GroundingChunk;
  index: number;
}

const DatasetCard: React.FC<DatasetCardProps> = ({ source, index }) => {
  if (!source.web) return null;

  const { title, uri } = source.web;

  // Simple heuristic to guess icon based on URL
  const getIcon = (url: string) => {
    if (url.includes('github.com')) return <Github className="w-5 h-5 text-gray-700" />;
    if (url.includes('kaggle.com')) return <Database className="w-5 h-5 text-blue-500" />;
    if (url.includes('csv') || url.includes('xls')) return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    return <Database className="w-5 h-5 text-indigo-500" />;
  };

  const getSourceLabel = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch {
      return 'Web Source';
    }
  };

  return (
    <a 
      href={uri} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors border border-gray-100">
            {getIcon(uri)}
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
            {getSourceLabel(uri)}
          </span>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-tight">
        {title}
      </h3>
      
      <div className="text-sm text-gray-500 truncate font-mono bg-gray-50 p-1.5 rounded px-2 group-hover:bg-gray-100 transition-colors">
        {uri}
      </div>
    </a>
  );
};

export default DatasetCard;