export default function VegBadge({ isVeg }) {
  return (
    <span
      className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
        isVeg ? "border-green-600" : "border-red-600"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isVeg ? "bg-green-600" : "bg-red-600"
        }`}
      />
    </span>
  );
}