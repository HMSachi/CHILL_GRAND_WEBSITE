import React, { useState, useMemo } from 'react';
import VariantGroup from './VariantGroup';
import '../../styles/components/VariantModal.css';

/**
 * VariantModal - Modal for selecting menu item variants
 */
const VariantModal = ({ item, onClose, onAddToCart }) => {
    // State for selected variants: { variantId: [optionId, ...] }
    const [selectedVariants, setSelectedVariants] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle variant selection change
    const handleSelectionChange = (variantId, optionIds) => {
        setSelectedVariants(prev => ({
            ...prev,
            [variantId]: optionIds
        }));

        // Clear error for this variant
        if (errors[variantId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[variantId];
                return newErrors;
            });
        }
    };

    // Calculate total price
    const calculatedPrice = useMemo(() => {
        let total = parseFloat(item.price);
        if (!item.variants) return total;

        item.variants.forEach(variant => {
            const selectedOptionIds = selectedVariants[variant.id] || [];
            variant.options.forEach(option => {
                if (selectedOptionIds.includes(option.id)) {
                    total += parseFloat(option.price || 0);
                }
            });
        });
        return total;
    }, [item, selectedVariants]);

    // Validate selections
    const validateSelections = () => {
        const newErrors = {};
        let isValid = true;

        if (!item.variants || item.variants.length === 0) return true;

        item.variants.forEach(variant => {
            const selectedOptions = selectedVariants[variant.id] || [];
            if (variant.isRequired && selectedOptions.length === 0) {
                newErrors[variant.id] = `Please select ${variant.type === 'SINGLE' ? 'an option' : 'at least one option'}`;
                isValid = false;
            } else if (variant.type !== 'SINGLE') {
                if (variant.minSelections && selectedOptions.length < variant.minSelections) {
                    newErrors[variant.id] = `Please select at least ${variant.minSelections} options`;
                    isValid = false;
                }
                if (variant.maxSelections && selectedOptions.length > variant.maxSelections) {
                    newErrors[variant.id] = `Maximum ${variant.maxSelections} options allowed`;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleAddToCart = () => {
        if (!validateSelections()) return;
        setIsSubmitting(true);

        const cartItem = {
            id: item.id,
            name: item.name,
            quantity: quantity,
            base_price: parseFloat(item.price),
            variants: [],
            total_price: calculatedPrice * quantity,
            image: item.image,
            uniqueKey: `${item.id}-${JSON.stringify(Object.values(selectedVariants).flat().sort())}`
        };

        if (item.variants) {
            item.variants.forEach(variant => {
                const selectedOptionIds = selectedVariants[variant.id] || [];
                selectedOptionIds.forEach(optionId => {
                    const option = variant.options.find(opt => opt.id === optionId);
                    if (option) {
                        cartItem.variants.push({
                            variant_id: variant.id,
                            variant_name: variant.name,
                            option_id: option.id,
                            option_name: option.name,
                            price: parseFloat(option.price || 0),
                            price_delta: parseFloat(option.price || 0)
                        });
                    }
                });
            });
        }

        onAddToCart(cartItem);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="variant-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="variant-modal-card">
                <div className="variant-modal-header">
                    <div>
                        <h2>{item.name}</h2>
                        <span className="base-price-label">Base Price: Rs. {parseFloat(item.price).toLocaleString()}</span>
                    </div>
                    <button onClick={onClose} className="close-modal-btn">✕</button>
                </div>

                <div className="variant-modal-body">
                    {item.variants && item.variants.map(variant => (
                        <VariantGroup
                            key={variant.id}
                            variant={variant}
                            selectedOptions={selectedVariants[variant.id] || []}
                            onSelectionChange={handleSelectionChange}
                            error={errors[variant.id]}
                        />
                    ))}
                </div>

                <div className="variant-modal-footer">
                    <div className="quantity-section">
                        <span className="variant-requirement">Adjust Quantity</span>
                        <div className="qty-controls">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn" disabled={quantity <= 1}>−</button>
                            <span className="qty-value">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
                        </div>
                    </div>

                    <div className="total-display">
                        <div className="total-info">
                            <span className="total-label">Selected Total</span>
                            {quantity > 1 && <span className="unit-calc">Rs. {calculatedPrice.toLocaleString()} × {quantity}</span>}
                        </div>
                        <span className="total-amount">Rs. {(calculatedPrice * quantity).toLocaleString()}</span>
                    </div>

                    <div className="modal-actions">
                        <button onClick={onClose} className="cancel-modal-btn" disabled={isSubmitting}>Cancel</button>
                        <button onClick={handleAddToCart} className="confirm-add-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add to Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VariantModal;
