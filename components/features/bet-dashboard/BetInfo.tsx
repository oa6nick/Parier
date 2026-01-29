import React from 'react';
import { Bet } from '@/types';
import { FileText, Link as LinkIcon, Hash, ShieldCheck } from 'lucide-react';

interface BetInfoProps {
  bet: Bet;
}

export const BetInfo: React.FC<BetInfoProps> = ({ bet }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center gap-3 mb-6">
         <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-500" />
         </div>
         <div>
            <h3 className="text-lg font-bold text-gray-900 leading-none">Description</h3>
            <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wide">About this market</p>
         </div>
      </div>
      
      <div className="prose prose-sm max-w-none text-gray-600 mb-8 leading-relaxed">
        <p>{bet.fullDescription}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            Verification Source
          </h4>
          <div className="flex items-center gap-2">
             <div className="flex-1 bg-white rounded-xl px-3 py-2 text-sm text-blue-700 font-medium break-all border border-blue-100/50 shadow-sm">
                {bet.verificationSource || 'Not specified'}
             </div>
             {bet.verificationSource && (
                <a 
                  href={bet.verificationSource.startsWith('http') ? bet.verificationSource : `https://${bet.verificationSource}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white rounded-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 border border-blue-100 shadow-sm transition-colors"
                >
                   <LinkIcon className="w-4 h-4" />
                </a>
             )}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-400" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {bet.tags.map((tag) => (
              <span 
                 key={tag} 
                 className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg border border-gray-100 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
