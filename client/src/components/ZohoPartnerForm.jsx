import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export const ZohoPartnerForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState("500px");
  const iframeRef = useRef(null);

  const baseSrc =
    "https://forms.zohopublic.in/hellomyh1/form/BecomePartner/formperma/e5IKTc0g91RvC17NU-czR8ID4q23ytbmilDCOrthdPQ";

  // Safely execute Zoho referrer-tracking functionality once on mount
  useEffect(() => {
    try {
      var zf_frame = iframeRef.current || document.getElementById("ziframe_649441");
      if (!zf_frame) return;

      var ifrmSrc = zf_frame.src || baseSrc;

      if (!((new RegExp("[?&]referrername=")).test(ifrmSrc))) {
        var rfr = window.location.href;

        try {
          rfr =
            window.self !== window.top
              ? window.top.location.href
              : (/^https?:\/\/[\w.-]+\.[a-zA-Z]{2,}/i.test(rfr) ? rfr : "");
        } catch (e) {}

        if (rfr && rfr !== "") {
          if (rfr.length > 1800) {
            var queryIndex = rfr.indexOf("?");
            if (queryIndex > -1) {
              rfr = rfr.substring(0, queryIndex);
            }
            if (rfr.length > 1800) {
              rfr = rfr.substring(0, 1800);
            }
          }

          ifrmSrc +=
            ((ifrmSrc.indexOf("?") > 0) ? "&" : "?") +
            "referrername=" +
            encodeURIComponent(rfr);
        }
      }

      if (zf_frame.src !== ifrmSrc) {
        zf_frame.src = ifrmSrc;
      }
    } catch (e) {}
  }, []);

  // Listen for Zoho dynamic iframe resize messages if emitted
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        if (typeof event.data === "string" && event.data.indexOf("zf_resize") > -1) {
          const parts = event.data.split(":");
          if (parts.length >= 2) {
            const height = parseInt(parts[1], 10);
            if (!isNaN(height) && height > 300) {
              setIframeHeight(`${height + 30}px`);
            }
          }
        }
      } catch (e) {}
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="partner-form-container w-full max-w-[900px] mx-auto relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center min-h-[400px] bg-slate-50/70 rounded-2xl z-10 transition-opacity">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Loading Partner Form...
          </p>
        </div>
      )}

      <iframe
        ref={iframeRef}
        id="ziframe_649441"
        aria-label="Become a Partner with myHRSG"
        frameBorder="0"
        title="Become a Partner with myHRSG"
        src={baseSrc}
        onLoad={() => setIsLoading(false)}
        className="partner-form-iframe rounded-2xl transition-opacity duration-300 mx-auto"
        style={{
          height: iframeHeight,
          width: "99%",
          border: "none",
          display: "block",
        }}
        scrolling="auto"
      />
    </div>
  );
};

export default ZohoPartnerForm;
