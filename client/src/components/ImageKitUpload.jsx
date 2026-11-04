import React, { useRef, useState } from "react";
import ImageKit from "imagekit-javascript";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { api } from "../services/api.js";

const imagekit = new ImageKit({
  publicKey: "public_B+2/j8qQP/Gd5dggjt/QYzhXTTs=",
  urlEndpoint: "https://ik.imagekit.io/eghvqjnt4",
});

export const ImageKitUpload = ({ onUploadSuccess, limit = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > limit) {
      alert(`Max ${limit} images allowed.`);
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

    try {
      const authParams = await api.getImageKitAuth();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Use a temporary base64 preview while uploading for better UX
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        const response = await imagekit.upload({
          file: file,
          fileName: file.name,
          signature: authParams.signature,
          token: authParams.token,
          expire: authParams.expire,
          folder: "/Events",
        });
        uploadedUrls.push(response.url);
        setPreviewImages(prev => [...prev, response.url]);
      }
      
      onUploadSuccess(uploadedUrls);
    } catch (error) {

      console.error("Upload error:", error);
      alert("Failed to upload images.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (url) => {
    const updated = previewImages.filter(img => img !== url);
    setPreviewImages(updated);
    // Note: This only removes from local state preview, 
    // we should handle removal in the parent form's data too.
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {previewImages.map((src, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100 group">
            <img src={`${src}?tr=w-200,h-200`} className="w-full h-full object-cover" />
            <button 
                type="button"
                onClick={() => removeImage(src)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <X size={10} />
            </button>
          </div>
        ))}
        {previewImages.length < limit && (
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all bg-slate-50/50"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            <span className="text-[8px] font-black uppercase mt-1">{uploading ? "..." : "Add"}</span>
          </button>
        )}
      </div>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
        {previewImages.length} of {limit} images uploaded
      </p>
    </div>
  );
};

