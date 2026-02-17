'use client';

import React, { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Check, ArrowRight, ArrowLeft, Trophy, Users, Eye, Activity, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';

type Step = 1 | 2 | 3;
type EngagementLevel = 'active' | 'casual' | 'observer';

export default function OnboardingPage() {
    const t = useTranslations('Onboarding');
    const router = useRouter();
    const { session } = useAuth();
    const [step, setStep] = useState<Step>(1);

    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [engagementLevel, setEngagementLevel] = useState<EngagementLevel | null>(null);

    const interests = [
        { id: 'sports', icon: '⚽️', color: 'bg-blue-500' },
        { id: 'politics', icon: '🏛️', color: 'bg-red-500' },
        { id: 'tech', icon: '💻', color: 'bg-purple-500' },
        { id: 'crypto', icon: '₿', color: 'bg-orange-500' },
        { id: 'entertainment', icon: '🎬', color: 'bg-pink-500' },
        { id: 'economy', icon: '📈', color: 'bg-green-500' },
    ];

    const toggleInterest = (id: string) => {
        if (selectedInterests.includes(id)) {
            setSelectedInterests(selectedInterests.filter((i) => i !== id));
        } else {
            setSelectedInterests([...selectedInterests, id]);
        }
    };

    const handleNext = () => {
        if (step === 1 && selectedInterests.length > 0) {
            setStep(2);
        } else if (step === 2 && engagementLevel) {
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleFinish = () => {
        // In a real app, save preferences here
        router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                {/* Progress Bar */}
                <div className="h-2 bg-gray-100 w-full">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center">
                    {/* Step 1: Interests */}
                    {step === 1 && (
                        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {t('step1.title')}
                                </h1>
                                <p className="text-lg text-gray-500">{t('step1.subtitle')}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                                {interests.map((interest) => {
                                    const isSelected = selectedInterests.includes(interest.id);
                                    return (
                                        <button
                                            key={interest.id}
                                            onClick={() => toggleInterest(interest.id)}
                                            className={cn(
                                                'relative group p-4 rounded-2xl border-2 transition-all duration-200 text-left hover:scale-[1.02]',
                                                isSelected
                                                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                                    : 'border-gray-100 bg-white hover:border-gray-200',
                                            )}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="text-3xl">{interest.icon}</span>
                                                {isSelected && (
                                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                className={cn(
                                                    'font-semibold block',
                                                    isSelected ? 'text-primary' : 'text-gray-700',
                                                )}
                                            >
                                                {t(`step1.interests.${interest.id}`)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    size="lg"
                                    onClick={handleNext}
                                    disabled={selectedInterests.length === 0}
                                    className="px-12 text-lg h-14 rounded-full"
                                >
                                    {t('step1.continue')}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Engagement Level */}
                    {step === 2 && (
                        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-6">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {t('step2.title')}
                                </h1>
                                <p className="text-lg text-gray-500">{t('step2.subtitle')}</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-12">
                                {[
                                    { id: 'active', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
                                    { id: 'casual', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                                    { id: 'observer', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50' },
                                ].map((level) => {
                                    const isSelected = engagementLevel === level.id;
                                    const Icon = level.icon;
                                    return (
                                        <button
                                            key={level.id}
                                            onClick={() => setEngagementLevel(level.id as EngagementLevel)}
                                            className={cn(
                                                'relative p-8 rounded-3xl border-2 transition-all duration-300 text-left hover:shadow-lg',
                                                isSelected
                                                    ? 'border-primary bg-white shadow-xl shadow-primary/10 ring-4 ring-primary/10'
                                                    : 'border-gray-100 bg-white hover:border-primary/30',
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-6',
                                                    level.bg,
                                                )}
                                            >
                                                <Icon className={cn('w-7 h-7', level.color)} />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                {t(`step2.levels.${level.id}.title`)}
                                            </h3>
                                            <p className="text-gray-500 leading-relaxed">
                                                {t(`step2.levels.${level.id}.description`)}
                                            </p>
                                            {isSelected && (
                                                <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-in zoom-in">
                                                    <Check className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex justify-between items-center max-w-xl mx-auto">
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    className="text-gray-500 hover:text-gray-900"
                                >
                                    <ArrowLeft className="mr-2 w-4 h-4" />
                                    {t('step2.back')}
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={handleNext}
                                    disabled={!engagementLevel}
                                    className="px-12 text-lg h-14 rounded-full"
                                >
                                    {t('step2.finish')}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="text-center animate-in fade-in zoom-in duration-500 max-w-md mx-auto">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <Check className="w-12 h-12 text-green-600" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-6">
                                All Set, {session?.username || 'Predictor'}!
                            </h1>
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                                Your feed has been personalized based on your interests. Get ready to challenge the
                                status quo.
                            </p>
                            <Button
                                size="lg"
                                onClick={handleFinish}
                                className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1"
                            >
                                Go to Feed
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
