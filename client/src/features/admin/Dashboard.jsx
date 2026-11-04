import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
    Users,
    Calendar,
    Settings,
    Search,
    LayoutDashboard,
    CheckCircle2,
    XCircle,
    Edit2,
    Trash2,
    Plus,
    Upload,
    Link as LinkIcon,
    MapPin,
    TrendingUp,
    Building2,
    BarChart as BarChartIcon,
    HelpCircle,
    Menu,
    X,
    Shield,
    Linkedin,
    Activity,
    Briefcase,
    Target,
    ArrowUpRight,
    User,
    UserPlus,
    LogOut,
    RefreshCw,
    Rocket,
    Clock,
    Edit,
    Gem,
    Image as ImageIcon,
    Mail,
    FileText,
    Video,
    MessageSquare,
    Sliders,
    MessageCircle,
    GripVertical,
    ExternalLink
} from "lucide-react";
import ImageKit from "imagekit-javascript";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { api } from "../../services/api.js";
import { ToastContainer } from "../../components/Toast.jsx";
import { ConfigContext } from "../../App.jsx";
import { ImageKitUpload } from "../../components/ImageKitUpload.jsx";
import { ConfirmationModal } from "../../components/ConfirmationModal.jsx";
import RichTextEditor from "../../components/RichTextEditor.jsx";

const CHART_COLORS = ['#0A66C2', '#3b82f6', '#1E293B', '#64748b', '#94a3b8', '#CBD5E1', '#F1F5F9'];

