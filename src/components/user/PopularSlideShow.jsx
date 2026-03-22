// PopularSlideshow.jsx
import { useRef, useState } from "react";
import AddButton from "./AddButton";
import VegBadge from "./VegBadge";

/* Icons */
const IconStar = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const IconLongArrow = () => (
  <svg
    width="28"
    height="14"
    viewBox="0 0 28 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-stone-400"
  >
    {/* Solid line - shorter */}
    <path
      d="M2 7H20"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Arrow head */}
    <path
      d="M20 4L25 7L20 10"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Slight fade at start */}
    <path
      d="M2 7C2 7 1 7 0 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeOpacity="0.2"
      strokeLinecap="round"
    />
  </svg>
);

/* Card */
function PopularCard({ item, onDetails, onCustomize }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={`
        relative flex-shrink-0 w-44 rounded-2xl bg-white
        transition-all duration-200 ease-out
        ${isPressed ? "scale-[0.98] opacity-90" : "scale-100"}
        cursor-pointer
      `}
      style={{
        boxShadow: isPressed
          ? "0 2px 8px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)"
          : "0 4px 12px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.02)",
      }}
      onClick={() => onDetails(item)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Image Container - Now 50% width with rounded corners */}
 <div className="relative w-full pt-[80%] bg-stone-50 rounded-2xl">
  <div className="absolute inset-0 p-3">
    
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md">

      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
          <span className="text-2xl opacity-30">🍽️</span>
        </div>
      )}

      {/* Popular badge */}
      <div className="absolute top-1 left-1 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-amber-500 text-[9px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm border border-white/50">
        <IconStar />
      </div>

    </div>

  </div>
</div>

      {/* Content */}
      <div className="px-3 pt-1 pb-3 flex flex-col">
        {/* Top row with Details button only */}
        <div className="flex items-start gap-1 mb-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetails(item);
            }}
            className="text-[10px] text-stone-400 px-1.5 py-0.5 border border-stone-200 rounded-sm whitespace-nowrap shrink-0 w-39 text-center"
          >
            View
          </button>
        </div>

        {/* Title with VegBadge */}
        <div className="flex gap-2 mb-5">
          <div className="shrink-0">
            <VegBadge isVeg={item.isVeg} />
          </div>
          <h4 className="text-[15px] font-bold leading-tight line-clamp-2 min-h-[2.25rem] text-gray-600">
            {item.name}
          </h4>
        </div>

        {/* Price and Add button row */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[15px] font-bold text-gray-700">
            ₹{item.price}
          </span>

          <div onClick={(e) => e.stopPropagation()}>
            <AddButton item={item} onCustomize={onCustomize} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Main Component */
export default function PopularSlideshow({
  categories,
  onDetails,
  onCustomize,
}) {
  const stripRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showArrow, setShowArrow] = useState(true);

  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const popularItems = categories.flatMap((cat) =>
    (cat.items || []).filter((item) => item.isPopular === true)
  );

  if (popularItems.length === 0) return null;

  const onMouseDown = (e) => {
    setIsDragging(true);
    drag.current = {
      active: true,
      startX: e.pageX - stripRef.current.offsetLeft,
      scrollLeft: stripRef.current.scrollLeft,
    };
  };

  const onMouseLeave = () => {
    setIsDragging(false);
    drag.current.active = false;
  };

  const onMouseUp = () => {
    setIsDragging(false);
    drag.current.active = false;
  };

  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    const walk = (x - drag.current.startX) * 1.5;
    stripRef.current.scrollLeft = drag.current.scrollLeft - walk;
  };

  const handleScroll = () => {
    if (stripRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = stripRef.current;
      // Hide arrow when scrolled to the end
      setShowArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  return (
    <div className="mb-3 -mx-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-[20px] font-bold text-gray-700 flex items-center gap-2">
          <span className="text-amber-500 "><IconStar /></span>
          Popular Dishes
        </h2>
        {showArrow && (
          <div className="flex items-center gap-1 text-stone-400 text-xs">
            <IconLongArrow />
          </div>
        )}
      </div>

      {/* Slider */}
      <div className="relative">
        <div
          ref={stripRef}
          className={`flex gap-3 px-4 pb-4 overflow-x-auto scroll-smooth ${
            isDragging ? "select-none" : ""
          }`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onScroll={handleScroll}
        >
          {popularItems.map((item) => (
            <PopularCard
              key={item._id}
              item={item}
              onDetails={onDetails}
              onCustomize={onCustomize}
            />
          ))}

          <div className="w-2 flex-shrink-0" />
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Divider */}
      <div className="mt-6 mx-4">
        <div className="h-[0.5px] bg-stone-200" />
      </div>
    </div>
  );
}