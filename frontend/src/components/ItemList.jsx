import React from 'react';

export function ItemList({ items }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Items</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No items yet</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={index}
              className="border-b pb-2 last:border-b-0 last:pb-0"
            >
              {item.name} - {item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}