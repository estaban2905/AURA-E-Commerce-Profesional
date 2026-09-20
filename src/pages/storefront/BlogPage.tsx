import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock, User } from 'lucide-react';
import { mockBlogPosts } from '@/data/blog';
import { Badge } from '@/components/ui/badge';

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Guías & Comparativas', 'Workspace & Ergonomía', 'Audio Pro'];

  const filteredPosts =
    selectedCategory === 'all'
      ? mockBlogPosts
      : mockBlogPosts.filter((p) => p.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12 max-w-6xl">
      {/* Blog Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">AURA Insights</span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          Ingeniería, Acústica & Ergonomía
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Artículos técnicos, comparativas de audio de estudio, guías para optimizar tu estación de trabajo y análisis de hardware.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat === 'all' ? 'Todos los Artículos' : cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md hover:border-primary/40 transition-all"
          >
            <Link to={`/blog/${post.slug}`} className="aspect-16/10 overflow-hidden bg-muted">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Badge variant="outline" className="text-[10px] py-0">
                    {post.category}
                  </Badge>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <Link to={`/blog/${post.slug}`} className="block">
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="text-[11px] font-semibold text-foreground">
                    {post.author.name}
                  </span>
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="font-semibold text-primary flex items-center gap-1 hover:underline"
                >
                  <span>Leer</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
