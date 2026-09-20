import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Tag, ChevronRight } from 'lucide-react';
import { mockBlogPosts } from '@/data/blog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = mockBlogPosts.find((p) => p.slug === slug) || mockBlogPosts[0];

  return (
    <article className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl space-y-8">
      {/* Navigation */}
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Volver a AURA Insights</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="text-xs">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Author info */}
        <div className="flex items-center gap-3 pt-2">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="h-10 w-10 rounded-full object-cover border border-border"
          />
          <div>
            <p className="text-xs font-bold text-foreground">{post.author.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {post.author.role} • {new Date(post.publishedAt).toLocaleDateString('es-CL')}
            </p>
          </div>
        </div>
      </header>

      {/* Cover image */}
      <div className="aspect-16/9 rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-6 text-foreground/90">
        <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed border-l-2 border-primary pl-4">
          {post.excerpt}
        </p>

        <p>
          En el ecosistema tecnológico contemporáneo, la línea que divide las herramientas de consumo masivo de los equipos profesionales de grado industrial se ha vuelto cada vez más difusa. Seleccionar los transductores adecuados, la calibración acústica y el amortiguamiento de resonancias de chasis son factores determinantes en la fatiga auditiva diaria.
        </p>

        <h3 className="text-xl font-bold text-foreground pt-4">1. La respuesta en frecuencia y distorsión armónica</h3>
        <p>
          Muchos auriculares comerciales aplican curvas V excesivamente pronunciadas con refuerzos artificiales en graves que enmascaran transientes críticos. Los monitores planares magnéticos logran reproducir microdetalles en los rangos de 10kHz a 40kHz sin generar distorsión por intermodulación armónica.
        </p>

        <h3 className="text-xl font-bold text-foreground pt-4">2. Materiales de construcción: Aluminio mecanizado y acústica controlada</h3>
        <p>
          La densidad del recinto acústico juega un papel primordial. La aleación de aluminio aeroespacial utilizada en la serie AURA Pro proporciona rigidez estructural eliminando vibraciones parasitarias parásitas, manteniendo la pureza tonal inalterada durante sesiones de más de 8 horas continuas.
        </p>
      </div>

      {/* Tags & Footer */}
      <footer className="pt-8 border-t border-border space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {post.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-xs">
              #{t}
            </Badge>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-foreground">¿Te interesa el equipamiento analizado?</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explora nuestra tienda para ver disponibilidad y despacho inmediato.
            </p>
          </div>
          <Button asChild variant="primary" size="sm">
            <Link to="/catalog">Ver Productos en Catálogo</Link>
          </Button>
        </div>
      </footer>
    </article>
  );
};
