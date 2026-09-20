import { useState, useEffect, useCallback } from 'react';
import { Review } from '@/types';
import { reviewService } from '@/services/review.service';

export function useReviews(productId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getReviews(productId);
      setReviews(data);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (data: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'status'>) => {
    const created = await reviewService.addReview(data);
    setReviews((prev) => [created, ...prev]);
    return created;
  };

  const markHelpful = async (reviewId: string) => {
    const count = await reviewService.markHelpful(reviewId);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: count } : r))
    );
  };

  return { reviews, isLoading, addReview, markHelpful, refetch: fetchReviews };
}
