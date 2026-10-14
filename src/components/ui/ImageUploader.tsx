import React, { useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';

export interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 4,
  label,
  helperText,
}) => {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = [...images];
    Array.from(files).forEach((file) => {
      if (newImages.length < maxImages) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            onChange([...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2 text-left">
      {label && (
        <label className="block text-xs font-semibold text-[var(--color-foreground)] select-none">
          {label}
        </label>
      )}

      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl p-5 text-center cursor-pointer transition-colors bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)]"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <UploadCloud className="w-8 h-8 mx-auto text-[var(--color-muted)] mb-2" />
          <p className="type-small font-semibold text-[var(--color-foreground)]">
            {t('actionUpload')}
          </p>
          <p className="type-caption text-[var(--color-muted)] mt-0.5">
            PNG, JPG, WebP (Max {maxImages} photos)
          </p>
        </div>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-4/3 rounded-lg overflow-hidden border border-[var(--color-border)] group bg-[var(--color-surface-muted)]"
            >
              <img
                src={img}
                alt={`Upload preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-black text-white transition touch-target"
                aria-label={t('actionRemove')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {helperText && (
        <p className="type-caption text-[var(--color-muted)]">{helperText}</p>
      )}
    </div>
  );
};
