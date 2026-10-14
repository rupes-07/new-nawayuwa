import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  StatusBadge,
  Input,
  Textarea,
  Select,
  Dialog,
  Drawer,
  Tabs,
  Skeleton,
  CardSkeleton,
  EmptyState,
  ErrorState,
  ConfirmDialog,
  LocationPicker,
  ImageUploader,
  OfflineBanner,
  BsDate,
} from './ui/index.ts';
import { useI18n } from '../context/I18nContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Sun,
  Moon,
  Globe,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Layers,
  Palette,
  Type,
} from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  // Dialog & Drawer demo states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  // Form demo states
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('option-1');
  const [locationValue, setLocationValue] = useState({
    province: 'Madhesh Pradesh',
    district: 'Dhanusha',
    localLevel: 'Janakpurdham Sub-Metropolitan',
    ward: '4',
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('components');
  const [activeDeviceFrame, setActiveDeviceFrame] = useState<'responsive' | 'mobile' | 'tablet'>('responsive');

  const demoTabs = [
    { id: 'components', label: '18 Reusable Components', count: 18 },
    { id: 'tokens', label: 'Color Tokens & Dhaka Pattern' },
    { id: 'typography', label: 'Devanagari & English Typography' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-200">
      {/* Offline Status Demo Banner */}
      <OfflineBanner />

      {/* Showcase Sticky Control Bar */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black text-lg shadow-sm">
              NY
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[var(--color-foreground)]">
                  {t('brandName')}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                  Phase 1: Design System
                </span>
              </div>
              <p className="text-xs text-[var(--color-muted)]">
                {t('brandTagline')}
              </p>
            </div>
          </div>

          {/* Quick Controls: Language, Theme, Viewport Preview */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Viewport Frame Presets for Verification */}
            <div className="hidden md:flex items-center bg-[var(--color-surface-muted)] rounded-lg p-1 border border-[var(--color-border)]">
              <button
                onClick={() => setActiveDeviceFrame('mobile')}
                className={`touch-target p-1.5 rounded text-xs font-semibold flex items-center gap-1 ${
                  activeDeviceFrame === 'mobile'
                    ? 'bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-xs'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                }`}
                title="Mobile 360x640"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px]">360px</span>
              </button>
              <button
                onClick={() => setActiveDeviceFrame('tablet')}
                className={`touch-target p-1.5 rounded text-xs font-semibold flex items-center gap-1 ${
                  activeDeviceFrame === 'tablet'
                    ? 'bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-xs'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                }`}
                title="Tablet 768px"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="text-[11px]">768px</span>
              </button>
              <button
                onClick={() => setActiveDeviceFrame('responsive')}
                className={`touch-target p-1.5 rounded text-xs font-semibold flex items-center gap-1 ${
                  activeDeviceFrame === 'responsive'
                    ? 'bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-xs'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                }`}
                title="Full Responsive"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[11px]">100%</span>
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'ne' : 'en')}
              className="touch-target px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)] text-xs font-bold transition flex items-center gap-1.5 text-[var(--color-foreground)]"
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>{locale === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="touch-target p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)] text-[var(--color-foreground)] transition"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--color-secondary)]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Optional Viewport Frame Simulation */}
      <div
        className={`mx-auto transition-all duration-300 p-4 sm:p-6 lg:p-8 ${
          activeDeviceFrame === 'mobile'
            ? 'max-w-[360px] border-x border-[var(--color-border)] shadow-lg my-4 rounded-2xl bg-[var(--color-background)]'
            : activeDeviceFrame === 'tablet'
            ? 'max-w-[768px] border-x border-[var(--color-border)] shadow-lg my-4 rounded-2xl bg-[var(--color-background)]'
            : 'max-w-7xl'
        }`}
      >
        {/* Banner with subtle Dhaka pattern */}
        <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 mb-8 shadow-sm">
          <div className="absolute inset-0 pattern-dhaka pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-[var(--color-primary)] uppercase">
                {t('brandTagline')}
              </span>
              <span className="text-[11px] text-[var(--color-muted)]">•</span>
              <BsDate showIcon={true} showAd={true} />
            </div>

            <h1 className="type-hero text-[var(--color-foreground)]">
              {locale === 'ne'
                ? 'नव युवा क्लब डिजाइन प्रणाली'
                : 'Nawa Yuwa Club Design System'}
            </h1>

            <p className="type-body text-[var(--color-muted)] max-w-2xl">
              {t('brandSupport')} {t('localActionTrust')}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Badge variant="primary">Crimson Accent</Badge>
              <Badge variant="secondary">Deep Blue Accent</Badge>
              <Badge variant="default">WCAG 2.1 AA Accessible</Badge>
              <Badge variant="outline">Mobile First (≥44px Touch)</Badge>
            </div>
          </div>
        </section>

        {/* Navigation Tabs for Showcase */}
        <div className="mb-8">
          <Tabs
            tabs={demoTabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="segmented"
          />
        </div>

        {/* Tab 1: 18 Components Showcase */}
        {activeTab === 'components' && (
          <div className="space-y-10">
            {/* 1. Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>1. Button Family (`Button.tsx`)</CardTitle>
                <CardDescription>
                  Supports primary crimson, secondary deep blue, outline, ghost, and danger with full keyboard & touch target discipline.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">{t('navReportIssue')}</Button>
                  <Button variant="secondary">{t('actionExploreChapters')}</Button>
                  <Button variant="outline">{t('actionViewDetails')}</Button>
                  <Button variant="ghost">{t('actionCancel')}</Button>
                  <Button variant="danger">Delete Item</Button>
                  <Button variant="primary" isLoading={true}>Loading</Button>
                </div>

                <div className="pt-2 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold text-[var(--color-muted)]">Sizes:</span>
                  <Button size="sm" variant="outline">Small (38px)</Button>
                  <Button size="md" variant="primary">Medium Default (44px touch target)</Button>
                  <Button size="lg" variant="secondary">Large (48px)</Button>
                </div>
              </CardContent>
            </Card>

            {/* 2. Status Badges & Standard Badges */}
            <Card>
              <CardHeader>
                <CardTitle>2. Badges & Status Indicators (`StatusBadge.tsx`, `Badge.tsx`)</CardTitle>
                <CardDescription>
                  Section 42 requirement: Every civic issue communicates status with BOTH icon + text (never color alone).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-[var(--color-muted)] mb-2 uppercase tracking-wider">
                    Civic Issue Workflow Statuses
                  </h4>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <StatusBadge status="Reported" />
                    <StatusBadge status="Under Review" />
                    <StatusBadge status="Verified" />
                    <StatusBadge status="In Progress" />
                    <StatusBadge status="Resolved" />
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border-subtle)]">
                  <h4 className="text-xs font-semibold text-[var(--color-muted)] mb-2 uppercase tracking-wider">
                    General Unboxed / Minimal Badges
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">General Category</Badge>
                    <Badge variant="primary">Youth Leadership</Badge>
                    <Badge variant="secondary">Volunteering</Badge>
                    <Badge variant="outline">Madhesh Chapter</Badge>
                    <Badge variant="subtle">Ward 16 · Published Today</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Accessible Form Controls */}
            <Card>
              <CardHeader>
                <CardTitle>3. Form Controls (`Input.tsx`, `Textarea.tsx`, `Select.tsx`)</CardTitle>
                <CardDescription>
                  Touch-compliant inputs (min 44px) with accessible labels, helper text, and error states.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t('labelIssueTitle')}
                    placeholder="Briefly describe the issue (e.g. Drinking water pipeline leak)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    helperText="Keep titles concise and specific to your ward."
                    required
                  />

                  <Select
                    label={t('labelCategory')}
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    options={[
                      { value: 'road', label: 'Road Infrastructure' },
                      { value: 'water', label: 'Drinking Water & Sanitation' },
                      { value: 'waste', label: 'Solid Waste Management' },
                      { value: 'education', label: 'Youth & Education' },
                      { value: 'health', label: 'Community Health' },
                    ]}
                    required
                  />
                </div>

                <Textarea
                  label={t('labelDescription')}
                  placeholder="Tell us what happened, where it happened, and why it matters."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  rows={3}
                  required
                />

                <Input
                  label="Sample Input with Validation Error"
                  placeholder="Invalid value test"
                  defaultValue="Wrong input"
                  error="Mobile number must be a valid 10-digit Nepal number starting with 98."
                />
              </CardContent>
            </Card>

            {/* 4. Nepal Administrative Location Picker */}
            <Card>
              <CardHeader>
                <CardTitle>4. Nepal Administrative Picker (`LocationPicker.tsx`)</CardTitle>
                <CardDescription>
                  Geographic focus on Madhesh Pradesh and local municipal units across Nepal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LocationPicker
                  label={t('labelLocation')}
                  value={locationValue}
                  onChange={setLocationValue}
                  required
                />
                <div className="mt-4 p-3 rounded-lg bg-[var(--color-surface-muted)] text-xs text-[var(--color-foreground)] flex items-center justify-between font-mono">
                  <span>Selected: {locationValue.localLevel}, Ward {locationValue.ward}, {locationValue.district}, {locationValue.province}</span>
                </div>
              </CardContent>
            </Card>

            {/* 5. Image Uploader */}
            <Card>
              <CardHeader>
                <CardTitle>5. Image Uploader (`ImageUploader.tsx`)</CardTitle>
                <CardDescription>
                  Accessible photo uploader for community issue reporting with preview and remove.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  label={t('labelPhotos')}
                  images={uploadedImages}
                  onChange={setUploadedImages}
                  maxImages={4}
                  helperText="Upload clear photographs of the local issue or community activity."
                />
              </CardContent>
            </Card>

            {/* 6. Modal Dialogs, Drawers & Confirmation */}
            <Card>
              <CardHeader>
                <CardTitle>6. Overlays (`Dialog.tsx`, `Drawer.tsx`, `ConfirmDialog.tsx`)</CardTitle>
                <CardDescription>
                  Accessible modal dialogs and mobile-first bottom sheets with keyboard escape and focus trap.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" onClick={() => setDialogOpen(true)}>
                    Open Modal Dialog
                  </Button>
                  <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                    Open Mobile Bottom Drawer
                  </Button>
                  <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                    Open Confirm Dialog
                  </Button>
                </div>

                {actionSuccess && (
                  <div className="p-3 bg-[var(--color-success-muted)] text-[var(--color-success)] rounded-lg text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Action successfully confirmed!</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 7. Loading Skeletons */}
            <Card>
              <CardHeader>
                <CardTitle>7. Loading Skeletons (`Skeleton.tsx`)</CardTitle>
                <CardDescription>
                  Section 41 requirement: Matches card layout with image, title, description, and metadata skeletons.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CardSkeleton hasImage={true} />
                  <CardSkeleton hasImage={false} />
                </div>
              </CardContent>
            </Card>

            {/* 8. Empty States & Error States */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EmptyState
                title={t('emptyTitle')}
                description={t('emptyDescription')}
                actionLabel={t('actionExploreChapters')}
                onAction={() => alert('Explore chapters action triggered')}
              />

              <ErrorState
                title={t('errorTitle')}
                description={t('errorDescription')}
                onRetry={() => alert('Retry action triggered')}
              />
            </div>

            {/* 9. Bikram Sambat Date Formatter */}
            <Card>
              <CardHeader>
                <CardTitle>9. Bikram Sambat Date (`BsDate.tsx`)</CardTitle>
                <CardDescription>
                  Native Nepal calendar converter showing Devanagari numerals (वि.सं.) and Gregorian date.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-4 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)] font-medium">Today's Date:</span>
                  <BsDate showIcon={true} showAd={true} />
                </div>
                <div className="p-4 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)] font-medium">Bilingual View:</span>
                  <BsDate date="2026-10-18T15:00:00Z" showIcon={true} showAd={true} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Design Tokens & Dhaka Pattern */}
        {activeTab === 'tokens' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Nepal National Color Token System</CardTitle>
                <CardDescription>
                  Section 4: Centralized CSS variables. Crimson and deep blue accents with 60-30-10 palette balance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <div className="h-16 rounded-lg bg-[var(--color-primary)] border border-black/10 shadow-xs flex items-end p-2 text-white font-mono text-[11px] font-bold">
                      Crimson
                    </div>
                    <div className="text-xs font-semibold text-[var(--color-foreground)]">--color-primary</div>
                    <div className="text-[11px] text-[var(--color-muted)]">Nepal National Crimson</div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-16 rounded-lg bg-[var(--color-secondary)] border border-black/10 shadow-xs flex items-end p-2 text-white font-mono text-[11px] font-bold">
                      Deep Blue
                    </div>
                    <div className="text-xs font-semibold text-[var(--color-foreground)]">--color-secondary</div>
                    <div className="text-[11px] text-[var(--color-muted)]">Nepal National Deep Blue</div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-16 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-end p-2 text-[var(--color-foreground)] font-mono text-[11px] font-bold">
                      Surface
                    </div>
                    <div className="text-xs font-semibold text-[var(--color-foreground)]">--color-surface</div>
                    <div className="text-[11px] text-[var(--color-muted)]">Card & Panel Base</div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-16 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] shadow-xs flex items-end p-2 text-[var(--color-foreground)] font-mono text-[11px] font-bold">
                      Background
                    </div>
                    <div className="text-xs font-semibold text-[var(--color-foreground)]">--color-background</div>
                    <div className="text-[11px] text-[var(--color-muted)]">Canvas Background</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--color-border-subtle)]">
                  <div className="p-3 rounded-lg bg-[var(--color-success-muted)] text-[var(--color-success)] border border-[var(--color-success)]/20 text-xs font-semibold">
                    Success (#15803D)
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--color-warning-muted)] text-[var(--color-warning)] border border-[var(--color-warning)]/20 text-xs font-semibold">
                    Warning (#B45309)
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--color-danger-muted)] text-[var(--color-danger)] border border-[var(--color-danger)]/20 text-xs font-semibold">
                    Danger (#B91C1C)
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--color-info-muted)] text-[var(--color-info)] border border-[var(--color-info)]/20 text-xs font-semibold">
                    Info (#0284C7)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subtle Dhaka Pattern Texture Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Subtle Dhaka-Inspired Pattern Texture</CardTitle>
                <CardDescription>
                  Section 5: "Dhaka-inspired pattern: Use very subtly. It should be a background texture, not the primary visual element."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden flex items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 pattern-dhaka pointer-events-none" />
                  <div className="relative z-10 space-y-1">
                    <p className="type-h3 text-[var(--color-foreground)] font-bold">
                      तपाईंको समुदाय। तपाईंको आवाज। तपाईंको पहल।
                    </p>
                    <p className="type-small text-[var(--color-muted)]">
                      Subtle traditional Dhaka geometric texture rendered via CSS radial gradients at 0.04 opacity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Typography Verification */}
        {activeTab === 'typography' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Typography Tokens (Devanagari & Latin)</CardTitle>
                <CardDescription>
                  Section 6: Devanagari font support with Mukta and Noto Sans Devanagari, ensuring generous line-height for Nepali text.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 border-b border-[var(--color-border-subtle)] pb-4">
                  <span className="text-[11px] font-mono text-[var(--color-muted)]">.type-display</span>
                  <div className="type-display text-[var(--color-foreground)]">
                    {locale === 'ne'
                      ? 'सशक्त, सक्रिय र जोडिएको समुदाय'
                      : 'Stronger, More Active Communities'}
                  </div>
                </div>

                <div className="space-y-2 border-b border-[var(--color-border-subtle)] pb-4">
                  <span className="text-[11px] font-mono text-[var(--color-muted)]">.type-hero</span>
                  <div className="type-hero text-[var(--color-foreground)]">
                    {t('brandTagline')}
                  </div>
                </div>

                <div className="space-y-2 border-b border-[var(--color-border-subtle)] pb-4">
                  <span className="text-[11px] font-mono text-[var(--color-muted)]">.type-h1 / .type-h2 / .type-h3</span>
                  <div className="type-h1 text-[var(--color-foreground)]">
                    {locale === 'ne' ? 'स्थानीय नेतृत्व र युवा सहभागिता' : 'Local Leadership & Youth Participation'}
                  </div>
                  <div className="type-h2 text-[var(--color-muted)]">
                    {locale === 'ne' ? 'समुदायका समस्याहरूको समाधान' : 'Resolving Community Challenges'}
                  </div>
                  <div className="type-h3 text-[var(--color-foreground)]">
                    {locale === 'ne' ? 'मधेश प्रदेश र स्थानीय शाखाहरू' : 'Madhesh Pradesh & Local Chapters'}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-[var(--color-muted)]">.type-body / .type-small</span>
                  <p className="type-body text-[var(--color-foreground)] max-w-2xl">
                    {t('brandSupport')}
                  </p>
                  <p className="type-small text-[var(--color-muted)]">
                    {t('localActionTrust')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Demo Modal Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={t('navReportIssue')}
        description="Help your community by reporting a local issue."
      >
        <div className="space-y-4">
          <Input label={t('labelIssueTitle')} placeholder="e.g. Road repair needed in Ward 4" />
          <LocationPicker value={locationValue} onChange={setLocationValue} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              {t('actionCancel')}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setDialogOpen(false);
                setActionSuccess(true);
                setTimeout(() => setActionSuccess(false), 3000);
              }}
            >
              {t('actionSubmit')}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Demo Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={t('navChapters')}
      >
        <div className="space-y-4">
          <p className="type-body text-[var(--color-muted)]">
            Explore active Nawa Yuwa Club chapters across Madhesh Pradesh and Nepal.
          </p>
          <div className="space-y-2.5">
            {['Janakpurdham Chapter', 'Birgunj Chapter', 'Bardaghat Chapter', 'Lahan Chapter'].map((chap, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-between text-xs font-semibold">
                <span>{chap}</span>
                <StatusBadge status="Verified" size="sm" />
              </div>
            ))}
          </div>
          <Button fullWidth variant="primary" onClick={() => setDrawerOpen(false)}>
            {t('actionExploreChapters')}
          </Button>
        </div>
      </Drawer>

      {/* Demo Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          setActionSuccess(true);
          setTimeout(() => setActionSuccess(false), 3000);
        }}
        title="Confirm Participation"
        message="Are you sure you want to RSVP for this community leadership activity?"
        confirmLabel={t('actionConfirm')}
        cancelLabel={t('actionCancel')}
      />
    </div>
  );
};
