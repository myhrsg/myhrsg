import React, { useRef, useEffect, useState } from "react";
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Outdent, Indent,
  Link as LinkIcon, Unlink, Image as ImageIcon, Video, Mail,
  Printer, Eye, Quote, Minus, RotateCcw, RotateCw,
  Code, Eraser, Heading, Smile, Table as TableIcon, 
  ChevronDown, Maximize, Minimize, MoreHorizontal, FileText, Check,
  Upload, Loader2
} from "lucide-react";
import ImageKit from "imagekit-javascript";
import { api } from "../services/api.js";

const RichTextEditor = ({ value, onChange, placeholder = "Start writing your content..." }) => {
  const editorRef = useRef(null);
  const textColorInputRef = useRef(null);
  const bgColorInputRef = useRef(null);
  
  const [isSourceView, setIsSourceView] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value || "");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState(null); // "font", "size", "heading", "more", "emoji"
  const [currentFont, setCurrentFont] = useState("Inter");
  const [currentSize, setCurrentSize] = useState("16px");
  const [currentHeading, setCurrentHeading] = useState("Normal");

  // Custom Modal States
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "", // "link", "email", "image", "video"
    title: "",
    inputLabel: "",
    inputValue: "",
    placeholder: "",
    savedSelection: null,
    showInput: false,
    isUploading: false
  });

  // Custom Crop States
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPanX, setCropPanX] = useState(0);
  const [cropPanY, setCropPanY] = useState(0);
  const [cropAspect, setCropAspect] = useState(1.77); // 16:9 default

  // Custom Image Click & Edit States
  const [selectedImageEl, setSelectedImageEl] = useState(null);

  // Sync internal state with external value ONLY if they diverge to keep cursor position
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
    setHtmlContent(value || "");
  }, [value]);

  // Handle outside clicks to close custom dropdowns
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const executeCommand = (command, val = null) => {
    if (isSourceView) return;
    
    // Restore selection if it was saved (for modal operations)
    if (modalConfig.savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(modalConfig.savedSelection);
    }

    document.execCommand(command, false, val);
    handleContentChange();
    
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      setHtmlContent(currentHtml);
      if (onChange) {
        onChange(currentHtml);
      }
    }
  };

  const handleSourceChange = (e) => {
    const val = e.target.value;
    setHtmlContent(val);
    if (onChange) {
      onChange(val);
    }
  };

  // Keyboard Shortcuts Handler
  const handleKeyDown = (e) => {
    // Ctrl+K -> Link popup
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      openInsertModal("link");
    }
  };

  // Drag & Drop Image Handler
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          executeCommand("insertImage", event.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Paste Image Handler
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              executeCommand("insertImage", event.target.result);
            };
            reader.readAsDataURL(file);
            e.preventDefault();
          }
        }
      }
    }
  };

  // Image Selection Click Handler
  const handleEditorClick = (e) => {
    if (e.target.tagName === "IMG") {
      setSelectedImageEl(e.target);
    } else {
      setSelectedImageEl(null);
    }
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  const openInsertModal = (type) => {
    const currentSelection = saveSelection();
    setCropImageSrc(null);
    setCropZoom(1);
    setCropPanX(0);
    setCropPanY(0);
    setCropAspect(1.77);

    let config = {
      isOpen: true,
      type,
      inputValue: "",
      savedSelection: currentSelection,
      showInput: type === "link" || type === "email",
      isUploading: false
    };

    if (type === "link") {
      config.title = "Insert Hyperlink";
      config.inputLabel = "URL Link Address";
      config.placeholder = "https://example.com";
    } else if (type === "email") {
      config.title = "Insert Email Link";
      config.inputLabel = "Email Address";
      config.placeholder = "name@example.com";
    } else if (type === "image") {
      config.title = "Insert Image";
      config.inputLabel = "Image Source URL";
      config.placeholder = "https://example.com/image.jpg";
    } else if (type === "video") {
      config.title = "Insert Video";
      config.inputLabel = "YouTube URL or Iframe Embed Code";
      config.placeholder = "https://www.youtube.com/watch?v=... or <iframe> code";
    }

    setModalConfig(config);
  };

  const getCroppedImage = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = cropImageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let sWidth = img.width;
        let sHeight = img.height;

        if (cropAspect > 0) {
          if (img.width / img.height > cropAspect) {
            sWidth = img.height * cropAspect;
          } else {
            sHeight = img.width / cropAspect;
          }
        }

        const cropW = sWidth / cropZoom;
        const cropH = sHeight / cropZoom;

        const maxOffsetW = (img.width - cropW) / 2;
        const maxOffsetH = (img.height - cropH) / 2;
        
        const offsetX = (cropPanX / 100) * maxOffsetW;
        const offsetY = (cropPanY / 100) * maxOffsetH;

        const startX = (img.width - cropW) / 2 + offsetX;
        const startY = (img.height - cropH) / 2 - offsetY;

        canvas.width = sWidth;
        canvas.height = sHeight;

        ctx.drawImage(
          img,
          Math.max(0, Math.min(img.width - cropW, startX)),
          Math.max(0, Math.min(img.height - cropH, startY)),
          cropW,
          cropH,
          0,
          0,
          sWidth,
          sHeight
        );

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg", 0.9);
      };
    });
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    if (type === "image" && !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    if (type === "video" && !file.type.startsWith("video/")) {
      alert("Please select a valid video file.");
      return;
    }
    if (type === "video" && file.size > 20 * 1024 * 1024) {
      alert("Video file exceeds 20MB limit. Please use a YouTube link or compress the video.");
      return;
    }

    setModalConfig(prev => ({ ...prev, isUploading: true }));

    try {
      const authParams = await api.getImageKitAuth();
      const imagekit = new ImageKit({
        publicKey: "public_B+2/j8qQP/Gd5dggjt/QYzhXTTs=",
        urlEndpoint: "https://ik.imagekit.io/eghvqjnt4",
      });

      const response = await imagekit.upload({
        file: file,
        fileName: `${Date.now()}-${file.name}`,
        signature: authParams.signature,
        token: authParams.token,
        expire: authParams.expire,
        folder: "/sponsors",
      });

      // Restore selection
      if (modalConfig.savedSelection) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(modalConfig.savedSelection);
      }

      if (type === "image") {
        if (modalConfig.type === "image-edit" && selectedImageEl) {
          selectedImageEl.src = response.url;
          handleContentChange();
          setSelectedImageEl(null);
        } else {
          executeCommand("insertImage", response.url);
        }
      } else if (type === "video") {
        const videoHTML = `<div class="my-4 max-w-2xl"><video src="${response.url}" controls class="w-full rounded-2xl aspect-video bg-black"></video></div>`;
        executeCommand("insertHTML", videoHTML);
      }

      setModalConfig({
        isOpen: false,
        type: "",
        title: "",
        inputLabel: "",
        inputValue: "",
        placeholder: "",
        savedSelection: null,
        showInput: false,
        isUploading: false
      });
    } catch (err) {
      console.error("Editor Media Upload Error:", err);
      alert(`Media upload failed: ${err.message || "Unknown error"}`);
      setModalConfig(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleModalSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const { type, inputValue } = modalConfig;

    if (!inputValue.trim()) {
      setModalConfig({ ...modalConfig, isOpen: false });
      return;
    }

    if (type === "link") {
      executeCommand("createLink", inputValue);
    } else if (type === "email") {
      executeCommand("createLink", `mailto:${inputValue}`);
    } else if (type === "image") {
      executeCommand("insertImage", inputValue);
    } else if (type === "video") {
      if (inputValue.startsWith("<iframe")) {
        executeCommand("insertHTML", inputValue);
      } else {
        let videoId = "";
        if (inputValue.includes("youtube.com/watch?v=")) {
          videoId = inputValue.split("v=")[1].split("&")[0];
        } else if (inputValue.includes("youtu.be/")) {
          videoId = inputValue.split("youtu.be/")[1].split("?")[0];
        }
        
        if (videoId) {
          const iframe = `<div class="aspect-video w-full my-4"><iframe class="w-full h-full rounded-2xl" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
          executeCommand("insertHTML", iframe);
        } else {
          alert("Invalid YouTube URL. Please use a youtube.com/watch?v=... link or enter the iframe embed HTML.");
        }
      }
    }

    setModalConfig({ ...modalConfig, isOpen: false, savedSelection: null });
  };

  // Custom Operations
  const insertTable = () => {
    const tableHTML = `
      <table class="border-collapse border border-slate-200 w-full my-4 text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th class="border border-slate-200 p-3 font-semibold text-left">Header 1</th>
            <th class="border border-slate-200 p-3 font-semibold text-left">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-200 p-3 text-slate-600">Cell data 1</td>
            <td class="border border-slate-200 p-3 text-slate-600">Cell data 2</td>
          </tr>
          <tr>
            <td class="border border-slate-200 p-3 text-slate-600">Cell data 3</td>
            <td class="border border-slate-200 p-3 text-slate-600">Cell data 4</td>
          </tr>
        </tbody>
      </table>
    `;
    executeCommand("insertHTML", tableHTML);
  };

  const insertInlineCode = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const text = selection.toString();
    if (text) {
      executeCommand("insertHTML", `<code class="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200/50">${text}</code>`);
    } else {
      executeCommand("insertHTML", `<code class="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200/50">code</code>`);
    }
  };

  const insertCodeBlock = () => {
    executeCommand("insertHTML", `<pre class="bg-slate-950 text-slate-100 p-5 rounded-2xl font-mono text-xs my-4 overflow-x-auto"><code>// Enter your block of code here</code></pre>`);
  };

  const toggleSourceView = () => {
    if (isSourceView) {
      setIsSourceView(false);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlContent;
        }
      }, 50);
    } else {
      setIsSourceView(true);
    }
  };

  const printDocument = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<html><head><title>Print Preview</title><style>body{font-family:sans-serif;padding:40px;line-height:1.6;}</style></head><body>${htmlContent}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const dropdownToggle = (e, type) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  const fonts = ["Inter", "Arial", "Georgia", "Courier New", "Times New Roman", "Tahoma", "Verdana"];
  const sizes = [
    { label: "Tiny", val: "1" },
    { label: "Small", val: "2" },
    { label: "Normal", val: "3" },
    { label: "Medium", val: "4" },
    { label: "Large", val: "5" },
    { label: "X-Large", val: "6" },
    { label: "XX-Large", val: "7" }
  ];
  const headings = [
    { label: "Paragraph", tag: "p" },
    { label: "Heading 1", tag: "h1" },
    { label: "Heading 2", tag: "h2" },
    { label: "Heading 3", tag: "h3" },
    { label: "Heading 4", tag: "h4" },
    { label: "Heading 5", tag: "h5" },
    { label: "Heading 6", tag: "h6" }
  ];
  const emojis = ["😀", "😂", "😍", "👍", "🎉", "🔥", "🚀", "❤️", "💼", "📢"];

  return (
    <div className={`border border-slate-200/80 rounded-[20px] bg-white shadow-sm flex flex-col font-sans transition-all duration-300 ${
      isFullscreen ? "fixed inset-4 z-[999] h-[calc(100vh-32px)] border border-slate-200 shadow-2xl" : "min-h-[460px]"
    }`}>
      <style>{`
        .editor-content-area ul {
          list-style-type: disc !important;
          padding-left: 2rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .editor-content-area ol {
          list-style-type: decimal !important;
          padding-left: 2rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .editor-content-area li {
          display: list-item !important;
          margin-bottom: 0.25rem !important;
        }
        .editor-content-area a {
          color: #06b6d4 !important;
          text-decoration: underline !important;
          font-weight: bold !important;
        }
        @media (max-width: 768px) {
          .mobile-friendly-dropdown {
            left: 0 !important;
            right: auto !important;
            transform: none !important;
          }
        }
      `}</style>
      
      {/* Hidden Color Inputs */}
      <input 
        type="color" 
        ref={textColorInputRef} 
        className="hidden" 
        onChange={(e) => executeCommand("foreColor", e.target.value)} 
      />
      <input 
        type="color" 
        ref={bgColorInputRef} 
        className="hidden" 
        onChange={(e) => executeCommand("backColor", e.target.value)} 
      />

      {/* Premium Minimal Toolbar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 p-2 sm:p-3 flex flex-wrap items-center gap-1 z-30 select-none rounded-t-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
        
        {/* GROUP 1: Typography (Font, Size, Headings) */}
        <div className="flex items-center gap-1">
          {/* Font Family Dropdown */}
          <div className="relative">
            <button
              type="button"
              disabled={isSourceView}
              onClick={(e) => dropdownToggle(e, "font")}
              className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200/60 transition-colors disabled:opacity-50 min-w-[90px]"
            >
              <span>{currentFont}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
            {activeDropdown === "font" && (
              <div className="absolute top-9 left-0 w-36 bg-white border border-slate-150 rounded-xl shadow-xl py-1 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                {fonts.map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => {
                      setCurrentFont(font);
                      executeCommand("fontName", font);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center justify-between"
                    style={{ fontFamily: font }}
                  >
                    <span>{font}</span>
                    {currentFont === font && <Check size={12} className="text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Dropdown */}
          <div className="relative">
            <button
              type="button"
              disabled={isSourceView}
              onClick={(e) => dropdownToggle(e, "size")}
              className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200/60 transition-colors disabled:opacity-50 min-w-[80px]"
            >
              <span>{currentSize}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
            {activeDropdown === "size" && (
              <div className="absolute top-9 left-0 w-28 bg-white border border-slate-150 rounded-xl shadow-xl py-1 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                {sizes.map((sz) => (
                  <button
                    key={sz.val}
                    type="button"
                    onClick={() => {
                      setCurrentSize(sz.label);
                      executeCommand("fontSize", sz.val);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>{sz.label}</span>
                    {currentSize === sz.label && <Check size={12} className="text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Heading Dropdown */}
          <div className="relative">
            <button
              type="button"
              disabled={isSourceView}
              onClick={(e) => dropdownToggle(e, "heading")}
              className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200/60 transition-colors disabled:opacity-50 min-w-[95px]"
            >
              <span className="flex items-center gap-1">
                <Heading size={12} className="text-slate-400" /> {currentHeading}
              </span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
            {activeDropdown === "heading" && (
              <div className="absolute top-9 left-0 w-32 bg-white border border-slate-150 rounded-xl shadow-xl py-1 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                {headings.map((hd) => (
                  <button
                    key={hd.tag}
                    type="button"
                    onClick={() => {
                      setCurrentHeading(hd.label);
                      executeCommand("formatBlock", hd.tag);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>{hd.label}</span>
                    {currentHeading === hd.label && <Check size={12} className="text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1 shrink-0" />

        {/* GROUP 2: Basic Text Formatting */}
        <div className="flex items-center gap-0.5">
          <button 
            type="button"
            disabled={isSourceView}
            title="Bold (Ctrl+B)"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("bold"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <Bold size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Italic (Ctrl+I)"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("italic"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <Italic size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Underline (Ctrl+U)"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("underline"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <Underline size={16} />
          </button>
          
          {/* Colors */}
          <button 
            type="button"
            disabled={isSourceView}
            title="Text Color"
            onMouseDown={(e) => { e.preventDefault(); textColorInputRef.current?.click(); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <span className="font-black text-sm border-b-[3px] border-slate-900 leading-none px-0.5">A</span>
          </button>

          <button 
            type="button"
            disabled={isSourceView}
            title="Highlight Color"
            onMouseDown={(e) => { e.preventDefault(); bgColorInputRef.current?.click(); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <span className="bg-yellow-200 text-slate-900 font-black text-xs px-0.5 rounded">ab</span>
          </button>

          <button 
            type="button"
            disabled={isSourceView}
            title="Clear Formatting"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("removeFormat"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <Eraser size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1 shrink-0" />

        {/* GROUP 3: Paragraph & List Options */}
        <div className="flex items-center gap-0.5">
          <button 
            type="button"
            disabled={isSourceView}
            title="Align Left"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("justifyLeft"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <AlignLeft size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Align Center"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("justifyCenter"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <AlignCenter size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Align Right"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("justifyRight"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <AlignRight size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Justify"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("justifyFull"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <AlignJustify size={16} />
          </button>

          {/* Lists */}
          <button 
            type="button"
            disabled={isSourceView}
            title="Bulleted List"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("insertUnorderedList"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <List size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Numbered List"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("insertOrderedList"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <ListOrdered size={16} />
          </button>
          
          {/* Indents */}
          <button 
            type="button"
            disabled={isSourceView}
            title="Decrease Indent"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("outdent"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <Outdent size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Increase Indent"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("indent"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <Indent size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1 shrink-0" />

        {/* GROUP 4: Link / Image / Video Insertion */}
        <div className="flex items-center gap-0.5">
          <button 
            type="button"
            disabled={isSourceView}
            title="Insert Link (Ctrl+K)"
            onMouseDown={(e) => { e.preventDefault(); openInsertModal("link"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <LinkIcon size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Remove Link"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("unlink"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <Unlink size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Insert Image URL"
            onMouseDown={(e) => { e.preventDefault(); openInsertModal("image"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <ImageIcon size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Insert Video Embed"
            onMouseDown={(e) => { e.preventDefault(); openInsertModal("video"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <Video size={16} />
          </button>
          <button 
            type="button"
            disabled={isSourceView}
            title="Insert Email Link"
            onMouseDown={(e) => { e.preventDefault(); openInsertModal("email"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <Mail size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1 shrink-0" />

        {/* GROUP 5: Utilities (Undo/Redo) */}
        <div className="flex items-center gap-0.5">
          <button 
            type="button"
            title="Undo"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("undo"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            type="button"
            title="Redo"
            onMouseDown={(e) => { e.preventDefault(); executeCommand("redo"); }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            <RotateCw size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1 shrink-0" />

        {/* GROUP 6: More Actions Dropdown (⋯) */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => dropdownToggle(e, "more")}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors flex items-center justify-center"
            title="More Options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
 
        {/* GROUP 7: Emoji Dropdown */}
        <div className="relative">
          <button
            type="button"
            disabled={isSourceView}
            onClick={(e) => dropdownToggle(e, "emoji")}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            title="Insert Emoji"
          >
            <Smile size={16} />
          </button>
        </div>

        {/* GROUP 8: Screen Mode & Source Toggle */}
        <div className="ml-auto flex items-center gap-0.5">
          {/* Source HTML view */}
          <button 
            type="button"
            title="View Source HTML"
            onClick={toggleSourceView}
            className={`p-1.5 rounded-lg transition-colors ${isSourceView ? "bg-slate-950 text-white hover:bg-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <Code size={16} />
          </button>
          {/* Fullscreen view */}
          <button 
            type="button"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>

        {/* Absolute aligned dropdowns relative to the entire toolbar to prevent clipping */}
        {activeDropdown === "more" && (
          <div className="absolute top-full right-2 mt-1 w-44 bg-white border border-slate-150 rounded-xl shadow-xl py-1 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
            <button 
              type="button"
              disabled={isSourceView}
              onMouseDown={(e) => { e.preventDefault(); executeCommand("strikeThrough"); }}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
            >
              <Strikethrough size={14} /> Strikethrough
            </button>
            <button 
              type="button"
              disabled={isSourceView}
              onMouseDown={(e) => { e.preventDefault(); executeCommand("formatBlock", "blockquote"); }}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
            >
              <Quote size={14} /> Block Quote
            </button>
            <button 
              type="button"
              disabled={isSourceView}
              onMouseDown={(e) => { e.preventDefault(); insertInlineCode(); }}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
            >
              <Code size={14} /> Inline Code
            </button>
            <button 
              type="button"
              disabled={isSourceView}
              onMouseDown={(e) => { e.preventDefault(); insertCodeBlock(); }}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
            >
              <Code size={14} /> Code Block
            </button>
            <button 
              type="button"
              disabled={isSourceView}
              onMouseDown={(e) => { e.preventDefault(); insertTable(); }}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
            >
              <TableIcon size={14} /> Insert Table
            </button>
            <button 
              type="button"
              disabled={isSourceView}
              onMouseDown={(e) => { e.preventDefault(); executeCommand("insertHorizontalRule"); }}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
            >
              <Minus size={14} /> Horizontal Divider
            </button>
            <div className="h-px bg-slate-100 my-1" />
            <button 
              type="button"
              onClick={printDocument}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
            >
              <Printer size={14} /> Print
            </button>
            <button 
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
            >
              <Eye size={14} /> Preview
            </button>
          </div>
        )}

        {activeDropdown === "emoji" && (
          <div className="absolute top-full right-2 mt-1 bg-white border border-slate-150 rounded-xl shadow-xl p-2 z-40 grid grid-cols-5 gap-1.5 w-40 animate-in fade-in slide-in-from-top-1 duration-150">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); executeCommand("insertHTML", emoji); }}
                className="w-6 h-6 hover:bg-slate-50 rounded flex items-center justify-center text-sm"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Image Context Toolbar */}
      {selectedImageEl && (
        <div className="bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <ImageIcon size={14} className="text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">Image Selected</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCropImageSrc(selectedImageEl.src);
                setCropZoom(1);
                setCropPanX(0);
                setCropPanY(0);
                setCropAspect(1.77);
                setModalConfig({
                  isOpen: true,
                  type: "image-edit",
                  title: "Crop Selected Image",
                  savedSelection: null,
                  showInput: false,
                  isUploading: false
                });
              }}
              className="px-3 py-1.5 bg-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-1 shadow-md shadow-primary/20"
            >
              ✂&nbsp;Crop Image
            </button>
            
            <div className="h-4 w-px bg-slate-800" />

            <span className="text-[10px] font-bold text-slate-400 uppercase">Size:</span>
            <div className="flex items-center bg-slate-850 rounded-xl p-0.5 border border-slate-850">
              <button
                type="button"
                onClick={() => { selectedImageEl.style.width = "100%"; selectedImageEl.style.height = "auto"; handleContentChange(); }}
                className="px-2.5 py-1 hover:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => { selectedImageEl.style.width = "75%"; selectedImageEl.style.height = "auto"; handleContentChange(); }}
                className="px-2.5 py-1 hover:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => { selectedImageEl.style.width = "50%"; selectedImageEl.style.height = "auto"; handleContentChange(); }}
                className="px-2.5 py-1 hover:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
              >
                50%
              </button>
            </div>

            <div className="h-4 w-px bg-slate-800" />

            <span className="text-[10px] font-bold text-slate-400 uppercase">Align:</span>
            <div className="flex items-center bg-slate-850 rounded-xl p-0.5 border border-slate-850">
              <button
                type="button"
                onClick={() => { selectedImageEl.style.float = "left"; selectedImageEl.style.margin = "10px 20px 10px 0"; selectedImageEl.style.display = "inline"; handleContentChange(); }}
                className="px-2.5 py-1 hover:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Left
              </button>
              <button
                type="button"
                onClick={() => { selectedImageEl.style.float = "none"; selectedImageEl.style.margin = "10px auto"; selectedImageEl.style.display = "block"; handleContentChange(); }}
                className="px-2.5 py-1 hover:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Center
              </button>
              <button
                type="button"
                onClick={() => { selectedImageEl.style.float = "right"; selectedImageEl.style.margin = "10px 0 10px 20px"; selectedImageEl.style.display = "inline"; handleContentChange(); }}
                className="px-2.5 py-1 hover:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Right
              </button>
            </div>

            <div className="h-4 w-px bg-slate-800" />

            <button
              type="button"
              onClick={() => {
                selectedImageEl.remove();
                setSelectedImageEl(null);
                handleContentChange();
              }}
              className="px-3 py-1.5 bg-red-650 hover:bg-red-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              🗑&nbsp;Delete
            </button>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div className="relative flex-grow flex flex-col bg-white overflow-hidden rounded-b-[20px]">
        {isSourceView ? (
          <textarea
            value={htmlContent}
            onChange={handleSourceChange}
            placeholder="Type raw HTML here..."
            className="w-full flex-grow p-6 sm:p-10 outline-none font-mono text-sm text-slate-800 bg-slate-950 text-white min-h-[300px] border-none resize-none focus:ring-0 focus:outline-none"
          />
        ) : (
          <>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleContentChange}
              onBlur={handleContentChange}
              onClick={handleEditorClick}
              onKeyDown={handleKeyDown}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onPaste={handlePaste}
              placeholder={placeholder}
              className="w-full flex-grow p-8 sm:p-12 outline-none text-slate-900 min-h-[340px] prose prose-slate max-w-none focus:ring-0 overflow-y-auto selection:bg-slate-100 leading-relaxed font-sans editor-content-area"
              style={{ 
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "16px",
              }}
            />
            {/* Placeholder behaviour */}
            {!htmlContent && (
              <div className="absolute top-8 left-8 sm:left-12 text-slate-350 pointer-events-none text-base select-none font-medium z-10">
                {placeholder}
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom HTML Preview Dialog */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-slate-400" />
                <h3 className="font-black text-lg text-slate-900">Article Preview</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
            <div 
              className="p-10 overflow-y-auto flex-grow prose max-w-none font-sans"
              dangerouslySetInnerHTML={{ __html: htmlContent || "<p class='text-slate-400 italic'>No content written yet.</p>" }}
            />
          </div>
        </div>
      )}

      {/* Beautiful Insert Popup Modal (Replaces standard prompt/alert) */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[210] flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-slate-100 flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-black text-lg text-slate-900">{modalConfig.title}</h4>
              <button 
                type="button" 
                disabled={modalConfig.isUploading}
                onClick={() => setModalConfig({ ...modalConfig, isOpen: false, savedSelection: null })}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {modalConfig.isUploading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={32} />
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Uploading media to hosting server...
                </p>
              </div>
            ) : modalConfig.type === "image" && cropImageSrc ? (
              // Step: Image Crop Workspace
              <div className="flex flex-col gap-5 py-2">
                <div className="relative overflow-hidden w-full bg-slate-950 rounded-2xl flex items-center justify-center h-48 border border-slate-150 shadow-inner">
                  {/* Highlight Box / Crop Area Guide */}
                  <div 
                    className="absolute border-2 border-primary z-20 pointer-events-none rounded-xl shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] animate-in fade-in duration-300"
                    style={{
                      aspectRatio: cropAspect || "auto",
                      width: cropAspect === 1 ? "120px" : "190px",
                      height: cropAspect === 1 ? "120px" : "107px",
                    }}
                  />
                  <img
                    src={cropImageSrc}
                    alt="To Crop"
                    className="max-w-full max-h-full object-contain transition-transform duration-100"
                    style={{
                      transform: `scale(${cropZoom}) translate(${cropPanX}px, ${-cropPanY}px)`
                    }}
                  />
                </div>

                {/* Crop Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 pl-1">
                    <span>Aspect Ratio</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCropAspect(1.77)}
                        className={`px-2.5 py-1 rounded-md text-[9px] font-black transition-colors ${cropAspect === 1.77 ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      >
                        16:9
                      </button>
                      <button
                        type="button"
                        onClick={() => setCropAspect(1)}
                        className={`px-2.5 py-1 rounded-md text-[9px] font-black transition-colors ${cropAspect === 1 ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      >
                        1:1
                      </button>
                      <button
                        type="button"
                        onClick={() => setCropAspect(0)}
                        className={`px-2.5 py-1 rounded-md text-[9px] font-black transition-colors ${cropAspect === 0 ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      >
                        Free
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 pl-1">
                      <span>ZOOM</span>
                      <span>{Math.round(cropZoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={cropZoom}
                      onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 pl-1">PAN HORIZONTAL</span>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={cropPanX}
                        onChange={(e) => setCropPanX(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 pl-1">PAN VERTICAL</span>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={cropPanY}
                        onChange={(e) => setCropPanY(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCropImageSrc(null);
                    }}
                    className="px-6 py-2.5 rounded-xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setModalConfig(prev => ({ ...prev, isUploading: true }));
                      try {
                        const croppedBlob = await getCroppedImage();
                        const file = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
                        await handleFileUpload(file, "image");
                      } catch (err) {
                        alert("Cropping failed: " + err.message);
                        setModalConfig(prev => ({ ...prev, isUploading: false }));
                      }
                    }}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-black hover:bg-primary/90 text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary/20"
                  >
                    Crop & Upload
                  </button>
                </div>
              </div>
            ) : (modalConfig.type === "image" || modalConfig.type === "video") && !modalConfig.showInput ? (
              // Step 1: Option Selection
              <div className="flex flex-col gap-4 py-2">
                <button
                  type="button"
                  onClick={() => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = modalConfig.type === "image" ? "image/*" : "video/*";
                    fileInput.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (modalConfig.type === "image") {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setCropImageSrc(event.target.result);
                            setCropZoom(1);
                            setCropPanX(0);
                            setCropPanY(0);
                            setCropAspect(1.77);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          handleFileUpload(file, modalConfig.type);
                        }
                      }
                    };
                    fileInput.click();
                  }}
                  className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-slate-50/50 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Upload size={22} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-sm">Upload from Computer</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {modalConfig.type === "image" ? "PNG, JPG, GIF (Max 10MB)" : "MP4 format (Max 20MB)"}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setModalConfig({ ...modalConfig, showInput: true })}
                  className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-slate-50/50 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
                    <LinkIcon size={22} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-sm">Insert Link URL</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Paste a direct media web address
                    </p>
                  </div>
                </button>
              </div>
            ) : (
              // Step 2: Paste URL Input Form
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {modalConfig.inputLabel}
                  </label>
                  <input 
                    type="text"
                    required
                    autoFocus
                    placeholder={modalConfig.placeholder}
                    value={modalConfig.inputValue}
                    onChange={(e) => setModalConfig({ ...modalConfig, inputValue: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleModalSubmit(e);
                      }
                    }}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:outline-none focus:ring-primary/20"
                  />
                </div>

                <div className="flex gap-4 justify-end pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      if (modalConfig.type === "image" || modalConfig.type === "video") {
                        setModalConfig({ ...modalConfig, showInput: false });
                      } else {
                        setModalConfig({ ...modalConfig, isOpen: false, savedSelection: null });
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 text-xs uppercase tracking-wider transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => handleModalSubmit(e)}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-black hover:bg-primary/90 text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary/20"
                  >
                    Insert
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
