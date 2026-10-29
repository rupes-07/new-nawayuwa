import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  MapPin,
  Globe2,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useI18n } from '../../context/I18nContext.tsx';
import { usePageMeta } from '../../lib/seo.ts';
import { onboardingSchema, OnboardingInput } from '../../lib/validation/auth.ts';
import { NEPAL_PROVINCES } from '../../lib/nepalGeo.ts';
import { Button } from '../ui/Button.tsx';
import { BrandLogo } from '../ui/BrandLogo.tsx';

interface OnboardingPageProps {
  onNavigate: (path: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { user, completeOnboarding, logout, isLoading: authLoading } = useAuth();
  const { t, setLocale, language } = useI18n();

  // AUTH PAGES: Must not be indexed (noindex, nofollow)
  usePageMeta({
    title: `${t('onboardingHeading')} | Nawa Yuwa Club`,
    description: t('onboardingSubtitle'),
    canonicalPath: '/onboarding',
    noIndex: true,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  // React Hook Form with Zod validation resolver
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: user?.name?.startsWith('Youth Member') ? '' : (user?.name || ''),
      province: user?.province || 'Lumbini Province',
      district: user?.district || 'Parasi (Nawalparasi West)',
      localLevel: user?.localLevel || '',
      ward: user?.ward || '',
      preferredLanguage: (user?.preferredLanguage as 'ne' | 'en') || language || 'ne',
    },
  });

  const selectedProvinceName = watch('province');
  const selectedLanguage = watch('preferredLanguage');

  // Find districts for the selected province
  const currentProvince = NEPAL_PROVINCES.find(
    (p) => p.nameEn === selectedProvinceName || p.nameNe === selectedProvinceName
  );
  const availableDistricts = currentProvince ? currentProvince.districts : [];

  // Redirect if not signed in, or if already onboarded
  useEffect(() => {
    if (!authLoading && !user) {
      onNavigate('/sign-in');
    } else if (user && user.onboardingCompleted) {
      onNavigate('/dashboard');
    }
  }, [user, authLoading, onNavigate]);

  const onSubmit = async (data: OnboardingInput) => {
    setSubmitError(null);
    try {
      await completeOnboarding(data);
      // Synchronize chosen language immediately in UI
      if (data.preferredLanguage) {
        setLocale(data.preferredLanguage);
      }
      onNavigate('/dashboard');
    } catch (err: any) {
      if (!navigator.onLine && (!err.message || err.message === 'Failed to fetch')) {
        setSubmitError(t('authNetworkError'));
      } else {
        setSubmitError(err.message || 'Failed to save onboarding details. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('/sign-in');
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="w-full max-w-xl space-y-6">
        {/* Main Card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <BrandLogo size="lg" showText={true} showSubtitle={true} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
              {t('onboardingHeading')}
            </h1>
            <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto leading-relaxed">
              {t('onboardingSubtitle')}
            </p>
            {user?.phone && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-foreground)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Verified: {user.phone}
              </div>
            )}
          </div>

          {submitError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{submitError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 1. Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-2"
              >
                {t('onboardingFullName')} <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-muted)]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  {...register('fullName')}
                  placeholder="e.g. Dinesh Bhattarai / सन्तोष श्रेष्ठ"
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted)] text-sm font-medium focus:outline-none"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* 2. Province & District Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Province */}
              <div>
                <label
                  htmlFor="province"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-2"
                >
                  {t('onboardingProvince')} <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent transition-all">
                  <select
                    id="province"
                    {...register('province')}
                    onChange={(e) => {
                      setValue('province', e.target.value);
                      // Reset district when province changes
                      const prov = NEPAL_PROVINCES.find((p) => p.nameEn === e.target.value);
                      if (prov && prov.districts.length > 0) {
                        setValue('district', prov.districts[0].nameEn);
                      }
                    }}
                    className="w-full px-3.5 py-3 bg-transparent text-[var(--color-foreground)] text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    {NEPAL_PROVINCES.map((prov) => (
                      <option key={prov.id} value={prov.nameEn} className="bg-[var(--color-surface)] text-[var(--color-foreground)]">
                        {language === 'ne' ? prov.nameNe : prov.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.province && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.province.message}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label
                  htmlFor="district"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-2"
                >
                  {t('onboardingDistrict')} <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent transition-all">
                  <select
                    id="district"
                    {...register('district')}
                    className="w-full px-3.5 py-3 bg-transparent text-[var(--color-foreground)] text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    {availableDistricts.length > 0 ? (
                      availableDistricts.map((d) => (
                        <option key={d.nameEn} value={d.nameEn} className="bg-[var(--color-surface)] text-[var(--color-foreground)]">
                          {language === 'ne' ? d.nameNe : d.nameEn}
                        </option>
                      ))
                    ) : (
                      <option value="Parasi (Nawalparasi West)">
                        {language === 'ne' ? 'नवलपरासी पश्चिम' : 'Parasi (Nawalparasi West)'}
                      </option>
                    )}
                  </select>
                </div>
                {errors.district && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.district.message}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Local Level & Ward Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Local Level (Municipality / Rural Municipality) */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="localLevel"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-2"
                >
                  {t('onboardingLocalLevel')} <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-muted)]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    id="localLevel"
                    type="text"
                    {...register('localLevel')}
                    placeholder="e.g. Bardaghat Municipality / बर्दघाट नगरपालिका"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted)] text-sm font-medium focus:outline-none"
                  />
                </div>
                {errors.localLevel && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.localLevel.message}
                  </p>
                )}
              </div>

              {/* Ward */}
              <div>
                <label
                  htmlFor="ward"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-2"
                >
                  {t('onboardingWard')} <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-muted)]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    id="ward"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    {...register('ward')}
                    placeholder="e.g. 14"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted)] text-sm font-medium focus:outline-none"
                  />
                </div>
                {errors.ward && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.ward.message}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Preferred Language */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-2">
                {t('onboardingLanguage')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('preferredLanguage', 'ne')}
                  className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                    selectedLanguage === 'ne'
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-bold'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <Globe2 className="w-4 h-4" />
                  <span>{t('onboardingLanguageNe')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('preferredLanguage', 'en')}
                  className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                    selectedLanguage === 'en'
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-bold'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <Globe2 className="w-4 h-4" />
                  <span>{t('onboardingLanguageEn')}</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                isLoading={isSubmitting}
                rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
              >
                {isSubmitting ? t('onboardingSaving') : t('onboardingSubmit')}
              </Button>
            </div>
          </form>

          {/* Sign Out link */}
          <div className="pt-6 mt-6 border-t border-[var(--color-border)] text-center">
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-[var(--color-muted)] hover:text-red-500 transition inline-flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign in with a different account
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="text-center text-xs text-[var(--color-muted)] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Information protected by Nawa Yuwa Club civic privacy standards</span>
        </div>
      </div>
    </div>
  );
};
