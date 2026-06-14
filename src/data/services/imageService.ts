import type { BeforeAfterPair, CategoryId, IssuePhoto } from '@/types';
import { ImageGenStatus } from '@/types';
import { afterImage } from '@/lib/placeholderImages';
import { withLatency } from '@/data/latency';
import { nowISO } from '@/lib/ids';

export interface GenerateAfterImageInput {
  beforePhoto: IssuePhoto;
  /** The proposed fix text. */
  countermeasure: string;
  categoryId: CategoryId;
}

export interface ImageService {
  /** "Show the fix" — returns an AI-generated after-image paired with the before. */
  generateAfterImage(input: GenerateAfterImageInput): Promise<BeforeAfterPair>;
}

/**
 * Mock implementation: shows a realistic "Generating your vision…" delay, then reveals a
 * curated placeholder after-image. A real image model can be dropped in behind this interface.
 */
const mockImageService: ImageService = {
  generateAfterImage: (input) => {
    const label = input.countermeasure.trim() || 'the proposed fix';
    const pair: BeforeAfterPair = {
      before: input.beforePhoto,
      after: { url: afterImage('After'), caption: `AI vision: ${label} (sample)` },
      status: ImageGenStatus.Ready,
      generatedAt: nowISO(),
    };
    // Longer artificial delay to make the loading state demoable.
    return withLatency(pair, 1800 + Math.random() * 900);
  },
};

export const imageService: ImageService = mockImageService;
