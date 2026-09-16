import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Landing on "/#services" from another page needs to scroll to that section;
// landing on a new page with no hash should start at the top.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
