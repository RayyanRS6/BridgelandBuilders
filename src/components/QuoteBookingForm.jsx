import { useEffect, useId, useRef, useState } from 'react';
import {
  BOOKING_CALENDAR,
  DEFAULT_PHONE_COUNTRY,
  OUTSIDE_AREA_MESSAGE,
  QUOTE_QUESTIONS,
  SERVICE_AREA,
  validateLead,
} from '../data/quoteForm.js';
import { SITE_PHONE } from '../data/siteConfig.js';
import { bookSlot, saveLead, trackConversion, utmSource } from '../lib/bookingApi.js';
import { PRESELECT_EVENT } from '../lib/quoteFormEvents.js';
import { dateIn, formatLongDate, formatTime } from '../lib/zonedDate.js';
import { ArrowRightIcon, CheckIcon, ChevronLeftIcon, PinIcon } from './icons.jsx';
import PhoneInput from './PhoneInput.jsx';
import SlotCalendar from './SlotCalendar.jsx';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  phoneCountry: DEFAULT_PHONE_COUNTRY,
  address: '',
  city: '',
  postalCode: '',
  winnipeg: '',
  types: [],
  company: '',
};

const ALERTS = {
  not_configured: 'Online booking isn’t available right now.',
  slot_unavailable: 'Sorry — that time was just booked by someone else. Please pick another.',
  network_error: 'We couldn’t reach our booking system. Please check your connection and try again.',
  default: 'Something went wrong on our side.',
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

/**
 * The /free-quote lead form: project details first (saved to GoHighLevel right
 * away, so the lead is kept even if they stop there), then a calendar to book
 * the free discovery call, then a confirmation. Visitors outside the service
 * area are saved like everyone else, then told so instead of reaching the
 * calendar. Styled from the site theme.
 */
export default function QuoteBookingForm({ id, title = 'Get Your Free Quote', initialTypes = [] }) {
  const uid = useId();
  const [step, setStep] = useState('details');
  // A service page pre-ticks its own renovation type.
  const [values, setValues] = useState(() => ({ ...EMPTY, types: initialTypes }));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState(null);
  const [slot, setSlot] = useState(null);
  const [booking, setBooking] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const mounted = useRef(false);

  // Move keyboard and screen-reader focus to the new step's heading.
  useEffect(() => {
    if (mounted.current) headingRef.current?.focus();
    mounted.current = true;
  }, [step]);

  useEffect(() => {
    const onPreselect = (event) => {
      setValues((current) =>
        current.types.includes(event.detail) ? current : { ...current, types: [...current.types, event.detail] }
      );
      setErrors((current) => ({ ...current, types: undefined }));
    };
    window.addEventListener(PRESELECT_EVENT, onPreselect);
    return () => window.removeEventListener(PRESELECT_EVENT, onPreselect);
  }, []);

  const setField = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  // Reads the current selection inside the updater, not from this render, so
  // quick successive taps can't overwrite each other.
  const toggleOption = (question, option) => {
    setValues((current) => {
      if (!question.multiple) return { ...current, [question.key]: option };
      const picked = current[question.key];
      const next = picked.includes(option) ? picked.filter((item) => item !== option) : [...picked, option];
      return { ...current, [question.key]: next };
    });
    setErrors((current) => (current[question.key] ? { ...current, [question.key]: undefined } : current));
  };

  const showErrors = (found) => {
    setErrors(found);
    requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"], [data-invalid="true"] button')?.focus());
  };

  const fail = (error) => {
    if (error.code === 'invalid' && error.fields) {
      setStep('details');
      showErrors(error.fields);
      return;
    }
    if (error.code === 'outside_service_area') return setStep('outside');
    setAlert({ message: ALERTS[error.code] || ALERTS.default, offerPhone: error.code !== 'slot_unavailable' });
  };

  const submitDetails = async (event) => {
    event.preventDefault();
    setAlert(null);
    const { errors: found } = validateLead(values);
    if (found) return showErrors(found);

    setBusy(true);
    try {
      // Everyone's details are saved first. Only then does an out-of-area lead
      // learn we can't take the job — nothing on the form hints at it before.
      const result = await saveLead({ ...values, utmSource: utmSource() });
      if (result.inServiceArea === false) {
        setStep('outside');
      } else {
        // Only in-area leads count as ad conversions, so Meta optimises for
        // people the crew can actually serve.
        trackConversion('Lead');
        setStep('schedule');
      }
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  const confirmBooking = async () => {
    if (!slot || busy) return;
    setAlert(null);
    setBusy(true);
    try {
      const result = await bookSlot({ ...values, utmSource: utmSource(), startTime: slot });
      trackConversion('Schedule');
      setBooking(result.booking?.startTime ? result.booking : { startTime: slot });
      setStep('done');
    } catch (error) {
      fail(error);
      if (error.code === 'slot_unavailable') {
        setSlot(null);
        setRefreshKey((key) => key + 1);
      }
    } finally {
      setBusy(false);
    }
  };

  const fieldProps = (key) => ({
    id: `${uid}-${key}`,
    name: key,
    value: values[key],
    onChange: (event) => setField(key, event.target.value),
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
  });

  const fieldError = (key) =>
    errors[key] ? <p className="qf-field-error" id={`${uid}-${key}-error`}>{errors[key]}</p> : null;

  const alertBox = alert && (
    <div className="qf-alert" role="alert">
      <p>{alert.message}</p>
      {alert.offerPhone && (
        <p>
          Please call us on <a href={`tel:${SITE_PHONE}`}>{SITE_PHONE}</a> and we’ll book you in directly.
        </p>
      )}
    </div>
  );

  const tz = BOOKING_CALENDAR.timeZone;
  const firstName = values.name.trim().split(/\s+/)[0];

  return (
    <div className="booking-card qf" id={id}>
      {step !== 'outside' && (
        <ol className="qf-steps">
          <li className={step === 'details' ? 'is-current' : 'is-done'}>
            <span>{step === 'details' ? '1' : <CheckIcon size={11} />}</span>Your project
          </li>
          <li className={cx(step === 'schedule' && 'is-current', step === 'done' && 'is-done')}>
            <span>{step === 'done' ? <CheckIcon size={11} /> : '2'}</span>Pick a time
          </li>
        </ol>
      )}

      {step === 'details' && (
        <form className="quote-form qf-form" method="post" noValidate onSubmit={submitDetails} ref={formRef}>
          <div className="booking-card-head">
            <h2 className="qf-title" ref={headingRef} tabIndex={-1}>{title}</h2>
            <p>Takes about a minute. Next, you’ll pick a time for a free {BOOKING_CALENDAR.durationMinutes}-minute call.</p>
          </div>

          <div className="form-group">
            <label htmlFor={`${uid}-name`}>Full name</label>
            <input type="text" autoComplete="name" placeholder="Your full name" {...fieldProps('name')} />
            {fieldError('name')}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`${uid}-email`}>Email</label>
              <input type="email" autoComplete="email" inputMode="email" placeholder="you@email.com" {...fieldProps('email')} />
              {fieldError('email')}
            </div>
            <div className="form-group">
              <label htmlFor={`${uid}-phone`}>Phone</label>
              <PhoneInput
                id={`${uid}-phone`}
                value={values.phone}
                country={values.phoneCountry}
                onChange={(phone) => setField('phone', phone)}
                onCountryChange={(code) => setField('phoneCountry', code)}
                invalid={Boolean(errors.phone)}
                describedBy={errors.phone ? `${uid}-phone-error` : undefined}
              />
              {fieldError('phone')}
            </div>
          </div>

          {/* Where the free on-site visit happens. */}
          <div className="form-group">
            <label htmlFor={`${uid}-address`}>Project address</label>
            <input type="text" autoComplete="address-line1" placeholder="Street address" {...fieldProps('address')} />
            {fieldError('address')}
          </div>

          <div className="form-row qf-address-row">
            <div className="form-group">
              <label htmlFor={`${uid}-city`}>City</label>
              <input type="text" autoComplete="address-level2" placeholder="Winnipeg" {...fieldProps('city')} />
              {fieldError('city')}
            </div>
            <div className="form-group">
              <label htmlFor={`${uid}-postalCode`}>Postal code</label>
              <input type="text" autoComplete="postal-code" autoCapitalize="characters" placeholder="Optional" {...fieldProps('postalCode')} />
              {fieldError('postalCode')}
            </div>
          </div>

          {QUOTE_QUESTIONS.map((question) => {
            const labelId = `${uid}-${question.key}-label`;
            return (
              <div className="form-group" key={question.key}>
                <span className="qf-label" id={labelId}>
                  {question.label}
                  {question.hint && <small>{question.hint}</small>}
                </span>
                <div
                  className="qf-chips"
                  role={question.multiple ? 'group' : 'radiogroup'}
                  aria-labelledby={labelId}
                  aria-describedby={errors[question.key] ? `${uid}-${question.key}-error` : undefined}
                  data-invalid={errors[question.key] ? 'true' : undefined}
                >
                  {question.options.map((option) => {
                    const selected = question.multiple
                      ? values[question.key].includes(option)
                      : values[question.key] === option;
                    return (
                      <button
                        type="button"
                        key={option}
                        className={cx('qf-chip', selected && 'is-selected')}
                        {...(question.multiple
                          ? { 'aria-pressed': selected }
                          : { role: 'radio', 'aria-checked': selected })}
                        onClick={() => toggleOption(question, option)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {fieldError(question.key)}
              </div>
            );
          })}

          {/* Honeypot — hidden from people, filled in by bots. */}
          <div className="qf-hp" aria-hidden="true">
            <label>
              Company
              <input type="text" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={(event) => setField('company', event.target.value)} />
            </label>
          </div>

          {alertBox}

          <button type="submit" className="btn-pill-red qf-submit" disabled={busy}>
            {busy ? 'SAVING…' : (<><span>NEXT: PICK A TIME</span><ArrowRightIcon size={15} /></>)}
          </button>
          <p className="qf-fineprint">No obligation. We only use your details to get back to you about this project.</p>
        </form>
      )}

      {step === 'schedule' && (
        <div className="qf-schedule">
          <div className="booking-card-head">
            <h2 className="qf-title" ref={headingRef} tabIndex={-1}>Pick a Time for Your Free Call</h2>
            <p>
              Thanks{firstName ? `, ${firstName}` : ''} — we have your details. Choose a time for a free
              {' '}{BOOKING_CALENDAR.durationMinutes}-minute call. Times are in {BOOKING_CALENDAR.timeZoneLabel}.
            </p>
          </div>

          <SlotCalendar timeZone={tz} selectedSlot={slot} onSelectSlot={setSlot} refreshKey={refreshKey} />

          {slot && (
            <p className="qf-selected">
              <CheckIcon size={15} />
              {formatLongDate(dateIn(slot, tz))} at {formatTime(slot, tz)}
            </p>
          )}

          {alertBox}

          <button type="button" className="btn-pill-red qf-submit" disabled={!slot || busy} onClick={confirmBooking}>
            {busy ? 'BOOKING…' : slot ? (<><span>CONFIRM MY CALL</span><ArrowRightIcon size={15} /></>) : 'CHOOSE A TIME ABOVE'}
          </button>

          <button type="button" className="qf-text-btn qf-back" onClick={() => { setAlert(null); setStep('details'); }}>
            <ChevronLeftIcon size={14} /> Edit my details
          </button>
          <p className="qf-fineprint">
            Rather not book now? That’s fine — we have your details and will get back to you within one business day.
          </p>
        </div>
      )}

      {step === 'done' && booking && (
        <div className="qf-done">
          <span className="qf-done-icon"><CheckIcon size={26} /></span>
          <h2 className="qf-title" ref={headingRef} tabIndex={-1}>You’re Booked!</h2>
          <p className="qf-done-when">
            {formatLongDate(dateIn(booking.startTime, tz))} at {formatTime(booking.startTime, tz)}
            <small>{BOOKING_CALENDAR.timeZoneLabel}</small>
          </p>
          <p>
            We’ll call you on <strong>{values.phone}</strong> for a quick chat about your project.
          </p>
          <p className="qf-fineprint">
            Need to change the time? Call us on <a href={`tel:${SITE_PHONE}`}>{SITE_PHONE}</a>.
          </p>
        </div>
      )}

      {step === 'outside' && (
        <div className="qf-done qf-outside">
          <span className="qf-done-icon"><PinIcon size={26} /></span>
          <h2 className="qf-title" ref={headingRef} tabIndex={-1}>We’re Not in Your Area Yet</h2>
          <p>{OUTSIDE_AREA_MESSAGE}</p>
          <p>Thank you for thinking of Bridgeland Builders.</p>
          <button
            type="button"
            className="qf-text-btn qf-back"
            onClick={() => {
              setField(SERVICE_AREA.key, SERVICE_AREA.inArea);
              setStep('details');
            }}
          >
            <ChevronLeftIcon size={14} /> My project is in Winnipeg or Manitoba
          </button>
        </div>
      )}
    </div>
  );
}
