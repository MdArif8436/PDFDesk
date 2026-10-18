import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatFileSize,
  calculateSavings,
  reorderItems,
  parsePageRanges
} from './pdfCalculations.ts';

test('formatFileSize formats bytes correctly', () => {
  assert.equal(formatFileSize(0), '0 B');
  assert.equal(formatFileSize(512), '512 B');
  assert.equal(formatFileSize(1024), '1.0 KB');
  assert.equal(formatFileSize(3072), '3.0 KB');
  assert.equal(formatFileSize(1048576), '1.00 MB');
  assert.equal(formatFileSize(2500000), '2.38 MB');
});

test('calculateSavings computes compression statistics', () => {
  const result = calculateSavings(3000, 1590);
  assert.equal(result.savingsPercent, 47);
  assert.equal(result.savedBytes, 1410);
  assert.equal(result.isReduced, true);

  const noSavings = calculateSavings(100, 120);
  assert.equal(noSavings.savingsPercent, 0);
  assert.equal(noSavings.savedBytes, 0);
  assert.equal(noSavings.isReduced, false);
});

test('reorderItems shifts elements within bounds', () => {
  const original = ['doc1.pdf', 'doc2.pdf', 'doc3.pdf'];
  
  // Move middle item to first position
  const movedLeft = reorderItems(original, 1, 'prev');
  assert.deepEqual(movedLeft, ['doc2.pdf', 'doc1.pdf', 'doc3.pdf']);

  // Move middle item to last position
  const movedRight = reorderItems(original, 1, 'next');
  assert.deepEqual(movedRight, ['doc1.pdf', 'doc3.pdf', 'doc2.pdf']);

  // Edge cases: out of bounds
  assert.deepEqual(reorderItems(original, 0, 'prev'), original);
  assert.deepEqual(reorderItems(original, 2, 'next'), original);
});

test('parsePageRanges parses single pages and ranges correctly', () => {
  assert.deepEqual(parsePageRanges('1-3, 5'), [1, 2, 3, 5]);
  assert.deepEqual(parsePageRanges('2, 4-6, 8'), [2, 4, 5, 6, 8]);
  assert.deepEqual(parsePageRanges('1-5', 3), [1, 2, 3]); // constrained by maxPages
});
