import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead.jsx';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Privacy Policy"
        description="myHRSG Privacy Policy explains how we handle personal information when you use our website, join our community, or contact us."
        path="/privacy-policy"
      />
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        
        {/* Navigation Back Link */}
        <div className="mb-8">
          <Link className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors" to="/">
            ← Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <header className="border-b border-slate-200 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            myHRSG Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            URL: <span className="text-slate-700">www.myhrsg.org/privacy-policy</span> | Last updated: <time dateTime="2026-10-29">29 October 2026</time>
          </p>
        </header>

        {/* Content Body */}
        <article className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
          <p className="text-base sm:text-lg text-slate-700 font-normal">
            <strong>myHRSG</strong> respects your privacy. This policy explains how we handle personal information when you use <a href="https://www.myhrsg.org" className="text-indigo-600 hover:underline">www.myhrsg.org</a>, join our community, take part in events, contact us or submit a sponsorship or partnership enquiry, including through our social media lead forms.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Information we collect</h2>
            <p>
              We collect information you choose to provide, such as your name, email address, phone number, company, professional details, registration information and enquiry content. When you use Google or LinkedIn sign-in, we receive the profile information you authorise those services to share. We do not receive your password for those services.
            </p>
            <p className="mt-3">
              Our website may also collect technical information, such as your device and browser details, pages visited and referral information, through cookies, analytics and similar technologies. Please avoid sending sensitive personal information or confidential information about other people through general enquiry forms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">How we use information</h2>
            <p>
              We use information to respond to enquiries, manage membership and registrations, organise events and community activities, discuss sponsorship and partnership opportunities, maintain relevant records, and understand and improve our website and communications.
            </p>
            <p className="mt-3">
              We may contact you by email or phone about your enquiry or an activity you have requested. Optional promotional communications should reflect your preferences and any permissions required by applicable law. You can ask us to stop promotional communications at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Sharing information</h2>
            <p>
              Authorised team members and service providers may access information where needed to support our website, communications, registrations and activities. We may also disclose information where required by law or necessary to address misuse or protect legal rights.
            </p>
            <p className="mt-3">
              Participating in an event or submitting an enquiry does not automatically give sponsors or partners access to your contact details. Any separate sharing must be explained, with permission obtained where required. Information you post publicly or share in third-party community groups may be visible to other people according to the relevant platform settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Cookies and external services</h2>
            <p>
              We use website technologies to support site functions and understand usage. You can manage cookies and similar storage through your browser settings; restricting them may affect some features. Where consent is required for optional tracking, the relevant choice should be provided before it operates.
            </p>
            <p className="mt-3">
              Our website and communications may link to social networks, event platforms or partner websites. These services have their own privacy practices, which you should review before sharing information with them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Event photographs and recordings</h2>
            <p>
              Events and community activities may include photography, video or testimonials. The intended use should be explained through the relevant event or contribution notice, with permission obtained where required. Contact us if you have a concern about published content that identifies you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Retention and security</h2>
            <p>
              We keep personal information for as long as reasonably needed for the purpose for which it was collected, including relevant recordkeeping, legal and security requirements. We take reasonable steps to protect information, although no online system can guarantee complete security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Your choices and contact</h2>
            <p>
              You can contact <a href="mailto:hello@myhrsg.org" className="text-indigo-600 font-medium hover:underline">hello@myhrsg.org</a> to ask about your personal information, request a correction or deletion, withdraw a consent where applicable, change communication preferences or raise a privacy concern. We may need to verify your identity before responding. Requests are handled subject to applicable law and any relevant recordkeeping requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Policy updates</h2>
            <p>
              We may update this policy as our activities or requirements change. The latest version and revision date will appear on this page.
            </p>
          </section>

          {/* Contact Box */}
          <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Have questions about our privacy practices?</p>
              <p className="text-sm text-slate-600">Email: hello@myhrsg.org</p>
            </div>
            <a 
              href="mailto:hello@myhrsg.org" 
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

