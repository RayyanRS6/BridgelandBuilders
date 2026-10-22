import { useEffect, useRef, useState } from 'react';

/**
 * Basement suite payback calculator: a post body's {"t": "calculator", "id":
 * "suite-payback"} block and the rental section of /services/basement-suites.
 * Loaded lazily through Calculator.jsx, so no other page downloads it.
 *
 * The visitor enters their own build cost (from a written quote: there is no
 * default, because the site publishes no suite prices) and a monthly rent,
 * prefilled with CMHC's October 2025 Winnipeg average for the chosen unit
 * type. Monthly costs and vacancy are optional. It shows gross yield, net
 * monthly income and simple payback, and nothing it can't work out from
 * those numbers (no financing, tax or resale value).
 *
 * SSR: the fields are uncontrolled (defaultValue), so the prerendered fields
 * are usable before hydration and anything typed by then is kept; results are
 * read from the fields on mount and after each pause in typing (debounced, so
 * the aria-live region isn't re-announced on every keystroke).
 *
 * A labelled group of fields, not a <form>: nothing can be submitted, so no
 * value can end up in a URL, nothing typed is stored or sent, and focusing a
 * field doesn't count as a lead-form start (AnalyticsListeners form_start).
 */

// CMHC Rental Market Survey, October 2025, Winnipeg CMA, private
// (purpose-built) apartments: Table 1.1.2 average rents, Table 1.1.1 total
// vacancy rate (verified 2026-10-23). CMHC does not survey basement suites,
// so these are a benchmark, never presented as suite rents.
const BENCHMARKS = [
  { id: 'bachelor', label: 'Bachelor (studio)', words: 'bachelor (studio)', rent: 915 },
  { id: 'one-bedroom', label: 'One bedroom', words: 'one-bedroom', rent: 1232 },
  { id: 'two-bedroom', label: 'Two bedrooms', words: 'two-bedroom', rent: 1571 },
];
const DEFAULT_BENCHMARK = 'one-bedroom';
const CMHC_VACANCY = '2.8%';

const FIELDS = ['cost', 'rent', 'utilities', 'insurance', 'maintenance', 'vacancy'];
// Larger amounts are treated as typing mistakes, so no result runs to
// exponent notation.
const MAX_AMOUNT = 100000000;
const TYPING_PAUSE_MS = 400;

const benchmarkById = (id) => BENCHMARKS.find((item) => item.id === id) || BENCHMARKS[1];

/**
 * A typed amount as a number ("$45,000" → 45000; "2,8" → 2.8, a decimal comma
 * as on a French-Canadian keypad). Blank → null; unreadable (letters, a minus
 * sign, more than MAX_AMOUNT) → NaN.
 */
function amount(value) {
  const text = String(value || '')
    .replace(/[\s$%]/g, '')
    .replace(/,(\d{1,2})$/, '.$1')
    .replace(/,/g, '');
  if (!text) return null;
  if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) return NaN;
  const number = Number(text);
  return number <= MAX_AMOUNT ? number : NaN;
}

/**
 * Whole dollars with thousands separators, written out by hand so the server
 * and the browser always format alike (no Intl/ICU differences at hydration).
 */
