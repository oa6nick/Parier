"use client";

import React, { useState } from 'react';
import { Bet } from '@/types';
import { BetHeader } from './BetHeader';
import { BetAnalytics } from './BetAnalytics';
import { BetInfo } from './BetInfo';
import { BetParticipants } from './BetParticipants';
import { BetPredictions } from './BetPredictions';
import { BetActions } from './BetActions';
import { MobileBetActions } from './MobileBetActions';
import { Tabs } from '@/components/ui/Tabs';
import { ChevronLeft } from 'lucide-react';
import { Link } from '@/navigation';

interface BetDetailViewProps {
  bet: Bet;
}

export const BetDetailView: React.FC<BetDetailViewProps> = ({ bet }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'discussion', label: 'Discussion', count: bet.commentsCount },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <BetHeader bet={bet} />
            
            <Tabs 
              tabs={tabs} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
              className="mb-6"
            />

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <BetInfo bet={bet} />
                  <BetParticipants bet={bet} />
                </div>
              )}

              {activeTab === 'analytics' && (
                <BetAnalytics bet={bet} />
              )}

              {activeTab === 'discussion' && (
                <div className="space-y-6">
                  {/* Reuse existing comments logic or components if available, 
                      or just placeholder for now since BetPredictions seems to be related to comments/updates */}
                  <BetPredictions bet={bet} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Right Column (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <BetActions bet={bet} />
              
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">About this Betting</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  This prediction market is verified by {bet.verificationSource || 'independent sources'}. 
                  Funds are held in a secure smart contract until the event outcome is determined.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Actions (Bottom Bar) */}
      <MobileBetActions bet={bet} />
    </div>
  );
};
