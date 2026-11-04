const fs = require('fs');

const filePath = 'client/src/features/admin/Dashboard.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add ConfigContext and ImageKitUpload imports
content = content.replace('import { ToastContainer } from "../../components/Toast.jsx";', 'import { ToastContainer } from "../../components/Toast.jsx";\nimport { ConfigContext } from "../../App.jsx";\nimport { ImageKitUpload } from "../../components/ImageKitUpload.jsx";');

// 2. Add FileText to lucide-react imports
content = content.replace('    Mail\n} from "lucide-react";', '    Mail,\n    FileText\n} from "lucide-react";');

// 3. Add articles states
const statesToAdd = `
    const [articles, setArticles] = useState([]);
    const [articleFormData, setArticleFormData] = useState({ title: "", description: "", content: "", category: "HR", date: "", image: "", author: "Admin" });
    const [editingArticleId, setEditingArticleId] = useState(null);
`;
content = content.replace('const [toasts, setToasts] = useState([]);', 'const [toasts, setToasts] = useState([]);' + statesToAdd);

// 4. Add useContext for config inside AdminDashboard component
const contextStr = `
    const { isQuizEnabled, setIsQuizEnabled } = React.useContext(ConfigContext);
    const [configLoading, setConfigLoading] = useState(false);
`;
content = content.replace('const [loading, setLoading] = useState(true);', contextStr + '\n    const [loading, setLoading] = useState(true);');

// 5. Add Articles to validTabs
content = content.replace('const validTabs = ["Overview", "Members", "Secondary Admins", "Mentors", "Sponsors", "Committee", "Events", "Quiz", "Mass Mail", "Settings"];', 'const validTabs = ["Overview", "Members", "Secondary Admins", "Mentors", "Sponsors", "Committee", "Events", "Quiz", "Articles", "Mass Mail", "Settings"];');

// 6. Add to sidebarItems
content = content.replace('{ icon: Mail, label: "Mass Mail" },', '{ icon: FileText, label: "Articles" },\n        { icon: Mail, label: "Mass Mail" },');

// 7. Add to API calls
content = content.replace('api.getMembers(),\n                    api.getEvents(),', 'api.getMembers(),\n                    api.getEvents(),\n                    api.getArticles(),');

// 8. Add to Promise variables
content = content.replace('const [memberData, eventData, mentorData, committeeData, quizData, statsData, sponsorData, galleryData]', 'const [memberData, eventData, articleData, mentorData, committeeData, quizData, statsData, sponsorData, galleryData]');

content = content.replace('[memberData, eventData, mentorData, committeeData, quizData, statsData, sponsorData, galleryData].forEach', '[memberData, eventData, articleData, mentorData, committeeData, quizData, statsData, sponsorData, galleryData].forEach');

// 9. Process articleData
const processArticleStr = `
                if (articleData.status === 'fulfilled') {
                    setArticles(articleData.value || []);
                }
`;
content = content.replace('if (eventData.status === \'fulfilled\') {', processArticleStr + '\n                if (eventData.status === \'fulfilled\') {');

// 10. Add Article Handlers
const articleHandlers = `
    const handleArticleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingArticleId) await api.updateArticle(editingArticleId, articleFormData);
            else await api.createArticle(articleFormData);
            setArticleFormData({ title: "", description: "", content: "", category: "HR", date: "", image: "", author: "Admin" });
            setEditingArticleId(null);
            fetchData();
        } catch (err) {
            addToast("Failed to save article.", "error");
        }
    };

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
    };
    
    const toggleConfig = async (key, currentValue) => {
        setConfigLoading(true);
        try {
            const res = await api.updateConfig(key, { value: !currentValue });
            if (key === "isQuizEnabled") setIsQuizEnabled(res.value);
            addToast("Configuration updated.", "success");
        } catch (err) {
            addToast("Failed to update config.", "error");
        } finally {
            setConfigLoading(false);
        }
    };
`;
content = content.replace('const handleEventSubmit = async (e) => {', articleHandlers + '\n    const handleEventSubmit = async (e) => {');