function dollars(value) {
  const whole = String(Math.round(Math.abs(value))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${value < 0 ? '−' : ''}$${whole}`;
}

/**
 * The three results from the form's values: each is { value } or, when a
 * field it needs is blank or unreadable, { empty } saying which one.
 */
function results({ cost, rent, utilities, insurance, maintenance, vacancy }) {
  const costIssue = Number.isNaN(cost) ? 'Check your build cost' : cost == null || cost < 1 ? 'Add your build cost' : null;
  const rentIssue = Number.isNaN(rent) ? 'Check the monthly rent' : rent == null ? 'Add a monthly rent' : null;
  const extras = [utilities, insurance, maintenance];
  const extrasIssue = extras.some(Number.isNaN) || Number.isNaN(vacancy) || vacancy > 100 ? 'Check the optional fields' : null;
  const netIssue = rentIssue || extrasIssue;
  // Whole dollars, so a net that shows as $0 never counts as a payback.
  const net = netIssue
    ? null
    : Math.round(rent * (1 - (vacancy || 0) / 100) - extras.reduce((sum, item) => sum + (item || 0), 0));
  return {
    grossYield: costIssue || rentIssue ? { empty: costIssue || rentIssue } : { value: `${((rent * 12 * 100) / cost).toFixed(1)}% a year` },
    net: netIssue ? { empty: netIssue } : { value: `${dollars(net)} a month` },
    payback:
      costIssue || netIssue
        ? { empty: costIssue || netIssue }
        : { value: net > 0 ? `${(cost / (net * 12)).toFixed(1)} years` : 'No payback at these numbers' },
  };
}

// Spans, not a list: an <output> holds phrasing content only.
function Result({ label, result }) {
  return (
    <span className="suite-calc-result">
      <span className="suite-calc-label">{label}</span>{' '}
      <span className={result.value ? 'suite-calc-value' : 'suite-calc-value is-empty'}>{result.value || result.empty}</span>
    </span>
  );
}

export default function SuitePaybackCalculator({ idPrefix = 'suite-payback' }) {
  const timer = useRef(0);
  const id = (name) => `${idPrefix}-${name}`;
  const field = (name) => document.getElementById(id(name));
  const [benchmarkId, setBenchmarkId] = useState(DEFAULT_BENCHMARK);
  const [values, setValues] = useState(() => results({ rent: benchmarkById(DEFAULT_BENCHMARK).rent }));
  const benchmark = benchmarkById(benchmarkId);

  // Reads every field (by id: the fields carry no name) and recomputes.
  const update = () => {
    window.clearTimeout(timer.current);
    const read = Object.fromEntries(FIELDS.map((name) => [name, amount(field(name)?.value)]));
    setValues(results(read));
  };
  const updateAfterPause = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(update, TYPING_PAUSE_MS);
  };

  // A unit type's CMHC average goes into the rent field only while it is
  // blank or still holds one of the averages, never over a rent the visitor
  // typed.
  const fillRent = (next) => {
    const rent = field('rent');
    const typed = rent ? amount(rent.value) : null;
    if (rent && (typed == null || BENCHMARKS.some((item) => item.rent === typed))) rent.value = String(next.rent);
  };

  const chooseBenchmark = (event) => {
    const next = benchmarkById(event.target.value);
    setBenchmarkId(next.id);
    fillRent(next);
    update();
  };

  // Anything typed or picked before hydration counts too.
  useEffect(() => {
    const select = field('type');
    if (select && select.value !== DEFAULT_BENCHMARK) {
      const next = benchmarkById(select.value);
      setBenchmarkId(next.id);
      fillRent(next);
    }
    update();
    return () => window.clearTimeout(timer.current);
  }, []);

  return (
    <div className="suite-calc" role="group" aria-label="Basement suite payback calculator" onInput={updateAfterPause}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor={id('cost')}>Build cost ($)</label>
          <input id={id('cost')} type="text" inputMode="decimal" autoComplete="off" placeholder="Total from your quote" aria-describedby={id('cost-hint')} />
          <p className="suite-calc-hint" id={id('cost-hint')}>
            Use the total from a written quote for your suite. Our instant price guide shows basement-development ranges, not suite prices.
          </p>
        </div>
        <div className="form-group">
          <label htmlFor={id('type')}>Unit type</label>
          <select id={id('type')} defaultValue={DEFAULT_BENCHMARK} onChange={chooseBenchmark} aria-describedby={id('rent-hint')}>
            {BENCHMARKS.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={id('rent')}>Monthly rent ($)</label>
        <input id={id('rent')} type="text" inputMode="decimal" autoComplete="off" defaultValue={String(benchmarkById(DEFAULT_BENCHMARK).rent)} aria-describedby={id('rent-hint')} />
        <p className="suite-calc-hint" id={id('rent-hint')}>
          Starting figure: CMHC’s October 2025 average rent for a {benchmark.words} purpose-built apartment in Winnipeg ({dollars(benchmark.rent)}).
          CMHC doesn’t survey basement suites, so check local listings and enter the rent you expect.
        </p>
      </div>

      <fieldset className="suite-calc-optional">
        <legend>Optional: monthly costs you’ll pay, and vacancy</legend>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor={id('utilities')}>Utilities ($ a month)</label>
            <input id={id('utilities')} type="text" inputMode="decimal" autoComplete="off" placeholder="0" />
          </div>
          <div className="form-group">
            <label htmlFor={id('insurance')}>Added insurance ($ a month)</label>
            <input id={id('insurance')} type="text" inputMode="decimal" autoComplete="off" placeholder="0" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor={id('maintenance')}>Maintenance ($ a month)</label>
            <input id={id('maintenance')} type="text" inputMode="decimal" autoComplete="off" placeholder="0" />
          </div>
          <div className="form-group">
            <label htmlFor={id('vacancy')}>Vacancy (%)</label>
            <input id={id('vacancy')} type="text" inputMode="decimal" autoComplete="off" placeholder="0" aria-describedby={id('vacancy-hint')} />
          </div>
        </div>
        <p className="suite-calc-hint" id={id('vacancy-hint')}>
          CMHC’s October 2025 vacancy rate for Winnipeg purpose-built apartments was {CMHC_VACANCY}.
        </p>
      </fieldset>

      <output className="suite-calc-results" htmlFor={FIELDS.map(id).join(' ')} aria-live="polite">
        <Result label="Gross yield" result={values.grossYield} />
        <Result label="Net monthly income" result={values.net} />
        <Result label="Simple payback" result={values.payback} />
      </output>

      <p className="suite-calc-note">
        Simple payback ignores financing, interest, tax, rent increases and any change in your home’s value. It’s a
        planning estimate, not financial advice. Nothing you type here is saved or sent.
      </p>
    </div>
  );
}
