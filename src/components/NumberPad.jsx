export default function NumberPad({ onSelect }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md">
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            className="w-full h-12 bg-green-500 text-white rounded-md text-xl font-bold active:bg-green-700"
            onClick={() => onSelect(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}