const DEFAULT_DURATION_HOURS = 2;

interface CalendarVenue {
  name?: string;
  address?: string;
  phoneNumber?: string;
}

interface CalendarEventInput {
  sessionCode: string;
  venue: CalendarVenue;
  startDateTime?: string;
}

function pad(num: number): string {
  return String(num).padStart(2, '0');
}

function formatUtcForIcs(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
    date.getUTCHours(),
  )}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildCalendarFileName(venueName?: string): string {
  const slug = slugify(venueName || 'safedate-plan');
  return `${slug || 'safedate-plan'}.ics`;
}

export function buildIcsEvent(input: CalendarEventInput): string {
  const fallbackStart = new Date();
  fallbackStart.setHours(fallbackStart.getHours() + 1, 0, 0, 0);
  const start = input.startDateTime ? new Date(input.startDateTime) : fallbackStart;
  const end = new Date(start.getTime() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000);
  const now = new Date();

  const summary = `Date at ${input.venue.name || 'Selected venue'}`;
  const description = [
    `SafeDate session: ${input.sessionCode}`,
    input.startDateTime ? null : 'Note: Start time was not set in app. Please adjust in your calendar.',
    input.venue.phoneNumber ? `Venue phone: ${input.venue.phoneNumber}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const uid = `${input.sessionCode}-${start.getTime()}@safedate`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SafeDate//Date Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatUtcForIcs(now)}`,
    `DTSTART:${formatUtcForIcs(start)}`,
    `DTEND:${formatUtcForIcs(end)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `LOCATION:${escapeIcsText(input.venue.address || 'Venue address')}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadCalendarIcs(contents: string, fileName: string): void {
  const blob = new Blob([contents], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
