// Copyright (C) 2025 Keygraph, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License version 3
// as published by the Free Software Foundation.

/**
 * Model tier definitions and resolution.
 *
 * Three tiers mapped to capability levels:
 * - "small"  (Haiku — summarization, structured extraction)
 * - "medium" (Sonnet — tool use, general analysis)
 * - "large"  (Opus — deep reasoning, complex analysis)
 *
 * Users override via ANTHROPIC_SMALL_MODEL / ANTHROPIC_MEDIUM_MODEL / ANTHROPIC_LARGE_MODEL,
 * which works across all providers (direct, Bedrock, Vertex).
 */

export type ModelTier = 'small' | 'medium' | 'large';

const DEFAULT_MODELS: Readonly<Record<ModelTier, string>> = {
  small: 'claude-haiku-4-5-20251001',
  medium: 'claude-sonnet-4-6',
  large: 'claude-opus-4-6',
};

/** Default Gemini model used when GEMINI_MODEL is not explicitly set. */
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

/** Resolve a model tier to a concrete model ID. */
export function resolveModel(tier: ModelTier = 'medium'): string {
  // Gemini Direct API mode: use configured Gemini model unless tier is explicitly overridden
  const geminiModel = process.env.GEMINI_API_KEY ? (process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL) : null;

  switch (tier) {
    case 'small':
      return process.env.ANTHROPIC_SMALL_MODEL || geminiModel || DEFAULT_MODELS.small;
    case 'large':
      return process.env.ANTHROPIC_LARGE_MODEL || geminiModel || DEFAULT_MODELS.large;
    default:
      return process.env.ANTHROPIC_MEDIUM_MODEL || geminiModel || DEFAULT_MODELS.medium;
  }
}
