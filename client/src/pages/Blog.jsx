import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api.js";
import { Calendar, User, ArrowLeft, Share2, Linkedin, Twitter, Facebook } from "lucide-react";

const Blog = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await api.getArticleById(id);
        setArticle(data);
      } catch (error) {
        console.error("Failed to fetch article", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article) {
      // 1. Update browser tab title
      document.title = article.metaTitle || `${article.title} | myHRSG`;

      // Helper to upsert meta tags
      const setMetaTag = (attribute, nameOrProperty, value) => {
        if (!value) return;
        let element = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`);
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute(attribute, nameOrProperty);
          document.head.appendChild(element);
        }
        element.setAttribute("content", value);
      };

      // 2. Set description meta tag
      setMetaTag("name", "description", article.metaDescription || article.description);

      // 3. Set Open Graph (Facebook/LinkedIn) meta tags
      setMetaTag("property", "og:title", article.metaTitle || article.title);
      setMetaTag("property", "og:description", article.metaDescription || article.description);
      if (article.image) {
        setMetaTag("property", "og:image", article.image);
      }
    }
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Article Not Found</h2>
        <Link to="/articles" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Articles
        </Link>
      </div>
    );
  }

  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <Link 
          to="/articles" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={16} />
          Back to Articles
        </Link>
        
        <div className="mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            {article.category}
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl lg:text-[2.75rem] font-bold text-slate-900 mb-6 leading-tight tracking-tight max-w-3xl mx-auto">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <User size={16} />
            {article.author || "Admin"}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(article.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.image && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="rounded-[2rem] overflow-hidden w-full bg-slate-50 border border-slate-100 shadow-lg">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-auto block hover:scale-[1.01] transition-transform duration-700"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12">
        <style>{`
          .blog-content-area ul {
            list-style-type: disc !important;
            padding-left: 2rem !important;
            margin-top: 1rem !important;
            margin-bottom: 1rem !important;
          }
          .blog-content-area ol {
            list-style-type: decimal !important;
            padding-left: 2rem !important;
            margin-top: 1rem !important;
            margin-bottom: 1rem !important;
          }
          .blog-content-area li {
            display: list-item !important;
            margin-bottom: 0.5rem !important;
          }
          .blog-content-area a {
            color: #06b6d4 !important;
            text-decoration: underline !important;
            font-weight: bold !important;
          }
        `}</style>
        
        {/* Main Content Body */}
        <article className="prose prose-slate prose-lg md:prose-xl max-w-none w-full">
          {/* For now, just render the text. If it contains HTML, we can use dangerouslySetInnerHTML */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} className="blog-content-area text-slate-700 leading-loose"></div>
        </article>
      </div>

    </div>
  );
};

export default Blog;
