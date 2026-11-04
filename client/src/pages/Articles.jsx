import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import StarBorder from "../components/StarBorder.jsx";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await api.getArticles();
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
           
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 text-primary font-black uppercase tracking-widest text-[10px] sm:text-xs mb-4">
            <BookOpen size={14} />
            <span>Knowledge Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-6 tracking-tight leading-tight">
            Articles & Insights
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Explore our curated research, news, and deep dives into the rapidly evolving landscape of HR and Global Capability Centers.
          </p>
        </div>                     

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            No articles found. Check back later!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
              {paginatedArticles.map((article) => (
                <Link 
                  to={`/blog/${article.slug || article._id}`}
                  key={article._id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full cursor-pointer block"
                >
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    {article.image ? (
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <BookOpen size={48} strokeWidth={1} />
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(article.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif text-slate-900 mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {article.description}
                    </p>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary text-xs uppercase">
                          {article.author?.charAt(0) || "A"}
                        </div>
                        {article.author || "Admin"}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-16 animate-in fade-in duration-500">
                {/* Prev Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-slate-150 text-xs font-black uppercase tracking-wider text-slate-700 hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:hover:border-slate-150 disabled:hover:text-slate-700 disabled:cursor-not-allowed shadow-sm flex items-center gap-1"
                >
                  Prev
                </button>

                {/* Numeric Page Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-2xl text-xs font-black transition-all shadow-sm ${
                      currentPage === page
                        ? "bg-primary text-white scale-105 shadow-md shadow-primary/20"
                        : "bg-white border border-slate-150 text-slate-700 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-slate-150 text-xs font-black uppercase tracking-wider text-slate-700 hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:hover:border-slate-150 disabled:hover:text-slate-700 disabled:cursor-not-allowed shadow-sm flex items-center gap-1"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Articles;
