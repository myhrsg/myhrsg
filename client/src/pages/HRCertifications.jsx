import React, { useState } from 'react';
import CertificationCard from '../features/knowledge/CertificationCard';
import SEOHead from '../components/SEOHead.jsx';

const certifications = [
    { title: "Human Resource Management Certification (IIM Calcutta)", description: "This certification, offered by the prestigious Indian Institute of Management, focuses on HR management, talent acquisition, and performance management.", link: "https://www.iimcal.ac.in/" },
    { title: "Post Graduate Diploma in HR Management (XLRI Jamshedpur)", description: "One of India's most recognized HR certifications, focusing on leadership and HR strategy.", link: "https://www.xlri.ac.in/" },
    { title: "HR Analytics Certification (Coursera)", description: "Coursera offers courses in HR analytics, which helps HR professionals make data-driven decisions.", link: "https://www.coursera.org/" },
    { title: "Certified Compensation Professional (CCP)", description: "Offered by WorldatWork, this certification specializes in compensation and benefits management.", link: "https://www.worldatwork.org/" },
    { title: "Talent Management Certification (TMI Academy)", description: "The Talent Management Institute offers this certification for professionals seeking to enhance their talent management skills.", link: "https://www.tmi.org.in/" },
    { title: "Employee Relations Certification (HR Certification Institute)", description: "A specialized certification focusing on managing employee relations and organizational culture.", link: "https://www.hrci.org/" },
    { title: "Certified HR Business Partner (HRBP)", description: "This certification is aimed at professionals who want to work as strategic HR business partners.", link: "https://www.shrm.org/in" },
    { title: "Diploma in Human Resource Management (NIIT)", description: "NIIT offers diploma courses that are ideal for aspiring HR managers, covering all major HR domains.", link: "https://www.niit.com/" },
    { title: "International Certified Professional in Talent Development (CPTD)", description: "A globally recognized certification that focuses on improving HR practices and employee development.", link: "https://www.td.org" },
    { title: "Certified Employee Benefit Specialist (CEBS)", description: "A certification that focuses on designing and managing employee benefits plans.", link: "https://www.cebs.org/" },
    { title: "HR Generalist Certification (UpGrad)", description: "This certification from UpGrad provides a strong foundation in HR processes and practices, from recruitment to employee engagement.", link: "https://www.upgrad.com/" },
    { title: "Certified Recruitment Specialist (CRS)", description: "This course focuses on recruitment strategies, skills, and the psychology of hiring.", link: "https://www.hrci.org/" },
    { title: "Advanced Certification in HR Analytics (Talentedge)", description: "This course focuses on how HR professionals can leverage data to make more informed HR decisions.", link: "https://talentedge.in/" },
    { title: "Digital HR Certification (Institute of Digital HR)", description: "This program covers the transformation of HR in the digital age, focusing on digital tools and strategies.", link: "https://digitalhr.in/" },
    { title: "Certified Learning and Development Professional (CLDP)", description: "This program focuses on improving skills in learning and development, talent management, and succession planning.", link: "https://www.nada.org/atd" },
    { title: "Workplace Diversity and Inclusion Certification (Cornell University)", description: "This course focuses on building diverse and inclusive workplaces.", link: "https://ecornell.cornell.edu/" },
    { title: "Employee Experience Certification (EX Certification)", description: "This certification focuses on creating meaningful employee experiences and improving retention.", link: "https://ex.co/" },
    { title: "Strategic HR Leadership Certification (Harvard Extension School)", description: "A certification for senior HR professionals focused on strategic HR leadership.", link: "https://extension.harvard.edu/" },
    { title: "Global Professional in HR (GPHR)", description: "Offered by HRCI, this certification is ideal for HR professionals working in global HR roles.", link: "https://www.hrci.org/" },
    { title: "Workforce Planning and Employment Certification (HRCI)", description: "A specialized certification focused on workforce planning, including recruiting, talent acquisition, and retention strategies.", link: "https://www.hrci.org/" }
];

const HRCertifications = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-white pt-16">
            <SEOHead
                title="Top 20 HR Certifications in India 2026 | myHRSG Guide"
                description="Explore the top 20 HR certifications in India — SHRM, HRCI, XLRI, IIM & more. Compare courses, fees & career impact for HR professionals."
                path="/hr-certifications"
            />
            <div className="bg-[#1b2531] text-white py-14 px-6 shadow-inner">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <h1 className="text-4xl font-extrabold tracking-tight">HR Certification</h1>

                </div>
            </div>

            <div className="max-w-5xl mx-auto py-16 px-6">
                <div className="border-l-4 border-primary pl-4 mb-10">
                    <h2 className="text-2xl font-black text-slate-900">
                        Top 20 - HR Courses available
                    </h2>
                </div>

                <div className="space-y-4">
                    {certifications.map((cert, index) => (
                        <CertificationCard
                            key={index}
                            index={index + 1}
                            title={cert.title}
                            description={cert.description}
                            link={cert.link}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                        />
                    ))}
                </div>

                <div className="mt-20 pt-10 border-t border-slate-100">
                    <p className="text-sm text-slate-500 leading-relaxed text-center italic">
                        <span className="font-bold text-slate-700 not-italic">Disclaimer:</span> The courses mentioned are for informational purposes only. All external links lead to third-party websites, and we do not endorse or take responsibility for their content.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HRCertifications;
