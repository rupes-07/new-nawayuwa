import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FolderPlus,
  Calendar,
  MapPin,
  Users,
  Clock,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import {
  projectCreationSchema,
  type ProjectCreationInput,
} from '../../lib/validation/project.ts';
import type { LeaderContext } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';

export interface LeaderNewProjectPageProps {
  context: LeaderContext;
  onNavigate: (path: string) => void;
}

// Curated authentic project imagery presets from applet assets
const PRESET_IMAGES = [
  {
    url: '/src/assets/images/project_clean_water_1791953725518.jpg',
    label: 'Clean Water & Public Health',
  },
  {
    url: '/src/assets/images/project_tree_drive_1791953781228.jpg',
    label: 'Tree Plantation & Conservation',
  },
  {
    url: '/src/assets/images/project_youth_workshop_1791953748929.jpg',
    label: 'Youth Leadership & Training',
  },
  {
    url: '/src/assets/images/nepal_youth_community_action_1791953691940.jpg',
    label: 'Community Action & Mobilization',
  },
];

export const LeaderNewProjectPage: React.FC<LeaderNewProjectPageProps> = ({
  context,
  onNavigate,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectCreationInput>({
    resolver: zodResolver(projectCreationSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Community',
      location: `${context.chapter.location || 'Ward 16, Bardaghat, Nawalparasi'}`,
      date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      targetVolunteers: 25,
      volunteerHoursCredit: 4,
      requiredSkills: 'Youth enthusiasm, teamwork, and civic pride',
      prerequisites: 'Open to all registered chapter members and local residents',
      coordinatorNotes: `Coordinated by ${context.userName || 'Chapter Coordinator'}`,
      imageUrl: PRESET_IMAGES[0].url,
    },
  });

  const selectedImageUrl = watch('imageUrl');
  const selectedCategory = watch('category');

  const onSubmit = async (formData: ProjectCreationInput) => {
    try {
      setSubmitError(null);
      await api.createLeaderProject({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        targetVolunteers: formData.targetVolunteers,
        requiredSkills: formData.requiredSkills,
        volunteerHoursCredit: formData.volunteerHoursCredit,
        prerequisites: formData.prerequisites,
        coordinatorNotes: formData.coordinatorNotes,
        images: [formData.imageUrl],
        imageUrl: formData.imageUrl,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        onNavigate('/leader/dashboard');
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create chapter project');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('/leader/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] mb-1 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">
            Create Chapter Community Project
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Plan, organize, and launch verified field volunteering initiatives for {context.chapter.name}.
          </p>
        </div>

        <Badge variant="primary" size="md">
          {context.chapter.name}
        </Badge>
      </div>

      {submitSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong>Project created successfully!</strong> Attendance register has been automatically generated. Redirecting to dashboard...
          </div>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-800 dark:text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>{submitError}</div>
        </div>
      )}

      {/* Main Form utilizing React Hook Form + Zod */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Project Details */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-[var(--color-foreground)] uppercase tracking-wider flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-[var(--color-primary)]" />
            1. Core Project Information
          </h3>

          <div className="space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                Project Title <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Ward 16 Solar Streetlamp Repair & Pathway Greening"
                className={`w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface-muted)] border rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-[var(--color-border)] focus:ring-[var(--color-primary)]'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                Project Description & Purpose <span className="text-[var(--color-primary)]">*</span>
              </label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Explain the background problem, community impact, activities involved, and expected outcomes..."
                className={`w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface-muted)] border rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-[var(--color-border)] focus:ring-[var(--color-primary)]'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                  Project Category <span className="text-[var(--color-primary)]">*</span>
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
                >
                  <option value="Community">Community</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Health">Health</option>
                  <option value="Culture">Culture</option>
                  <option value="Tourism">Tourism</option>
                </select>
                {errors.category && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                  Execution Date <span className="text-[var(--color-primary)]">*</span>
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className={`w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface-muted)] border rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 ${
                    errors.date
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-[var(--color-border)] focus:ring-[var(--color-primary)]'
                  }`}
                />
                {errors.date && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                Location & Venue Details <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                type="text"
                {...register('location')}
                placeholder="e.g. Ward 16 Community Center & Watershed Trail, Bardaghat"
                className={`w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface-muted)] border rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 ${
                  errors.location
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-[var(--color-border)] focus:ring-[var(--color-primary)]'
                }`}
              />
              {errors.location && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Participation & Volunteer Information */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-[var(--color-foreground)] uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--color-secondary)]" />
            2. Volunteer Participation Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                Target Volunteers Count
              </label>
              <input
                type="number"
                min="1"
                max="500"
                {...register('targetVolunteers', { valueAsNumber: true })}
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
              {errors.targetVolunteers && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  {errors.targetVolunteers.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                Volunteer Hours Awarded (Per Attendee)
              </label>
              <input
                type="number"
                min="1"
                max="40"
                {...register('volunteerHoursCredit', { valueAsNumber: true })}
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
              {errors.volunteerHoursCredit && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  {errors.volunteerHoursCredit.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                Required Skills & Roles
              </label>
              <input
                type="text"
                {...register('requiredSkills')}
                placeholder="e.g. Field physical tasks, documentation, logistics coordination"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                Prerequisites & Gear
              </label>
              <input
                type="text"
                {...register('prerequisites')}
                placeholder="e.g. Bring personal water bottle and club volunteer vest"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                Coordinator Notes & Assembly Point
              </label>
              <input
                type="text"
                {...register('coordinatorNotes')}
                placeholder="e.g. Gathering at Club Bhavan at 7:30 AM for brief orientation"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Visual Banner & Images */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[var(--color-foreground)] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-500" />
              3. Project Cover Image
            </h3>
            <span className="text-xs text-[var(--color-muted)]">
              Choose from verified assets or enter URL
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_IMAGES.map((img) => (
              <button
                type="button"
                key={img.url}
                onClick={() => setValue('imageUrl', img.url, { shouldValidate: true })}
                className={`relative rounded-xl overflow-hidden border-2 text-left transition cursor-pointer group aspect-video ${
                  selectedImageUrl === img.url
                    ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                    : 'border-transparent hover:border-[var(--color-border)]'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-white leading-tight">
                    {img.label}
                  </span>
                </div>
                {selectedImageUrl === img.url && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
              Custom Image URL
            </label>
            <input
              type="text"
              {...register('imageUrl')}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 text-xs font-mono bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.imageUrl && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                {errors.imageUrl.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onNavigate('/leader/dashboard')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Publish Project to Chapter Roster
          </Button>
        </div>
      </form>
    </div>
  );
};
