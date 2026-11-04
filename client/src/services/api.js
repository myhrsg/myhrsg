import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
    // Auth - Merged from Main & Chapters
    login: async (code) => {
        const res = await axios.post(`${API_URL}/auth/linkedin`, { code });
        return res.data;
    },
    verifyOTP: async (token, otp) => {
        const res = await axios.post(`${API_URL}/auth/verify-otp`, { token, otp });
        return res.data;
    },
    resendOTP: async (token) => {
        const res = await axios.post(`${API_URL}/auth/resend-otp`, { token });
        return res.data;
    },
    getMe: async () => {
        const res = await axios.get(`${API_URL}/auth/me`, { headers: getAuthHeader() });
        return res.data;
    },
    completeProfile: async (data) => {
        const res = await axios.post(`${API_URL}/auth/complete-profile`, data, { headers: getAuthHeader() });
        return res.data;
    },

    // Members (Admin)
    getMembers: async (params = {}) => {
        const res = await axios.get(`${API_URL}/members`, { 
            headers: getAuthHeader(),
            params
        });
        return res.data;
    },
    updateMemberStatus: async (id, status, reason = "") => {
        const res = await axios.put(`${API_URL}/members/${id}/status`, { status, reason }, { headers: getAuthHeader() });
        return res.data;
    },
    promoteAdmin: async (id) => {
        const res = await axios.put(`${API_URL}/members/${id}/promote`, {}, { headers: getAuthHeader() });
        return res.data;
    },
    deleteMember: async (id, reason = "") => {
        const res = await axios.delete(`${API_URL}/members/${id}`, { 
            headers: getAuthHeader(),
            params: { reason }
        });
        return res.data;
    },
    getAdminStats: async () => {
        const res = await axios.get(`${API_URL}/members/stats`, { headers: getAuthHeader() });
        return res.data;
    },
    sendMassMail: async (data) => {
        const res = await axios.post(`${API_URL}/members/mass-mail`, data, { headers: getAuthHeader() });
        return res.data;
    },

    // Events
    getEvents: async () => {
        const res = await axios.get(`${API_URL}/events`);
        return res.data;
    },
    getEventById: async (id) => {
        const res = await axios.get(`${API_URL}/events/${id}`);
        return res.data;
    },
    createEvent: async (formData) => {
        const res = await axios.post(`${API_URL}/events`, formData, { 
            headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" } 
        });
        return res.data;
    },
    updateEvent: async (id, formData) => {
        const res = await axios.put(`${API_URL}/events/${id}`, formData, { 
            headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" } 
        });
        return res.data;
    },
    deleteEvent: async (id) => {
        const res = await axios.delete(`${API_URL}/events/${id}`, { headers: getAuthHeader() });
        return res.data;
    },

    // Comments
    getComments: async (eventId) => {
        const res = await axios.get(`${API_URL}/comments/${eventId}`);
        return res.data;
    },
    postComment: async (commentData) => {
        const res = await axios.post(`${API_URL}/comments`, commentData, { headers: getAuthHeader() });
        return res.data;
    },
    deleteComment: async (commentId) => {
        const res = await axios.delete(`${API_URL}/comments/${commentId}`, { headers: getAuthHeader() });
        return res.data;
    },

    // Partners
    getPartners: async () => {
        const res = await axios.get(`${API_URL}/partners`);
        return res.data;
    },
    createPartnerInquiry: async (data) => {
        const res = await axios.post(`${API_URL}/partners`, data);
        return res.data;
    },

    // Sponsors
    getSponsors: async () => {
        const res = await axios.get(`${API_URL}/sponsors`);
        return res.data;
    },
    createSponsorInquiry: async (data) => {
        const res = await axios.post(`${API_URL}/sponsors`, data);
        return res.data;
    },

    // Display Sponsors (Logos)
    getDisplaySponsors: async () => {
        const res = await axios.get(`${API_URL}/display-sponsors`);
        return res.data;
    },
    createDisplaySponsor: async (data) => {
        const res = await axios.post(`${API_URL}/display-sponsors`, data, { headers: getAuthHeader() });
        return res.data;
    },
    updateDisplaySponsor: async (id, data) => {
        const res = await axios.put(`${API_URL}/display-sponsors/${id}`, data, { headers: getAuthHeader() });
        return res.data;
    },
    deleteDisplaySponsor: async (id) => {
        const res = await axios.delete(`${API_URL}/display-sponsors/${id}`, { headers: getAuthHeader() });
        return res.data;
    },

    // Mentors
    getMentors: async () => {
        const res = await axios.get(`${API_URL}/mentors`);
        return res.data;
    },
    createMentor: async (formData) => {
        const res = await axios.post(`${API_URL}/mentors`, formData, {
            headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },
    updateMentor: async (id, formData) => {
        const res = await axios.put(`${API_URL}/mentors/${id}`, formData, {
            headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },
    deleteMentor: async (id) => {
        const res = await axios.delete(`${API_URL}/mentors/${id}`, { headers: getAuthHeader() });
        return res.data;
    },
    undoMemberStatus: async (id) => {
        const res = await axios.put(`${API_URL}/members/${id}/undo`, {}, { headers: getAuthHeader() });
        return res.data;
    },
    updateUserRole: async (id, role) => {
        const res = await axios.patch(`${API_URL}/members/${id}/role`, { role }, { headers: getAuthHeader() });
        return res.data;
    },

    // Committee
    getCommittee: async () => {
        const res = await axios.get(`${API_URL}/committee`);
        return res.data;
    },
    createCommitteeMember: async (formData) => {
        const res = await axios.post(`${API_URL}/committee`, formData, {
            headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },
    deleteCommitteeMember: async (id) => {
        const res = await axios.delete(`${API_URL}/committee/${id}`, { headers: getAuthHeader() });
        return res.data;
    },
    updateCommitteeMember: async (id, formData) => {
        const res = await axios.put(`${API_URL}/committee/${id}`, formData, {
            headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },

    // Gallery
    getGalleryItems: async () => {
        const res = await axios.get(`${API_URL}/gallery`);
        return res.data;
    },
    createGalleryItem: async (formData) => {
        const res = await axios.post(`${API_URL}/gallery`, formData, {
            headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },
    updateGalleryItem: async (id, data) => {
        const res = await axios.put(`${API_URL}/gallery/${id}`, data, { headers: getAuthHeader() });
        return res.data;
    },
    deleteGalleryItem: async (id) => {
        const res = await axios.delete(`${API_URL}/gallery/${id}`, { headers: getAuthHeader() });
        return res.data;
    },

    // Quiz - Taken from Main Logic
    getQuizQuestions: async () => {
        const res = await axios.get(`${API_URL}/quiz`);
        return res.data;
    },
    createQuizQuestion: async (data) => {
        const res = await axios.post(`${API_URL}/quiz`, data, { headers: getAuthHeader() });
        return res.data;
    },
    updateQuizQuestion: async (id, data) => {
        const res = await axios.put(`${API_URL}/quiz/${id}`, data, { headers: getAuthHeader() });
        return res.data;
    },
    deleteQuizQuestion: async (id) => {
        const res = await axios.delete(`${API_URL}/quiz/${id}`, { headers: getAuthHeader() });
        return res.data;
    },

    // ImageKit
    getImageKitAuth: async () => {
        const res = await axios.get(`${API_URL}/imagekit/auth`);
        return res.data;
    },

    // Contact
    submitContactForm: async (data) => {
        const res = await axios.post(`${API_URL}/contact/submit`, data);
        return res.data;
    },

    // Articles
    getArticles: async (params) => {
        const res = await axios.get(`${API_URL}/articles`, { params });
        return res.data;
    },
    getArticleById: async (id) => {
        const res = await axios.get(`${API_URL}/articles/${id}`);
        return res.data;
    },
    createArticle: async (data) => {
        const res = await axios.post(`${API_URL}/articles`, data, { headers: getAuthHeader() });
        return res.data;
    },
    updateArticle: async (id, data) => {
        const res = await axios.put(`${API_URL}/articles/${id}`, data, { headers: getAuthHeader() });
        return res.data;
    },
    deleteArticle: async (id) => {
        const res = await axios.delete(`${API_URL}/articles/${id}`, { headers: getAuthHeader() });
        return res.data;
    },

    // Config
    getConfig: async (key) => {
        const res = await axios.get(`${API_URL}/config/${key}`);
        return res.data;
    },
    updateConfig: async (key, data) => {
        const res = await axios.put(`${API_URL}/config/${key}`, data, { headers: getAuthHeader() });
        return res.data;
    },

    // Testimonials
    getTestimonials: async () => {
        const res = await axios.get(`${API_URL}/testimonials`);
        return res.data;
    },
    createTestimonial: async (data) => {
        const headers = getAuthHeader();
        if (data instanceof FormData) {
            headers["Content-Type"] = "multipart/form-data";
        }
        const res = await axios.post(`${API_URL}/testimonials`, data, { headers });
        return res.data;
    },
    updateTestimonial: async (id, data) => {
        const headers = getAuthHeader();
        if (data instanceof FormData) {
            headers["Content-Type"] = "multipart/form-data";
        }
        const res = await axios.put(`${API_URL}/testimonials/${id}`, data, { headers });
        return res.data;
    },
    deleteTestimonial: async (id) => {
        const res = await axios.delete(`${API_URL}/testimonials/${id}`, { headers: getAuthHeader() });
        return res.data;
    },

    // WhatsApp Communities
    getWhatsAppCommunities: async () => {
        const res = await axios.get(`${API_URL}/whatsapp-communities`);
        return res.data;
    },
    createWhatsAppCommunity: async (formData) => {
        const res = await axios.post(`${API_URL}/whatsapp-communities`, formData, {
            headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },
    updateWhatsAppCommunity: async (id, formData) => {
        const res = await axios.put(`${API_URL}/whatsapp-communities/${id}`, formData, {
            headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },
    deleteWhatsAppCommunity: async (id) => {
        const res = await axios.delete(`${API_URL}/whatsapp-communities/${id}`, { headers: getAuthHeader() });
        return res.data;
    },
    reorderWhatsAppCommunities: async (ids) => {
        const res = await axios.put(`${API_URL}/whatsapp-communities/reorder`, { ids }, { headers: getAuthHeader() });
        return res.data;
    }
};
