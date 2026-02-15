"use client";

import React, { useState, useEffect, useId } from "react";
import { Mic, Type, ArrowLeft, Wand2, CopyPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCategories } from "@/lib/mockData/categories";
import { getBetByIdSync } from "@/lib/mockData/bets";
import { Input } from "@/components/ui/Input";
import { DateInput } from "@/components/ui/DateInput";
import { Link, useRouter } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CreatePage() {
  const t = useTranslations('Create');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const categories = getCategories(locale);
  const searchParams = useSearchParams();
  const [inputMethod, setInputMethod] = useState<"text" | "voice">("text");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    outcome: "",
    category: "",
    betAmount: "",
    coefficient: "",
    deadline: "",
    eventDate: "",
    verificationSource: "",
  });

  // Pre-fill form from query parameters or from bet ID
  useEffect(() => {
    const fromBetId = searchParams?.get('from');
    if (fromBetId) {
      const bet = getBetByIdSync(fromBetId, locale);
      if (bet) {
        setFormData(prev => ({
          ...prev,
          title: bet.title,
          shortDescription: bet.shortDescription,
          fullDescription: bet.fullDescription,
          outcome: bet.outcome,
          category: bet.category.id,
          betAmount: String(bet.betAmount),
          coefficient: String(bet.coefficient),
          deadline: bet.deadline.toISOString().split('T')[0],
          eventDate: bet.eventDate ? bet.eventDate.toISOString().split('T')[0] : '',
          verificationSource: bet.verificationSource || '',
        }));
      }
      return;
    }

    const title = searchParams?.get('title');
    const betAmount = searchParams?.get('betAmount');
    const coefficient = searchParams?.get('coefficient');

    if (title || betAmount || coefficient) {
      setFormData(prev => ({
        ...prev,
        title: title || prev.title,
        betAmount: betAmount || prev.betAmount,
        coefficient: coefficient || prev.coefficient,
      }));
    }
  }, [searchParams, locale]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const now = new Date();
    // Reset time part for fair comparison if needed, or just compare timestamps
    
    if (!formData.title.trim()) {
      newErrors.title = t('form.errors.titleRequired') || "Title is required"; // Fallback if key missing
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.betAmount) {
      newErrors.betAmount = "Pool amount is required";
    } else if (Number(formData.betAmount) <= 0) {
      newErrors.betAmount = "Pool amount must be positive";
    }

    if (!formData.coefficient) {
      newErrors.coefficient = "Coefficient is required";
    } else if (Number(formData.coefficient) <= 1.0) {
      newErrors.coefficient = "Coefficient must be greater than 1.0";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    } else {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= now) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }

    if (!formData.verificationSource.trim()) {
      newErrors.verificationSource = "Verification source is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          shortDescription: formData.shortDescription.trim(),
          fullDescription: formData.fullDescription.trim(),
          outcome: formData.outcome.trim(),
          categoryId: formData.category,
          betAmount: Number(formData.betAmount),
          coefficient: Number(formData.coefficient),
          deadline: formData.deadline + "T12:00:00",
          eventDate: formData.eventDate ? formData.eventDate + "T12:00:00" : undefined,
          verificationSource: formData.verificationSource.trim(),
          authorId: user?.id || "1",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create bet");
      }

      const { id } = await res.json();
      router.push(`/bet/${id}`);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to create bet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">{t('backToFeed')}</span>
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
        <p className="text-gray-500 text-lg">
          {t('subtitle')}
        </p>
      </div>

      <Link
        href="/pick?mode=create"
        className="mb-8 flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all group"
      >
        <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20">
          <CopyPlus className="w-5 h-5 text-primary" />
        </div>
        <div className="text-left">
          <span className="font-semibold text-gray-900 block">{t('createFromExisting')}</span>
          <span className="text-sm text-gray-500">{t('createFromExistingDesc')}</span>
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setInputMethod("text")}
          className={`flex items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${
            inputMethod === "text"
              ? "border-primary bg-primary/5 text-primary shadow-glow"
              : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
          }`}
        >
          <Type className="w-5 h-5" />
          <span className="font-semibold">{t('textInput')}</span>
        </button>
        <button
          onClick={() => setInputMethod("voice")}
          className={`relative flex items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
            inputMethod === "voice"
              ? "border-primary bg-primary/5 text-primary shadow-glow"
              : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
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

      {inputMethod === "voice" && (
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
            <Button size="sm" className="mt-4">{t('startRecording')}</Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100 space-y-6">
        <Input
          label={t('form.title')}
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder={t('form.titlePlaceholder')}
          error={errors.title}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{t('form.shortDesc')}</label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            rows={2}
            className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
              errors.shortDescription ? "border-red-500 focus:ring-red-500" : "border-gray-200"
            }`}
            placeholder={t('form.shortDescPlaceholder')}
          />
          {errors.shortDescription && (
            <p className="text-sm text-red-500 mt-1.5 ml-1">{errors.shortDescription}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{t('form.category')}</label>
          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`w-full appearance-none rounded-xl border-2 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                errors.category ? "border-red-500 focus:ring-red-500" : "border-gray-200"
              }`}
            >
              <option value="">{t('form.selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </div>
          </div>
          {errors.category && (
            <p className="text-sm text-red-500 mt-1.5 ml-1">{errors.category}</p>
          )}
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
            error={errors.betAmount}
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
            error={errors.coefficient}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DateInput
            label={t('form.deadline')}
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            error={errors.deadline}
            min={new Date().toISOString().split('T')[0]}
          />
          <Input
            label={t('form.verificationSource')}
            name="verificationSource"
            value={formData.verificationSource}
            onChange={handleChange}
            required
            placeholder={t('form.verificationPlaceholder')}
            error={errors.verificationSource}
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-4">
          <Link href="/">
            <Button variant="ghost">{t('form.cancel')}</Button>
          </Link>
          <Button type="submit" size="lg" className="px-8 shadow-glow" disabled={isSubmitting}>
            {isSubmitting ? t('form.publishing') : t('form.publish')}
          </Button>
        </div>
      </form>
    </div>
  );
}
