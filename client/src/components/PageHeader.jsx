import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const PageHeader = ({ title, breadcrumbs = [] }) => {
  return (
    <div className="bg-[#111111] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center sm:flex-row sm:justify-between">
        <h1 className="text-4xl font-serif text-white mb-4 sm:mb-0">
          {title}
        </h1>
        
        <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            HOME
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <ChevronRight size={10} className="text-slate-600" />
              <Link 
                to={crumb.path} 
                className={idx === breadcrumbs.length - 1 ? "text-primary" : "text-slate-400 hover:text-white transition-colors"}
              >
                {crumb.name}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default PageHeader;
