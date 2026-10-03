import type {
  HighlightChunk as ArkHighlightChunk,
  UseHighlightProps,
} from "@ark-ui/vue/highlight";

export type HighlightQuery = UseHighlightProps["query"];
export type HighlightChunk = ArkHighlightChunk;

export interface HighlightProps {
  /** Text rendered by the component and searched for matching query terms. */
  text: string;
  /** One query or a list of query terms to mark. */
  query: HighlightQuery;
  /** Match query terms without regard to letter case. */
  ignoreCase?: boolean;
  /** Mark every matching occurrence. Arrays default to every occurrence. */
  matchAll?: boolean;
  /** Match complete words instead of query substrings. */
  exactMatch?: boolean;
}

export const HIGHLIGHT_DEFAULT_IGNORE_CASE = false;
export const HIGHLIGHT_DEFAULT_EXACT_MATCH = false;

/** Resolve Ark UI's query-dependent matchAll default without changing explicit values. */
export const resolveHighlightMatchAll = (
  query: HighlightQuery,
  matchAll?: boolean,
): boolean => matchAll ?? Array.isArray(query);
