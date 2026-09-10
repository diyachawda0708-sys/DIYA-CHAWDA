import React, { useMemo } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { ARTICLES } from '../data/articles';
import { PRODUCTS } from '../data/products';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEOHead } from '../components/seo/SEOHead';
import { ProductCard } from '../components/product/ProductCard';
import { Clock, Calendar, User, ArrowLeft, ArrowRight, Share2, Sparkles, BookOpen } from 'lucide-react';

interface ArticleDetailPageProps {
  slug: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug }) => {
  const { currentPath, navigate, addToast } = useEcommerce();

  const article = useMemo(() => {
    return ARTICLES.find((a) => a.slug === slug) || ARTICLES[0];
  }, [slug]);

  // Find products mentioned in or related to this article
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => article.relatedProductSlugs?.includes(p.slug));
  }, [article]);

  const otherArticles = useMemo(() => {
    return ARTICLES.filter((a) => a.id !== article.id).slice(0, 2);
  }, [article]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Article link copied to clipboard!', 'success');
    }
  };

  const breadcrumbs = [
    { label: 'Journal', path: '/journal' },
    { label: article.category, path: '/journal' },
    { label: article.title },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-10">
      <SEOHead
        title={`${article.title} | VERVE Journal`}
        description={article.excerpt}
        canonicalPath={currentPath}
        ogImage={article.coverImage}
        ogType="article"
        article={article}
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 rounded-md">
            {article.category}
          </span>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Metadata byline */}
        <div className="flex items-center gap-4 text-xs text-stone-500 pt-2 border-y border-stone-200 py-3">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <span className="font-bold text-stone-900 block">{article.author.name}</span>
              <span className="text-[11px] text-stone-400">{article.author.role}</span>
            </div>
          </div>
          <div className="h-4 w-px bg-stone-300" />
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{article.date}</span>
          </div>
          <div className="h-4 w-px bg-stone-300" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="aspect-16/9 rounded-2xl overflow-hidden bg-stone-100 shadow-xs border border-stone-200">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Markdown/Content Body */}
      <div className="prose prose-stone max-w-none text-stone-800 text-base leading-relaxed space-y-6">
        {(Array.isArray(article.content) ? article.content : String(article.content).split('\n\n')).map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="font-serif text-xl sm:text-2xl font-bold text-stone-900 pt-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('- ')) {
            const items = paragraph.split('\n');
            return (
              <ul key={index} className="list-disc pl-5 space-y-1.5 text-stone-700">
                {items.map((it, idx) => (
                  <li key={idx}>{it.replace('- ', '')}</li>
                ))}
              </ul>
            );
          }
          return <p key={index}>{paragraph}</p>;
        })}
      </div>

      {/* FEATURED PRODUCTS INSIDE ARTICLE (Content-driven SEO loop requirement) */}
      {relatedProducts.length > 0 && (
        <section className="p-6 sm:p-8 bg-stone-100 rounded-2xl border border-stone-200/80 space-y-6 my-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Mentioned in This Guide
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Featured Essentials
              </h3>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="text-xs font-bold text-stone-900 hover:underline hidden sm:block"
            >
              Browse All Catalog
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} listName="Article Featured Products" />
            ))}
          </div>
        </section>
      )}

      {/* Author Bio Box */}
      <div className="p-6 bg-white rounded-xl border border-stone-200 flex items-start gap-4">
        <img
          src={article.author.avatar}
          alt={article.author.name}
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-stone-900">About {article.author.name}</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            {article.author.role} at VERVE. Dedicated to investigating sustainable material lifecycles, circular weaving methodologies, and reducing post-consumer textile waste.
          </p>
        </div>
      </div>

      {/* Read Next Section */}
      {otherArticles.length > 0 && (
        <div className="pt-10 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-stone-900">Continue Reading</h3>
            <button
              onClick={() => navigate('/journal')}
              className="text-xs font-semibold text-stone-900 hover:underline flex items-center gap-1"
            >
              <span>All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => navigate(`/journal/${art.slug}`)}
                className="group p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-400 cursor-pointer space-y-2 transition-colors"
              >
                <span className="text-[10px] uppercase font-bold text-amber-700">
                  {art.category}
                </span>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-stone-700 leading-snug">
                  {art.title}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-2">{art.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
