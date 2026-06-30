import React, { useState, useEffect } from 'react';

const VariantModal = ({ item, onClose, onAddToCart }) => {
    const [selections, setSelections] = useState({});
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const initialSelections = {};
        if (item.variants) {
            item.variants.forEach(v => {
                if (v.isRequired && v.options?.length > 0 && v.type === 'SINGLE') {
                    initialSelections[v.id] = [v.options[0].id];
                } else {
                    initialSelections[v.id] = [];
                }
            });
        }
        setSelections(initialSelections);
    }, [item]);

    const handleOptionToggle = (variant, option) => {
        setSelections(prev => {
            const current = prev[variant.id] || [];
            if (variant.type === 'SINGLE') {
                return { ...prev, [variant.id]: [option.id] };
            } else {
                const exists = current.includes(option.id);
                if (exists) {
                    return { ...prev, [variant.id]: current.filter(id => id !== option.id) };
                } else {
                    if (variant.maxSelections && current.length >= variant.maxSelections) return prev;
                    return { ...prev, [variant.id]: [...current, option.id] };
                }
            }
        });
    };

    const getBasePrice = () => {
        let price = item.price;
        if (typeof price === 'string') {
            price = parseFloat(price.replace(/[^0-9.-]+/g, ""));
        }
        return price;
    };

    const calculateUnitTotal = () => {
        let total = getBasePrice();
        if (item.variants) {
            item.variants.forEach(v => {
                const selectedIds = selections[v.id] || [];
                selectedIds.forEach(optId => {
                    const opt = v.options?.find(o => o.id === optId);
                    if (opt) total += parseFloat(opt.price);
                });
            });
        }
        return total;
    };

    const calculateTotal = () => calculateUnitTotal() * quantity;

    const isValid = () => {
        if (!item.variants) return true;
        return item.variants.every(v => {
            if (v.isRequired) {
                const selected = selections[v.id] || [];
                return selected.length >= (v.minSelections || 1);
            }
            return true;
        });
    };

    const handleAdd = () => {
        const selectedVariants = [];
        if (item.variants) {
            item.variants.forEach(v => {
                const selectedIds = selections[v.id] || [];
                selectedIds.forEach(optId => {
                    const opt = v.options?.find(o => o.id === optId);
                    if (opt) {
                        selectedVariants.push({
                            variantId: v.id,
                            variantName: v.name,
                            optionId: opt.id,
                            optionName: opt.name,
                            price: opt.price
                        });
                    }
                });
            });
        }

        onAddToCart({
            ...item,
            quantity,
            unitPrice: calculateUnitTotal(),
            selectedVariants
        });
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', padding: '20px' }}>
            <div style={{ background: '#111', width: '100%', maxWidth: '400px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ color: 'white', margin: 0, fontSize: '18px', textTransform: 'uppercase', fontFamily: '"Inter", "Roboto", sans-serif' }}>{item.name}</h3>
                        <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '12px', letterSpacing: '1px' }}>BASE PRICE: RS. {getBasePrice().toFixed(2)}</p>
                    </div>
                    <button onClick={onClose} style={{ background: '#222', border: 'none', color: '#888', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>×</button>
                </div>

                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {item.variants && item.variants.map(v => (
                        <div key={v.id} style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
                                <h4 style={{ color: '#ddd', margin: 0, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>{v.name}</h4>
                                <span style={{ color: '#555', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    {v.isRequired ? 'Required' : 'Optional'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {v.options?.map(opt => {
                                    const isSelected = (selections[v.id] || []).includes(opt.id);
                                    return (
                                        <div
                                            key={opt.id}
                                            onClick={() => handleOptionToggle(v, opt)}
                                            style={{
                                                display: 'flex', justifyContent: 'space-between', padding: '15px', borderRadius: '12px', border: `1px solid ${isSelected ? '#ffc107' : '#222'}`, background: isSelected ? 'rgba(255, 193, 7, 0.05)' : '#1a1a1a', cursor: 'pointer', transition: 'all 0.2s', alignItems: 'center'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${isSelected ? '#ffc107' : '#444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {isSelected && <div style={{ width: '10px', height: '10px', background: '#ffc107', borderRadius: '50%' }}></div>}
                                                </div>
                                                <span style={{ color: isSelected ? 'white' : '#aaa', fontSize: '14px', fontWeight: 'bold' }}>{opt.name}</span>
                                            </div>
                                            <span style={{ color: '#007bff', fontSize: '12px', fontWeight: 'bold' }}>
                                                {parseFloat(opt.price) > 0 ? `+RS. ${parseFloat(opt.price).toFixed(2)}` : 'NO EXTRA CHARGE'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '20px 0', borderTop: '1px solid #222' }}>
                        <span style={{ color: '#888', fontSize: '12px', letterSpacing: '1px' }}>ADJUST QUANTITY</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#1a1a1a', border: '1px solid #333', padding: '5px', borderRadius: '12px' }}>
                            <button disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)} style={{ width: '30px', height: '30px', background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', opacity: quantity <= 1 ? 0.5 : 1 }}>-</button>
                            <span style={{ color: 'white', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} style={{ width: '30px', height: '30px', background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>+</button>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '20px', background: '#0a0a0a', borderTop: '1px solid #222' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ color: '#666', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>Selected Total</span>
                        <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Rs. {calculateTotal().toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '15px', background: '#1a1a1a', color: '#aaa', border: '1px solid #333', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
                        <button disabled={!isValid()} onClick={handleAdd} style={{ flex: 1.5, padding: '15px', background: isValid() ? '#ffc107' : '#333', color: isValid() ? '#000' : '#666', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', cursor: isValid() ? 'pointer' : 'not-allowed', boxShadow: isValid() ? '0 4px 15px rgba(255,193,7,0.3)' : 'none' }}>Add to Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VariantModal;
