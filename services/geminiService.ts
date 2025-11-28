import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SearchResult, GroundingChunk } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeDatasetQuery = async (originalQuery: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a dataset research expert. Rewrite the following user query to be a highly effective search string for finding specific, downloadable datasets (CSV, JSON, SQL). 
      
      Rules:
      1. Keep it concise but descriptive.
      2. Add keywords like 'dataset', 'CSV', 'statistics', or 'database' where appropriate.
      3. Do not add quotes unless necessary.
      4. Output ONLY the optimized query string.

      User Query: ${originalQuery}`,
    });
    return response.text?.trim() || originalQuery;
  } catch (error) {
    console.error("Optimization Error:", error);
    return originalQuery;
  }
};

export const findDatasets = async (query: string, platformSuffix: string): Promise<SearchResult> => {
  try {
    // We construct a query that explicitly looks for datasets to help the Search Tool
    const enhancedQuery = `Find datasets related to: ${query}. ${platformSuffix ? `Focus search on: ${platformSuffix}` : ''}. Return a summary of what these datasets contain.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enhancedQuery,
      config: {
        // Critical: Enable Google Search Grounding to find real URLs
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are DataXray, a specialized engine for finding data sets. Your goal is to find downloadable datasets (CSV, JSON, Images, Parquet) for the user. Summarize the findings briefly using Markdown formatting (bolding key terms). The search tool will provide the actual links.",
        // Note: responseMimeType cannot be JSON when using googleSearch
      },
    });

    const summary = response.text || "No summary generated.";
    
    // Extract grounding chunks (the search results with URLs)
    // The structure is response.candidates[0].groundingMetadata.groundingChunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    return {
      summary,
      sources: chunks
    };

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};