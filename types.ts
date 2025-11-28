export interface SearchResult {
  summary: string;
  sources: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Platform {
  id: string;
  name: string;
  querySuffix: string;
}

export const PLATFORMS: Platform[] = [
  { id: 'all', name: 'All Sources', querySuffix: '' },
  { id: 'kaggle', name: 'Kaggle', querySuffix: 'site:kaggle.com' },
  { id: 'huggingface', name: 'Hugging Face', querySuffix: 'site:huggingface.co' },
  { id: 'github', name: 'GitHub', querySuffix: 'site:github.com filetype:csv OR filetype:json OR filetype:parquet' },
  { id: 'gov', name: 'Gov Data', querySuffix: 'site:data.gov OR site:europa.eu' },
  { id: 'papers', name: 'Academic', querySuffix: 'site:arxiv.org OR site:paperswithcode.com' },
];