// 11. Add UI for Articles Tab
const articlesTabUI = `
                        {activeTab === "Articles" && (
                            <div className="space-y-12">
                                <div className="bg-white p-8 rounded-3xl border border-slate-100">
                                    <h2 className="text-xl font-bold mb-6">{editingArticleId ? "Edit Article" : "Add New Article"}</h2>
                                    <form onSubmit={handleArticleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input type="text" placeholder="Title" required className="p-3 bg-slate-50 rounded-xl" value={articleFormData.title} onChange={e => setArticleFormData({...articleFormData, title: e.target.value})} />
                                            <input type="text" placeholder="Category" required className="p-3 bg-slate-50 rounded-xl" value={articleFormData.category} onChange={e => setArticleFormData({...articleFormData, category: e.target.value})} />
                                            <input type="date" required className="p-3 bg-slate-50 rounded-xl" value={articleFormData.date} onChange={e => setArticleFormData({...articleFormData, date: e.target.value})} />
                                            <input type="text" placeholder="Author" required className="p-3 bg-slate-50 rounded-xl" value={articleFormData.author} onChange={e => setArticleFormData({...articleFormData, author: e.target.value})} />
                                        </div>
                                        <input type="text" placeholder="Short Description" required className="w-full p-3 bg-slate-50 rounded-xl" value={articleFormData.description} onChange={e => setArticleFormData({...articleFormData, description: e.target.value})} />
                                        <textarea placeholder="Article Content (HTML allowed)" required className="w-full p-3 bg-slate-50 rounded-xl h-48" value={articleFormData.content} onChange={e => setArticleFormData({...articleFormData, content: e.target.value})}></textarea>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Header Image</label>
                                            <ImageKitUpload 
                                                limit={1} 
                                                onUploadSuccess={(urls) => setArticleFormData({...articleFormData, image: urls[0]})}
                                            />
                                            {articleFormData.image && (
                                                <div className="mt-2 text-xs text-green-600 font-bold">Image uploaded!</div>
                                            )}
                                        </div>
                                        
                                        <div className="flex gap-4">
                                            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary/90">{editingArticleId ? "Update Article" : "Publish Article"}</button>
                                            {editingArticleId && (
                                                <button type="button" onClick={() => { setEditingArticleId(null); setArticleFormData({ title: "", description: "", content: "", category: "HR", date: "", image: "", author: "Admin" }); }} className="bg-slate-100 text-slate-600 px-6 py-2 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                                
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold">Published Articles</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {articles.map(article => (
                                            <div key={article._id} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col">
                                                {article.image && <img src={article.image} alt={article.title} className="w-full h-32 object-cover rounded-xl mb-4" />}
                                                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                                                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{article.description}</p>
                                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                                                    <button onClick={() => handleEditArticle(article)} className="text-primary hover:bg-primary/10 p-2 rounded-xl"><Edit2 size={18} /></button>
                                                    <button onClick={() => handleDeleteClick(article._id, 'article')} className="text-red-500 hover:bg-red-50 p-2 rounded-xl"><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
`;
content = content.replace('{activeTab === "Mass Mail" && (', articlesTabUI + '\n                        {activeTab === "Mass Mail" && (');

// 12. Add Config UI to Settings
const configUI = `
                                {/* Global Configuration Section */}
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm mt-8">
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Global Settings</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Manage application-wide configurations</p>
                                    
                                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">HR Quiz Feature</h4>
                                            <p className="text-sm text-slate-500 mt-1">Enable or disable the HR Quiz feature across the entire website.</p>
                                        </div>
                                        <button 
                                            onClick={() => toggleConfig("isQuizEnabled", isQuizEnabled)}
                                            disabled={configLoading}
                                            className={\`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none \${isQuizEnabled ? 'bg-primary' : 'bg-slate-300'}\`}
                                        >
                                            <span className={\`inline-block h-6 w-6 transform rounded-full bg-white transition-transform \${isQuizEnabled ? 'translate-x-7' : 'translate-x-1'}\`} />
                                        </button>
                                    </div>
                                </div>
`;
content = content.replace('{/* City/Phone/Pincode only for Secondary Admins (Complete Profile) */}', configUI + '\n                                                    {/* City/Phone/Pincode only for Secondary Admins (Complete Profile) */}');

// 13. Handle Delete for Articles
content = content.replace("else if (type === 'committee') await api.deleteCommitteeMember(id);", "else if (type === 'committee') await api.deleteCommitteeMember(id);\n                    else if (type === 'article') await api.deleteArticle(id);");


fs.writeFileSync(filePath, content);
console.log("Dashboard updated successfully!");
