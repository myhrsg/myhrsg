const fs = require('fs');

const filePath = 'client/src/features/admin/Dashboard.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Add showArticleForm state
const newStates = `
    const [editingArticleId, setEditingArticleId] = useState(null);
    const [showArticleForm, setShowArticleForm] = useState(false);
`;
content = content.replace('const [editingArticleId, setEditingArticleId] = useState(null);', newStates);

// Modify handleEditArticle to also show form
const editArticleFn = `
    const handleEditArticle = (article) => {
        setArticleFormData({
            title: article.title,
            description: article.description,
            content: article.content,
            category: article.category,
            date: new Date(article.date).toISOString().split('T')[0],
            image: article.image,
            author: article.author || "Admin"
        });
        setEditingArticleId(article._id);
        setShowArticleForm(true);
    };
`;
content = content.replace(/const handleEditArticle = \(article\) => \{[\s\S]*?setEditingArticleId\(article._id\);\n    \};/, editArticleFn.trim());

// Modify handleArticleSubmit to hide form
const articleSubmitFn = `
    const handleArticleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingArticleId) await api.updateArticle(editingArticleId, articleFormData);
            else await api.createArticle(articleFormData);
            setArticleFormData({ title: "", description: "", content: "", category: "HR", date: "", image: "", author: "Admin" });
            setEditingArticleId(null);
            setShowArticleForm(false);
            fetchData();
        } catch (err) {
            addToast("Failed to save article.", "error");
        }
    };
`;
content = content.replace(/const handleArticleSubmit = async \(e\) => \{[\s\S]*?fetchData\(\);\n        \} catch \(err\) \{[\s\S]*?\}\n    \};/, articleSubmitFn.trim());

// New UI string
const newArticlesUI = `
                        {activeTab === "Articles" && (
                            <div className="space-y-8 bg-[#0a0a0a] p-8 -mx-8 -mt-8 min-h-screen text-white">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-serif font-bold text-white">Articles</h2>
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
                                        className="bg-white text-black px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-slate-200"
                                    >
                                        {showArticleForm ? (
                                            <><X size={16} /> Cancel</>
                                        ) : (
                                            <><Plus size={16} /> New Article</>
                                        )}
                                    </button>
                                </div>

                                {showArticleForm ? (
                                    <div className="bg-[#111111] p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
                                        {/* Blue accent line */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                        
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <h3 className="text-2xl font-serif font-bold text-white">{editingArticleId ? "Edit Article" : "New Article"}</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Publish insightful content to the knowledge hub</p>
                                            </div>
                                            <button onClick={() => { setShowArticleForm(false); setEditingArticleId(null); setArticleFormData({ title: "", description: "", content: "", category: "HR", date: "", image: "", author: "Admin" }); }} className="p-2 bg-[#1a1a1a] rounded-full text-slate-400 hover:text-white">
                                                <X size={16} />
                                            </button>
                                        </div>

                                        <form onSubmit={handleArticleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Title</label>
                                                    <input type="text" required className="w-full p-4 bg-[#1a1a1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500" value={articleFormData.title} onChange={e => setArticleFormData({...articleFormData, title: e.target.value})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                                                    <input type="text" required className="w-full p-4 bg-[#1a1a1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500" value={articleFormData.category} onChange={e => setArticleFormData({...articleFormData, category: e.target.value})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publish Date</label>
                                                    <input type="date" required className="w-full p-4 bg-[#1a1a1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]" value={articleFormData.date} onChange={e => setArticleFormData({...articleFormData, date: e.target.value})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author (Optional)</label>
                                                    <input type="text" className="w-full p-4 bg-[#1a1a1a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500" value={articleFormData.author} onChange={e => setArticleFormData({...articleFormData, author: e.target.value})} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Short Description</label>
                                                <textarea required className="w-full p-4 bg-[#1a1a1a] border border-slate-800 rounded-xl text-white h-24 focus:outline-none focus:border-blue-500" value={articleFormData.description} onChange={e => setArticleFormData({...articleFormData, description: e.target.value})}></textarea>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Content</label>
                                                <textarea required className="w-full p-4 bg-[#1a1a1a] border border-slate-800 rounded-xl text-white h-64 focus:outline-none focus:border-blue-500" value={articleFormData.content} onChange={e => setArticleFormData({...articleFormData, content: e.target.value})}></textarea>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Header Image</label>
                                                {articleFormData.image && (
                                                    <div className="mb-4 w-48 h-24 rounded-xl overflow-hidden border border-slate-800 relative">
                                                        <img src={articleFormData.image} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl bg-[#1a1a1a] flex flex-col items-center justify-center text-center">
                                                    <ImageKitUpload 
                                                        limit={1} 
                                                        onUploadSuccess={(urls) => setArticleFormData({...articleFormData, image: urls[0]})}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-4 pt-4 border-t border-slate-800 justify-end">
                                                <button type="button" onClick={() => { setShowArticleForm(false); setEditingArticleId(null); setArticleFormData({ title: "", description: "", content: "", category: "HR", date: "", image: "", author: "Admin" }); }} className="px-8 py-3 rounded-xl font-bold text-slate-300 bg-[#1a1a1a] hover:bg-slate-800 text-xs uppercase tracking-wider">Cancel</button>
                                                <button type="submit" className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 text-xs uppercase tracking-wider flex items-center gap-2">
                                                    <CheckCircle2 size={16} /> Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {articles.map(article => (
                                            <div key={article._id} className="group bg-[#111111] rounded-3xl border border-slate-800 flex overflow-hidden relative min-h-[220px]">
                                                {/* Left Content */}
                                                <div className="flex-1 p-8 pr-4 z-10 flex flex-col justify-center">
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="mt-1 p-2 bg-[#1a1a1a] rounded-lg text-blue-400">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-xl text-white mb-2 leading-tight pr-12">{article.title}</h3>
                                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                                <span>{article.category}</span>
                                                                <span>•</span>
                                                                <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-400 line-clamp-2 mt-2">{article.description}</p>
                                                </div>

                                                {/* Right Image area with gradient overlay */}
                                                <div className="w-1/3 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent z-10"></div>
                                                    {article.image && (
                                                        <img src={article.image} alt={article.title} className="w-full h-full object-cover opacity-50" />
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditArticle(article)} className="p-2.5 bg-[#1a1a1a] hover:bg-blue-500 hover:text-white text-slate-400 rounded-full border border-slate-700 transition-all shadow-xl">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(article._id, 'article')} className="p-2.5 bg-[#1a1a1a] hover:bg-red-500 hover:text-white text-slate-400 rounded-full border border-slate-700 transition-all shadow-xl">
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

content = content.replace(/\{activeTab === "Articles" && \([\s\S]*?\}\n                                  <\/div>\n                              <\/div>\n                          \)\}/, newArticlesUI.trim());

fs.writeFileSync(filePath, content);
console.log("Dashboard Articles UI updated to dark theme.");
