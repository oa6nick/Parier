'use client';

import React, { useState, useId, useMemo } from 'react';
import { User, Shield, Bell, LogOut, Trash2, Camera, Save, Check, Mail, Lock, MapPin, AtSign } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { GetMediaUrl } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/api/context';
import { useSelector } from 'react-redux';
import { useAuth } from '@/lib/hooks/useAuth';
import { getSession } from '@/lib/store/Session';

export default function SettingsPage() {
    const t = useTranslations('Settings');
    const router = useRouter();
    const api = useApi();
    const { editProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { data: currentUserData } = useQuery({
        queryKey: ['current_user'],
        queryFn: () => api.ParierApi.parierUserGet(),
    });
    const session = useSelector(getSession);
    const currentUser = useMemo(() => currentUserData?.data?.data || {}, [currentUserData]);
    // Form states
    const [displayName, setDisplayName] = useState(currentUser?.username);
    const [username, setUsername] = useState(currentUser?.username); // Mock username
    const [location, setLocation] = useState(currentUser?.location || '');
    const [email, setEmail] = useState(session?.email); // Mock email
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const bioId = useId();

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-3xl p-4 shadow-soft border border-gray-100 sticky top-24">
                        <h1 className="text-xl font-bold text-gray-900 px-4 mb-6">{t('title')}</h1>

                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                                    activeTab === 'profile'
                                        ? 'bg-primary/5 text-primary'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                                )}
                            >
                                <User className="w-5 h-5" />
                                {t('profile')}
                            </button>

                            <button
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                    editProfile(event);
                                }}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                                    activeTab === 'security'
                                        ? 'bg-primary/5 text-primary'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                                )}
                            >
                                <Shield className="w-5 h-5" />
                                {t('security')}
                            </button>
                        </nav>

                        <div className="mt-8 pt-8 border-t border-gray-100 px-4 space-y-4">
                            <button className="flex items-center gap-3 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                                <LogOut className="w-5 h-5" />
                                {t('logout')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100">
                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('profile')}</h2>

                                    {/* Avatar Section */}
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative">
                                            <Avatar
                                                src={GetMediaUrl(currentUser?.avatar)}
                                                alt={currentUser?.username || ''}
                                                size="lg"
                                                className="w-24 h-24"
                                            />
                                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors">
                                                <Camera className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{t('avatar')}</h3>
                                            <p className="text-sm text-gray-500 mb-3">
                                                JPG, GIF or PNG. Max size of 800K
                                            </p>
                                            <Button variant="outline" size="sm">
                                                {t('changeAvatar')}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Input
                                                label={t('displayName')}
                                                name="displayName"
                                                autoComplete="name"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                icon={<User className="w-4 h-4" />}
                                            />
                                            <Input
                                                label={t('username')}
                                                name="username"
                                                autoComplete="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                icon={<AtSign className="w-4 h-4" />}
                                            />
                                        </div>

                                        <Input
                                            label={t('location')}
                                            name="location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            icon={<MapPin className="w-4 h-4" />}
                                        />

                                        {/* <div>
                                            <label
                                                htmlFor={bioId}
                                                className="block text-sm font-medium text-gray-700 mb-1.5 ml-1"
                                            >
                                                {t('bio')}
                                            </label>
                                            <textarea
                                                id={bioId}
                                                name="bio"
                                                className="w-full min-h-[120px] rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200 resize-none"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>*/}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('security')}</h2>

                                    <div className="space-y-6">
                                        <Input
                                            label={t('email')}
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            icon={<Mail className="w-4 h-4" />}
                                        />

                                        <div className="pt-6 border-t border-gray-100">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('password')}</h3>
                                            <div className="space-y-4">
                                                <Input
                                                    label={t('currentPassword')}
                                                    name="currentPassword"
                                                    type="password"
                                                    autoComplete="current-password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    icon={<Lock className="w-4 h-4" />}
                                                />
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <Input
                                                        label={t('newPassword')}
                                                        name="newPassword"
                                                        type="password"
                                                        autoComplete="new-password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        icon={<Lock className="w-4 h-4" />}
                                                    />
                                                    <Input
                                                        label={t('confirmPassword')}
                                                        name="confirmPassword"
                                                        type="password"
                                                        autoComplete="new-password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        icon={<Lock className="w-4 h-4" />}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-100">
                                            <h3 className="text-lg font-bold text-red-600 mb-2">
                                                {t('deleteAccount')}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4">{t('deleteAccountDesc')}</p>
                                            <Button
                                                variant="outline"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                {t('deleteAccount')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                            <Button onClick={handleSave} disabled={isLoading} className="min-w-[140px]">
                                {isLoading ? (
                                    'Saving...'
                                ) : isSaved ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" /> {t('saved')}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> {t('save')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
