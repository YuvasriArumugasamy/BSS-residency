import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollObserver() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        '.fade-up:not(.is-visible), .fade-down:not(.is-visible), .fade-left:not(.is-visible), .fade-right:not(.is-visible), .fade-in:not(.is-visible), .scale-in:not(.is-visible), .slide-up:not(.is-visible)'
      );
      animatedElements.forEach((el) => observer.observe(el));
    };

    // Initial check
    observeElements();

    // Watch for DOM mutations to catch elements rendered slightly later (e.g. from APIs)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
