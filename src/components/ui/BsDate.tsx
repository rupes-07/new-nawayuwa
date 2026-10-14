import React from 'react';
import { Calendar } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';

export interface BsDateProps {
  date?: string | Date;
  showIcon?: boolean;
  showAd?: boolean;
  className?: string;
}

// Nepali numeral mapping
const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const toDevanagariNumerals = (num: number | string): string => {
  return String(num)
    .split('')
    .map((char) => {
      const parsed = parseInt(char, 10);
      return !isNaN(parsed) ? devanagariDigits[parsed] : char;
    })
    .join('');
};

// Bikram Sambat Month names
const bsMonthsNe = [
  'बैशाख',
  'जेठ',
  'असार',
  'साउन',
  'भदौ',
  'असोज',
  'कात्तिक',
  'मंसिर',
  'पुस',
  'माघ',
  'फागुन',
  'चैत',
];

const bsMonthsEn = [
  'Baishakh',
  'Jestha',
  'Ashadh',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
];

// Helper approximation for standard BS calculation (BS is approx AD + 56 years, 8 months, 15 days)
export const formatBsDate = (
  dInput?: string | Date,
  locale: 'en' | 'ne' = 'ne'
): { bsString: string; adString: string } => {
  const d = dInput ? new Date(dInput) : new Date();
  const adYear = d.getFullYear();
  const adMonth = d.getMonth();
  const adDay = d.getDate();

  // BS Year approximation
  const bsYear = adMonth > 3 || (adMonth === 3 && adDay >= 14) ? adYear + 57 : adYear + 56;
  const bsMonthIdx = (adMonth + 8) % 12;
  const bsDay = ((adDay + 14) % 30) + 1;

  const bsString =
    locale === 'ne'
      ? `${toDevanagariNumerals(bsYear)} ${bsMonthsNe[bsMonthIdx]} ${toDevanagariNumerals(bsDay)}`
      : `${bsMonthsEn[bsMonthIdx]} ${bsDay}, ${bsYear} BS`;

  const adString = d.toLocaleDateString(locale === 'ne' ? 'ne-NP' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return { bsString, adString };
};

export const BsDate: React.FC<BsDateProps> = ({
  date,
  showIcon = true,
  showAd = true,
  className = '',
}) => {
  const { locale } = useI18n();
  const { bsString, adString } = formatBsDate(date, locale);

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] font-medium ${className}`}>
      {showIcon && <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" aria-hidden="true" />}
      <span className="text-[var(--color-foreground)] font-semibold">{bsString}</span>
      {showAd && (
        <span className="text-[var(--color-muted)] text-[11px] font-normal">
          ({adString})
        </span>
      )}
    </span>
  );
};
