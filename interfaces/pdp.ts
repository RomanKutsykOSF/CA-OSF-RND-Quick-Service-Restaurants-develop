import { SizeTileProps } from "components/pdp/SizeTile";
import { TabProps } from "components/UI/Tabs";

export interface Ingredient {
    id: string;
    name: string;
    price: {
        displayValue: string;
        value?: number;
    };
    qty: number;
    min: number;
    max: number;
    imgUrl: string;
}

export interface IngredientGroup {
    id: string;
    name: string;
    items: Ingredient[];
}

export interface ProductImage {
    url: string;
    alt: string;
    title: string;
}

export interface ProductData {
    id: string;
    name: string;
    weight: string;
    shortDescription: string;
    imgSquare: ProductImage;
    imgLandscape: ProductImage;
    parentCategoryId: string;
    price: string;
    priceTimesQty: string;
    qty: number;
    minQty: number;
    maxQty: number;
    isProductSavedInWishlist: boolean;
    sizeTiles: SizeTileProps[];
    badges: string[];
    tabs?: TabProps[];
    ingredientGroups: IngredientGroup[];
    isMasterProduct: boolean;
    inventory: {
        ats: number;
        backorderable: boolean;
        id: string;
        orderable: boolean;
        preorderable: boolean;
        stockLevel: number;
    };
    isStoreSelected: boolean;
}

export type ProductProps = ProductData;
