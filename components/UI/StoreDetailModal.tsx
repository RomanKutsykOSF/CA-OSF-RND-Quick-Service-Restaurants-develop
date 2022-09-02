import { Store } from "interfaces/storelocatorContext";
import Image from "next/image";
import { FormEventHandler, KeyboardEventHandler } from "react";
import Backdrop from "./Backdrop";
import Button from "./Button";

interface StoreDetailProps {
    closeModalHandler: FormEventHandler<HTMLElement>;
    closeModalKeyboardHandler: KeyboardEventHandler<HTMLElement>;
    selectStoreHandler: FormEventHandler;
    selectedStoreId: string;
    modalState: boolean;
    storeDetailSelectedStore: Store;
    i18: Record<string, string>;
    largeViewportBreakpoint: number;
}

const StoreDetailModal = ({
    closeModalHandler,
    closeModalKeyboardHandler,
    selectStoreHandler,
    selectedStoreId,
    modalState,
    storeDetailSelectedStore,
    largeViewportBreakpoint,
    i18,
}: StoreDetailProps): JSX.Element => {
    return (
        <>
            <div
                className={`z-50 store-details-modal bg-bgr-primary rounded-t-xl lg:rounded-b-xl fixed ${
                    modalState ? "open" : ""
                }`}
            >
                {storeDetailSelectedStore && (
                    <>
                        <i
                            tabIndex={0}
                            role="button"
                            onClick={closeModalHandler}
                            onKeyDown={closeModalKeyboardHandler}
                            className="icon-cross absolute text-t-tertiary close-modal"
                        ></i>
                        <div>
                            <Image
                                src={storeDetailSelectedStore.imgMobile || "/images/no-image-icon.png"}
                                width={1372}
                                height={656}
                                className="lg:rounded-t-xl"
                            ></Image>
                        </div>
                        <div className="lg:p-4">
                            <p className="font-bold my-2 font-primary text-lg">{storeDetailSelectedStore.name}</p>
                            <address>
                                <span className="font-primary text-sm mt-1 block">
                                    {storeDetailSelectedStore.address1}
                                </span>
                                <span className="font-primary text-sm block mt-1">
                                    {storeDetailSelectedStore.postal_code}
                                </span>
                            </address>
                            {storeDetailSelectedStore.phone && (
                                <p className="icon-phone phone text-sm mt-6">{storeDetailSelectedStore.phone}</p>
                            )}
                            <ul className={`${!storeDetailSelectedStore.phone ? "mt-6" : ""}`}>
                                {storeDetailSelectedStore.features
                                    ? storeDetailSelectedStore.features.map(
                                          (feature) =>
                                              feature.isAvailable && (
                                                  <li key={feature.id} className="icon-check store-feature my-2">
                                                      {feature.displayName}
                                                  </li>
                                              )
                                      )
                                    : null}
                            </ul>
                            <div className="mt-6 flex lg:items-start">
                                <Button
                                    disabled={selectedStoreId === storeDetailSelectedStore.id}
                                    onClick={(e) => {
                                        if (selectedStoreId) {
                                            closeModalHandler(e);
                                            selectStoreHandler(e);
                                        } else {
                                            selectStoreHandler(e);
                                        }
                                    }}
                                    className="mr-2"
                                    variant="primary"
                                >
                                    {i18.chooseStore}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {modalState ? <Backdrop /> : null}
            <style jsx>{`
                .store-details-modal {
                    width: 100%;
                    padding: 15px;
                    bottom: 0;
                    z-index: 101;
                    box-shadow: 1px 0px 7px rgba(0, 0, 0, 0.5);
                    transform: translateY(150%);
                    transition: transform 0.2s ease-out;
                }

                .store-details-modal.open {
                    transform: translateX(0);
                }

                .phone::before {
                    color: var(--t-secondary-2);
                    font-size: 22px;
                    margin-right: 10px;
                }

                .store-feature:before {
                    font-size: 22px;
                    margin-right: 10px;
                    color: var(--t-secondary-2);
                }

                .close-modal {
                    top: -50px;
                    right: 15px;
                    border-radius: 50%;
                    font-size: 22px;
                    border: 1px solid var(--t-tertiary);
                }

                @media only screen and (min-width: ${largeViewportBreakpoint}px) {
                    .store-details-modal {
                        padding: 0;
                        width: 550px;
                        left: 50%;
                        height: max-content;
                        transform: translate(-50%, 120%);
                    }

                    .store-details-modal.open {
                        top: 50%;
                        transform: translate(-50%, -50%);
                    }

                    .close-modal {
                        top: 0px;
                        right: -50px;
                    }
                }
            `}</style>
        </>
    );
};

export default StoreDetailModal;
