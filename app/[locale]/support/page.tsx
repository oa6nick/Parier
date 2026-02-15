"use client";

import React, { useState, useId } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Send, HelpCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SupportPage() {
  const t = useTranslations('Support');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const textareaId = useId();

  const faqs = [1, 2, 3];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('sent');
      // Reset after showing success message
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          We're here to help. Browse our FAQs or send us a message directly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* FAQ Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('faq.title')}</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((id) => (
              <div 
                key={id} 
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === id ? null : id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-gray-900">{t(`faq.q${id}`)}</span>
                  {openFaq === id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {openFaq === id && (
                  <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 mt-2">
                    <div className="pt-4">
                      {t(`faq.a${id}`)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Mail className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('contact.title')}</h2>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100">
            {formStatus === 'sent' ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('contact.success')}</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                  label={t('contact.name')} 
                  name="name"
                  required 
                  placeholder="John Doe"
                />
                <Input 
                  label={t('contact.email')} 
                  name="email"
                  type="email" 
                  required 
                  placeholder="john@example.com"
                />
                
                <div>
                  <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id={textareaId}
                    name="message"
                    required
                    rows={4}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={formStatus === 'sending'}
                >
                  {formStatus === 'sending' ? 'Sending...' : t('contact.send')}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
