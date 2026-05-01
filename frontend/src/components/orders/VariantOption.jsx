import React from 'react';

/**
 * VariantOption - Renders a single option within a variant group
 * Handles both radio and checkbox types with pricing display
 */
const VariantOption = ({
    option,
    variantType,
    isSelected,
    onChange,
    disabled,
    name // For radio button grouping
}) => {
    const inputId = `option-${option.id}`;

    const handleChange = (e) => {
        if (!disabled) {
            onChange(option, e.target.checked);
        }
    };

    const priceDisplay = option.price > 0 ? `+Rs. ${parseFloat(option.price).toFixed(2)}` : 'No Extra Charge';

    return (
        <label
            htmlFor={inputId}
            className={`variant-option-label ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
        >
            <div className="option-main">
                <div className="option-input-wrapper">
                    <input
                        id={inputId}
                        type={variantType === 'radio' ? 'radio' : 'checkbox'}
                        name={name}
                        checked={isSelected}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <div className="check-mark"></div>
                </div>
                <span className="option-name">
                    {option.name}
                </span>
            </div>
            <span className={`option-price ${option.price > 0 ? '' : 'no-charge'}`}>
                {priceDisplay}
            </span>
        </label>
    );
};

export default VariantOption;
