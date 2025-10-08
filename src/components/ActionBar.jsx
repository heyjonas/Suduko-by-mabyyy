export default function ActionBar({ onErase }) {
  return (
    <div className="flex justify-around w-full mt-4 mb-2 px-4">
      <button className="text-sm px-3 py-2 bg-gray-200 rounded">Undo</button>
      <button onClick={onErase} className="text-sm px-3 py-2 bg-gray-200 rounded">Erase</button>
      <button className="text-sm px-3 py-2 bg-gray-200 rounded">Note</button>
      <button className="text-sm px-3 py-2 bg-gray-200 rounded">Hint</button>
    </div>
  );
}