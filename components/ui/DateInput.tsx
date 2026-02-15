"use client";

import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { enUS, ru } from "react-day-picker/locale";
import { useLocale, useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";

interface DateInputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string; // YYYY-MM-DD
}

const localeMap = {
  en: enUS,
  ru: ru,
} as const;

export const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required,
  disabled,
  min,
}) => {
  const locale = useLocale() as "en" | "ru";
  const t = useTranslations("DateInput");
  const dayPickerLocale = localeMap[locale] ?? enUS;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + "T12:00:00") : undefined;
  const minDate = min ? new Date(min + "T12:00:00") : undefined;

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const iso = date.toISOString().split("T")[0];
    onChange({ target: { name, value: iso } });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-12 w-full items-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm text-left",
          "placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          !value && "text-gray-400",
          error && "border-red-500 focus-visible:ring-red-500"
        )}
      >
        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className={cn(!value && "text-gray-400")}>
          {value ? formatDisplayDate(value) : t("placeholder")}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 p-4 bg-white rounded-2xl shadow-lg border border-gray-100 max-h-[70vh] overflow-y-auto">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={dayPickerLocale}
            disabled={minDate ? { before: minDate } : undefined}
            defaultMonth={selectedDate || minDate || new Date()}
            className="rdp-custom"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-1.5 ml-1">{error}</p>
      )}
    </div>
  );
};
