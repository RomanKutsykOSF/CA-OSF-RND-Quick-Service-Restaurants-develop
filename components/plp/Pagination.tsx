import React, { useState, useEffect } from "react";

interface PaginationInterface {
    totalSearchResults: number;
    itemsPerPaginationStep: number;
    maxPaginationItemsToShowPerStep: number;
    currentActivePaginationItemIndex: number;
    showPreviousPaginationGroupText: string;
    showNextPaginationGroupText: string;
    paginationItemClickCallback: (itemIndex: string) => void;
}

const Pagination = ({
    totalSearchResults,
    itemsPerPaginationStep,
    currentActivePaginationItemIndex, //calculate active step based on it
    maxPaginationItemsToShowPerStep,
    showPreviousPaginationGroupText,
    showNextPaginationGroupText,
    paginationItemClickCallback,
}: PaginationInterface): JSX.Element => {
    const [currentStepPositionIndex, setCurrentStepPositionIndex] = useState(0); //hidrate from outside
    const [currentStepItems, setCurrentStepItems] = useState([]);
    const [totalPaginationItemsNumber, setTotalPaginationItemsNumber] = useState(
        Math.ceil(totalSearchResults / itemsPerPaginationStep)
    );

    const goToNextStep = (): void => {
        const nextStepPositionIndex = currentStepPositionIndex + maxPaginationItemsToShowPerStep;
        if (nextStepPositionIndex < totalPaginationItemsNumber) {
            setCurrentStepPositionIndex(nextStepPositionIndex);
        }
    };

    const goToPrevStep = (): void => {
        if (currentStepPositionIndex > 0) {
            setCurrentStepPositionIndex(currentStepPositionIndex - maxPaginationItemsToShowPerStep);
        }
    };

    const generatePaginationStepItems = (currentStepPositionIndex): JSX.Element[] => {
        const jsxPaginationSteps: JSX.Element[] = [];

        for (
            let i = currentStepPositionIndex, length = currentStepPositionIndex + maxPaginationItemsToShowPerStep;
            i < length;
            i++
        ) {
            if (i < totalPaginationItemsNumber) {
                jsxPaginationSteps.push(
                    <button
                        key={`pagination-button-${i}`}
                        onClick={() => {
                            paginationItemClickCallback(i);
                        }}
                        className={`w-8 h-8  mx-1 font-primary cursor-pointer  font-bold ${
                            currentActivePaginationItemIndex === i
                                ? "text-t-tertiary font-bold bg-bgr-tertiary rounded-full"
                                : "text-t-primary"
                        }`}
                    >
                        {i + 1}
                    </button>
                );
            }
        }

        return jsxPaginationSteps;
    };

    useEffect(() => {
        setTotalPaginationItemsNumber(Math.ceil(totalSearchResults / itemsPerPaginationStep));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalSearchResults, itemsPerPaginationStep]);

    useEffect(() => {
        const paginationRangesArray = [];
        let tempCurrentStepPositionIndex = 0;

        while (tempCurrentStepPositionIndex <= totalPaginationItemsNumber) {
            const nextStepPositionIndex = tempCurrentStepPositionIndex + maxPaginationItemsToShowPerStep;

            paginationRangesArray.push([tempCurrentStepPositionIndex, nextStepPositionIndex - 1]);
            tempCurrentStepPositionIndex = nextStepPositionIndex;
        }

        for (let i = 0, length = paginationRangesArray.length; i < length; i++) {
            if (
                currentActivePaginationItemIndex >= paginationRangesArray[i][0] &&
                currentActivePaginationItemIndex <= paginationRangesArray[i][1]
            ) {
                setCurrentStepPositionIndex(i * maxPaginationItemsToShowPerStep);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentActivePaginationItemIndex, totalPaginationItemsNumber]);

    useEffect(() => {
        const generatedPaginationStepItems = generatePaginationStepItems(currentStepPositionIndex);
        setCurrentStepItems(generatedPaginationStepItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStepPositionIndex, currentActivePaginationItemIndex, totalPaginationItemsNumber]);
    return (
        <section className="w-full flex justify-center items-center">
            <div className="pagination flex justify-center items-center">
                <button
                    onClick={goToPrevStep}
                    className={`pagination-arrow icon-chevron-up transform -rotate-90 text-xxl ${
                        currentStepPositionIndex <= 0 ? "disabled" : ""
                    }`}
                    title={showPreviousPaginationGroupText}
                ></button>
                {currentStepItems}
                <button
                    onClick={goToNextStep}
                    className={`pagination-arrow icon-chevron-up transform rotate-90 text-xxl ${
                        currentStepPositionIndex + maxPaginationItemsToShowPerStep >= totalPaginationItemsNumber
                            ? "disabled"
                            : ""
                    }`}
                    title={showNextPaginationGroupText}
                ></button>
            </div>
            <style jsx>{`
                .pagination-arrow {
                    color: var(--t-primary);
                }
                .pagination-arrow.disabled::before {
                    color: var(--t-disabled);
                }
            `}</style>
        </section>
    );
};

export default Pagination;
