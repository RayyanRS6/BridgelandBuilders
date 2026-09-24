import { useEffect, useMemo, useState } from 'react';
import { fetchSlots } from '../lib/bookingApi.js';
import {
  dateIn,
  daysInMonth,
  formatLongDate,
  formatMonth,
  formatTime,
  monthGrid,
  shiftMonth,
  todayIn,
} from '../lib/zonedDate.js';
import { ChevronLeftIcon, ChevronRightIcon } from './icons.jsx';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
// How far ahead a visitor can browse: this month plus the next two.
const MONTHS_AHEAD = 2;

const cx = (...classes) => classes.filter(Boolean).join(' ');
const monthKeyOf = ({ year, month }) => `${year}-${String(month).padStart(2, '0')}`;

/**
 * Month view of open discovery-call times from the GoHighLevel calendar, with
 * the chosen day's times listed underneath. Everything is shown in `timeZone`.
 * Bump `refreshKey` to re-fetch (e.g. after a slot was taken by someone else).
 */
export default function SlotCalendar({ timeZone, selectedSlot, onSelectSlot, refreshKey = 0 }) {
  const today = useMemo(() => todayIn(timeZone), [timeZone]);
  const firstMonth = useMemo(() => ({ year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) }), [today]);
  const lastMonth = useMemo(() => shiftMonth(firstMonth, MONTHS_AHEAD), [firstMonth]);

  const [view, setView] = useState(firstMonth);
  const [days, setDays] = useState(null);
  const [status, setStatus] = useState('loading');
  const [selectedDate, setSelectedDate] = useState(selectedSlot ? dateIn(selectedSlot, timeZone) : null);
  const [autoAdvanced, setAutoAdvanced] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const monthKey = monthKeyOf(view);
  const isFirstMonth = monthKey === monthKeyOf(firstMonth);
  const isLastMonth = monthKey === monthKeyOf(lastMonth);

  useEffect(() => {
    const controller = new AbortController();
    const start = isFirstMonth ? today : `${monthKey}-01`;
    const end = `${monthKey}-${daysInMonth(view.year, view.month)}`;
    setStatus('loading');
    setDays(null);
    fetchSlots(start, end, controller.signal)
      .then((data) => {
        setDays(data.days || {});
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error');
      });
    return () => controller.abort();
  }, [monthKey, isFirstMonth, today, view.year, view.month, refreshKey, retryKey]);

  const selectDate = (date) => {
    setSelectedDate(date);
    if (selectedSlot && dateIn(selectedSlot, timeZone) !== date) onSelectSlot(null);
  };

  // Once a month loads, open its first available day so times show straight
  // away. If the rest of this month is fully booked, move on to next month once.
  useEffect(() => {
    if (status !== 'ready' || !days) return;
    const available = Object.keys(days).sort();
    if (!available.length) {
      if (isFirstMonth && !autoAdvanced) {
        setAutoAdvanced(true);
        setView((current) => shiftMonth(current, 1));
      }
      return;
    }
    if (!selectedDate || !days[selectedDate]) selectDate(available[0]);
  }, [status, days]);

  const cells = monthGrid(view.year, view.month);
  const times = status === 'ready' && selectedDate && days?.[selectedDate];
  const monthLabel = formatMonth(view.year, view.month);

  return (
    <div className="qf-calendar">
      <div className="qf-cal-head">
        <button
          type="button"
          className="qf-cal-nav"
          onClick={() => setView((current) => shiftMonth(current, -1))}
          disabled={isFirstMonth}
          aria-label="Previous month"
        >
          <ChevronLeftIcon size={16} />
        </button>
        <strong className="qf-cal-month" aria-live="polite">{monthLabel}</strong>
        <button
          type="button"
          className="qf-cal-nav"
          onClick={() => setView((current) => shiftMonth(current, 1))}
          disabled={isLastMonth}
          aria-label="Next month"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>

      <div className={cx('qf-cal-grid', status === 'loading' && 'is-loading')} role="group" aria-label={monthLabel}>
        {WEEKDAYS.map((label, index) => (
          <span className="qf-cal-weekday" aria-hidden="true" key={`weekday-${index}`}>{label}</span>
        ))}
        {cells.map((date, index) => {
          if (!date) return <span className="qf-day-pad" aria-hidden="true" key={`pad-${index}`} />;
          const open = Boolean(days?.[date]);
          return (
            <button
              type="button"
              key={date}
              className={cx('qf-day', open && 'is-open', date === selectedDate && 'is-selected', date === today && 'is-today')}
              disabled={!open}
              aria-pressed={date === selectedDate}
              aria-label={`${formatLongDate(date)}${open ? '' : ', no times available'}`}
              onClick={() => selectDate(date)}
            >
              {Number(date.slice(8))}
            </button>
          );
        })}
      </div>

      <div className="qf-cal-status" aria-live="polite">
        {status === 'loading' && <p>Loading available times…</p>}
        {status === 'error' && (
          <p>
            We couldn’t load the calendar.{' '}
            <button type="button" className="qf-text-btn" onClick={() => setRetryKey((key) => key + 1)}>Try again</button>
          </p>
        )}
        {status === 'ready' && days && !Object.keys(days).length && (
          <p>No open times left in {monthLabel}.{isLastMonth ? '' : ' Try the next month.'}</p>
        )}
      </div>

      {times && (
        <div className="qf-slots">
          <p className="qf-slots-title">{formatLongDate(selectedDate)}</p>
          <div className="qf-slot-grid" role="radiogroup" aria-label={`Times on ${formatLongDate(selectedDate)}`}>
            {times.map((iso) => (
              <button
                type="button"
                role="radio"
                aria-checked={iso === selectedSlot}
                key={iso}
                className={cx('qf-slot', iso === selectedSlot && 'is-selected')}
                onClick={() => onSelectSlot(iso)}
              >
                {formatTime(iso, timeZone)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
