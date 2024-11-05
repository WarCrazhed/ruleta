import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Importa SweetAlert

const Home = () => {
    const [items, setItems] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [highlightedItemIndex, setHighlightedItemIndex] = useState(null);

    const fetchInventoryItems = () => {
        const request = indexedDB.open('inventoryDB', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['inventory'], 'readonly');
            const store = transaction.objectStore('inventory');
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
                setItems(getAllRequest.result);
            };
        };

        request.onerror = (event) => {
            console.error("Database error: ", event.target.error);
        };
    };

    useEffect(() => {
        fetchInventoryItems();
    }, []);

    const decrementItemQuantity = (item) => {
        const request = indexedDB.open('inventoryDB', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['inventory'], 'readwrite');
            const store = transaction.objectStore('inventory');

            if (item.quantity > 1) {
                const updatedItem = { ...item, quantity: item.quantity - 1 };
                store.put(updatedItem).onsuccess = () => {
                    fetchInventoryItems();
                };
            } else {
                store.delete(item.id).onsuccess = () => {
                    fetchInventoryItems();
                };
            }
        };

        request.onerror = (event) => {
            console.error("Database error: ", event.target.error);
        };
    };

    const spinWheel = () => {
        if (items.length === 0) return;

        setIsSpinning(true);
        setHighlightedItemIndex(null);

        const randomIndex = Math.floor(Math.random() * (items.length + 1));

        const highlightInterval = setInterval(() => {
            const randomHighlightIndex = Math.floor(Math.random() * items.length);
            setHighlightedItemIndex(randomHighlightIndex);
        }, 100);

        setTimeout(() => {
            clearInterval(highlightInterval);
            setIsSpinning(false);

            if (randomIndex === items.length) {
                Swal.fire({
                    title: '¡Nada!',
                    text: 'No ganaste un artículo esta vez.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#7cc201'
                });
            } else {
                const selectedItem = items[randomIndex];
                Swal.fire({
                    title: '¡Ganaste!',
                    text: `Has ganado: ${selectedItem.name}`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#7cc201'
                });
                decrementItemQuantity(selectedItem);
            }

            setHighlightedItemIndex(null);
        }, 5000);
    };

    return (
        <div className="bg-zinc-950">
            <div className="container mx-auto min-h-screen py-10 px-4 text-white text-center">
                <h1 className="text-3xl font-black mb-4">Ruleta de Inventario</h1>
                {items.length > 0 ? (
                    <>
                        <div className="my-20 flex justify-center font-bold">
                            <button 
                                onClick={spinWheel}
                                disabled={isSpinning} 
                                className={`p-4 rounded-full text-lg hover:bg-lime-700 transition-all ${isSpinning ? 'animate-pulse bg-lime-600' : 'bg-lime-600'}`}
                            >
                                Girar Ruleta
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-between p-4 shadow-lg bg-zinc-900/25 rounded-lg">
                            {items.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className={`bg-gradient-to-r from-lime-500 via-green-700 to-yellow-500 rounded-full p-[0.15rem] ${highlightedItemIndex === index ? 'shadow-lg ring-4 ring-lime-300' : ''}`}
                                >
                                    <div className="text-lg font-semibold rounded-full py-3 px-6 bg-zinc-950">
                                        {item.name} - {item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p>No hay elementos en el inventario</p>
                )}
            </div>
        </div>
    );
};

export default Home;
