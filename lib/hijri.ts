export function getHijriDate(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatToParts(date);

  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '';

  return `${get('day')} ${get('month')} ${get('year')}`;
  // → "17 Dhu al-Hijjah 1447 AH"
}