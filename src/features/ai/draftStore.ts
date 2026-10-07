import { create } from 'zustand';

import type { ExtractedOrder } from './schemas';

interface AiOrderDraftState {
  draft: ExtractedOrder | null;
  customerId: string | null;
  setDraft: (draft: ExtractedOrder, customerId: string | null) => void;
  clear: () => void;
}

/**
 * Hands the AI-extracted draft from the "paste text" screen to the review screen without
 * round-tripping a large object through URL params. Cleared once the order is created
 * (or the flow is abandoned) so a stale draft never resurfaces.
 */
export const useAiOrderDraftStore = create<AiOrderDraftState>((set) => ({
  draft: null,
  customerId: null,
  setDraft: (draft, customerId) => set({ draft, customerId }),
  clear: () => set({ draft: null, customerId: null }),
}));
