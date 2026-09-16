const STEPS = [
  {
    num: '01',
    title: 'Experience You Can Trust',
    text: 'We’ve been at this a long time — more than 60 years of combined experience. We’ve done all kinds of jobs — from patching up little things to tearing down walls and starting fresh. After this many years, not much surprises us. And if something unexpected comes up — because it usually does — we sort it out and keep the project moving.',
  },
  {
    num: '02',
    title: 'Customer Satisfaction',
    text: 'The best part of this work isn’t just finishing a project — it’s seeing the smile when people walk into their new space for the first time. Over the years, we’ve built kitchens, offices, bathrooms, basements — but more importantly, we’ve built trust. Many of our customers call us back for their next job, and that means a lot.',
  },
  {
    num: '03',
    title: 'Quality Work, No Shortcuts',
    text: 'We don’t believe in quick fixes or cutting corners. If we’re building it, it’s built to last. We use good materials, take our time on the details, and do it the right way — even when no one’s looking.',
  },
  {
    num: '04',
    title: 'Built Around You',
    text: 'Every project starts with a talk. Give us your wish list and the pain points. We’ll sort out a simple plan with you and get it done, no fuss. Simple as that.',
  },
];

export default function Process() {
  return (
    <section className="process-section" id="process">
      <div className="container">
        <div className="section-header center reveal">
          <span className="section-tag">How We Work</span>
          <h2 className="section-title">Our Process</h2>
          <p className="section-desc">Reliable, step-by-step care from our Winnipeg team to your doorstep.</p>
        </div>

        <div className="process-grid">
          {STEPS.map((step, index) => (
            <div
              className="process-card reveal"
              key={step.num}
              style={index > 0 ? { transitionDelay: `${index * 0.1}s` } : undefined}
            >
              <div className="process-step-num">{step.num}</div>
              <h3 className="process-card-title">{step.title}</h3>
              <p className="process-card-text">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
