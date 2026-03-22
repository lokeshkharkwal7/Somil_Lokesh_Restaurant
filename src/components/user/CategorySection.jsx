// CategorySection.jsx
// Passes onDetails down to ItemCard (new prop alongside existing onCustomize).

import ItemCard from "./ItemCard";

export default function CategorySection({ category, onCustomize, onDetails }) {
  return (
    <div id={category.name} className="mb-6">
      <h2 className="text-[17px] font-bold text-gray-900 mb-3 flex items-center gap-2">
        {category.name}
        <span className="text-[12px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {category.items.length}
        </span>
      </h2>

      {category.items.map((item, index) => (
        <ItemCard
          key={index}
          item={item}
          onCustomize={onCustomize}
          onDetails={onDetails}
        />
      ))}
    </div>
  );
}