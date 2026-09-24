import { useEffect, useState } from 'react';
import { countryFromInternational, countryOptions, dialCode, flagEmoji, formatForDisplay } from '../lib/phoneCountries.js';
import { ChevronDownIcon } from './icons.jsx';

const optionLabel = (option) => `${flagEmoji(option.code)} ${option.name} (${option.dial})`;

/**
 * Phone number with a country picker, Canada by default. The picker is a real
 * <select> laid invisibly over the flag and dial code, so phones open their
 * own native country list and keyboards and screen readers get a proper
 * control, while it looks like part of the field.
 *
 * Typing or pasting a number that starts with "+" switches the picker to that
 * number's country automatically.
 */
export default function PhoneInput({ id, value, country, onChange, onCountryChange, invalid, describedBy }) {
  // The full list is built after hydration (see countryOptions); until then
  // the select holds just the current country, identical on server and client.
  const [options, setOptions] = useState(null);
  useEffect(() => setOptions(countryOptions()), []);

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
        <select aria-label="Country code" value={country} onChange={(event) => onCountryChange(event.target.value)}>
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
        onBlur={() => onChange(formatForDisplay(value, country))}
        aria-invalid={invalid ? 'true' : undefined}
        aria-describedby={describedBy}
      />
    </div>
  );
}
