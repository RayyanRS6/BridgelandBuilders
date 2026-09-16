import { useEffect, useRef } from 'react';

const MIN_HEIGHT = 500;
const MAX_HEIGHT = 5000;

export default function EstimatorEmbed({ src, title = 'EstimatorX360 renovation estimator' }) {
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const frameOrigin = new URL(src).origin;
    const handleResize = (event) => {
      if (event.source !== frame.contentWindow || event.origin !== frameOrigin) return;
      if (event.data?.type !== 'automatex360:resize') return;

      const height = Number(event.data.height);
      if (Number.isFinite(height)) {
        frame.style.height = `${Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, height))}px`;
      }
    };

    window.addEventListener('message', handleResize);
    return () => window.removeEventListener('message', handleResize);
  }, [src]);

  return (
    <iframe
      ref={frameRef}
      className="estimator-embed"
      src={src}
      width="100%"
      height="760"
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer"
      sandbox="allow-forms allow-scripts allow-same-origin"
      scrolling="no"
    />
  );
}
