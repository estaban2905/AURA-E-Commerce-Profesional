import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, MessageSquare, ThumbsUp } from 'lucide-react';
import { reviewService } from '@/services/review.service';
import { Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { useToast } from '@/components/ui/toast-context';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const loadReviews = async () => {
    const data = await reviewService.getAllReviews();
    setReviews(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta reseña permanentemente?')) {
      await reviewService.deleteReview(id);
      toast.info('Reseña eliminada');
      loadReviews();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Moderación de Reseñas ({reviews.length})
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Supervisa las opiniones y calificaciones publicadas por compradores verificados.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground text-xs">Cargando reseñas...</div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">No hay reseñas para moderar.</div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Rating value={r.rating} size="sm" showCount={false} />
                    <span className="text-xs font-bold text-foreground">"{r.title}"</span>
                    {r.verified && (
                      <Badge variant="success" className="text-[10px] py-0">
                        Compra Verificada
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{r.comment}</p>

                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>Por: <strong className="text-foreground">{r.userName}</strong></span>
                    <span>•</span>
                    <span>Producto: <strong className="text-foreground">{r.productName}</strong></span>
                    <span>•</span>
                    <span>Fecha: {r.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{r.helpfulCount} votos útiles</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(r.id)}
                    className="text-xs text-rose-500 hover:text-rose-600 gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Eliminar</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
