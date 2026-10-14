import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BOOKING_CALENDAR,
  DEFAULT_PHONE_COUNTRY,
  OUTSIDE_AREA_MESSAGE,
  QUOTE_QUESTIONS,
  SERVICE_AREA,
} from '../data/quoteForm.js';
import { SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { newEventId, track } from '../lib/analytics.js';
import { getAttribution } from '../lib/attribution.js';
import { bookSlot, saveLead, trackConversion, utmSource } from '../lib/bookingApi.js';
import { channelFor } from '../lib/channel.js';
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
  // Optional marketing-email consent (CASL): never ticked by default.
  marketingConsent: false,
  // Honeypot. Named so browser autofill never recognises it (a field called
  // 'company' can be autofilled with a saved organisation, which would make the
  // server discard a real lead).
  bb_hp: '',
};

const ALERTS = {
  not_configured: 'Online booking isn’t available right now.',
  slot_unavailable: 'Sorry — that time was just booked by someone else. Please pick another.',
  network_error: 'We couldn’t reach our booking system. Please check your connection and try again.',
  default: 'Something went wrong on our side.',
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

// The marketing-consent checkbox sits outside .form-group, whose input and
// label rules are made for text fields. 16px text (no iOS zoom), a 44px-high
// tap area, and the theme's own colour tokens.
const CONSENT_LABEL_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  minHeight: '44px',
  color: 'var(--text-muted)',
  fontSize: '16px',
  lineHeight: 1.4,
  textAlign: 'left',
  cursor: 'pointer',
};
const CONSENT_BOX_STYLE = {
  flex: 'none',
  width: '20px',
  height: '20px',
  margin: 0,
  accentColor: 'var(--accent-seagreen)',
  cursor: 'pointer',
};

// Validation needs the phone-number library, so it is downloaded on first
// focus or idle time rather than with the page (src/data/leadValidation.js).
// The same module validates on the server, which stays the final check.
let validationModule = null; // promise
let validation = null; // the loaded module
function loadValidation() {
  if (!validationModule) {
    validationModule = import('../data/leadValidation.js').then(
      (mod) => {
        validation = mod;
        return mod;
      },
      (error) => {
        validationModule = null;
        throw error;
      }
    );
  }
  return validationModule;
}

// How long a submit waits for the validation download before sending the lead
// anyway. A slow or stalled download must never hold up saving the lead: the
// server runs the same check and its errors are shown the same way.
const VALIDATION_WAIT_MS = 1500;

/** The validation module, or null if it isn't available within the wait. */
function validationWithin(ms) {
  if (validation) return Promise.resolve(validation);
  let timer;
  const timeout = new Promise((resolve) => {
    timer = window.setTimeout(() => resolve(null), ms);
  });
  return Promise.race([loadValidation().catch(() => null), timeout]).finally(() => window.clearTimeout(timer));
}

/** Shared analytics parameters for this form's events. */
function leadParams(values, attribution) {
  return {
    form_id: 'quote_booking',
    form_page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    renovation_types: values.types,
    lead_channel: channelFor(attribution && (attribution.last || attribution.first)),
  };
}

