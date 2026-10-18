import React, { useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Repeat,
  CheckCircle2,
  ExternalLink,
  Download,
  CalendarCheck2
} from 'lucide-react';

interface CalendarModalProps {
  onClose: () => void;
  defaultTitle?: string;
  defaultDescription?: string;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  onClose,
  defaultTitle = 'FileForge Document Batch Review',
  defaultDescription = 'Automated review of processed PDF & document archives.'
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(Date.now() + 3600000);
    return d.toISOString().slice(0, 16);
  });
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('weekly');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  const formatIsoCal = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const getCalendarLinks = () => {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const startIso = formatIsoCal(start);
    const endIso = formatIsoCal(end);

    const cleanTitle = encodeURIComponent(title);
    const cleanDesc = encodeURIComponent(description);

    let googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${cleanTitle}&dates=${startIso}/${endIso}&details=${cleanDesc}&location=FileForge+Studio`;
    if (recurring === 'daily') googleUrl += `&recur=RRULE:FREQ=DAILY`;
    if (recurring === 'weekly') googleUrl += `&recur=RRULE:FREQ=WEEKLY`;
    if (recurring === 'monthly') googleUrl += `&recur=RRULE:FREQ=MONTHLY`;

    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${cleanTitle}&body=${cleanDesc}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&location=FileForge+Studio`;

    let rrule = '';
    if (recurring === 'daily') rrule = '\r\nRRULE:FREQ=DAILY';
    if (recurring === 'weekly') rrule = '\r\nRRULE:FREQ=WEEKLY';
    if (recurring === 'monthly') rrule = '\r\nRRULE:FREQ=MONTHLY';

    const icsString = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FileForge//Document Automation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:ff-${Date.now()}@fileforge.internal`,
      `DTSTAMP:${formatIsoCal(new Date())}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:${title}${rrule}`,
      `DESCRIPTION:${description}`,
      'LOCATION:FileForge Online Studio',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return { googleUrl, outlookUrl, icsString };
  };

  const handleDownloadIcs = () => {
    const { icsString } = getCalendarLinks();
    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fileforge-schedule-${Date.now()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSyncSuccess('iCalendar (.ics) file downloaded. Compatible with Apple Calendar, Outlook & Google.');
  };

  const handleOpenGoogle = () => {
    const { googleUrl } = getCalendarLinks();
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
    setSyncSuccess('Opened Google Calendar event scheduler in new tab.');
  };

  const handleOpenOutlook = () => {
    const { outlookUrl } = getCalendarLinks();
    window.open(outlookUrl, '_blank', 'noopener,noreferrer');
    setSyncSuccess('Opened Microsoft Outlook Calendar event scheduler in new tab.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
              <CalendarCheck2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Calendar & Scheduled Jobs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Effortless syncing across Google Calendar and Microsoft Outlook
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Event or Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Invoices Merge & Archive"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Description & Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes on required inputs, formats, or recipients..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-indigo-500" /> Recurrence Cadence
              </label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="none">One-time Task</option>
                <option value="daily">Daily Schedule</option>
                <option value="weekly">Weekly Recurring</option>
                <option value="monthly">Monthly Audit</option>
              </select>
            </div>
          </div>

          {syncSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-none" />
              <span>{syncSuccess}</span>
            </div>
          )}

          {/* Sync Actions Grid */}
          <div className="pt-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Sync Across Calendar Services
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Google Calendar */}
              <button
                type="button"
                onClick={handleOpenGoogle}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800/80 transition-all text-center flex flex-col items-center justify-center gap-1.5 group shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1">
                  Google Calendar <ExternalLink className="w-3 h-3 text-slate-400" />
                </span>
                <span className="text-[10px] text-slate-400">One-click web sync</span>
              </button>

              {/* Microsoft Outlook */}
              <button
                type="button"
                onClick={handleOpenOutlook}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800/80 transition-all text-center flex flex-col items-center justify-center gap-1.5 group shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1">
                  Outlook 365 <ExternalLink className="w-3 h-3 text-slate-400" />
                </span>
                <span className="text-[10px] text-slate-400">Deep link sync</span>
              </button>

              {/* Apple / iCal .ics */}
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800/80 transition-all text-center flex flex-col items-center justify-center gap-1.5 group shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1">
                  Download .ics
                </span>
                <span className="text-[10px] text-slate-400">Apple & all apps</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center text-xs">
          <span className="text-slate-400 text-[11px]">
            Zero-latency schedule sync keeps you on top of batch deadlines.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
