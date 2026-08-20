/**
 * Calendar Integration Utilities for Municipal Public Events
 * Supports Google Calendar, Outlook Web, and Universal .ics file downloads.
 */

// Helper to convert Month name (e.g. "AUG", "August", "Aug") to 2-digit string
const monthToNumber = (mStr) => {
  if (!mStr) return '08';
  const m = mStr.toUpperCase().substring(0, 3);
  const months = {
    JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
    JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12'
  };
  return months[m] || '08';
};

// Helper to format 2-digit day
const padZero = (n) => String(n).padStart(2, '0');

export const getEventDateTimes = (event) => {
  const y = event.year || '2026';
  const m = monthToNumber(event.month || (event.date ? event.date.split(' ')[0] : 'AUG'));
  const rawDay = event.day || (event.date ? event.date.split(' ')[1] : '29');
  const d = padZero(String(rawDay).replace(/[^0-9]/g, '') || '29');

  // Default times: 10:00 AM to 01:00 PM (13:00)
  let startHour = '100000';
  let endHour = '130000';

  if (event.time) {
    if (event.time.includes('7:30')) {
      startHour = '073000';
      endHour = '113000';
    } else if (event.time.includes('9:00')) {
      startHour = '090000';
      endHour = '180000';
    } else if (event.time.includes('8:30')) {
      startHour = '083000';
      endHour = '190000';
    } else if (event.time.includes('8:00')) {
      startHour = '080000';
      endHour = '140000';
    } else if (event.time.includes('10:30')) {
      startHour = '103000';
      endHour = '153000';
    }
  }

  const startIso = `${y}${m}${d}T${startHour}`;
  const endIso = `${y}${m}${d}T${endHour}`;
  return { y, m, d, startIso, endIso };
};

/**
 * Generate Direct Google Calendar Event URL
 */
export const getGoogleCalendarUrl = (event) => {
  if (!event) return '#';
  const { startIso, endIso } = getEventDateTimes(event);
  const title = encodeURIComponent(event.title || 'Municipal Public Event');
  const location = encodeURIComponent(`${event.location || ''}, ${event.address || 'Bengaluru, Karnataka'}`);
  const details = encodeURIComponent(
    `${event.summary || event.description || ''}\n\nHosted by: ${event.organizer || 'Greater Bengaluru Municipal Corporation'}\nHelpdesk: ${event.hostContact || '1533'}\nOfficial Portal: https://bbmp.gov.in/events/${event.slug || ''}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
};

/**
 * Generate Direct Outlook Online Calendar URL
 */
export const getOutlookCalendarUrl = (event) => {
  if (!event) return '#';
  const { y, m, d } = getEventDateTimes(event);
  const startdt = `${y}-${m}-${d}T10:00:00`;
  const enddt = `${y}-${m}-${d}T13:00:00`;
  const subject = encodeURIComponent(event.title || 'Municipal Event');
  const location = encodeURIComponent(`${event.location || ''}, ${event.address || ''}`);
  const body = encodeURIComponent(event.summary || event.description || '');

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${startdt}&enddt=${enddt}&body=${body}&location=${location}`;
};

/**
 * Generate & Download .ics (iCalendar) file for Apple Calendar, Outlook, Mobile
 */
export const downloadIcsFile = (event) => {
  if (!event) return;
  const { startIso, endIso } = getEventDateTimes(event);
  const title = event.title || 'Municipal Public Event';
  const desc = (event.summary || event.description || 'Official Municipal Event').replace(/\n/g, '\\n');
  const loc = `${event.location || ''}, ${event.address || 'Bengaluru'}`.replace(/\n/g, ' ');

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Greater Bengaluru Municipal Corporation//BBMP Civic Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:bbmp-event-${event.id || '2026'}-${Date.now()}@bbmp.gov.in`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    `ORGANIZER;CN="${event.organizer || 'BBMP Secretariat'}":mailto:events@bbmp.gov.in`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const cleanName = title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
  link.download = `${cleanName}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
