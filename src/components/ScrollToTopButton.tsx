'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 120);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      title='Scroll to Top'
      className="fixed bottom-6 right-6 z-40 bg-[#dfad0a] hover:bg-[#9d7a20] p-3 rounded-full shadow-md cursor-pointer !overflow-hidden"
    >
      <ArrowUp className="w-5 h-5 dark:text-black" />
    </button>
  );
}
