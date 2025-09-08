/**
 * @fileoverview Type Definitions for the Polling Application.
 *
 * @description This file contains TypeScript type definitions used across the Polling App.
 * Centralizing types here ensures consistency and facilitates easier maintenance
 * and understanding of data structures throughout the codebase.
 */

/**
 * @typedef {Object} Poll
 * @summary Represents a poll object within the application.
 *
 * @description This type defines the structure for a poll, including its unique identifier,
 * the question asked, available options, the ID of the user who created it, and its creation timestamp.
 * It is used for consistency when handling poll data across both client and server components
 * and when interacting with the Supabase database.
 *
 * @property {string} id - The unique identifier for the poll.
 * @property {string} question - The main question posed by the poll.
 * @property {string[]} options - An array of strings, where each string is a possible answer to the poll.
 * @property {string} created_by - The Supabase `user_id` of the user who created this poll.
 * @property {string} created_at - An ISO 8601 formatted string representing the timestamp when the poll was created.
 */
export type Poll = {
  id: string;
  question: string;
  options: string[];
  created_by: string;
  created_at: string;
};
