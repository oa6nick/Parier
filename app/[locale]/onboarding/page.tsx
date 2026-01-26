"use client";

import React, { useState } from "react";
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Check, Trophy, TrendingUp, Bitcoin, Globe, Film, Activity, Eye, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const INTERESTS_CONFIG = [
  { id: "sports", icon: Trophy, color: "from-orange-400 to-red-500" },
  { id: "politics", icon: Globe, color: "from-blue-400 to-indigo-500" },
  { id: "tech", icon: Zap, color: "from-purple-400 to-pink-500" },
  { id: "crypto", icon: Bitcoin, color: "from-yellow-400 to-orange-500" },
  { id: "entertainment", icon: Film, color: "from-pink-400 to-rose-500" },
  { id: "economy", icon: TrendingUp, color: "from-green-400 to-emerald-500" },
];

const LEVELS_CONFIG = [
  {
    id: "active",
    icon: Activity,
    color: "bg-red-50 border-red-200 text-red-600",
    iconBg: "bg-red-100"
  },
  {
    id: "casual",
    icon: TrendingUp,
    color: "bg-blue-50 border-blue-200 text-blue-600",
    iconBg: "bg-blue-100"
  },
  {
    id: "observer",
    icon: Eye,
    color: "bg-green-50 border-green-200 text-green-600",
    iconBg: "bg-green-100"
  },
];

export default function OnboardingPage() {
  const t = useTranslations('Onboarding');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(2);
      setIsAnimating(false);
    }, 300);
  };

  const finishOnboarding = () => {
    // Save preferences logic here
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

      <div className={`w-full max-w-2xl transition-all duration-500 transform ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        
        {/* Progress Bar */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className={`h-2 rounded-full transition-all duration-500 ${step >= 1 ? 'w-12 bg-primary' : 'w-2 bg-gray-200'}`}></div>
          <div className={`h-2 rounded-full transition-all duration-500 ${step >= 2 ? 'w-12 bg-primary' : 'w-2 bg-gray-200'}`}></div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/5 border border-white p-8 md:p-12">
          
          {step === 1 ? (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('step1.title')}</h1>
                <p className="text-lg text-gray-500">{t('step1.subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {INTERESTS_CONFIG.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={cn(
                        "relative group p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 hover:-translate-y-1",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                          : "border-gray-100 bg-white hover:border-primary/30 hover:shadow-md"
                      )}
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110",
                        `bg-gradient-to-br ${interest.color}`,
                        isSelected ? "scale-110" : ""
                      )}>
                        <interest.icon className="w-7 h-7" />
                      </div>
                      <span className={cn(
                        "font-semibold transition-colors",
                        isSelected ? "text-primary" : "text-gray-700 group-hover:text-gray-900"
                      )}>
                        {t(`step1.interests.${interest.id}`)}
                      </span>
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-sm animate-scale-in">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <Button 
                  size="lg" 
                  onClick={nextStep} 
                  disabled={selectedInterests.length === 0}
                  className="w-full md:w-auto shadow-lg shadow-primary/20"
                >
                  {t('step1.continue')} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('step2.title')}</h1>
                <p className="text-lg text-gray-500">{t('step2.subtitle')}</p>
              </div>

              <div className="space-y-4 mb-10">
                {LEVELS_CONFIG.map((level) => {
                  const isSelected = selectedLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={cn(
                        "w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-6 hover:shadow-lg",
                        isSelected
                          ? `border-${level.color.split('-')[1]}-500 bg-white ring-2 ring-${level.color.split('-')[1]}-100`
                          : "border-gray-100 bg-white hover:border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
                        level.iconBg,
                        level.color.split(' ')[2] // Text color for icon
                      )}>
                        <level.icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className={cn("text-xl font-bold mb-1", isSelected ? "text-gray-900" : "text-gray-800")}>
                          {t(`step2.levels.${level.id}.title`)}
                        </h3>
                        <p className="text-gray-500 font-medium">
                          {t(`step2.levels.${level.id}.description`)}
                        </p>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        isSelected
                          ? `border-${level.color.split('-')[1]}-500 bg-${level.color.split('-')[1]}-500`
                          : "border-gray-300"
                      )}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-900">
                  <ArrowLeft className="mr-2 w-5 h-5" /> {t('step2.back')}
                </Button>
                <Button 
                  size="lg" 
                  onClick={finishOnboarding} 
                  disabled={!selectedLevel}
                  className="px-8 shadow-lg shadow-primary/20"
                >
                  {t('step2.finish')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
