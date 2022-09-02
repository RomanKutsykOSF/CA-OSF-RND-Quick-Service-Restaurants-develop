import Image from "next/image";
import Link from "next/link";
import { useContext, useRef } from "react";

import { GlobalContext } from "context/global";
import useStoreSearch from "hooks/useStoreSearch";
import { StoreLocatorContext } from "context/storelocator";
import Modal from "./ModalPopup";

interface StoreSearchProps {
    title: string;
    locale: string;
    subTitle: string;
    useCurrentLocationLabel: string;
    viewAllLabel: string;
    viewAllUrl: string;
    bannerImgDesktopUrl: string;
    bannerImgDesktopWidth: number;
    bannerImgDesktopHeight: number;
    bannerImgMobileUrl: string;
    bannerImgMobileWidth: number;
    bannerImgMobileHeight: number;
    inputPlaceholder: string;
    deliveryBtnLabel: string;
    collectionBtnLabel: string;
    globalResources: Record<string, string>;
    pickUpInStoreMethodId: string;
    addressDeliveryMethodId: string;
    defaultStoreSearchRadius: string;
}

const StoreSearch = ({
    locale,
    title,
    subTitle,
    useCurrentLocationLabel,
    viewAllLabel,
    viewAllUrl,
    bannerImgDesktopUrl,
    bannerImgDesktopWidth,
    bannerImgDesktopHeight,
    bannerImgMobileUrl,
    bannerImgMobileWidth,
    bannerImgMobileHeight,
    inputPlaceholder,
    deliveryBtnLabel,
    collectionBtnLabel,
    globalResources,
    pickUpInStoreMethodId,
    addressDeliveryMethodId,
    defaultStoreSearchRadius,
}: StoreSearchProps): JSX.Element => {
    const { viewports } = useContext(GlobalContext);
    const {
        handleSelectedStore,
        confirmChangeStore,
        setIsChangeStorePopupVisible,
        isChangeStorePopupVisible,
    } = useContext(StoreLocatorContext);
    const { deliveryMethodId, setDeliveryMethodId } = useContext(StoreLocatorContext);
    const placesApiServiceHelperRef = useRef<HTMLDivElement>(null);

    const {
        fetching,
        stores,
        handleSearch,
        searchText,
        handleKeydown,
        handleUseCurrentLocation,
        handlePreselectStore,
        googleScriptLoaded,
    } = useStoreSearch({
        serviceHelperRef: placesApiServiceHelperRef,
        locale,
        deliveryMethodId,
        internalServerError: globalResources.internalServerError,
        deniedGeolocationError: globalResources.deniedGeolocation,
        defaultStoreSearchRadius: defaultStoreSearchRadius,
    });

    return (
        <>
            <section className="app-store-search  relative w-full">
                <div className="relative w-full hidden lg:block">
                    <Image
                        src={bannerImgDesktopUrl}
                        layout="responsive"
                        width={bannerImgDesktopWidth}
                        height={bannerImgDesktopHeight}
                    />
                </div>
                <div className="relative w-full lg:hidden">
                    <Image
                        src={bannerImgMobileUrl}
                        layout="responsive"
                        width={bannerImgMobileWidth}
                        height={bannerImgMobileHeight}
                    />
                </div>
                <div className="absolute top-0 left-0 flex flex-col w-full h-full items-center justify-center">
                    {googleScriptLoaded && <div ref={placesApiServiceHelperRef} />}
                    <div>
                        <h1 className="font-primary font-thin lg:py-8 text-xl lg:text-2lg text-t-tertiary">{title}</h1>
                    </div>
                    <div className="flex flex-col relative w-full lg:w-auto search-stores">
                        <div className="lg:bg-bgr-primary p-4 lg:p-2 lg:rounded-3xl flex flex-col lg:flex-row items-center">
                            <div className="bg-bgr-primary w-full flex items-center delivery-method-container justify-between lg:justify-between mb-4 lg:mb-0 lg:p-0 p-1 rounded-3xl">
                                <button
                                    className={`${
                                        deliveryMethodId === addressDeliveryMethodId
                                            ? "bg-bgr-tertiary primary text-t-tertiary"
                                            : ""
                                    } text-center w-full p-2 rounded-3xl font-primary text-sm btn icon-delivery-2 font-bold mr-2`}
                                    onClick={() => setDeliveryMethodId(addressDeliveryMethodId)}
                                >
                                    {deliveryBtnLabel}
                                </button>
                                <button
                                    className={`${
                                        deliveryMethodId === pickUpInStoreMethodId
                                            ? "bg-bgr-tertiary primary text-t-tertiary"
                                            : ""
                                    } text-center w-full p-2 rounded-3xl font-primary text-sm btn icon-store-1 font-bold`}
                                    onClick={() => setDeliveryMethodId(pickUpInStoreMethodId)}
                                >
                                    {collectionBtnLabel}
                                </button>
                            </div>

                            <div className="bg-bgr-primary w-full flex items-center justify-between lg:justify-around rounded-3xl input-container p-1 lg:p-0">
                                <input
                                    value={searchText}
                                    onChange={handleSearch}
                                    onKeyDown={handleKeydown}
                                    className={"search-input p-2 rounded-3xl lg:rounded-none"}
                                    placeholder={inputPlaceholder}
                                    type="text"
                                />
                                <div
                                    className={`rounded-xl z-10 search-dropdown absolute bg-bgr-primary mt-2 p-4 self-center lg:self-end`}
                                >
                                    <button
                                        onClick={handleUseCurrentLocation}
                                        className="icon-crosshair text-t-secondary text-sm font-primary mb-4 font-medium current-location"
                                    >
                                        {useCurrentLocationLabel}
                                    </button>
                                    <h1 className="mb-2 font-primary text-xl font-bold text-t-primary">{subTitle}</h1>
                                    <div className={"search-results overflow-y-scroll"}>
                                        {!fetching
                                            ? stores?.map((store) => {
                                                  return (
                                                      <div
                                                          role="button"
                                                          tabIndex={0}
                                                          onKeyDown={(e) => {
                                                              e.key === "Enter" && handleSelectedStore(store);
                                                          }}
                                                          onClick={() => {
                                                              handleSelectedStore(store);
                                                          }}
                                                          className={"flex mt-2 cursor-pointer"}
                                                          key={store.id}
                                                      >
                                                          <div>
                                                              <Image
                                                                  src={store.icon || "/images/storeDefaultImg.png"}
                                                                  width={56}
                                                                  height={56}
                                                              ></Image>
                                                          </div>
                                                          <div className="py-1 px-2">
                                                              <h1
                                                                  className={`text-t-primary text-xl font-primary font-bold`}
                                                              >
                                                                  {store.name}
                                                              </h1>
                                                              <p className={`text-t-secondary text-sm font-primary`}>
                                                                  {store.address1}
                                                              </p>
                                                              <p className={`text-t-disabled text-sm font-primary`}>
                                                                  {store.store_hours}
                                                              </p>
                                                          </div>
                                                      </div>
                                                  );
                                              })
                                            : [...Array(3)].map((n, i) => (
                                                  <div key={i} className={`flex flex-col items-center justify-center`}>
                                                      <div className="flex w-full">
                                                          <div className="skeleton-circle"></div>
                                                          <div>
                                                              <div className="skeleton-line"></div>
                                                              <div className="skeleton-line"></div>
                                                          </div>
                                                      </div>
                                                  </div>
                                              ))}
                                    </div>
                                    <Link href={viewAllUrl}>
                                        <a className="pt-4 block text-sm font-semibold font-primary text-t-secondary-2">
                                            {viewAllLabel}
                                            <i className="icon-arrow-right"></i>
                                        </a>
                                    </Link>
                                </div>
                                <button
                                    onClick={handlePreselectStore}
                                    type="button"
                                    className="submit-search btn icon-arrow-right bg-bgr-tertiary w-10 h-10 rounded-full"
                                ></button>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    actionFunction={confirmChangeStore}
                    title={globalResources.changeStoreConfirmTitle}
                    text={globalResources.changeStoreConfirmText}
                    isPopupVisible={isChangeStorePopupVisible}
                    yesText={globalResources.changeStoreYes}
                    noText={globalResources.changeStoreNo}
                    onClose={() => setIsChangeStorePopupVisible(false)}
                />
            </section>
            <style jsx>{`
                .submit-search:before {
                    width: 100%;
                    margin: 0;
                    font-size: 20px;
                    color: var(--t-tertiary);
                    display: block;
                }
                .primary {
                    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
                }
                button {
                    transition: 250ms all;
                }
                .btn:hover:not(.primary):not(.submit-search) {
                    background: var(--bgr-disabled);
                }
                .primary:hover {
                    filter: brightness(85%);
                }
                .btn:before {
                    margin-right: 10px;
                    font-size: 21px;
                }
                .current-location:before {
                    margin-right: 16px;
                    font-size: 20px;
                    color: var(--t-secondary-2);
                    display: inline-block;
                }
                .current-location:hover {
                    cursor: pointer;
                }
                .search-dropdown {
                    display: none;
                    box-shadow: 0px 24px 48px 0 rgba(0, 0, 0, 0.16);
                    top: 128px;
                    width: calc(100% - 32px);
                }
                .search-results {
                    max-height: 300px;
                }
                .search-input {
                    width: calc(100% - 120px);
                }
                .search-dropdown:hover {
                    display: block;
                }
                input:focus + .search-dropdown {
                    display: block;
                }
                .skeleton-circle {
                    width: 52px;
                    height: 52px;
                    background-color: #ccc;
                    border-radius: 25%;
                    margin: 8px;
                    background-image: linear-gradient(90deg, #ddd 0px, #e8e8e8 40px, #ddd 80px);
                    background-size: 600px;
                    animation: shine-cirlce 1.4s infinite linear;
                }
                .skeleton-line {
                    width: 240px;
                    height: 16px;
                    margin-top: 12px;
                    border-radius: 7px;
                    background-image: linear-gradient(90deg, #ddd 0px, #e8e8e8 40px, #ddd 80px);
                    background-size: 600px;
                    animation: shine-lines 1.4s infinite linear;
                }
                @keyframes shine-lines {
                    0% {
                        background-position: -200px;
                    }
                    40%,
                    100% {
                        background-position: 240px;
                    }
                }
                @keyframes shine-cirlce {
                    0% {
                        background-position: -30px;
                    }
                    40%,
                    100% {
                        background-position: 150px;
                    }
                }
                @media only screen and (min-width: ${viewports.medium}px) {
                    .search-stores {
                        max-width: 65%;
                    }
                }
                @media only screen and (min-width: ${viewports.large}px) {
                    .search-stores {
                        width: 728px;
                        box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.25);
                    }
                    .search-dropdown {
                        width: 409px;
                        top: 58px;
                    }
                    .input-container {
                        border-left: 1px solid var(--br-disabled);
                        border-radius: initial;
                    }
                    .delivery-method-container {
                        max-width: 280px;
                        margin-right: 32px;
                    }
                }
            `}</style>
        </>
    );
};

export default StoreSearch;
