import IngredientSelector from "components/pdp/IngredientSelector";
import { Ingredient } from "interfaces/pdp";

export interface IngredientsSelectorProps {
    title: string;
    selectors: Ingredient[];
    quantityChangeFunction: (ingredientId: string, qty: number) => any;
    isFetching: boolean;
    xlViewport: number;
    lgViewport: number;
}

const IngredientsSelector = ({
    title,
    selectors,
    quantityChangeFunction,
    isFetching,
    xlViewport,
    lgViewport,
}: IngredientsSelectorProps): JSX.Element => {
    const ingredients =
        selectors?.map((item) => {
            return (
                <div key={item.id} className="ingredients-selector">
                    <IngredientSelector
                        lgViewport={lgViewport}
                        xlViewport={xlViewport}
                        isDisabled={isFetching}
                        ingredientId={item.id}
                        imageUrl={item.imgUrl}
                        title={item.name}
                        price={item.price.displayValue}
                        qty={item.qty}
                        minQty={item.min}
                        maxQty={item.max}
                        quantityChangeFunction={quantityChangeFunction}
                    />
                </div>
            );
        }) ?? null;

    return (
        <div className="my-4 ingredients-selector">
            <p className="mb-2 font-bold text-lg lg:text-2xl">{title}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{ingredients}</div>
        </div>
    );
};

export default IngredientsSelector;
