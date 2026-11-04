const fs = require('fs');
const filePath = 'client/src/features/admin/Dashboard.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

const startIndex = content.indexOf('{activeTab === "Articles" && (');
const endIndex = content.indexOf('{activeTab === "Mass Mail" && (');

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);

    const newArticlesUI = `
                        {activeTab === "Articles" && (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 mb-1">Articles</h2>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manage your knowledge hub content</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (showArticleForm) {
                                                setShowArticleForm(false);
                                                setEditingArticleId(null);
                                                setArticleFormData({ title: "", description: "", content: "", category: "HR", date: "", image: "", author: "Admin" });
                                            } else {
                                                setShowArticleForm(true);
                                            }
                                        }}
                                        className="bg-primary text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all"
                                    >
                                        {showArticleForm ? (
                                            <><X size={16} /> Cancel</>
                                        ) : (
                                            <><Plus size={16} /> New Article</>
                                        )}
                                    </button>
                                </div>

                                {showArticleForm ? (
                                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900">{editingArticleId ? "Edit Article" : "New Article"}</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Publish insightful content to the knowledge hub</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleArticleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Title</label>
                                                    <input type="text" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20" value={articleFormData.title} onChange={e => setArticleFormData({...articleFormData, title: e.target.value})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                                                    <input type="text" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20" value={articleFormData.category} onChange={e => setArticleFormData({...articleFormData, category: e.target.value})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publish Date</label>
                                                    <input type="date" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20" value={articleFormData.date} onChange={e => setArticleFormData({...articleFormData, date: e.target.value})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author (Optional)</label>
                                                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20" value={articleFormData.author} onChange={e => setArticleFormData({...articleFormData, author: e.target.value})} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Short Description</label>
                                                <textarea required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold h-24 focus:ring-2 focus:outline-none focus:ring-primary/20" value={articleFormData.description} onChange={e => setArticleFormData({...articleFormData, description: e.target.value})}></textarea>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Content</label>
                                                <textarea required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-medium h-64 focus:ring-2 focus:outline-none focus:ring-primary/20" value={articleFormData.content} onChange={e => setArticleFormData({...articleFormData, content: e.target.value})}></textarea>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Header Image</label>
                                                {articleFormData.image && (
                                                    <div className="mb-4 w-48 h-24 rounded-xl overflow-hidden shadow-sm relative">
                                                        <img src={articleFormData.image} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
                                                    <ImageKitUpload 
                                                        limit={1} 
                                                        onUploadSuccess={(urls) => setArticleFormData({...articleFormData, image: urls[0]})}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-4 pt-8 justify-end">
                                                <button type="button" onClick={() => { setShowArticleForm(false); setEditingArticleId(null); setArticleFormData({ title: "", description: "", content: "", category: "HR", date: "", image: "", author: "Admin" }); }} className="px-8 py-3 rounded-xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 text-xs uppercase tracking-wider transition-colors">Cancel</button>
                                                <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-black hover:bg-primary/90 text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-primary/20 transition-all">
                                                    <CheckCircle2 size={16} /> Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {articles.map(article => (
                                            <div key={article._id} className="group bg-white rounded-[2.5rem] border border-slate-100 flex overflow-hidden relative min-h-[220px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                                {/* Left Content */}
                                                <div className="flex-1 p-8 pr-4 z-10 flex flex-col justify-center">
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="mt-1 p-2 bg-primary/5 rounded-lg text-primary">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-xl text-slate-900 mb-2 leading-tight pr-12">{article.title}</h3>
                                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                                <span className="text-primary">{article.category}</span>
                                                                <span>•</span>
                                                                <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-500 line-clamp-2 mt-2">{article.description}</p>
                                                </div>

                                                {/* Right Image area with gradient overlay */}
                                                <div className="w-1/3 relative overflow-hidden rounded-[2.5rem] m-2">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent z-10"></div>
                                                    {article.image ? (
                                                        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-100"></div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditArticle(article)} className="p-2.5 bg-white hover:bg-primary hover:text-white text-slate-400 rounded-full transition-all shadow-xl">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(article._id, 'article')} className="p-2.5 bg-white hover:bg-red-500 hover:text-white text-slate-400 rounded-full transition-all shadow-xl">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        `;
    fs.writeFileSync(filePath, before + newArticlesUI + after);
    console.log("Dashboard Articles UI updated successfully using absolute bounds.");
} else {
    console.error("Could not find boundaries.");
}