/**
 * The /free-quote lead form: project details first (saved to GoHighLevel right
 * away, so the lead is kept even if they stop there), then a calendar to book
 * the free on-site visit, then a confirmation. Visitors outside the service
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

  // Fetch the validation module while the visitor reads the form.
  useEffect(() => {
    const preload = () => loadValidation().catch(() => {});
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(preload, { timeout: 4000 })
      : window.setTimeout(preload, 2500);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(idle) : window.clearTimeout(idle));
  }, []);

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

  const fail = (error, stage) => {
    track('booking_error', { form_id: 'quote_booking', error_code: error.code || 'unknown', form_stage: stage });
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
    if (busy) return;
    setAlert(null);
    setBusy(true);
    try {
      // Validate in the browser first (the module is normally preloaded). If
      // it can't be downloaded quickly (slow or flaky connection), the
      // server's identical check decides and its errors are shown the same way.
      const validator = await validationWithin(VALIDATION_WAIT_MS);
      const found = validator && validator.validateLead(values).errors;
      if (found) {
        showErrors(found);
        return;
      }

      const attribution = getAttribution();
      const eventId = newEventId();
      // Everyone's details are saved first. Only then does an out-of-area lead
      // learn we can't take the job — nothing on the form hints at it before.
      const result = await saveLead({ ...values, utmSource: utmSource(), attribution, eventId });
      if (result.inServiceArea === false) {
        track('lead_out_of_area', { ...leadParams(values, attribution), in_service_area: false });
        setStep('outside');
      } else {
        // Only in-area leads count as ad conversions, so Meta optimises for
        // people the crew can actually serve. The event id lets Meta match
        // this with the server's copy (api/_lib/meta.js) and count it once.
        trackConversion('Lead', eventId);
        track('generate_lead', { ...leadParams(values, attribution), in_service_area: true });
        setStep('schedule');
      }
    } catch (error) {
      fail(error, 'details');
    } finally {
      setBusy(false);
    }
  };

  const confirmBooking = async () => {
    if (!slot || busy) return;
    setAlert(null);
    setBusy(true);
    try {
      const attribution = getAttribution();
      const eventId = newEventId();
      const result = await bookSlot({ ...values, utmSource: utmSource(), attribution, eventId, startTime: slot });
      trackConversion('Schedule', eventId);
      track('book_appointment', leadParams(values, attribution));
      setBooking(result.booking?.startTime ? result.booking : { startTime: slot });
      setStep('done');
    } catch (error) {
      fail(error, 'schedule');
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
          Please call us on <a href={SITE_PHONE_TEL}>{SITE_PHONE}</a> and we’ll book you in directly.
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
        <form
          className="quote-form qf-form"
          method="post"
          noValidate
          onSubmit={submitDetails}
          onFocus={() => loadValidation().catch(() => {})}
          ref={formRef}
          data-form-id="quote_booking"
        >
          <div className="booking-card-head">
            <h2 className="qf-title" ref={headingRef} tabIndex={-1}>{title}</h2>
            <p>Takes about a minute. Next, you’ll pick a time for your free on-site visit.</p>
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

          {/* Optional, unticked, never required: express consent to marketing
              emails (CASL). Ticking it only adds a GoHighLevel tag
              (MARKETING_CONSENT_TAG); it never affects saving the lead. */}
          <label htmlFor={`${uid}-marketingConsent`} style={CONSENT_LABEL_STYLE}>
            <input
              type="checkbox"
              id={`${uid}-marketingConsent`}
              name="marketingConsent"
              checked={values.marketingConsent}
              onChange={(event) => setField('marketingConsent', event.target.checked)}
              style={CONSENT_BOX_STYLE}
            />
            <span>Email me occasional renovation tips and offers. Unsubscribe any time.</span>
          </label>

          {/* Honeypot — hidden from people, filled in by bots. */}
          <div className="qf-hp" aria-hidden="true">
            <label>
              Leave this field empty
              <input type="text" name="bb_hp" tabIndex={-1} autoComplete="off" value={values.bb_hp} onChange={(event) => setField('bb_hp', event.target.value)} />
            </label>
          </div>

          {alertBox}

          {/* Not "Next: Pick a Time": an old Meta Event Setup Tool rule on the
              pixel sends a Lead for any button with that text, which would
              double-count the Lead this form sends in submitDetails. */}
          <button type="submit" className="btn-pill-red qf-submit" disabled={busy}>
            {busy ? 'SAVING…' : (<><span>CONTINUE: PICK A TIME</span><ArrowRightIcon size={15} /></>)}
          </button>
          <p className="qf-fineprint">
            No obligation, and we never sell your details. See our <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
        </form>
      )}

      {step === 'schedule' && (
        <div className="qf-schedule">
          <div className="booking-card-head">
            <h2 className="qf-title" ref={headingRef} tabIndex={-1}>Pick a Time for Your Free On-Site Visit</h2>
            <p>
              Thanks{firstName ? `, ${firstName}` : ''} — we have your details. Choose a time for us to visit
              and look at the space with you. Times are in {BOOKING_CALENDAR.timeZoneLabel}.
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
            {busy ? 'BOOKING…' : slot ? (<><span>CONFIRM MY VISIT</span><ArrowRightIcon size={15} /></>) : 'CHOOSE A TIME ABOVE'}
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
            We’ll meet you at <strong>{values.address}</strong> to walk through the space and talk about your project.
          </p>
          <p className="qf-fineprint">
            Need to change the time? Call us on <a href={SITE_PHONE_TEL}>{SITE_PHONE}</a>.
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
            <ChevronLeftIcon size={14} /> My project is in Winnipeg or a nearby community
          </button>
        </div>
      )}
    </div>
  );
}
