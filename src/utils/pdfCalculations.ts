/**
 * Pure calculation utilities for PDF processing, file metrics, and document reordering.
 */

export interface Reorderable {
  id: string;
}

/**
 * Format bytes into human-readable file size strings (B, KB, MB, GB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Calculate compression reduction percentage and byte savings.
 */
export function calculateSavings(originalSize: number, compressedSize: number): {
  savingsPercent: number;
  savedBytes: number;
  isReduced: boolean;
} {
  if (originalSize <= 0 || compressedSize <= 0) {
    return { savingsPercent: 0, savedBytes: 0, isReduced: false };
  }

  const savedBytes = Math.max(0, originalSize - compressedSize);
  const savingsPercent = Math.max(0, Math.round((savedBytes / originalSize) * 100));

  return {
    savingsPercent,
    savedBytes,
    isReduced: savedBytes > 0
  };
}

/**
 * Reorder an array of items moving the element at fromIndex one step left or right.
 */
export function reorderItems<T>(items: T[], index: number, direction: 'prev' | 'next'): T[] {
  const targetIdx = direction === 'prev' ? index - 1 : index + 1;
  if (targetIdx < 0 || targetIdx >= items.length || index < 0 || index >= items.length) {
    return items;
  }
  const result = [...items];
  const [removed] = result.splice(index, 1);
  result.splice(targetIdx, 0, removed);
  return result;
}

/**
 * Parse page ranges string like "1-3, 5, 8-10" into an array of 1-based page numbers.
 */
export function parsePageRanges(rangeStr: string, maxPages?: number): number[] {
  const pagesSet = new Set<number>();
  const parts = rangeStr.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && (!maxPages || i <= maxPages)) {
            pagesSet.add(i);
          }
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page > 0 && (!maxPages || page <= maxPages)) {
        pagesSet.add(page);
      }
    }
  }

  return Array.from(pagesSet).sort((a, b) => a - b);
}
