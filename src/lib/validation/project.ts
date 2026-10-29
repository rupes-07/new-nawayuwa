import { z } from 'zod';

export const projectCategoryEnum = z.enum([
  'Community',
  'Environment',
  'Education',
  'Leadership',
  'Volunteering',
  'Culture',
  'Health',
  'Tourism',
] as const);

export const projectCreationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .min(15, 'Please provide a clear description of at least 15 characters'),
  category: projectCategoryEnum,
  location: z
    .string()
    .trim()
    .min(3, 'Location is required (e.g. Ward 16, Bardaghat)'),
  date: z
    .string()
    .min(1, 'Project date is required'),
  targetVolunteers: z
    .number()
    .min(1, 'Target volunteers must be at least 1')
    .max(500, 'Target volunteers cannot exceed 500'),
  volunteerHoursCredit: z
    .number()
    .min(1, 'Hours credit must be at least 1')
    .max(40, 'Hours credit cannot exceed 40'),
  requiredSkills: z
    .string()
    .trim()
    .optional(),
  prerequisites: z
    .string()
    .trim()
    .optional(),
  coordinatorNotes: z
    .string()
    .trim()
    .optional(),
  imageUrl: z
    .string()
    .trim()
    .min(1, 'Please select or provide a banner image'),
});

export type ProjectCreationInput = z.infer<typeof projectCreationSchema>;
