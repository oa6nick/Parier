'use client';

import React, { useMemo, useState } from 'react';
import { Mic, Type, ArrowLeft, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getCategories } from '@/lib/mockData/categories';
import { Input } from '@/components/ui/Input';
import { Link, redirect } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/api/context';
import router from 'next/router';

export default function CreatePage() {
    const t = useTranslations('Create');
    const locale = useLocale();
    const api = useApi();
    const { data } = useQuery({
        queryKey: ['categories'],
        queryFn: () => api.ParierApi.parierCategoriesPost({ language: locale }),
    });
    const { data: verificationSourcesData } = useQuery({
        queryKey: ['verificationSources'],
        queryFn: () => api.ParierApi.parierVerificationSourcesPost({ language: locale }),
    });
    const categories = useMemo(() => data?.data?.data || [], [data]);
    const verificationSources = useMemo(() => verificationSourcesData?.data?.data || [], [verificationSourcesData]);
    const [inputMethod, setInputMethod] = useState<'text' | 'voice'>('text');
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        fullDescription: '',
        outcome: '',
        category: '',
        betAmount: '',
        coefficient: '',
        deadline: '',
        eventDate: '',
        verificationSource: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        api.ParierApi.parierBetPut({
            title: formData.title,
            description: formData.shortDescription,
            category_id: formData.category,
            amount: formData.betAmount,
            coefficient: formData.coefficient,
            deadline: formData.deadline + 'T00:00:00Z',
            verification_source_id: [formData.verificationSource],
            status_id: 'OPEN',
            type_id: 'SINGLE',
            language: locale,
        }).then((res) => {
            if (res.data.success) {
                redirect({ href: `/`, locale: locale });
            } else {
                alert(res.data.message);
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">{t('backToFeed')}</span>
            </Link>

            <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
                <p className="text-gray-500 text-lg">{t('subtitle')}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => setInputMethod('text')}
                    className={`flex items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${
                        inputMethod === 'text'
                            ? 'border-primary bg-primary/5 text-primary shadow-glow'
                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                >
                    <Type className="w-5 h-5" />
                    <span className="font-semibold">{t('textInput')}</span>
                </button>
                <button
                    onClick={() => setInputMethod('voice')}
                    className={`relative flex items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
                        inputMethod === 'voice'
                            ? 'border-primary bg-primary/5 text-primary shadow-glow'
                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                >
                    <div className="absolute top-2 right-2">
                        <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                    </div>
                    <Mic className="w-5 h-5" />
                    <span className="font-semibold">{t('voiceInput')}</span>
                </button>
            </div>

            {inputMethod === 'voice' && (
                <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Wand2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{t('aiReady')}</h3>
                        <p className="text-sm text-gray-500">
                            {t('aiDesc')}
                            <br />
                            <span className="text-xs text-gray-400 mt-2 block">{t('aiDisclaimer')}</span>
                        </p>
                        <Button size="sm" className="mt-4">
                            {t('startRecording')}
                        </Button>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100 space-y-6"
            >
                <Input
                    label={t('form.title')}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder={t('form.titlePlaceholder')}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{t('form.shortDesc')}</label>
                    <textarea
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        required
                        rows={2}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        placeholder={t('form.shortDescPlaceholder')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{t('form.category')}</label>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        >
                            <option value="">{t('form.selectCategory')}</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label={t('form.poolAmount')}
                        name="betAmount"
                        type="number"
                        value={formData.betAmount}
                        onChange={handleChange}
                        required
                        placeholder="1000"
                    />
                    <Input
                        label={t('form.coefficient')}
                        name="coefficient"
                        type="number"
                        step="0.1"
                        value={formData.coefficient}
                        onChange={handleChange}
                        required
                        placeholder="2.5"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label={t('form.deadline')}
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                            {t('form.verificationSource')}
                        </label>
                        <div className="relative">
                            <select
                                name="verificationSource"
                                value={formData.verificationSource}
                                onChange={handleChange}
                                required
                                className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                            >
                                <option value="">{t('form.verificationPlaceholder')}</option>
                                {verificationSources.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                ▼
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-4">
                    <Link href="/">
                        <Button variant="ghost">{t('form.cancel')}</Button>
                    </Link>
                    <Button type="submit" size="lg" className="px-8 shadow-glow">
                        {t('form.publish')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
