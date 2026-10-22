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
 * SSR: the fields are uncontrolled (defaultValue), so the prerendered form is
 * usable before hydration and anything typed by then is kept; results are
 * read from the form on mount and on every input. No field has a name and
 * there is no submit button, so the form never submits values into a URL,
 * and nothing typed is stored or sent.
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

const benchmarkById = (id) => BENCHMARKS.find((item) => item.id === id) || BENCHMARKS[1];

/** A typed amount as a number ("$45,000" → 45000); blank or unreadable → null. */
function amount(value) {
  const cleaned = String(value || '').replace(/[^0-9.]/g, '');
  if (!cleaned) return null;
  const number = Number.parseFloat(cleaned);
  return Number.isFinite(number) ? number : null;
}

/**
 * Whole dollars with thousands separators, written out by hand so the server
 * and the browser always format alike (no Intl/ICU differences at hydration).
 */
function dollars(value) {
  const whole = String(Math.round(Math.abs(value))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${value < 0 ? '−' : ''}$${whole}`;
}

/** The three results from the form's values (amounts, or null when blank). */
function results({ cost, rent, utilities, insurance, maintenance, vacancy }) {
  const vacancyShare = Math.min(Math.max(vacancy || 0, 0), 100) / 100;
  const net = rent == null ? null : rent * (1 - vacancyShare) - (utilities || 0) - (insurance || 0) - (maintenance || 0);
  const hasCost = cost != null && cost > 0;
  return {
    grossYield: hasCost && rent != null ? `${((rent * 12 * 100) / cost).toFixed(1)}% a year` : null,
    net: net == null ? null : `${dollars(net)} a month`,
    payback:
      !hasCost || net == null ? null : net > 0 ? `${(cost / (net * 12)).toFixed(1)} years` : 'No payback at these numbers',
  };
}

// Spans, not a list: an <output> holds phrasing content only.
function Result({ label, value, empty }) {
  return (
    <span className="suite-calc-result">
      <span className="suite-calc-label">{label}</span>{' '}
      <span className={value ? 'suite-calc-value' : 'suite-calc-value is-empty'}>{value || empty}</span>
    </span>
  );
}

export default function SuitePaybackCalculator({ idPrefix = 'suite-payback' }) {
  const formRef = useRef(null);
  const id = (name) => `${idPrefix}-${name}`;
  const [benchmarkId, setBenchmarkId] = useState(DEFAULT_BENCHMARK);
  const [values, setValues] = useState(() => results({ rent: benchmarkById(DEFAULT_BENCHMARK).rent }));
  const benchmark = benchmarkById(benchmarkId);

  // Reads every field (by id: the fields carry no name) and recomputes.
  const update = () => {
    const form = formRef.current;
    if (!form) return;
    const read = Object.fromEntries(FIELDS.map((name) => [name, amount(form.elements.namedItem(id(name))?.value)]));
    setValues(results(read));
  };

  // Picking a unit type refills the rent with that CMHC average.
  const chooseBenchmark = (event) => {
    const next = benchmarkById(event.target.value);
    setBenchmarkId(next.id);
    const rent = formRef.current && formRef.current.elements.namedItem(id('rent'));
    if (rent) rent.value = String(next.rent);
    update();
  };

  // Anything typed before hydration counts too.
  useEffect(() => {
    const select = formRef.current && formRef.current.elements.namedItem(id('type'));
    if (select && select.value !== DEFAULT_BENCHMARK) setBenchmarkId(benchmarkById(select.value).id);
    update();
  }, []);

  return (
    <form
      className="suite-calc"
      ref={formRef}
      onInput={update}
      onSubmit={(event) => event.preventDefault()}
      noValidate
      aria-label="Basement suite payback calculator"
      data-form-id="suite-payback-calculator"
    >
      <div className="form-row">
        <div className="form-group">
          <label htmlFor={id('cost')}>Build cost ($)</label>
          <input id={id('cost')} type="text" inputMode="decimal" autoComplete="off" placeholder="Total from your quote" aria-describedby={id('cost-hint')} />
          <p className="suite-calc-hint" id={id('cost-hint')}>Use the total from a written quote for your suite. We don’t publish suite prices.</p>
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
          Prefilled with CMHC’s October 2025 average rent for a {benchmark.words} purpose-built apartment in Winnipeg ({dollars(benchmark.rent)}).
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
        <Result label="Gross yield" value={values.grossYield} empty="Add your build cost" />
        <Result label="Net monthly income" value={values.net} empty="Add a monthly rent" />
        <Result label="Simple payback" value={values.payback} empty="Add your build cost" />
      </output>

      <p className="suite-calc-note">
        Simple payback ignores financing, interest, tax, rent increases and any change in your home’s value. It’s a
        planning estimate, not financial advice. Nothing you type here is saved or sent.
      </p>
    </form>
  );
}
