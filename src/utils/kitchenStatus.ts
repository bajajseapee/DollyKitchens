export interface KitchenStatus {
  isOpen: boolean;
  istTimeLabel: string;
}

/**
 * Checks whether Dolly's Kitchen (4:30 PM – 11:30 PM IST) is currently open
 * in Asia/Kolkata regardless of the visitor's local browser timezone.
 */
export function getKitchenStatus(now: Date = new Date()): KitchenStatus {
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  const parts = formatter.formatToParts(now);
  const hourPart = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minutePart = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);

  const normalizedHour = hourPart === 24 ? 0 : hourPart;
  const totalMinutes = normalizedHour * 60 + minutePart;

  // Open daily 16:30 (990 min) through 23:30 (1410 min) IST
  const openMinutes = 16 * 60 + 30;
  const closeMinutes = 23 * 60 + 30;
  const isOpen = totalMinutes >= openMinutes && totalMinutes < closeMinutes;

  const displayFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  });

  return {
    isOpen,
    istTimeLabel: displayFormatter.format(now),
  };
}
