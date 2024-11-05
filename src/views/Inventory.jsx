import React, { useEffect, useState } from 'react';

const Inventory = () => {
    const [db, setDb] = useState(null);
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const request = indexedDB.open('inventoryDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('inventory')) {
                db.createObjectStore('inventory', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            setDb(event.target.result);
        };

        request.onerror = (event) => {
            console.error("Database error: ", event.target.error);
        };
    }, []);

    // Fetch items only when db is set
    useEffect(() => {
        if (db) {
            fetchItems();
        }
    }, [db]);

    const fetchItems = () => {
        if (!db) return;
        const transaction = db.transaction(['inventory'], 'readonly');
        const store = transaction.objectStore('inventory');
        const request = store.getAll();

        request.onsuccess = () => {
            setItems(request.result);
        };
    };

    const addItem = () => {
        const transaction = db.transaction(['inventory'], 'readwrite');
        const store = transaction.objectStore('inventory');
        const item = { name, quantity: parseInt(quantity) };

        store.add(item).onsuccess = () => {
            fetchItems();
            setName('');
            setQuantity('');
        };
    };

    const updateItem = (id) => {
        const transaction = db.transaction(['inventory'], 'readwrite');
        const store = transaction.objectStore('inventory');

        store.get(id).onsuccess = (event) => {
            const item = event.target.result;
            item.name = name;
            item.quantity = parseInt(quantity);

            store.put(item).onsuccess = () => {
                fetchItems();
                setName('');
                setQuantity('');
                setEditingId(null);
            };
        };
    };

    const deleteItem = (id) => {
        const transaction = db.transaction(['inventory'], 'readwrite');
        const store = transaction.objectStore('inventory');

        store.delete(id).onsuccess = () => {
            fetchItems();
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateItem(editingId);
        } else {
            addItem();
        }
    };

    const startEditing = (item) => {
        setName(item.name);
        setQuantity(item.quantity);
        setEditingId(item.id);
    };

    return (
        <div className="bg-zinc-950">
            <div className="container mx-auto min-h-screen py-10 px-4 text-white">
                <h1 className="text-3xl font-black mb-4">Inventario</h1>
                <form onSubmit={handleSubmit} className="mb-5 flex flex-col md:flex-row gap-4 justify-between">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 bg-zinc-800 rounded-md focus:outline-none focus:ring focus:ring-lime-500 md:w-1/2"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Cantidad"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="p-2 bg-zinc-800 rounded-md focus:outline-none focus:ring focus:ring-lime-500 md:w-1/4"
                        required
                    />
                    <button type="submit" className="p-2 bg-lime-600 rounded-md hover:bg-lime-700 md:w-1/4 font-bold">
                        {editingId ? 'Actualizar' : 'Agregar'}
                    </button>
                </form>
                <div>
                    {items.map((item) => (
                        <div key={item.id} className='bg-gradient-to-r from-lime-500 via-green-700 to-cyan-800 rounded-lg p-[0.15rem] mb-4'>
                            <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-zinc-950 p-4 rounded-lg">
                                <span className='font-light'>{item.name} - {item.quantity}</span>
                                <div className='flex gap-4 w-full md:w-1/4 font-bold'>
                                    <button
                                        onClick={() => startEditing(item)}
                                        className="bg-lime-600 hover:bg-lime-700 p-1 w-1/2 rounded-md"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="bg-red-600 hover:bg-red-700 p-1 w-1/2 rounded-md"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
