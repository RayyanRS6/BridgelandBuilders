import { useEffect, useRef, useState } from 'react';
import {
  countryFromInternational,
  countryOptions,
  dialCode,
  flagEmoji,
  formatForDisplay,
  loadPhoneLib,
  phoneLibReady,
} from '../lib/phoneCountries.js';
import { ChevronDownIcon } from './icons.jsx';

const optionLabel = (option) => `${flagEmoji(option.code)} ${option.name} (${option.dial})`;

/**
 * Phone number with a country picker, Canada by default. The picker is a real
 * <select> laid invisibly over the flag and dial code, so phones open their
 * own native country list and keyboards and screen readers get a proper
 * control, while it looks like part of the field.
 *
 * Typing or pasting a number that starts with "+" switches the picker to that
 * number's country automatically. That and the tidy-up on leaving the field
 * use the phone-number library, which is downloaded on first focus (or when
 * the browser is idle) instead of with the page.
 */
export default function PhoneInput({ id, value, country, onChange, onCountryChange, invalid, describedBy }) {
  // The full list is built after hydration (see countryOptions); until then
  // the select holds just the current country, identical on server and client.
  const [options, setOptions] = useState(null);
  const [libReady, setLibReady] = useState(phoneLibReady);
  const latest = useRef({ value, country, onCountryChange });
  latest.current = { value, country, onCountryChange };

  useEffect(() => setOptions(countryOptions()), []);

  const ensureLib = () => {
    if (phoneLibReady()) return;
    loadPhoneLib().then(() => setLibReady(true), () => {});
  };

  // Idle-time preload, so the library is usually there before it's needed.
  useEffect(() => {
    if (phoneLibReady()) return undefined;
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(ensureLib, { timeout: 4000 })
      : window.setTimeout(ensureLib, 2500);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(idle) : window.clearTimeout(idle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A "+…" number typed before the library arrived gets its country now.
  useEffect(() => {
    if (!libReady) return;
    const { value: current, country: picked, onCountryChange: change } = latest.current;
    const detected = countryFromInternational(current);
    if (detected && detected !== picked) change(detected);
  }, [libReady]);

  const handleChange = (event) => {
    // Digits and ordinary phone punctuation only, with "+" allowed at the start.
    const cleaned = event.target.value.replace(/[^\d+()\-.\s]/g, '').replace(/(?!^)\+/g, '');
    onChange(cleaned);
    const detected = countryFromInternational(cleaned);
    if (detected && detected !== country) onCountryChange(detected);
  };

  const northAmerican = country === 'CA' || country === 'US';

  return (
    <div className={`qf-phone${invalid ? ' is-invalid' : ''}`}>
      <div className="qf-phone-country">
        <span className="qf-phone-flag" aria-hidden="true">{flagEmoji(country)}</span>
        <span className="qf-phone-dial" aria-hidden="true">{dialCode(country)}</span>
        <ChevronDownIcon size={14} />
        <select aria-label="Country code" value={country} onChange={(event) => onCountryChange(event.target.value)} onFocus={ensureLib}>
          {options ? (
            <>
              <optgroup label="Most common">
                {options.pinned.map((option) => <option key={option.code} value={option.code}>{optionLabel(option)}</option>)}
              </optgroup>
              <optgroup label="All countries">
                {options.rest.map((option) => <option key={option.code} value={option.code}>{optionLabel(option)}</option>)}
              </optgroup>
            </>
          ) : (
            <option value={country}>{`${flagEmoji(country)} ${dialCode(country)}`}</option>
          )}
        </select>
      </div>
      <input
        id={id}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder={northAmerican ? '(204) 555-0123' : 'Phone number'}
        value={value}
        onChange={handleChange}
        onFocus={ensureLib}
        onBlur={() => onChange(formatForDisplay(value, country))}
        aria-invalid={invalid ? 'true' : undefined}
        aria-describedby={describedBy}
      />
    </div>
  );
}
