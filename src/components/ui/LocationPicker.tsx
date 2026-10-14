import React from 'react';
import { Select } from './Select.tsx';
import { Input } from './Input.tsx';
import { MapPin } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';

export interface LocationData {
  province: string;
  district: string;
  localLevel: string;
  ward: string;
}

export interface LocationPickerProps {
  value: LocationData;
  onChange: (data: LocationData) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  error,
  label,
  required = false,
}) => {
  const { t } = useI18n();

  // Provinces of Nepal with Madhesh Pradesh prioritized
  const provinces = [
    { value: 'Madhesh Pradesh', label: t('provinceMadhesh') },
    { value: 'Bagmati Province', label: t('provinceBagmati') },
    { value: 'Lumbini Province', label: t('provinceLumbini') },
    { value: 'Gandaki Province', label: t('provinceGandaki') },
    { value: 'Koshi Province', label: t('provinceKoshi') },
    { value: 'Karnali Province', label: t('provinceKarnali') },
    { value: 'Sudurpashchim Province', label: t('provinceSudurpashchim') },
  ];

  // Common districts grouped by Province
  const districtsByProvince: Record<string, string[]> = {
    'Madhesh Pradesh': [
      'Dhanusha',
      'Mahottari',
      'Sarlahi',
      'Rautahat',
      'Bara',
      'Parsa',
      'Siraha',
      'Saptari',
    ],
    'Bagmati Province': [
      'Kathmandu',
      'Lalitpur',
      'Bhaktapur',
      'Chitwan',
      'Kavrepalanchok',
      'Makwanpur',
      'Sindhupalchok',
    ],
    'Lumbini Province': [
      'Nawalparasi (Bardaghat Susta West)',
      'Rupandehi',
      'Kapilvastu',
      'Dang',
      'Banke',
      'Bardiya',
      'Palpa',
    ],
    'Gandaki Province': ['Kaski', 'Tanahun', 'Syngja', 'Gorkha', 'Nawalpur', 'Lamjung'],
    'Koshi Province': ['Morang', 'Sunsari', 'Jhapa', 'Ilam', 'Udayapur'],
    'Karnali Province': ['Surkhet', 'Dailekh', 'Jumla', 'Salyan'],
    'Sudurpashchim Province': ['Kailali', 'Kanchanpur', 'Doti', 'Dadeldhura'],
  };

  const currentDistricts = districtsByProvince[value.province] || districtsByProvince['Madhesh Pradesh'];

  const handleProvinceChange = (province: string) => {
    const districts = districtsByProvince[province] || [];
    onChange({
      ...value,
      province,
      district: districts[0] || '',
    });
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-foreground)]">
          <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>{label}</span>
          {required && <span className="text-[var(--color-danger)]">*</span>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label={t('labelProvince')}
          value={value.province}
          onChange={(e) => handleProvinceChange(e.target.value)}
          options={provinces}
          required={required}
        />

        <Select
          label={t('labelDistrict')}
          value={value.district}
          onChange={(e) => onChange({ ...value, district: e.target.value })}
          options={currentDistricts.map((d) => ({ value: d, label: d }))}
          required={required}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            label={t('labelLocalLevel')}
            placeholder="e.g. Bardaghat / Janakpurdham / Birgunj"
            value={value.localLevel}
            onChange={(e) => onChange({ ...value, localLevel: e.target.value })}
            required={required}
          />
        </div>

        <div>
          <Input
            label={t('labelWard')}
            placeholder="e.g. 16"
            type="number"
            min="1"
            max="35"
            value={value.ward}
            onChange={(e) => onChange({ ...value, ward: e.target.value })}
            required={required}
          />
        </div>
      </div>

      {error && <p className="text-xs text-[var(--color-danger)] font-medium">{error}</p>}
    </div>
  );
};
