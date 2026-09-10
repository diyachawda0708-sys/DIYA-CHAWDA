import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { ARTICLES } from '../data/articles';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEOHead } from '../components/seo/SEOHead';
import { ArrowRight, Clock, BookOpen, Tag } from 'lucide-react';

export const JournalListPage: React.FC = () => {
  const { navigate, currentPath } = useEcommerce();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Buying Guides', 'Material Science', 'Everyday Carry', 'Sustainability'];

  const filteredArticles = selectedCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === selectedCategory);

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'The VERVE Journal' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-10">
      <SEOHead
        title="The VERVE Journal | Material Science, Guides & Sustainable Design"
        description="Deep dives into circular textiles, everyday carry ergonomics, vegetable leather patinas, and intentional minimalism."
        canonicalPath={currentPath}
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <div className="border-b border-stone-200 pb-8 space-y-3">
        <span className="text-xs uppercase tracking-widest text-amber-700 font-bold flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Editorial & Guides
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          The VERVE Journal
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
          Essays on material ethics, design philosophies, garment longevity, and field guides to thoughtful carry.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => navigate(`/journal/${article.slug}`)}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-400 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
              <img
                src={article.coverImage}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-stone-900/90 text-white rounded backdrop-blur-xs">
                {article.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>

                <h2 className="text-lg font-bold text-stone-900 group-hover:text-stone-700 transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900">
                <span className="group-hover:underline">Read Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
