import type { SemanticCandidate, SemanticMatchOutput } from '../types';
import { AUTO_MATCH_THRESHOLD, REVIEW_QUEUE_THRESHOLD } from '../matching/semanticMatcher';

type GroqSelection = { activityId: string | null; confidence: number; rationale: string };

/**
 * Uses Groq only to choose between known project activities. It never creates IDs or
 * bypasses the confidence gate, and falls back to the deterministic matcher on failure.
 */
export async function refineMatchWithGroq(
  rawText: string,
  candidates: SemanticCandidate[],
  fallback: SemanticMatchOutput,
): Promise<SemanticMatchOutput> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || candidates.length === 0) return fallback;

  try {
    const allowed = candidates.slice(0, 80).map((candidate) => ({
      id: candidate.id,
      code: candidate.activityCode,
      name: candidate.name,
      discipline: candidate.discipline,
      wbs: candidate.wbsPath,
    }));
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You match a construction field report to one known schedule activity. Return JSON only: {"activityId": string|null, "confidence": number 0..1, "rationale": string}. Use null when the report cannot be safely linked. Confidence above 0.85 requires exact work and location evidence.' },
          { role: 'user', content: JSON.stringify({ fieldReport: rawText, activities: allowed }) },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return fallback;
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const parsed = JSON.parse(payload.choices?.[0]?.message?.content || '{}') as GroqSelection;
    const candidate = candidates.find((item) => item.id === parsed.activityId);
    const confidence = Number(parsed.confidence);
    if (!candidate || !Number.isFinite(confidence) || confidence < 0 || confidence > 1) return fallback;

    const status = confidence >= AUTO_MATCH_THRESHOLD ? 'AUTO_MATCHED' : confidence >= REVIEW_QUEUE_THRESHOLD ? 'PENDING_REVIEW' : 'UNMATCHED';
    return {
      status,
      confidenceScore: confidence,
      topCandidate: status === 'UNMATCHED' ? undefined : candidate,
      alternateCandidates: candidates.filter((item) => item.id !== candidate.id).slice(0, 3).map((item) => ({ candidate: item, score: 0 })),
      matchRationale: `Groq constrained match: ${String(parsed.rationale || 'No rationale supplied.')}`,
    };
  } catch {
    return fallback;
  }
}
