import { Review } from '@/types';
import { delay, getStoredReviews, saveStoredReviews } from '@/mocks/api';

export const reviewService = {
  async getReviews(productId?: string): Promise<Review[]> {
    await delay(200);
    const reviews = getStoredReviews();
    if (productId) {
      return reviews.filter((r) => r.productId === productId && r.status === 'approved');
    }
    return reviews;
  },

  async getAllReviewsForAdmin(): Promise<Review[]> {
    await delay(250);
    return getStoredReviews();
  },

  async getAllReviews(): Promise<Review[]> {
    return this.getAllReviewsForAdmin();
  },

  async deleteReview(id: string): Promise<boolean> {
    await delay(200);
    const reviews = getStoredReviews();
    saveStoredReviews(reviews.filter((r) => r.id !== id));
    return true;
  },

  async addReview(reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'status'>): Promise<Review> {
    await delay(350);
    const reviews = getStoredReviews();
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      status: 'approved', // Default approved in mock for immediate feedback
    };

    saveStoredReviews([newReview, ...reviews]);
    return newReview;
  },

  async updateReviewStatus(id: string, status: 'approved' | 'rejected'): Promise<Review> {
    await delay(200);
    const reviews = getStoredReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Reseña no encontrada');

    reviews[index].status = status;
    saveStoredReviews([...reviews]);
    return reviews[index];
  },

  async markHelpful(id: string): Promise<number> {
    const reviews = getStoredReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) return 0;

    reviews[index].helpfulCount += 1;
    saveStoredReviews([...reviews]);
    return reviews[index].helpfulCount;
  },
};