const MemberCard = ({
    member,
    isExpanded,
    onToggle,
    onApprove,
    onReject,
    onUndo,
    onRemove,
    onRoleUpdate,
    onPromoteMain,
    showActions = true,
    isMainAdmin = false,
    showRoleToggle = true
}) => {
    return (
        <div className={`bg-white border ${isExpanded ? 'border-slate-300 shadow-xl scale-[1.01]' : (member.status === 'rejected' ? 'border-red-100 bg-red-50/10' : 'border-slate-100 shadow-sm')} rounded-[2.5rem] transition-all duration-500 overflow-hidden`}>
            {/* minimalist Collapsed View */}
            <div className="p-6 flex items-center justify-between group">
                <div
                    className="flex-grow cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                >
                    <h4 className="font-bold text-slate-900 text-sm tracking-tight leading-tight truncate hover:text-primary transition-colors">{member.name}</h4>
                </div>

                <div className="flex items-center gap-3">
                    {member.status === 'pending' && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); onApprove(member._id); }}
                                className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                                title="Accept"
                            >
                                <CheckCircle2 size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onReject(member._id); }}
                                className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90"
                                title="Reject"
                            >
                                <XCircle size={20} />
                            </button>
                        </>
                    )}
                    <div
                        className={`p-1.5 rounded-full bg-slate-50 transition-transform duration-300 cursor-pointer ${isExpanded ? 'rotate-45 text-primary' : 'text-slate-300'}`}
                        onClick={(e) => { e.stopPropagation(); onToggle(); }}
                    >
                        <Plus size={14} />
                    </div>
                </div>
            </div>

            {/* Detailed Expanded View */}
            {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-8 pb-8 pt-2 space-y-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-100 shadow-lg flex items-center justify-center">
                                {member.profileImage ? (
                                    <img src={member.profileImage} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary font-black text-3xl">
                                        {member.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${member.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                member.status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                    'bg-amber-50 text-amber-600 border border-amber-100'
                                }`}>
                                {member.status === 'accepted' ? 'Accepted' : member.status}
                            </span>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] pl-1">
                                {member.role === 'admin' ? 'ADMIN' : 'MEMBER'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100/50 space-y-1.5">
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest pl-1">Contact Method</p>
                            <p className="text-xs font-bold text-slate-800 break-all">{member.email}</p>
                        </div>

                        <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100/50 space-y-1.5">
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest pl-1">Primary Location</p>
                            <p className="text-xs font-bold text-slate-800">
                                {member.city || 'N/A'}{member.pincode ? `, ${member.pincode}` : ''}
                            </p>
                        </div>
                    </div>

                    {member.linkedin ? (
                        <a
                            href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-3 bg-[#0A66C2] text-white py-4 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest hover:bg-[#004182] transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98]"
                        >
                            <Linkedin size={14} fill="white" /> View Professional Network
                        </a>
                    ) : (
                        <div className="w-full flex items-center justify-center gap-3 bg-slate-50 text-slate-400 py-4 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest cursor-not-allowed border border-slate-100">
                            <Linkedin size={14} /> Profile Not Provided
                        </div>
                    )}

                    {showActions && (
                        <div className="flex flex-col gap-3 pt-4 border-t border-slate-50">
                            <div className="flex gap-3">
                                {member.status === 'pending' && (
                                    <>
                                        <button onClick={(e) => { e.stopPropagation(); onApprove(member._id); }} className="flex-grow bg-emerald-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-[0.98]">Approve Access</button>
                                        <button onClick={(e) => { e.stopPropagation(); onReject(member._id); }} className="px-8 bg-rose-50 text-rose-600 border border-rose-100 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-[0.98]">Reject</button>
                                    </>
                                )}
                                {member.status === 'accepted' && (
                                    <>
                                        <button onClick={(e) => { e.stopPropagation(); onUndo(member._id); }} className="flex-grow bg-slate-100 text-slate-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-[0.98]">Undo Approval</button>
                                        <button onClick={(e) => { e.stopPropagation(); onRemove(member._id); }} className="px-8 bg-rose-50 text-rose-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-[0.98]">Remove</button>
                                    </>
                                )}
                                {member.status === 'rejected' && (
                                    <button onClick={(e) => { e.stopPropagation(); onUndo(member._id); }} className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-[0.98]">Undo Rejection</button>
                                )}
                            </div>

                            {/* Promote to Main Admin Action */}
                            {isMainAdmin && !member.isMainAdmin && member.role === 'admin' && onPromoteMain && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onPromoteMain(member._id); }}
                                    className="w-full py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                                >
                                    <Shield size={12} className="group-hover:fill-current" /> Elevate to Main Administrator
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [events, setEvents] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [stats, setStats] = useState(null);
    
    const { isQuizEnabled, setIsQuizEnabled } = React.useContext(ConfigContext);
    const [configLoading, setConfigLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        const validTabs = ["Overview", "Members", "Secondary Admins", "Mentors", "Sponsors", "Committee", "Events", "Quiz", "Articles", "WhatsApp", "Mass Mail", "Settings"];
        return (tab && validTabs.includes(tab)) ? tab : "Overview";
    });
    const [eventSubTab, setEventSubTab] = useState("Upcoming Events");
    const [memberSubTab, setMemberSubTab] = useState("Members");
    const [activeSubView, setActiveSubView] = useState("Analytics");
    const [toasts, setToasts] = useState([]);
    const [articles, setArticles] = useState([]);
    const [articleFormData, setArticleFormData] = useState({ title: "", slug: "", isSlugEdited: false, description: "", content: "", category: "HR", date: "", image: "", author: "Admin", metaTitle: "", metaDescription: "", status: "draft" });
    const statusRef = useRef("draft");
    
    const [editingArticleId, setEditingArticleId] = useState(null);
    const [showArticleForm, setShowArticleForm] = useState(false);


    const [modalConfig, setModalConfig] = useState({ isOpen: false });

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };
    const [showForm, setShowForm] = useState(false);
    const [showGalleryForm, setShowGalleryForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    const [formData, setFormData] = useState({
        title: "",
        mentorName: "",
        location: "",
        date: "",
        type: "upcoming",
        registrationUrl: "",
        images: []
    });
    const [user, setUser] = useState(null);
    const [expandedMemberId, setExpandedMemberId] = useState(null);
    const [searchAdminQuery, setSearchAdminQuery] = useState("");
    const [showMemberListView, setShowMemberListView] = useState(false);
    const [existingImages, setExistingImages] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [committee, setCommittee] = useState([]);
    const [displaySponsors, setDisplaySponsors] = useState([]);
    const [whatsappCommunities, setWhatsappCommunities] = useState([]);
    const [whatsappFormData, setWhatsappFormData] = useState({ city: "", whatsappLink: "", qrImage: null });
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizSearchQuery, setQuizSearchQuery] = useState("");
    const [galleryFormData, setGalleryFormData] = useState({
        caption: "",
        images: []
    });

    const [mentorFormData, setMentorFormData] = useState({
        name: "",
        city: "",
        linkedinUrl: "",
        photo: null
    });

    const [committeeFormData, setCommitteeFormData] = useState({ name: "", role: "", city: "", linkedinUrl: "", image: null });

    const [sponsorFormData, setSponsorFormData] = useState({
        name: "",
        logo: null,
        websiteUrl: "",
        order: 0
    });

    const [showQuizForm, setShowQuizForm] = useState(false);
    const [quizFormData, setQuizFormData] = useState({
        question: "",
        options: ["", "", "", ""],
        answerIndex: 0
    });
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [overviewFilter, setOverviewFilter] = useState("members");
    const [secondaryAdminView, setSecondaryAdminView] = useState("pending"); // 'pending' or 'rejected'
    const [memberView, setMemberView] = useState("pending"); // 'pending' or 'rejected'
    const [pendingUndo, setPendingUndo] = useState(null);

    const [massMailData, setMassMailData] = useState({ subject: "", message: "" });
    const [sendingMail, setSendingMail] = useState(false);
    const [gallerySpeed, setGallerySpeed] = useState(40);

    const [testimonials, setTestimonials] = useState([]);
    const [testimonialFormData, setTestimonialFormData] = useState({
        type: "member",
        name: "",
        designation: "",
        link: "",
        order: 0
    });
    const [testimonialSearchQuery, setTestimonialSearchQuery] = useState("");
    const [isTestimonialDropdownOpen, setIsTestimonialDropdownOpen] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailUploading, setThumbnailUploading] = useState(false);
    const [editingTestimonialId, setEditingTestimonialId] = useState(null);

    const handleMassMailSubmit = async (e) => {
        e.preventDefault();
        setSendingMail(true);
        try {
            const res = await api.sendMassMail(massMailData);
            addToast(res.message || "Mass mail sent successfully!", "success");
            setMassMailData({ subject: "", message: "" });
        } catch (err) {
            addToast(err.response?.data?.error || "Failed to send mass mail.", "error");
        } finally {
            setSendingMail(false);
        }
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: "Overview" },
        { icon: Users, label: "Members" },
        ...(user?.isMainAdmin ? [{ icon: UserPlus, label: "Secondary Admins" }] : []),
        { icon: Users, label: "Mentors" },
        { icon: Gem, label: "Sponsors" },
        { icon: Video, label: "Testimonials" },
        { icon: Users, label: "Committee" },
        { icon: Calendar, label: "Events" },
        { icon: HelpCircle, label: "Quiz" },
        { icon: FileText, label: "Articles" },
        { icon: MessageCircle, label: "WhatsApp" },
        { icon: Mail, label: "Mass Mail" },
        { icon: Settings, label: "Settings" },
    ];

    const handleExportData = () => {
        if (!members.length) return;

        // Header
        const headers = ["Full Name", "Email", "Company", "City", "Pincode", "Role", "Status"];

        // Rows
        const rows = members.map(m => [
            m.name,
            m.email,
            m.company || "N/A",
            m.city || "N/A",
            m.pincode || "N/A",
            m.role,
            m.status
        ]);

        // City Frequency (Survey Logic)
        const cityCounts = {};
        members.forEach(m => {
            const city = m.city || "Unknown";
            cityCounts[city] = (cityCounts[city] || 0) + 1;
        });

        const frequencyRows = [
            [],
            ["City Distribution (Survey Report)"],
            ["City", "Count", "Percentage"],
            ...Object.entries(cityCounts).map(([city, count]) => [
                city,
                count,
                ((count / members.length) * 100).toFixed(2) + "%"
            ])
        ];

        // Combine
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(",")),
            ...frequencyRows.map(r => r.join(","))
        ].join("\n");

        // Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `myHRSG_User_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast("Report downloaded successfully!", "success");
    };

    const PendingApprovalView = () => (
        <div className="flex-grow flex items-center justify-center p-8 bg-slate-50/30">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl text-center space-y-8"
            >
                <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                    <Clock size={48} />
                </div>
                <div className="space-y-3">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Pending</h2>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        Your secondary admin application is currently under review by the Main Administrator.
                        You will handle full access once your status is <span className="text-emerald-500 font-bold uppercase">Approved</span>.
                    </p>
                </div>
                <div className="pt-4 flex flex-col gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Current Status</p>
                        <p className="text-amber-600 font-bold text-lg uppercase tracking-tight italic">Waiting for Review</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-all mt-4"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </motion.div>
        </div>
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            // Step 1: Fetch user identity and permissions first
            const userData = await api.getMe();
            const currentUser = userData?.user || null;
            setUser(currentUser);

            // Step 2: Authorization check
            if (currentUser?.role?.toLowerCase() !== 'admin') {
                navigate("/");
                return;
            }

            // Step 3: Fetch dashboard data (Don't let these failures crash the UI)
            try {
                const [memberData, eventData, articleData, mentorData, committeeData, quizData, statsData, sponsorData, galleryData, testimonialData, whatsappData] = await Promise.allSettled([
                    api.getMembers(),
                    api.getEvents(),
                    api.getArticles({ all: true }),
                    api.getMentors(),
                    api.getCommittee(),
                    api.getQuizQuestions(),
                    api.getAdminStats(),
                    api.getDisplaySponsors(),
                    api.getGalleryItems(),
                    api.getTestimonials(),
                    api.getWhatsAppCommunities()
                ]);

                // Helper to extract data from settled promise
                const getData = (result) => result.status === 'fulfilled' ? result.value : [];
                const getObj = (result) => result.status === 'fulfilled' ? result.value : null;

                setMembers(Array.isArray(getData(memberData)) ? getData(memberData) : []);
                setEvents(Array.isArray(getData(eventData)) ? getData(eventData) : []);
                setArticles(Array.isArray(getData(articleData)) ? getData(articleData) : []);
                setMentors(Array.isArray(getData(mentorData)) ? getData(mentorData) : []);
                setCommittee(Array.isArray(getData(committeeData)) ? getData(committeeData) : []);
                setQuizQuestions(Array.isArray(getData(quizData)) ? getData(quizData) : []);
                setStats(getObj(statsData));
                setDisplaySponsors(Array.isArray(getData(sponsorData)) ? getData(sponsorData) : []);
                setGalleryItems(Array.isArray(getData(galleryData)) ? getData(galleryData) : []);
                setTestimonials(Array.isArray(getData(testimonialData)) ? getData(testimonialData) : []);
                setWhatsappCommunities(Array.isArray(getData(whatsappData)) ? getData(whatsappData) : []);

                try {
                    const configRes = await api.getConfig("gallerySpeed");
                    if (configRes && configRes.value) setGallerySpeed(configRes.value);
                } catch (configErr) {
                    // Ignore missing config
                }

                // Log any failures for debugging
                [memberData, eventData, articleData, mentorData, committeeData, quizData, statsData, sponsorData, galleryData, testimonialData, whatsappData].forEach((res, idx) => {
                    if (res.status === 'rejected') {
                        console.error(`Fetch error for index ${idx}:`, res.reason);
                    }
                });

            } catch (dataErr) {
                console.error("Critical error in data fetch batch:", dataErr);
                addToast("Some dashboard data failed to load.", "error");
            }

        } catch (err) {
            console.error("Authentication check failed:", err);
            // Only redirect if it's an auth error (401/403)
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate("/login");
            } else {
                addToast("Server connection error. Please refresh.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Event Handlers
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + existingImages.length > 20) {
            addToast("Maximum 20 images allowed per event.", "error");
            return;
        }
        setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const removeNewImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setFormData({ title: "", mentorName: "", location: "", date: "", type: "upcoming", registrationUrl: "", images: [] });
        setExistingImages([]);
        setEditingId(null);
        setShowForm(false);
        setMentorFormData({ name: "", city: "", linkedinUrl: "", photo: null });
        setCommitteeFormData({ name: "", role: "", city: "", linkedinUrl: "", image: null });
        setSponsorFormData({ name: "", logo: null, websiteUrl: "", order: 0 });
        setGalleryFormData({ caption: "", images: [] });
        setWhatsappFormData({ city: "", whatsappLink: "", qrImage: null });
        setQuizFormData({ question: "", options: ["", "", "", ""], answerIndex: 0 });
        setEditingQuestionId(null);
        setShowQuizForm(false);
        setShowGalleryForm(false);
        setTestimonialFormData({ type: "member", name: "", designation: "", link: "", order: 0 });
        setTestimonialSearchQuery("");
        setIsTestimonialDropdownOpen(false);
        setThumbnailFile(null);
        setThumbnailUploading(false);
        setEditingTestimonialId(null);
    };

    const handleEditTestimonial = (testimonial) => {
        setTestimonialFormData({
            type: testimonial.type,
            name: testimonial.name,
            designation: testimonial.designation,
            link: testimonial.link,
            thumbnail: testimonial.thumbnail || "",
            order: testimonial.order || 0
        });
        setEditingTestimonialId(testimonial._id);
        setShowForm(true);
    };

    const handleTestimonialSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!testimonialFormData.name) {
                addToast("Please enter a name.", "error");
                setLoading(false);
                return;
            }

            if (!testimonialFormData.link) {
                addToast("Please enter the Instagram or LinkedIn link.", "error");
                setLoading(false);
                return;
            }

            let finalThumbnailUrl = "";
            
            if (thumbnailFile) {
                setThumbnailUploading(true);
                addToast("Uploading custom thumbnail to ImageKit...", "info");
                try {
                    const authParams = await api.getImageKitAuth();
                    const imagekit = new ImageKit({
                        publicKey: "public_B+2/j8qQP/Gd5dggjt/QYzhXTTs=",
                        urlEndpoint: "https://ik.imagekit.io/eghvqjnt4",
                    });
                    const response = await imagekit.upload({
                        file: thumbnailFile,
                        fileName: `${Date.now()}-${thumbnailFile.name}`,
                        signature: authParams.signature,
                        token: authParams.token,
                        expire: authParams.expire,
                        folder: "/sponsors",
                    });
                    finalThumbnailUrl = response.url;
                } catch (uploadErr) {
                    console.error("ImageKit Thumbnail Upload Error:", uploadErr);
                    throw new Error(`Thumbnail upload failed: ${uploadErr.message || "Please check image parameters."}`);
                } finally {
                    setThumbnailUploading(false);
                }
            }

            const submitData = {
                type: testimonialFormData.type,
                name: testimonialFormData.name,
                designation: testimonialFormData.designation,
                link: testimonialFormData.link,
                thumbnail: finalThumbnailUrl || testimonialFormData.thumbnail,
                order: testimonialFormData.order || 0
            };

            if (editingTestimonialId) {
                await api.updateTestimonial(editingTestimonialId, submitData);
                addToast("Testimonial updated successfully!", "success");
            } else {
                await api.createTestimonial(submitData);
                addToast("Testimonial added successfully!", "success");
            }
            
            resetForm();
            fetchData();
        } catch (err) {
            console.error("Save Testimonial Error:", err);
            const errMsg = err.response?.data?.error || err.message || "Failed to save testimonial.";
            addToast(errMsg, "error");
        } finally {
            setLoading(false);
            setThumbnailUploading(false);
        }
    };

    const handleArticleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...articleFormData,
                status: statusRef.current
            };
            if (editingArticleId) await api.updateArticle(editingArticleId, submitData);
            else await api.createArticle(submitData);
            setArticleFormData({ title: "", slug: "", isSlugEdited: false, description: "", content: "", category: "HR", date: "", image: "", author: "Admin", metaTitle: "", metaDescription: "", status: "draft" });
            statusRef.current = "draft";
            setEditingArticleId(null);
            setShowArticleForm(false);
            fetchData();
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to save article.";
            addToast(errMsg, "error");
        }
    };

    const handleEditArticle = (article) => {
        setArticleFormData({
            title: article.title,
            slug: article.slug || "",
            isSlugEdited: !!article.slug,
            description: article.description,
            content: article.content,
            category: article.category,
            date: new Date(article.date).toISOString().split('T')[0],
            image: article.image,
            author: article.author || "Admin",
            metaTitle: article.metaTitle || "",
            metaDescription: article.metaDescription || "",
            status: article.status || "draft"
        });
        statusRef.current = article.status || "draft";
        setEditingArticleId(article._id);
        setShowArticleForm(true);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'images') data.append(key, formData[key]);
        });
        formData.images.forEach(image => data.append("images", image));
        if (editingId) existingImages.forEach(url => data.append("existingImages", url));

        try {
            if (editingId) await api.updateEvent(editingId, data);
            else await api.createEvent(data);
            resetForm();
            fetchData();
        } catch (err) {
            alert("Failed to save event.");
        } finally {
            setLoading(false);
        }
    };

    const handleMentorSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append("name", mentorFormData.name);
        data.append("city", mentorFormData.city);
        data.append("linkedinUrl", mentorFormData.linkedinUrl);
        if (mentorFormData.photo && typeof mentorFormData.photo !== 'string') {
            data.append("photo", mentorFormData.photo);
        }
        try {
            if (editingId) await api.updateMentor(editingId, data);
            else await api.createMentor(data);
            resetForm();
            fetchData();
        } catch (err) {
            addToast("Failed to save mentor.", "error");
        } finally {
            setLoading(false);
        }
    };

    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, targetIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const updatedCommunities = [...whatsappCommunities];
        const [draggedItem] = updatedCommunities.splice(draggedIndex, 1);
        updatedCommunities.splice(targetIndex, 0, draggedItem);

        setWhatsappCommunities(updatedCommunities);

        try {
            const ids = updatedCommunities.map(item => item._id);
            await api.reorderWhatsAppCommunities(ids);
            addToast("WhatsApp communities order updated successfully.", "success");
        } catch (err) {
            addToast("Failed to save new order to server.", "error");
            fetchData();
        }

        setDraggedIndex(null);
    };

    const handleCommitteeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append("name", committeeFormData.name);
        data.append("role", committeeFormData.role || "Committee Member");
        data.append("city", committeeFormData.city);
        if (committeeFormData.linkedinUrl) data.append("linkedinUrl", committeeFormData.linkedinUrl);
        if (committeeFormData.image && typeof committeeFormData.image !== 'string') {
            data.append("image", committeeFormData.image);
        }
        try {
            if (editingId) await api.updateCommitteeMember(editingId, data);
            else await api.createCommitteeMember(data);
            resetForm();
            fetchData();
        } catch (err) {
            addToast("Failed to save committee member.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleQuizSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingQuestionId) await api.updateQuizQuestion(editingQuestionId, quizFormData);
            else await api.createQuizQuestion(quizFormData);
            resetForm();
            fetchData();
        } catch (err) {
            addToast("Failed to save quiz question.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSponsorSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("name", sponsorFormData.name);
        data.append("websiteUrl", sponsorFormData.websiteUrl);
        data.append("order", sponsorFormData.order);
        if (sponsorFormData.logo && typeof sponsorFormData.logo !== 'string') {
            data.append("logo", sponsorFormData.logo);
        } else if (typeof sponsorFormData.logo === 'string') {
            data.append("logo", sponsorFormData.logo);
        }

        try {
            if (editingId) {
                await api.updateDisplaySponsor(editingId, data);
            } else {
                await api.createDisplaySponsor(data);
            }
            addToast("Sponsor saved successfully.", "success");
            resetForm();
            fetchData();
        } catch (err) {
            addToast("Failed to save sponsor.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleGallerySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append("caption", galleryFormData.caption);
        if (galleryFormData.images && galleryFormData.images.length > 0) {
            galleryFormData.images.forEach(img => data.append("images", img));
        }

        try {
            if (editingId) {
                await api.updateGalleryItem(editingId, { caption: galleryFormData.caption });
            } else {
                await api.createGalleryItem(data);
            }
            addToast("Gallery item saved successfully.", "success");
            resetForm();
            fetchData();
        } catch (err) {
            addToast("Failed to save gallery item.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        const member = members.find(m => m._id === id);
        if (!member) return;

        if (status === "rejected") {
            const reason = window.prompt("Enter rejection reason (optional):");
            if (reason === null) return;

            // Optimistic UI: Update status instantly so they move from pending to rejected
            setMembers(prev => prev.map(m => m._id === id ? { ...m, status } : m));
            addToast(`Member status updated to ${status}.`, "success");

            try {
                await api.updateMemberStatus(id, status, reason);
                fetchData();
            } catch (err) {
                addToast("Failed to update status. Refreshing list...", "error");
                fetchData();
            }
            return;
        }

        // Optimistic UI: Update status instantly so they move from pending to accepted
        setMembers(prev => prev.map(m => m._id === id ? { ...m, status } : m));
        addToast(`Member status updated to ${status}.`, "success");

        try {
            await api.updateMemberStatus(id, status);
            fetchData();
        } catch (err) {
            addToast("Failed to update status. Refreshing list...", "error");
            fetchData();
        }
    };

    const cancelPendingUndo = () => {
        if (pendingUndo?.timerId) {
            clearTimeout(pendingUndo.timerId);
        }
        if (pendingUndo?.originalMember) {
            setMembers(prev => [...prev, pendingUndo.originalMember]);
        }
        setPendingUndo(null);
        // Optional: still call fetchData but the UI is already updated
        fetchData();
    };

    const triggerGracefulAction = (id, actionType, actionFn, message) => {
        const member = members.find(m => m._id === id);
        if (!member) return;

        // Optimistically remove from UI
        setMembers(prev => prev.filter(m => m._id !== id));

        const timerId = setTimeout(async () => {
            try {
                await actionFn();
                setPendingUndo(null);
                fetchData();
            } catch (err) {
                addToast(`Delayed action failed: ${err.message}`, "error");
                setPendingUndo(null);
                fetchData();
            }
        }, 30000); // 30 seconds

        setPendingUndo({
            id,
            memberName: member.name,
            originalMember: member,
            actionType,
            timerId,
            message
        });
    };

    const handleDelete = async (type, id) => {
        if (type === 'member') {
            const member = members.find(m => m._id === id);
            triggerGracefulAction(
                id,
                'Waitlist',
                () => api.undoMemberStatus(id),
                `Moving ${member?.name || 'user'} to waitlist...`
            );
            return;
        }

        setModalConfig({
            isOpen: true,
            title: `Delete ${type}?`,
            message: `Are you sure you want to permanently delete this ${type}? This action cannot be undone.`,
            confirmText: `Delete ${type}`,
            type: "danger",
            onConfirm: async () => {
                try {
                    if (type === 'event') await api.deleteEvent(id);
                    else if (type === 'mentor') await api.deleteMentor(id);
                    else if (type === 'committee') await api.deleteCommitteeMember(id);
                    else if (type === 'article') await api.deleteArticle(id);
                    else if (type === 'quiz') await api.deleteQuizQuestion(id);
                    else if (type === 'display-sponsor') await api.deleteDisplaySponsor(id);
                    else if (type === 'gallery') await api.deleteGalleryItem(id);
                    else if (type === 'testimonial') await api.deleteTestimonial(id);
                    else if (type === 'whatsapp') await api.deleteWhatsAppCommunity(id);
                    addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`, "success");
                    fetchData();
                } catch (err) {
                    addToast(`Failed to delete ${type}.`, "error");
                }
            }
        });
    };

    const handleUndoApproval = async (id) => {
        const member = members.find(m => m._id === id);
        triggerGracefulAction(
            id,
            'Undo Approval',
            () => api.undoMemberStatus(id),
            `Reverting approval for ${member?.name || 'user'}...`
        );
    };

    const handleRoleUpdate = async (id, newRole) => {
        // Optimistic UI update
        setMembers(prev => prev.map(m => m._id === id ? { ...m, role: newRole } : m));
        addToast(`User role updated to ${newRole.toUpperCase()}.`, "success");

        try {
            await api.updateUserRole(id, newRole);
            fetchData();
        } catch (err) {
            addToast("Failed to update user role. Refreshing list...", "error");
            fetchData();
        }
    };

    const handlePromoteMain = async (id) => {
        setModalConfig({
            isOpen: true,
            title: "Promote to Main Admin?",
            message: "Are you sure? This will grant the user full administrative control over the entire platform. This action is significant.",
            confirmText: "Yes, Promote to Main Admin",
            type: "danger",
            onConfirm: async () => {
                try {
                    await api.promoteAdmin(id);
                    addToast("User promoted to Main Admin successfully.", "success");
                    fetchData();
                } catch (err) {
                    addToast("Failed to promote user to Main Admin.", "error");
                }
            }
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (user && !user.isMainAdmin && user.status !== 'accepted') {
        return (
            <div className="min-h-screen bg-white flex flex-col pt-24">
                <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white z-40 flex-shrink-0 sticky top-24">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-sm">
                            <Shield size={18} />
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Administrative Hub</h1>
                    </div>
                </header>
                <PendingApprovalView />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col pt-24">
            <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white z-40 flex-shrink-0 sticky top-24">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="xl:hidden p-2"><Menu /></button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-sm">
                            <Shield size={18} />
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Administrative Hub</h1>
                    </div>
                </div>
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={handleExportData}
                        className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all mr-3 flex items-center gap-2 border border-emerald-100/50 shadow-sm"
                        title="Download Report"
                    >
                        <ArrowUpRight size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Export Report</span>
                    </button>
                    <button
                        type="button"
                        onClick={fetchData}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all mr-4 flex items-center gap-2"
                        title="Refresh Data"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin text-primary" : ""} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Refresh Sync</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-grow overflow-hidden relative">
                {/* Mobile Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/50 z-40 xl:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <aside className={`fixed inset-y-0 left-0 z-50 xl:relative w-64 border-r border-slate-100 bg-white p-4 flex flex-col gap-1 overflow-y-auto transform transition-transform duration-300 xl:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex-grow flex flex-col gap-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => setActiveTab(item.label)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === item.label ? "bg-primary/5 text-primary" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-50 mt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-xs text-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                            <LogOut size={16} />
                            Log Out
                        </button>
                    </div>
                </aside>

                <main className="flex-grow overflow-y-auto bg-slate-50/30 p-8 relative">
                    {/* Graceful Undo Banner */}
                    {pendingUndo && (
                        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-4">
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                                        <Activity size={18} />
                                    </div>
                                    <p className="text-xs font-bold text-white tracking-tight">
                                        {pendingUndo.message} <span className="text-slate-400 font-normal italic">(Executing in 30s)</span>
                                    </p>
                                </div>
                                <button
                                    onClick={cancelPendingUndo}
                                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Undo
                                </button>
                            </motion.div>
                        </div>
                    )}

                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{activeTab}</h2>
                            {["Events", "Mentors", "Committee", "Quiz", "Testimonials", "WhatsApp"].includes(activeTab) && (
                                <button type="button" onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                                    {showForm ? <XCircle size={14} /> : <Plus size={14} />}
                                    {showForm ? "Cancel" : (activeTab === "WhatsApp" ? "New WhatsApp Community" : `New ${activeTab.slice(0, -1)}`)}
                                </button>
                            )}
                        </div>

                        {activeTab === "Overview" && (
                            <div className="space-y-8">
                                {/* Overview Directory Toggle Section - Moved to Top */}
                                <div className="pb-8 border-b border-slate-100 space-y-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Administrative Directory</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manage approved members and administrative staff</p>
                                        </div>
                                        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                                            <button
                                                onClick={() => setOverviewFilter("members")}
                                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${overviewFilter === 'members' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Approved Members
                                            </button>
                                            {user?.isMainAdmin && (
                                                <button
                                                    onClick={() => setOverviewFilter("admins")}
                                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${overviewFilter === 'admins' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    Secondary Admins
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {(() => {
                                            const filteredOverviewMembers = members
                                                .filter(m => m.status === 'accepted')
                                                .filter(m => {
                                                    if (overviewFilter === 'members') return m.role === 'member';
                                                    return m.role === 'admin' && !m.isMainAdmin;
                                                })
                                                .filter(m => m._id !== user?._id);

                                            return (
                                                <>
                                                    {filteredOverviewMembers.map(member => (
                                                        <MemberCard
                                                            key={member._id}
                                                            member={member}
                                                            isExpanded={expandedMemberId === member._id}
                                                            onToggle={() => setExpandedMemberId(expandedMemberId === member._id ? null : member._id)}
                                                            onApprove={(id) => handleStatusUpdate(id, 'accepted')}
                                                            onReject={(id) => handleStatusUpdate(id, 'rejected')}
                                                            onUndo={handleUndoApproval}
                                                            onRemove={() => handleDelete('member', member._id)}
                                                            onRoleUpdate={handleRoleUpdate}
                                                            onPromoteMain={handlePromoteMain}
                                                            isMainAdmin={user?.isMainAdmin}
                                                        />
                                                    ))}
                                                    {filteredOverviewMembers.length === 0 && (
                                                        <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-slate-100">
                                                            <Users size={48} className="mx-auto text-slate-100 mb-4" />
                                                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No approved {overviewFilter} found.</p>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Stats Cards based on real data */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {[
                                        { icon: Building2, color: 'blue', value: stats?.companyStats?.length || 0, label: 'Companies' },
                                        { icon: MapPin, color: 'blue', value: stats?.cityStats?.length || 0, label: 'Cities' },
                                        { icon: TrendingUp, color: 'blue', value: stats?.pincodeStats?.length || 0, label: 'Pincodes' },
                                        { icon: Users, color: 'amber', value: stats?.totalMembers ?? members.filter(m => m.status === 'accepted' && m.role === 'member').length, label: 'Total Members' }
                                    ].map((card, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 group cursor-default"
                                        >
                                            <div className={`w-12 h-12 bg-${card.color}-50 text-${card.color}-500 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                                                <card.icon size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black transition-colors group-hover:text-primary">{card.value}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{card.label}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Real-time Charts Distribution */}
                                {stats && (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 group"
                                        >
                                            <h3 className="text-sm font-black mb-6 flex items-center gap-2">
                                                <MapPin size={16} className="text-primary" /> City Distribution
                                            </h3>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="99%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={stats?.cityStats || []}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            innerRadius={60}
                                                            outerRadius={85}
                                                            paddingAngle={5}
                                                        >
                                                            {(stats?.cityStats || []).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="none" />)}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                                        />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 group"
                                        >
                                            <h3 className="text-sm font-black mb-6 flex items-center gap-2">
                                                <TrendingUp size={16} className="text-primary" /> Pincode Distribution
                                            </h3>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="99%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={stats?.pincodeStats || []}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            innerRadius={60}
                                                            outerRadius={85}
                                                            paddingAngle={5}
                                                        >
                                                            {(stats?.pincodeStats || []).map((_, i) => <Cell key={i} fill={CHART_COLORS[(i + 3) % CHART_COLORS.length]} stroke="none" />)}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                                        />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 group"
                                        >
                                            <h3 className="text-sm font-black mb-6 flex items-center gap-2">
                                                <Building2 size={16} className="text-primary" /> Top Companies
                                            </h3>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="99%" height="100%">
                                                    <BarChart data={stats?.companyStats || []}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                        <XAxis dataKey="name" hide />
                                                        <YAxis axisLine={false} tickLine={false} fontSize={10} fontStyle={{ fontWeight: 900 }} />
                                                        <Tooltip
                                                            cursor={{ fill: '#F8FAFC' }}
                                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                                        />
                                                        <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                                                            {(stats?.companyStats || []).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        )}

                        {(activeTab === "Members" || activeTab === "Secondary Admins") && (
                            <div className="space-y-8">
                                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                                {activeTab === "Members" ? `Member ${memberView === 'pending' ? 'Waitlist' : memberView === 'accepted' ? 'Approved' : 'Rejected'}` : `Secondary Admin ${secondaryAdminView === 'pending' ? 'Waitlist' : secondaryAdminView === 'accepted' ? 'Approved' : 'Rejected'}`}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                {activeTab === "Members" ? "Review and approve new member registrations" : "Moderate administrative staff applications"}
                                            </p>
                                        </div>
                                        <div className="flex bg-slate-100 p-1 rounded-xl gap-0.5 ml-4">
                                            <button
                                                onClick={() => activeTab === 'Members' ? setMemberView("pending") : setSecondaryAdminView("pending")}
                                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${(activeTab === 'Members' ? memberView : secondaryAdminView) === 'pending' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Waitlist
                                            </button>
                                            <button
                                                onClick={() => activeTab === 'Members' ? setMemberView("accepted") : setSecondaryAdminView("accepted")}
                                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${(activeTab === 'Members' ? memberView : secondaryAdminView) === 'accepted' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Approved
                                            </button>
                                            <button
                                                onClick={() => activeTab === 'Members' ? setMemberView("rejected") : setSecondaryAdminView("rejected")}
                                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${(activeTab === 'Members' ? memberView : secondaryAdminView) === 'rejected' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Rejected
                                            </button>
                                        </div>
                                    </div>
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search by name, email, status..."
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold outline-none focus:border-primary transition-all shadow-inner"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(() => {
                                        const filteredMembers = members
                                            .filter(m => {
                                                if (activeTab === "Members") return m.role === 'member' && m.status === memberView;
                                                if (activeTab === "Secondary Admins") {
                                                    return m.role === 'admin' && !m.isMainAdmin && m.status === secondaryAdminView;
                                                }
                                                return false;
                                            })
                                            .filter(m => !searchQuery ||
                                                m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                m.status?.toLowerCase().includes(searchQuery.toLowerCase())
                                            );

                                        return (
                                            <>
                                                {filteredMembers.map(member => (
                                                    <MemberCard
                                                        key={member._id}
                                                        member={member}
                                                        isExpanded={expandedMemberId === member._id}
                                                        onToggle={() => setExpandedMemberId(expandedMemberId === member._id ? null : member._id)}
                                                        onApprove={(id) => handleStatusUpdate(id, 'accepted')}
                                                        onReject={(id) => handleStatusUpdate(id, 'rejected')}
                                                        onUndo={handleUndoApproval}
                                                        onRemove={() => handleStatusUpdate(member._id, 'rejected')}
                                                        onRoleUpdate={handleRoleUpdate}
                                                        onPromoteMain={activeTab === "Secondary Admins" ? handlePromoteMain : null}
                                                        isMainAdmin={user?.isMainAdmin}
                                                        showRoleToggle={activeTab !== "Members"}
                                                    />
                                                ))}
                                                {filteredMembers.length === 0 && (
                                                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-slate-100">
                                                        <Users size={60} className="mx-auto text-slate-100 mb-6" />
                                                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching {activeTab === "Members" ? "members" : "admins"} found.</p>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* Event Form & List */}
                        {activeTab === "Events" && (
                            <div className="space-y-12">
                                {/* Live Event Marquees - For Future Overview */}
                                <div className="space-y-6">
                                    {(() => {
                                        const upcoming = events.filter(e => e.type === "upcoming");
                                        const past = events.filter(e => e.type === "past");

                                        return (
                                            <>
                                                {upcoming.length > 4 && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 px-6">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Upcoming Track</span>
                                                        </div>
                                                        <div className="relative overflow-hidden bg-slate-50/50 py-6 rounded-[2rem] border border-slate-100">
                                                            <div className="flex gap-8 animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
                                                                {[...upcoming, ...upcoming].map((event, idx) => (
                                                                    <div key={`${event._id}-${idx}`} className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                                                                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                                            <Calendar size={14} />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-black text-slate-900">{event.title}</p>
                                                                            <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(event.date).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {past.length > 4 && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 px-6">
                                                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Archive Stream</span>
                                                        </div>
                                                        <div className="relative overflow-hidden bg-slate-50/20 py-4 rounded-[1.5rem]">
                                                            <div className="flex gap-6 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] opacity-60 hover:opacity-100 transition-opacity">
                                                                {[...past, ...past].map((event, idx) => (
                                                                    <div key={`${event._id}-${idx}`} className="inline-flex items-center gap-3 bg-white/50 px-4 py-2 rounded-xl border border-dashed border-slate-200">
                                                                        <span className="text-[10px] font-bold text-slate-500">{event.title}</span>
                                                                        <span className="text-[8px] text-slate-400 font-black px-1.5 py-0.5 bg-slate-100 rounded">PAST</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>

                                {showForm && (
                                    <motion.section
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl"
                                    >
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Event Title</label>
                                                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Mentor Name</label>
                                                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={formData.mentorName} onChange={e => setFormData({ ...formData, mentorName: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Location</label>
                                                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Date</label>
                                                    <input type="date" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Type</label>
                                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none appearance-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                                        <option value="upcoming">Upcoming</option>
                                                        <option value="past">Past</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Registration URL (For Upcoming)</label>
                                                <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={formData.registrationUrl} onChange={e => setFormData({ ...formData, registrationUrl: e.target.value })} placeholder="https://..." />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block">Event Gallery</label>

                                                <div className="relative group">
                                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-3 bg-white">
                                                        <Upload size={32} className="text-primary" />
                                                        <p className="text-xs font-black text-slate-900 uppercase">Click or Drag images to upload</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Max 10 images allowed</p>
                                                    </div>
                                                </div>

                                                {(formData.images.length > 0 || existingImages.length > 0) && (
                                                    <div className="flex flex-wrap gap-4 mt-4">
                                                        {existingImages.map((url, i) => (
                                                            <div key={`existing-${i}`} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                                                                <img src={url} className="w-full h-full object-cover" />
                                                                <button type="button" onClick={() => removeExistingImage(i)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {formData.images.map((file, i) => (
                                                            <div key={`new-${i}`} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-primary/20">
                                                                <img
                                                                    src={(file instanceof File || file instanceof Blob) ? URL.createObjectURL(file) : (typeof file === 'string' ? file : '')}
                                                                    className="w-full h-full object-cover"
                                                                    onLoad={(e) => {
                                                                        if (file instanceof File || file instanceof Blob) URL.revokeObjectURL(e.target.src);
                                                                    }}
                                                                />
                                                                <div className="absolute top-1 right-1 bg-primary text-white text-[8px] px-1 rounded">NEW</div>
                                                                <button type="button" onClick={() => removeNewImage(i)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <button disabled={loading} type="submit" className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50">
                                                {loading ? "Uploading..." : "Save Event"}
                                            </button>
                                        </form>
                                    </motion.section>
                                )}

                                <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Administrative Directory</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50">
                                                <tr>
                                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event</th>
                                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mentor</th>
                                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 text-sm font-bold">
                                                {events.map((event) => (
                                                    <tr key={event._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-8 py-4 text-slate-900">{event.title}</td>
                                                        <td className="px-8 py-4 text-slate-500">{event.mentorName}</td>
                                                        <td className="px-8 py-4 text-slate-500">{event.location}</td>
                                                        <td className="px-8 py-4">
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${event.type === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                                                {event.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => { setFormData(event); setExistingImages(event.images); setEditingId(event._id); setShowForm(true); }} className="p-2 text-slate-300 hover:text-primary transition-all"><Edit2 size={14} /></button>
                                                                <button onClick={() => handleDelete('event', event._id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* --- EVENT GALLERY SECTION --- */}
                                <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mt-12 p-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Event Gallery</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage global event photos</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => { resetForm(); setShowGalleryForm(!showGalleryForm); }}
                                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                                            >
                                                {showGalleryForm ? <XCircle size={16} /> : <Plus size={16} />}
                                                {showGalleryForm ? "Cancel" : "Upload Photo"}
                                            </button>
                                        </div>
                                    </div>

                                    {showGalleryForm && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 mb-8"
                                        >
                                            <form onSubmit={handleGallerySubmit} className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Caption</label>
                                                    <input required className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none shadow-sm" value={galleryFormData.caption} onChange={e => setGalleryFormData({ ...galleryFormData, caption: e.target.value })} placeholder="Enter an engaging caption..." />
                                                </div>

                                                {!editingId && (
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block">Photo Upload</label>
                                                        <div className="relative group">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                required={!editingId}
                                                                onChange={(e) => setGalleryFormData({ ...galleryFormData, images: Array.from(e.target.files) })}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            />
                                                            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 bg-white">
                                                                <Upload size={24} className="text-primary" />
                                                                <div className="text-center">
                                                                    <p className="text-xs font-black text-slate-900 uppercase">
                                                                        {galleryFormData.images.length > 0 ? `${galleryFormData.images.length} Photos Selected` : "Choose Gallery Photos"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <button disabled={loading} type="submit" className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50">
                                                    {loading ? "Saving..." : (editingId ? "Update Caption" : "Upload to Gallery")}
                                                </button>
                                            </form>
                                        </motion.div>
                                    )}

                                    {/* Gallery Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {galleryItems.map(item => (
                                            <div key={item._id} className="relative group rounded-3xl overflow-hidden border border-slate-100 shadow-sm aspect-square bg-slate-50">
                                                <img src={item.image} alt={item.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                                    <p className="text-white font-black text-xs leading-tight mb-3 truncate">{item.caption}</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => { setGalleryFormData({ caption: item.caption, image: item.image }); setEditingId(item._id); setShowGalleryForm(true); scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                            className="p-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-xl backdrop-blur-sm transition-all"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete('gallery', item._id)}
                                                            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl backdrop-blur-sm transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {galleryItems.length === 0 && (
                                            <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                                <ImageIcon size={32} className="mx-auto text-slate-300 mb-3" />
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No gallery photos yet</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === "Mentors" && (
                            <div className="space-y-8">
                                {showForm && (
                                    <motion.section
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl"
                                    >
                                        <form onSubmit={handleMentorSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Name</label>
                                                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={mentorFormData.name} onChange={e => setMentorFormData({ ...mentorFormData, name: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">City</label>
                                                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={mentorFormData.city} onChange={e => setMentorFormData({ ...mentorFormData, city: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">LinkedIn URL</label>
                                                <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={mentorFormData.linkedinUrl} onChange={e => setMentorFormData({ ...mentorFormData, linkedinUrl: e.target.value })} />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block">Mentor Photo</label>
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setMentorFormData({ ...mentorFormData, photo: e.target.files[0] })}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 bg-white">
                                                        <Upload size={24} className="text-primary" />
                                                        <div className="text-center">
                                                            <p className="text-xs font-black text-slate-900 uppercase">
                                                                {mentorFormData.photo ? (typeof mentorFormData.photo === 'string' ? 'Current Photo (Existing)' : mentorFormData.photo.name) : "Choose Mentor Photo"}
                                                            </p>
                                                            {typeof mentorFormData.photo === 'string' && (
                                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Click to replace</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button disabled={loading} type="submit" className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50">
                                                {loading ? "Saving..." : "Save Mentor"}
                                            </button>
                                        </form>
                                    </motion.section>
                                )}

                                <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/50">
                                            <tr>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mentor</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">City</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 text-sm">
                                            {mentors.map((mentor) => (
                                                <tr key={mentor._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                                                                {mentor.photo && <img src={mentor.photo} className="w-full h-full object-cover" />}
                                                            </div>
                                                            <div className="font-bold text-slate-900">{mentor.name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-4 text-slate-500 font-bold">{mentor.city}</td>
                                                    <td className="px-8 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setMentorFormData({
                                                                        name: mentor.name,
                                                                        city: mentor.city,
                                                                        linkedinUrl: mentor.linkedinUrl,
                                                                        photo: mentor.photo // This is a URL string
                                                                    });
                                                                    setEditingId(mentor._id);
                                                                    setShowForm(true);
                                                                }}
                                                                className="p-2 text-slate-300 hover:text-primary transition-all"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete('mentor', mentor._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>
                            </div>
                        )}

                        {activeTab === "Sponsors" && (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Sponsor Logos</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage logos for the Partners & Sponsors page</p>
                                    </div>
                                    <button
                                        onClick={() => { resetForm(); setShowForm(true); }}
                                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                                    >
                                        <Plus size={16} />
                                        Add Sponsor
                                    </button>
                                </div>

                                {showForm && (
                                    <motion.section
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl"
                                    >
                                        <form onSubmit={handleSponsorSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Sponsor Name</label>
                                                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={sponsorFormData.name} onChange={e => setSponsorFormData({ ...sponsorFormData, name: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Order (Numeric)</label>
                                                    <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={sponsorFormData.order} onChange={e => setSponsorFormData({ ...sponsorFormData, order: parseInt(e.target.value) || 0 })} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Website URL</label>
                                                <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={sponsorFormData.websiteUrl} onChange={e => setSponsorFormData({ ...sponsorFormData, websiteUrl: e.target.value })} placeholder="https://..." />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block">Sponsor Logo</label>
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setSponsorFormData({ ...sponsorFormData, logo: e.target.files[0] })}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 bg-white">
                                                        <Upload size={24} className="text-primary" />
                                                        <div className="text-center">
                                                            <p className="text-xs font-black text-slate-900 uppercase">
                                                                {sponsorFormData.logo ? (typeof sponsorFormData.logo === 'string' ? 'Current Logo (Existing)' : sponsorFormData.logo.name) : "Choose Sponsor Logo"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button disabled={loading} type="submit" className="flex-grow bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50">
                                                    {loading ? "Processing..." : "Save Sponsor"}
                                                </button>
                                                <button type="button" onClick={resetForm} className="bg-slate-50 text-slate-400 py-5 px-8 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                                            </div>
                                        </form>
                                    </motion.section>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {displaySponsors.map((sponsor) => (
                                        <motion.div
                                            key={sponsor._id}
                                            layout
                                            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                                        >
                                            <div className="aspect-square rounded-2xl bg-slate-50 flex items-center justify-center p-6 mb-4 relative overflow-hidden">
                                                <img src={sponsor.logo} alt={sponsor.name} className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="font-black text-slate-900 text-sm">{sponsor.name}</p>
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSponsorFormData({
                                                                name: sponsor.name,
                                                                logo: sponsor.logo,
                                                                websiteUrl: sponsor.websiteUrl || "",
                                                                order: sponsor.order || 0
                                                            });
                                                            setEditingId(sponsor._id);
                                                            setShowForm(true);
                                                        }}
                                                        className="p-2 text-slate-300 hover:text-primary transition-all"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete('display-sponsor', sponsor._id)} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {displaySponsors.length === 0 && (
                                        <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                            <Gem size={48} className="mx-auto text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No sponsors added yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "Testimonials" && (
                            <div className="space-y-8">
                                {showForm && (
                                    <motion.section
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl"
                                    >
                                        <form onSubmit={handleTestimonialSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Type</label>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setTestimonialFormData(prev => ({ ...prev, type: "member" }))}
                                                            className={`flex-grow py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${testimonialFormData.type === "member" ? "bg-primary text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                                                        >
                                                            Member
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setTestimonialFormData(prev => ({ ...prev, type: "sponsor" }))}
                                                            className={`flex-grow py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${testimonialFormData.type === "sponsor" ? "bg-primary text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                                                        >
                                                            Sponsor
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none"
                                                        placeholder="Enter testimonial person/organization name"
                                                        value={testimonialFormData.name || ""}
                                                        onChange={(e) => setTestimonialFormData(prev => ({ ...prev, name: e.target.value }))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Designation / Company</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none"
                                                        placeholder="e.g. HR Manager at Google"
                                                        value={testimonialFormData.designation || ""}
                                                        onChange={(e) => setTestimonialFormData(prev => ({ ...prev, designation: e.target.value }))}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Instagram / LinkedIn Post Link</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none"
                                                        placeholder="https://www.linkedin.com/posts/..."
                                                        value={testimonialFormData.link || ""}
                                                        onChange={(e) => setTestimonialFormData(prev => ({ ...prev, link: e.target.value }))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                                                        Cover Thumbnail Image
                                                    </label>
                                                    <div className="relative group border-2 border-dashed border-slate-200 rounded-[2rem] p-4 flex flex-col items-center justify-center gap-2 bg-white min-h-[90px]">
                                                        <Upload size={18} className="text-primary" />
                                                        <div className="text-center">
                                                            <p className="text-[10px] font-black text-slate-900 uppercase">
                                                                {thumbnailFile ? thumbnailFile.name : "Choose Thumbnail Cover Image"}
                                                            </p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => setThumbnailFile(e.target.files[0])}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button disabled={loading || thumbnailUploading} type="submit" className="flex-grow bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50">
                                                    {loading ? "Processing..." : "Save Testimonial"}
                                                </button>
                                                <button type="button" onClick={() => { resetForm(); setThumbnailFile(null); }} className="bg-slate-50 text-slate-400 py-5 px-8 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                                            </div>
                                        </form>
                                    </motion.section>
                                )}

                                {!showForm && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {testimonials.map((test) => (
                                            <motion.div
                                                key={test._id}
                                                layout
                                                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
                                            >
                                                <div className="space-y-4">
                                                    <div className="aspect-[16/9] rounded-3xl bg-slate-50 flex items-center justify-center relative overflow-hidden shadow-inner border border-slate-100">
                                                        {test.thumbnail ? (
                                                            <img src={test.thumbnail} alt={test.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="text-slate-400 text-xs flex flex-col items-center gap-1.5 font-bold uppercase tracking-wider">
                                                                <Video size={20} />
                                                                <span>No Thumbnail</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                                                <User size={18} className="text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-slate-900 text-xs">{test.name}</h4>
                                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                                                                    {test.designation || (test.type === "member" ? "Member" : "Sponsor")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {test.link && (
                                                            <div className="mt-2 text-left">
                                                                <a 
                                                                    href={test.link} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                                                                >
                                                                    <ExternalLink size={10} /> View Social Post
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-4">
                                                    <button type="button" onClick={() => handleEditTestimonial(test)} className="p-2 text-slate-400 hover:text-primary transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
                                                        <Edit size={12} /> Edit
                                                    </button>
                                                    <button type="button" onClick={() => handleDelete('testimonial', test._id)} className="p-2 text-slate-300 hover:text-red-500 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {testimonials.length === 0 && (
                                            <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                                <Video size={48} className="mx-auto text-slate-200 mb-4" />
                                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No testimonials found.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "Committee" && (
                            <div className="space-y-8">
                                {showForm && (
                                    <motion.section
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl"
                                    >
                                        <form onSubmit={handleCommitteeSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Name</label>
                                                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={committeeFormData.name} onChange={e => setCommitteeFormData({ ...committeeFormData, name: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">City</label>
                                                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={committeeFormData.city} onChange={e => setCommitteeFormData({ ...committeeFormData, city: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">LinkedIn URL</label>
                                                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" placeholder="https://linkedin.com/in/..." value={committeeFormData.linkedinUrl} onChange={e => setCommitteeFormData({ ...committeeFormData, linkedinUrl: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block">Member Photo</label>
                                                <div className="relative group">
                                                    <input type="file" accept="image/*" onChange={(e) => setCommitteeFormData({ ...committeeFormData, image: e.target.files[0] })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 bg-white">
                                                        <Upload size={24} className="text-primary" />
                                                        <div className="text-center">
                                                            <p className="text-xs font-black text-slate-900 uppercase">
                                                                {committeeFormData.image ? (typeof committeeFormData.image === 'string' ? 'Current Photo (Existing)' : committeeFormData.image.name) : "Choose Member Photo"}
                                                            </p>
                                                            {typeof committeeFormData.image === 'string' && (
                                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Click to replace</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button disabled={loading} type="submit" className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50">
                                                {loading ? "Saving..." : (editingId ? "Update Committee Member" : "Save Committee Member")}
                                            </button>
                                        </form>
                                    </motion.section>
                                )}
                                <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/50">
                                            <tr>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">City</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 text-sm">
                                            {committee.map((member) => (
                                                <tr key={member._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                                                                {member.image && <img src={member.image} className="w-full h-full object-cover" />}
                                                            </div>
                                                            <div className="font-bold text-slate-900">{member.name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-4 text-slate-500 font-bold">{member.city}</td>
                                                    <td className="px-8 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setCommitteeFormData({
                                                                        name: member.name,
                                                                        role: member.role || "Committee Member",
                                                                        city: member.city,
                                                                        linkedinUrl: member.linkedinUrl || "",
                                                                        image: member.image || null
                                                                    });
                                                                    setEditingId(member._id);
                                                                    setShowForm(true);
                                                                }}
                                                                className="p-2 text-slate-300 hover:text-primary transition-all"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete('committee', member._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>
                            </div>
                        )}
                        {activeTab === "Quiz" && (
                            <div className="space-y-8">
                                {/* Header Section */}
                                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <HelpCircle size={24} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Quiz Management</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Questions: {quizQuestions.length}</p>
                                        </div>
                                    </div>
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search questions or options..."
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold outline-none focus:border-primary transition-all shadow-inner"
                                            value={quizSearchQuery}
                                            onChange={(e) => setQuizSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {showForm && (
                                    <motion.section
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white p-8 rounded-[3rem] border-2 border-primary/10 shadow-xl"
                                    >
                                        <form onSubmit={handleQuizSubmit} className="space-y-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Question Text</label>
                                                <textarea
                                                    required
                                                    rows="3"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none transition-all"
                                                    value={quizFormData.question}
                                                    onChange={e => setQuizFormData({ ...quizFormData, question: e.target.value })}
                                                    placeholder="Enter your question here..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {quizFormData.options.map((opt, i) => (
                                                    <div key={i} className="space-y-2 relative">
                                                        <div className="flex justify-between items-center px-2">
                                                            <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${quizFormData.answerIndex === i ? 'text-primary' : 'text-slate-400'}`}>
                                                                Option {i + 1}
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={() => setQuizFormData({ ...quizFormData, answerIndex: i })}
                                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider transition-all ${quizFormData.answerIndex === i ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                                            >
                                                                {quizFormData.answerIndex === i ? (
                                                                    <><CheckCircle2 size={10} /> Correct Answer</>
                                                                ) : (
                                                                    'Mark as Correct'
                                                                )}
                                                            </button>
                                                        </div>
                                                        <div className="relative">
                                                            <input
                                                                required
                                                                className={`w-full border-2 rounded-2xl py-4 px-6 text-xs font-bold transition-all outline-none ${quizFormData.answerIndex === i ? 'bg-primary-dark/2 border-primary shadow-sm' : 'bg-slate-50 border-slate-100 focus:border-slate-200'}`}
                                                                value={opt}
                                                                onChange={e => {
                                                                    const newOpts = [...quizFormData.options];
                                                                    newOpts[i] = e.target.value;
                                                                    setQuizFormData({ ...quizFormData, options: newOpts });
                                                                }}
                                                                placeholder={`Enter option ${i + 1}`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-50">
                                                <button disabled={loading} type="submit" className="flex-grow bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50">
                                                    {loading ? "Processing..." : (editingQuestionId ? "Update Question" : "Publish Question")}
                                                </button>
                                                <button type="button" onClick={resetForm} className="bg-slate-50 text-slate-400 py-5 px-8 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </motion.section>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {quizQuestions
                                        .filter(q => !quizSearchQuery ||
                                            q.question.toLowerCase().includes(quizSearchQuery.toLowerCase()) ||
                                            q.options.some(opt => opt.toLowerCase().includes(quizSearchQuery.toLowerCase()))
                                        )
                                        .map((q, i) => (
                                            <motion.div
                                                key={q._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
                                            >
                                                <div className="p-8">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                                                                {i + 1}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[8px] font-black uppercase tracking-widest">Multiple Choice</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => { setQuizFormData(q); setEditingQuestionId(q._id); setShowForm(true); }} className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><Edit2 size={14} /></button>
                                                            <button onClick={() => handleDelete('quiz', q._id)} className="p-2.5 bg-red-50 text-red-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>

                                                    <p className="font-bold text-slate-900 text-sm mb-6 line-clamp-2 leading-relaxed h-[2.5rem]">{q.question}</p>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {q.options.map((opt, optIdx) => (
                                                            <div
                                                                key={optIdx}
                                                                className={`p-3 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-3 ${q.answerIndex === optIdx ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-slate-50/50 border-slate-50 text-slate-500'}`}
                                                            >
                                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${q.answerIndex === optIdx ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                                    {String.fromCharCode(65 + optIdx)}
                                                                </div>
                                                                <span className="truncate">{opt}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                    {quizQuestions.length === 0 && (
                                        <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                            <HelpCircle size={60} className="mx-auto text-slate-100 mb-6" />
                                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No quiz questions found.</p>
                                            <button onClick={() => setShowForm(true)} className="mt-6 text-primary font-black uppercase tracking-widest text-[10px] hover:underline">Add Your First Question</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}



                        
                        
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
                                                setArticleFormData({ title: "", slug: "", isSlugEdited: false, description: "", content: "", category: "HR", date: "", image: "", author: "Admin", metaTitle: "", metaDescription: "", status: "draft" });
                                                statusRef.current = "draft";
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
                                                    <input type="text" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20" value={articleFormData.title} onChange={e => {
                                                        const newTitle = e.target.value;
                                                        setArticleFormData(prev => {
                                                            const updated = { ...prev, title: newTitle };
                                                            if (!prev.isSlugEdited) {
                                                                updated.slug = newTitle
                                                                    .toLowerCase()
                                                                    .replace(/[^a-z0-9]+/g, "-")
                                                                    .replace(/(^-|-$)/g, "");
                                                            }
                                                            return updated;
                                                        });
                                                    }} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL Slug</label>
                                                    <input type="text" required placeholder="e.g., human-resources-to-human-responsibilities" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20" value={articleFormData.slug || ""} onChange={e => {
                                                        const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "");
                                                        setArticleFormData(prev => ({ ...prev, slug: newSlug, isSlugEdited: true }));
                                                    }} />
                                                    <p className="text-[9px] text-slate-400 font-bold pl-1">Auto-generates from Title, but can be edited.</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                                                    <input type="text" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20" value={articleFormData.category} onChange={e => setArticleFormData({...articleFormData, category: e.target.value})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publish Date</label>
                                                    <input type="date" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20" value={articleFormData.date} onChange={e => setArticleFormData({...articleFormData, date: e.target.value})} />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
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
                                                <RichTextEditor 
                                                    value={articleFormData.content} 
                                                    onChange={html => setArticleFormData({...articleFormData, content: html})} 
                                                />
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

                                            {/* SEO & Metadata Fields */}
                                            <div className="space-y-6 pt-6 border-t border-slate-100">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">SEO & Metadata</h4>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center pl-2 pr-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meta Title</label>
                                                            <span className="text-[9px] font-bold text-slate-400">{(articleFormData.metaTitle || "").length}/60</span>
                                                        </div>
                                                        <input 
                                                            type="text" 
                                                            maxLength={60}
                                                            placeholder="e.g., Future of Work | myHRSG" 
                                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20" 
                                                            value={articleFormData.metaTitle || ""} 
                                                            onChange={e => setArticleFormData({ ...articleFormData, metaTitle: e.target.value })} 
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center pl-2 pr-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meta Description</label>
                                                            <span className="text-[9px] font-bold text-slate-400">{(articleFormData.metaDescription || "").length}/160 characters</span>
                                                        </div>
                                                        <input 
                                                            type="text" 
                                                            maxLength={160}
                                                            placeholder="e.g. Explore how HR is evolving into human responsibilities." 
                                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20" 
                                                            value={articleFormData.metaDescription || ""} 
                                                            onChange={e => setArticleFormData({ ...articleFormData, metaDescription: e.target.value })} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-4 pt-8 justify-end items-center">
                                                <button 
                                                    type="submit" 
                                                    onClick={() => { statusRef.current = "draft"; }}
                                                    className="bg-slate-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-600 transition-all"
                                                >
                                                    Save as Draft
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => { 
                                                        setShowArticleForm(false); 
                                                        setEditingArticleId(null); 
                                                        setArticleFormData({ title: "", slug: "", isSlugEdited: false, description: "", content: "", category: "HR", date: "", image: "", author: "Admin", metaTitle: "", metaDescription: "", status: "draft" }); 
                                                        statusRef.current = "draft";
                                                    }} 
                                                    className="px-8 py-3 rounded-xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 text-xs uppercase tracking-wider transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    type="submit" 
                                                    onClick={() => { statusRef.current = "published"; }}
                                                    className="bg-primary text-white px-8 py-3 rounded-xl font-black hover:bg-primary/90 text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-primary/20 transition-all"
                                                >
                                                    {editingArticleId ? (
                                                        <><CheckCircle2 size={16} /> Save Changes</>
                                                    ) : (
                                                        <><Rocket size={16} /> Publish</>
                                                    )}
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
                                                                <span>•</span>
                                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${article.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                                                    {article.status || 'draft'}
                                                                </span>
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
                                                    <button onClick={() => handleDelete('article', article._id)} className="p-2.5 bg-white hover:bg-red-500 hover:text-white text-slate-400 rounded-full transition-all shadow-xl">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "Mass Mail" && (
                            <div className="space-y-8">
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Mass Mailer</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Send an email broadcast to all accepted members.</p>
                                    
                                    <form onSubmit={handleMassMailSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Subject</label>
                                            <input 
                                                required 
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" 
                                                value={massMailData.subject} 
                                                onChange={e => setMassMailData({ ...massMailData, subject: e.target.value })} 
                                                placeholder="Enter email subject"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Message (HTML Supported)</label>
                                            <textarea 
                                                required 
                                                rows="10"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none resize-none" 
                                                value={massMailData.message} 
                                                onChange={e => setMassMailData({ ...massMailData, message: e.target.value })} 
                                                placeholder="Type your message here..."
                                            />
                                        </div>
                                        <button 
                                            disabled={sendingMail} 
                                            type="submit" 
                                            className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                                        >
                                            {sendingMail ? "Sending..." : "Send Mass Mail"}
                                            {!sendingMail && <Mail size={16} />}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === "WhatsApp" && (
                            <div className="space-y-8">
                                {showForm && (
                                    <motion.section
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl"
                                    >
                                        <form onSubmit={async (e) => {
                                            e.preventDefault();
                                            setLoading(true);
                                            const data = new FormData();
                                            data.append("city", whatsappFormData.city);
                                            data.append("whatsappLink", whatsappFormData.whatsappLink);
                                            if (whatsappFormData.qrImage && typeof whatsappFormData.qrImage !== 'string') {
                                                data.append("qrImage", whatsappFormData.qrImage);
                                            }
                                            try {
                                                if (editingId) await api.updateWhatsAppCommunity(editingId, data);
                                                else await api.createWhatsAppCommunity(data);
                                                resetForm();
                                                fetchData();
                                            } catch (err) {
                                                addToast("Failed to save WhatsApp community.", "error");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">City / Location</label>
                                                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={whatsappFormData.city} onChange={e => setWhatsappFormData({ ...whatsappFormData, city: e.target.value })} placeholder="e.g. Pune" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">WhatsApp Invite Link</label>
                                                    <input required type="url" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold focus:border-primary outline-none" value={whatsappFormData.whatsappLink} onChange={e => setWhatsappFormData({ ...whatsappFormData, whatsappLink: e.target.value })} placeholder="https://chat.whatsapp.com/..." />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block">QR Code Image</label>
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setWhatsappFormData({ ...whatsappFormData, qrImage: e.target.files[0] })}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 bg-white">
                                                        <Upload size={24} className="text-primary" />
                                                        <div className="text-center">
                                                            <p className="text-xs font-black text-slate-900 uppercase">
                                                                {whatsappFormData.qrImage ? (typeof whatsappFormData.qrImage === 'string' ? 'Current QR (Existing)' : whatsappFormData.qrImage.name) : "Choose QR Code Image"}
                                                            </p>
                                                            {typeof whatsappFormData.qrImage === 'string' && (
                                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Click to replace</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button disabled={loading} type="submit" className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50">
                                                {loading ? "Saving..." : (editingId ? "Update Community" : "Save Community")}
                                            </button>
                                        </form>
                                    </motion.section>
                                )}
                                 <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/50">
                                            <tr>
                                                <th className="w-10 px-8 py-4"></th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">City</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Link</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">QR Code</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 text-sm">
                                            {whatsappCommunities.map((community, index) => (
                                                <tr 
                                                    key={community._id} 
                                                    draggable 
                                                    onDragStart={(e) => handleDragStart(e, index)}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDrop(e, index)}
                                                    className="hover:bg-slate-50/50 transition-colors"
                                                >
                                                    <td className="px-8 py-4 text-slate-400 cursor-grab active:cursor-grabbing">
                                                        <GripVertical size={16} />
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-[#25D366]/10 rounded-lg flex items-center justify-center">
                                                                <MapPin size={14} className="text-[#25D366]" />
                                                            </div>
                                                            <div className="font-bold text-slate-900">{community.city}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <a href={community.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold hover:underline truncate block max-w-[200px]">{community.whatsappLink}</a>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        {community.qrImage ? (
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 bg-white">
                                                                <img src={community.qrImage} className="w-full h-full object-contain" />
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-300 text-xs font-bold">No QR</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setWhatsappFormData({
                                                                        city: community.city,
                                                                        whatsappLink: community.whatsappLink,
                                                                        qrImage: community.qrImage || null
                                                                    });
                                                                    setEditingId(community._id);
                                                                    setShowForm(true);
                                                                }}
                                                                className="p-2 text-slate-300 hover:text-primary transition-all"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete('whatsapp', community._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>
                            </div>
                        )}

                        {activeTab === "Settings" && (
                            <div className="space-y-8">
                                {/* My Profile Section */}
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                                    <h3 className="text-xl font-black text-slate-900 mb-2">My Profile</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Manage your administrator details and account security</p>

                                    {user && (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-primary/10 shadow-xl">
                                                        {user.profileImage ? <img src={user.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300"><Users size={40} /></div>}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-2xl font-black text-slate-900">{user.name}</h4>
                                                        <p className="text-primary font-bold">{user.email}</p>
                                                        <div className="mt-2 inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">
                                                            {user.isMainAdmin ? 'Main Administrator' : 'Admin'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-slate-400">Company</label>
                                                        <p className="font-bold text-slate-700">{user.company || 'Not Added'}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-slate-400">Position</label>
                                                        <p className="font-bold text-slate-700">{user.position || 'Not Added'}</p>
                                                    </div>
                                                    
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
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isQuizEnabled ? 'bg-primary' : 'bg-slate-300'}`}
                                        >
                                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isQuizEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                                    {/* City/Phone/Pincode only for Secondary Admins (Complete Profile) */}
                                                    {!user.isMainAdmin && (
                                                        <>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase text-slate-400">City</label>
                                                                <p className="font-bold text-slate-700">{user.city || 'Not Added'}</p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase text-slate-400">Pincode</label>
                                                                <p className="font-bold text-slate-700">{user.pincode || 'Not Added'}</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* LinkedIn connection visible for all users with provided URLs */}
                                            {user.linkedin && (
                                                <div className="space-y-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                                                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">Connected Accounts</h4>
                                                    <div className="space-y-4">
                                                        <a
                                                            href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`}
                                                            target="_blank"
                                                            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary transition-all group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Linkedin size={20} className="text-[#0A66C2]" />
                                                                <div>
                                                                    <p className="font-bold text-slate-900 text-sm">LinkedIn Profile</p>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Publicly Visible</p>
                                                                </div>
                                                            </div>
                                                            <LinkIcon size={16} className="text-slate-300 group-hover:text-primary" />
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Security & Admin Management Section - Main Admins Only */}
                                {user?.isMainAdmin && (
                                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                                        <div className="flex items-center gap-4 py-2 border-b border-slate-50">
                                            <Shield className="text-primary" size={24} />
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Approved Secondary Admins</h3>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">View details of approved administrative team members</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest bg-primary/5 text-primary px-4 py-2 rounded-lg">Active Team Directory</h4>
                                                <div className="relative w-full md:w-80">
                                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Search secondary admins..."
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold outline-none focus:border-primary transition-all"
                                                        value={searchAdminQuery}
                                                        onChange={(e) => setSearchAdminQuery(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {members
                                                    .filter(m => m.role === 'admin' && m.status === 'accepted' && !m.isMainAdmin && m._id?.toString() !== user?._id?.toString())
                                                    .filter(m => !searchAdminQuery || m.name?.toLowerCase().includes(searchAdminQuery.toLowerCase()) || m.email?.toLowerCase().includes(searchAdminQuery.toLowerCase()))
                                                    .map(member => (
                                                        <MemberCard
                                                            key={member._id}
                                                            member={member}
                                                            isExpanded={expandedMemberId === member._id}
                                                            onToggle={() => setExpandedMemberId(expandedMemberId === member._id ? null : member._id)}
                                                            onApprove={(id) => handleStatusUpdate(id, 'accepted')}
                                                            onReject={(id) => handleStatusUpdate(id, 'rejected')}
                                                            onUndo={handleUndoApproval}
                                                            onRemove={() => handleDelete('member', member._id)}
                                                            onRoleUpdate={handleRoleUpdate}
                                                            onPromoteMain={handlePromoteMain}
                                                            showActions={user?.isMainAdmin}
                                                            isMainAdmin={user?.isMainAdmin}
                                                        />
                                                    ))
                                                }
                                                {members.filter(m => m.role === 'admin' && m.status === 'accepted' && !m.isMainAdmin && m._id?.toString() !== user?._id?.toString()).length === 0 && (
                                                    <div className="col-span-full py-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">No other approved secondary admins found.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </main>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <ConfirmationModal {...modalConfig} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} />
        </div>
    );
};