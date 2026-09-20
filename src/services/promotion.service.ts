import { Promotion } from '@/types';
import { delay, getStoredPromotions, saveStoredPromotions } from '@/mocks/api';

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  discountAmount: number;
  promotion?: Promotion;
}

export const promotionService = {
  async getPromotions(): Promise<Promotion[]> {
    await delay(200);
    return getStoredPromotions();
  },

  async validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
    await delay(300);
    const cleanCode = code.trim().toUpperCase();
    const promotions = getStoredPromotions();
    const promo = promotions.find((p) => p.code.toUpperCase() === cleanCode);

    if (!promo) {
      return {
        valid: false,
        message: 'El código de cupón no existe o ha expirado.',
        discountAmount: 0,
      };
    }

    if (!promo.active) {
      return {
        valid: false,
        message: 'Esta promoción ya no se encuentra activa.',
        discountAmount: 0,
      };
    }

    const minAmount = promo.minPurchase ?? promo.minOrderAmount ?? 0;
    if (subtotal < minAmount) {
      return {
        valid: false,
        message: `El monto mínimo de compra para este cupón es de $${minAmount.toLocaleString('es-CL')}.`,
        discountAmount: 0,
      };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = Math.round((subtotal * promo.value) / 100);
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = promo.value;
    }

    return {
      valid: true,
      message: `¡Cupón ${promo.code} aplicado con éxito! Descuento de $${discount.toLocaleString('es-CL')}.`,
      discountAmount: discount,
      promotion: promo,
    };
  },

  async createPromotion(data: Omit<Promotion, 'id' | 'usedCount'>): Promise<Promotion> {
    await delay(300);
    const promotions = getStoredPromotions();
    const newPromo: Promotion = {
      ...data,
      id: `promo-${Date.now()}`,
      usedCount: 0,
    };
    saveStoredPromotions([newPromo, ...promotions]);
    return newPromo;
  },

  async updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion> {
    await delay(200);
    const promotions = getStoredPromotions();
    const index = promotions.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Promoción no encontrada');
    promotions[index] = { ...promotions[index], ...updates };
    saveStoredPromotions([...promotions]);
    return promotions[index];
  },

  async deletePromotion(id: string): Promise<boolean> {
    await delay(200);
    const promotions = getStoredPromotions();
    saveStoredPromotions(promotions.filter((p) => p.id !== id));
    return true;
  },

  async togglePromotion(id: string): Promise<Promotion> {
    await delay(200);
    const promotions = getStoredPromotions();
    const index = promotions.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Promoción no encontrada');
    promotions[index].active = !promotions[index].active;
    saveStoredPromotions([...promotions]);
    return promotions[index];
  },
};
