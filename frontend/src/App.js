import React, { useState, useEffect } from 'react';
import { ItemList } from './components/ItemList';
import { AddItemForm } from './components/AddItemForm';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async (newItem) => {
    try {
      const response = await fetch('http://localhost:8000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      const data = await response.json();
      setItems([...items, data]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          FastAPI + React App
        </h1>
        <div className="grid gap-8">
          <AddItemForm onAdd={addItem} />
          <ItemList items={items} />
        </div>
      </div>
    </div>
  );
}

export default App;