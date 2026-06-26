import React from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

const UploadCv: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div 
      className="bg-[#051C0E] rounded-2xl shadow-sm p-6 flex flex-col justify-between items-center text-white cursor-pointer h-full hover:shadow-lg transition-shadow w-full"
      onClick={() => navigate("/upload")}
    >
      {/* Icon Wrapper */}
      <div className="flex flex-col items-center justify-center pt-4">
        <div className="bg-white/10 p-3 rounded-full mb-4">
          <Upload size={24} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold font-['Newsreader'] text-center mb-2">
          Upload New CV
        </h3>
        <p className="text-center text-xs text-gray-300 px-4 mb-6 leading-relaxed">
          Analyze a new CV to get more accurate career recommendations
        </p>
      </div>

      {/* Button Style Matches Mockup */}
      <button className="w-full bg-white text-black py-3 px-6 rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-gray-100 transition-colors font-['Newsreader']">
        Start Analysis
      </button>
    </div>
  );
};

export default UploadCv;
