// src/lib/metadata.ts
import getMetaData from "metadata-scraper";

export async function extractMetadata(url: string) {
  try {
    const data = await getMetaData(url);
    return data;
  } catch (error) {
    console.error("Error extracting metadata:", error);
    return null;
  }
}