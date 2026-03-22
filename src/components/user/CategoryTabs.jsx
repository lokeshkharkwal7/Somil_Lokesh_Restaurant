import { useState, useEffect, useRef, useCallback } from "react";

export default function CategoryTabs({
  categories,
  stickyNavRef,   // ref to MenuPage's sticky wrapper — used to measure true nav height
  lockHeader,     // call before scrolling to pin the header visible
  unlockHeader,   // call after scrolling to restore normal hide-on-scroll behaviour
}) {
  const [selected, setSelected] = useState("");
  const tabsContainerRef = useRef(null);
  const activeTabRef = useRef(null);
  const isProgrammaticScrolling = useRef(false);
  const scrollEndTimer = useRef(null);

  useEffect(() => {
    if (categories?.length) {
      setSelected(categories[0].name);
    }
  }, [categories]);

  // Scroll the active tab pill into view horizontally whenever selection changes
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const activeTab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeTabRect = activeTab.getBoundingClientRect();

      const isVisible =
        activeTabRect.left >= containerRect.left &&
        activeTabRect.right <= containerRect.right;

      if (!isVisible) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selected]);

  // IntersectionObserver: tracks which category is in view during natural scrolling.
  // Suppressed while a tab-click scroll is animating (isProgrammaticScrolling guard).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrolling.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSelected(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(cat.name);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  const scrollTo = useCallback(
    (name) => {
      const el = document.getElementById(name);
      if (!el) return;

      // 1️⃣ Lock the active tab immediately — no flickering while scroll animates
      setSelected(name);
      isProgrammaticScrolling.current = true;
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);

      // 2️⃣ Pin the header visible in MenuPage BEFORE measuring or scrolling.
      //    If the header is mid-hide (CSS transition), locking it now means
      //    it will be fully visible by the time we measure in the next frame.
      lockHeader?.();

      // 3️⃣ Defer the measurement + scroll by one animation frame.
      //
      //    Why: `lockHeader` calls `setHeaderVisible(true)` in MenuPage, which
      //    is a React state update. The CSS transform won't reflect the new value
      //    until the next render + paint cycle. Deferring to rAF ensures we
      //    measure the sticky container AFTER it has snapped back to its fully
      //    visible height, giving us the correct offset every time.
      requestAnimationFrame(() => {
        // ✅ Measure the live rendered height of the sticky nav (header + tabs).
        //    This replaces the hardcoded `140` and adapts automatically to any
        //    future layout changes or when the header is in a transition state.
        const navHeight = (stickyNavRef?.current?.offsetHeight ?? 140) + 15;

        const elementPosition = el.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: elementPosition - navHeight,
          behavior: "smooth",
        });

        // 4️⃣ Lower both guards after the smooth-scroll animation completes.
        //    CSS smooth-scroll has no completion callback, so a timer is used.
        //    800 ms covers typical smooth-scroll durations on any device.
        scrollEndTimer.current = setTimeout(() => {
          isProgrammaticScrolling.current = false;
          unlockHeader?.();
        }, 800);
      });
    },
    [lockHeader, unlockHeader, stickyNavRef]
  );

  useEffect(() => {
    return () => {
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    };
  }, []);

  return (
    <div className="sticky top-0 bg-white z-20 border-b">
      <div
        ref={tabsContainerRef}
        className="flex overflow-x-auto gap-3 px-4 py-3 text-sm font-medium scroll-smooth hide-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((cat) => {
          const isActive = selected === cat.name;

          return (
            <button
              key={cat.name}
              ref={isActive ? activeTabRef : null}
              onClick={() => scrollTo(cat.name)}
              className={`whitespace-nowrap px-4 py-2 rounded-full transition-all flex-shrink-0
                ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}