import React from "react";

export interface ProductBadgeProps {
    text: string;
}

const ProductBadge = ({ text }: ProductBadgeProps): JSX.Element => {
    return (
        <div className="rounded-full inline-flex justify-center items-center font-bold text-sm product-badge">
            <span>{text}</span>
            <style jsx>{`
                .product-badge {
                    padding: 0 10px;
                    height: 30px;
                    color: var(--t-secondary-2);
                    background-color: var(--bgr-primary);
                }

                // to have distance between multiple badges
                .product-badge + .product-badge {
                    margin-left: 10px;
                }
            `}</style>
        </div>
    );
};

export default ProductBadge;
