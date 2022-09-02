import { GetServerSidePropsResult, GetServerSidePropsContext } from "next";
import i18nInit from "i18";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Head from "next/head";
import { useRouter } from "next/router";

import { GlobalContext } from "context/global";
import CheckoutLayout from "components/layouts/checkout";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import CheckoutOrderSummaryPanel from "components/checkout/CheckoutOrderSummaryPanel";
import CheckoutAccordion from "components/checkout/CheckoutAccordion";
import Title from "components/UI/Title";
import TitleContentItems from "components/UI/TitleContentItems";
import Input from "components/UI/forms/Input";
import Checkbox from "components/UI/forms/Checkbox";
import RadioButton from "components/UI/forms/RadioButton";
import RadioButtonsGroup from "components/UI/forms/RadioButtonsGroup";
import Select from "components/UI/forms/Select";
import FormGroup from "components/UI/forms/FormGroup";
import Button from "components/UI/Button";
import populateGlobalResources from "i18/populateGlobalResources";
import DateTimePicker from "components/checkout/dateTimePicker/DateTimePicker";
import getCheckoutDataFetcher, { getCheckoutDataQuery } from "bdConnector/checkout/getCheckoutData";
import addBillingAddressToBasketFetcher, {
    addBillingAddressToBasketQuery,
} from "bdConnector/checkout/addBillingAddressToBasket";
import addPaymentMethodToBasketFetcher, {
    addPaymentMethodToBasketQuery,
} from "bdConnector/checkout/addPaymentMethodToBasket";
import addShippingAddressToBasketFetcher, {
    addShippingAddressToBasketQuery,
} from "bdConnector/checkout/addShippingAddressToBasket";
import addShippingMethodToBasketFetcher, {
    addShippingMethodToBasketQuery,
} from "bdConnector/checkout/addShippingMethodToBasket";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import { FetcherResponse } from "bdConnector/types";
import DotsLoader from "components/UI/DotsLoader";
import { validatePhone, validatePostalCode } from "utils";
import { StoreLocatorContext, storeLocatorContextDefaults } from "context/storelocator";
import countries from "../../config/countries.json";
import {
    DeliveryMethod,
    DeliveryMethods,
    SelectedStoreAddress,
    ShippingAddress,
    ShippingAddressInput,
} from "interfaces/checkout";
import createOrderFetcher, { createOrderQuery } from "bdConnector/checkout/createOrder";
import Divider from "components/UI/Divider";
interface CheckoutProps {
    i18: Record<string, string>;
    locale: string;
    globalResources: Record<string, string>;
    globalData: FetcherResponse<GlobalData>;
}

const Checkout = ({ i18, globalResources, globalData, locale }: CheckoutProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const storelocatorContext = useContext(StoreLocatorContext);
    const router = useRouter();
    const [i18Fd, setI18Fd] = useState(null);
    const [selectedStoreAddress, setSelectedStoreAddress] = useState<SelectedStoreAddress>(null);
    const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>(null);
    const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethods>(null);
    const [savedShippingAddressId, setSavedShippingAddressId] = useState<string>(null);
    const [savedBillingAddressId, setSavedBillingAddressId] = useState<string>(null);
    const [savedBillingAddress, setSavedBillingAddress] = useState<ShippingAddressInput>(null);
    const [savedShippingAddress, setSavedShippingAddress] = useState<ShippingAddressInput>(null);
    const [deliveryTime, setDeliveryTime] = useState<string>(null);
    const [dateTimePickerData, setDateTimePickerData] = useState(null);
    const [isDeliveryMethodConfirmed, setIsDeliveryMethodConfirmed] = useState<boolean>(null);
    const [deliveryIsPickup, setDeliveryIsPickup] = useState<boolean>(null);
    const [customerBillingAddress, setCustomerBillingAddress] = useState<ShippingAddressInput>(null);
    const [customerShippingAddress, setCustomerShippingAddress] = useState<ShippingAddressInput>(null);
    const [placeOrderBtnDisabled, setPlaceOrderBtnDisabled] = useState<boolean>(true);
    const [checkoutDataLoading, setChekoutDataLoading] = useState<boolean>(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

    const { data: checkoutData, isValidating } = useSWR(
        [getCheckoutDataQuery, locale, i18.custom],
        getCheckoutDataFetcher,
        {
            onError: (e) => console.error(e),
            revalidateOnFocus: false,
        }
    );

    const [deliveryMethodsAccordionState, setDeliveryMethodsAccordionState] = useState({
        isOpen: true,
        canBeOpened: true,
        canBeClosed: false,
    });

    const [shippingAddressAccordionState, setShippingAddressAccordionState] = useState({
        isOpen: false,
        canBeOpened: false,
        canBeClosed: false,
    });

    const [billingAddressAccordionState, setBillingAddressAccordionState] = useState({
        isOpen: false,
        canBeOpened: false,
        canBeClosed: false,
    });

    const [inStorePickupAccordionState, setIstorePickupAccordionState] = useState({
        isOpen: false,
        canBeOpened: false,
        canBeClosed: false,
    });

    const [showDateTimePicker, setShowDateTimePicker] = useState(false);

    const {
        register,
        getValues,
        setValue,
        trigger,
        handleSubmit,
        reset,
        formState: { errors, isSubmitted },
    } = useForm();

    useEffect(() => {
        i18nInit(locale)
            .then((i18Fd) => {
                setI18Fd(i18Fd);
            })
            .catch((e) => {
                console.log("Error during checkout i18n initialization:", e);
            });
    }, [locale]);

    const [shippingAddressValidatedFieldsList, setShippingAddressValidatedFieldsList] = useState({
        firstName: false,
        lastName: false,
        address1: false,
        address2: false,
        country: false,
        city: false,
        state: false,
        zip: false,
        phone: false,
    });

    const [billingAddressValidatedFieldsList, setBillingAddressValidatedFieldsList] = useState({
        firstName: false,
        lastName: false,
        address1: false,
        address2: false,
        country: false,
        city: false,
        state: false,
        zip: false,
        phone: false,
    });

    useEffect(() => {
        if (!checkoutData) {
            return;
        }

        setSavedAddresses(checkoutData?.data?.savedAddresses);
        setDeliveryMethods(checkoutData?.data?.deliveryMethods);
        setSelectedStoreAddress(checkoutData?.data?.selectedStoreAddress);

        const deliveryMethodId = storelocatorContext.deliveryMethodId;
        let deliveryMethodData = deliveryMethods?.items?.find(
            (deliveryMethod: DeliveryMethod) => deliveryMethod.id === deliveryMethodId
        );

        if (!deliveryMethodData) {
            deliveryMethodData = deliveryMethods?.items?.find(
                (deliveryMethod: DeliveryMethod) => storeLocatorContextDefaults.deliveryMethodId === deliveryMethod.id
            );
        }

        setShowDateTimePicker(deliveryMethodData?.requiresDate);
        setDateTimePickerData(checkoutData?.data?.dateTimePickerData);

        setSavedShippingAddress({
            address1: checkoutData?.data?.primaryAddressData?.address1,
            address2: checkoutData?.data?.primaryAddressData?.address2,
            city: checkoutData?.data?.primaryAddressData?.city,
            countryCode: checkoutData?.data?.primaryAddressData?.country,
            firstName: checkoutData?.data?.primaryAddressData?.firstName,
            lastName: checkoutData?.data?.primaryAddressData?.lastName,
            phone: checkoutData?.data?.primaryAddressData?.phone,
            postalCode: checkoutData?.data?.primaryAddressData?.zip,
            stateCode: checkoutData?.data?.primaryAddressData?.state,
            addressName: checkoutData?.data?.primaryAddressData?.addressName,
        });

        setSavedBillingAddress({
            address1: checkoutData?.data?.primaryAddressData?.address1,
            address2: checkoutData?.data?.primaryAddressData?.address2,
            city: checkoutData?.data?.primaryAddressData?.city,
            countryCode: checkoutData?.data?.primaryAddressData?.country,
            firstName: checkoutData?.data?.primaryAddressData?.firstName,
            lastName: checkoutData?.data?.primaryAddressData?.lastName,
            phone: checkoutData?.data?.primaryAddressData?.phone,
            postalCode: checkoutData?.data?.primaryAddressData?.zip,
            stateCode: checkoutData?.data?.primaryAddressData?.state,
            addressName: checkoutData?.data?.primaryAddressData?.addressName,
        });

        reset({
            activeSavedShippingAddressId: savedShippingAddressId ?? checkoutData?.data?.primaryAddressData?.id,
            activeSavedBillingAddressId: savedBillingAddressId ?? checkoutData?.data?.primaryAddressData?.id,
            shippingAddress: customerShippingAddress ?? savedShippingAddress,
            billingAddress: customerBillingAddress ?? savedBillingAddress,
            deliveryMethodId: storelocatorContext.deliveryMethodId,
            deliveryTime: deliveryTime,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        checkoutData?.data,
        customerBillingAddress,
        customerShippingAddress,
        deliveryMethods?.items,
        deliveryTime,
        reset,
    ]);

    const handleDeliveryMethodSelected = (deliveryMethod: DeliveryMethod): void => {
        setShowDateTimePicker(deliveryMethod.requiresDate);
        storelocatorContext.setDeliveryMethodId(deliveryMethod.id);
        setValue("deliveryMethodId", deliveryMethod.id);
    };

    const confirmDeliveryMethod = async ({ enableLoading }: { enableLoading: boolean }): Promise<void> => {
        enableLoading && globalContext.setScreenBlockLoader(true);
        const deliveryTime = getValues("deliveryTime");
        const basket = globalContext?.basket;
        const shipment = basket?.shipments[0];
        const basketDeliveryMethodId = shipment?.shippingMethod?.id;
        const deliveryMethodId = getValues("deliveryMethodId");

        if (deliveryMethodId !== basketDeliveryMethodId || !basketDeliveryMethodId) {
            const { data } = await addShippingMethodToBasketFetcher(addShippingMethodToBasketQuery, deliveryMethodId);
            globalContext.setBasket(data);
        }

        const deliveryMethodData = deliveryMethods?.items.find(
            (deliveryMethod: DeliveryMethod) => deliveryMethod.id === deliveryMethodId
        );

        setDeliveryIsPickup(deliveryMethodData?.isStorePickup);

        if (deliveryMethodData?.requiresDate) {
            setDeliveryTime(deliveryTime);
        }

        const activeSavedShippingAddressId = getValues("activeSavedShippingAddressId");

        if (activeSavedShippingAddressId) {
            const address = savedAddresses?.find((address) => address.id === activeSavedShippingAddressId);

            if (address) {
                setCustomerShippingAddress({
                    address1: address?.address1 ?? "",
                    address2: address?.address2 ?? "",
                    city: address.city,
                    countryCode: address.country,
                    firstName: address.firstName,
                    lastName: address.lastName,
                    phone: address.phone,
                    postalCode: address.zip,
                    stateCode: address.state,
                    addressName: address.addressName,
                });
            }
        }

        setDeliveryMethodsAccordionState({
            isOpen: false,
            canBeClosed: true,
            canBeOpened: true,
        });

        setShippingAddressAccordionState({
            isOpen: !deliveryMethodData?.isStorePickup ?? false,
            canBeClosed: false,
            canBeOpened: true,
        });

        setIstorePickupAccordionState({
            isOpen: deliveryMethodData?.isStorePickup ?? false,
            canBeClosed: false,
            canBeOpened: true,
        });

        setIsDeliveryMethodConfirmed(true);
        enableLoading && globalContext.setScreenBlockLoader(false);
    };

    const validateShippingAddress = async ({ enableLoading }: { enableLoading: boolean }): Promise<void> => {
        enableLoading && globalContext.setScreenBlockLoader(true);
        const firstNameValid = await trigger("shippingAddress.firstName", { shouldFocus: true });
        const lastNameValid = await trigger("shippingAddress.lastName", { shouldFocus: true });
        const address1Valid = await trigger("shippingAddress.address1", { shouldFocus: true });
        const countryValid = await trigger("shippingAddress.countryCode", { shouldFocus: true });
        const cityValid = await trigger("shippingAddress.city", { shouldFocus: true });
        const stateValid = await trigger("shippingAddress.stateCode", { shouldFocus: true });
        const zipValid = await trigger("shippingAddress.postalCode", { shouldFocus: true });
        const phoneInvalid = await trigger("shippingAddress.phone", { shouldFocus: true });

        setShippingAddressValidatedFieldsList({
            firstName: true,
            lastName: true,
            address1: true,
            address2: true,
            country: true,
            city: true,
            state: true,
            zip: true,
            phone: true,
        });

        if (
            firstNameValid &&
            lastNameValid &&
            address1Valid &&
            countryValid &&
            cityValid &&
            stateValid &&
            zipValid &&
            phoneInvalid
        ) {
            const firstName = getValues("shippingAddress.firstName");
            const lastName = getValues("shippingAddress.lastName");
            const address1 = getValues("shippingAddress.address1");
            const address2 = getValues("shippingAddress.address2");
            const country = getValues("shippingAddress.countryCode");
            const city = getValues("shippingAddress.city");
            const state = getValues("shippingAddress.stateCode");
            const zip = getValues("shippingAddress.postalCode");
            const phone = getValues("shippingAddress.phone");
            const sameAsBilling = getValues("shippingAddress.sameAsBilling");

            let address: ShippingAddressInput = {
                firstName: firstName,
                lastName: lastName,
                address1: address1,
                address2: address2 ? address2 : null,
                countryCode: country,
                city: city,
                stateCode: state,
                phone: phone,
                postalCode: zip,
            };

            if (deliveryIsPickup) {
                address = {
                    address1: selectedStoreAddress.address1,
                    address2: selectedStoreAddress.address2,
                    city: selectedStoreAddress.city,
                    countryCode: selectedStoreAddress.countryCode,
                    firstName,
                    lastName,
                    phone,
                    stateCode: selectedStoreAddress.stateCode,
                    postalCode: selectedStoreAddress.postalCode,
                };
            }

            const basket = globalContext.basket;
            const shipment = basket.shipments[0];
            let basketHasDifferentShippingAddress = false;

            const basketShippingAddress = shipment?.shippingAddress ?? null;

            if (basketShippingAddress) {
                delete basketShippingAddress.id;
                delete basketShippingAddress.fullName;

                for (const key in basketShippingAddress) {
                    if (basketShippingAddress[key] !== address[key]) {
                        basketHasDifferentShippingAddress = true;
                    }
                }
            }

            if (basketHasDifferentShippingAddress || !basketShippingAddress) {
                const { data } = await addShippingAddressToBasketFetcher(addShippingAddressToBasketQuery, {
                    ...address,
                    address2: address2 ? address2 : "",
                });
                globalContext.setBasket(data);
            }

            address.addressName = savedAddresses?.find(
                (address) => address.id === getValues("activeSavedShippingAddressId")
            )?.addressName;

            setCustomerShippingAddress(address);

            if (deliveryIsPickup) {
                setIstorePickupAccordionState({
                    isOpen: false,
                    canBeClosed: true,
                    canBeOpened: true,
                });
            }

            if (sameAsBilling) {
                setBillingAddressValidatedFieldsList({
                    firstName: true,
                    lastName: true,
                    address1: true,
                    address2: true,
                    country: true,
                    city: true,
                    state: true,
                    zip: true,
                    phone: true,
                });

                if ("addressName" in address) {
                    delete address.addressName;
                }

                let basketHasDifferentBillingAddress = false;
                const basket = globalContext.basket;
                const basketBillingAddress = basket?.billingAddress ?? null;

                if (basketBillingAddress) {
                    delete basketBillingAddress.id;
                    delete basketBillingAddress.fullName;

                    for (const key in basketBillingAddress) {
                        if (basketBillingAddress[key] !== address[key]) {
                            basketHasDifferentBillingAddress = true;
                        }
                    }
                }

                if (basketHasDifferentBillingAddress || !basketBillingAddress) {
                    const { data } = await addBillingAddressToBasketFetcher(addBillingAddressToBasketQuery, {
                        ...address,
                        address2: address2 ? address2 : "",
                    });

                    globalContext.setBasket(data);
                }

                const activeSavedShippingAddressId = getValues("activeSavedShippingAddressId");

                address.addressName = savedAddresses?.find(
                    (address) => address.id === activeSavedShippingAddressId
                )?.addressName;

                setCustomerBillingAddress(address);

                setShippingAddressAccordionState({
                    isOpen: false,
                    canBeClosed: false,
                    canBeOpened: true,
                });

                setBillingAddressAccordionState({
                    isOpen: false,
                    canBeClosed: true,
                    canBeOpened: true,
                });

                setPlaceOrderBtnDisabled(false);
            } else {
                setShippingAddressAccordionState({
                    isOpen: false,
                    canBeClosed: true,
                    canBeOpened: true,
                });

                setBillingAddressAccordionState({
                    isOpen: true,
                    canBeClosed: false,
                    canBeOpened: true,
                });
            }
        }

        enableLoading && globalContext.setScreenBlockLoader(false);
    };

    const validateBillingAddress = async ({ enableLoading }: { enableLoading: boolean }): Promise<void> => {
        enableLoading && globalContext.setScreenBlockLoader(true);
        const firstName = await trigger("billingAddress.firstName", { shouldFocus: true });
        const lastName = await trigger("billingAddress.lastName", { shouldFocus: true });
        const address1 = await trigger("billingAddress.address1", { shouldFocus: true });
        const city = await trigger("billingAddress.city", { shouldFocus: true });
        const state = await trigger("billingAddress.stateCode", { shouldFocus: true });
        const zip = await trigger("billingAddress.postalCode", { shouldFocus: true });
        const country = await trigger("billingAddress.countryCode", { shouldFocus: true });
        const phone = await trigger("billingAddress.phone", { shouldFocus: true });

        setBillingAddressValidatedFieldsList({
            firstName: true,
            lastName: true,
            address1: true,
            address2: true,
            country: true,
            city: true,
            state: true,
            zip: true,
            phone: true,
        });

        if (firstName && lastName && address1 && country && city && state && zip && phone) {
            const firstName = getValues("billingAddress.firstName");
            const lastName = getValues("billingAddress.lastName");
            const address1 = getValues("billingAddress.address1");
            const address2 = getValues("billingAddress.address2");
            const country = getValues("billingAddress.countryCode");
            const city = getValues("billingAddress.city");
            const state = getValues("billingAddress.stateCode");
            const zip = getValues("billingAddress.postalCode");
            const phone = getValues("billingAddress.phone");

            const billing = {
                firstName: firstName,
                lastName: lastName,
                address1: address1,
                address2: address2 ? address2 : null,
                countryCode: country,
                city: city,
                stateCode: state,
                phone: phone,
                postalCode: zip,
            };

            let basketHasDifferentBillingAddress = false;
            const basket = globalContext.basket;
            const basketBillingAddress = basket?.billingAddress ?? null;

            if (basketBillingAddress) {
                delete basketBillingAddress.id;
                delete basketBillingAddress.fullName;

                for (const key in basketBillingAddress) {
                    if (basketBillingAddress[key] !== billing[key]) {
                        basketHasDifferentBillingAddress = true;
                    }
                }
            }

            if (basketHasDifferentBillingAddress || !basketBillingAddress) {
                const { data } = await addBillingAddressToBasketFetcher(addBillingAddressToBasketQuery, {
                    ...billing,
                    address2: address2 ? address2 : "",
                });

                globalContext.setBasket(data);
            }

            setCustomerBillingAddress({
                firstName: firstName,
                lastName: lastName,
                address1: address1,
                address2: address2,
                countryCode: country,
                city: city,
                stateCode: state,
                phone: phone,
                postalCode: zip,
                addressName: savedAddresses?.find((address) => address.id === getValues("activeSavedBillingAddressId"))
                    ?.addressName,
            });

            setBillingAddressAccordionState({
                isOpen: false,
                canBeClosed: true,
                canBeOpened: true,
            });

            setPlaceOrderBtnDisabled(false);
        }

        enableLoading && globalContext.setScreenBlockLoader(false);
    };

    const returningCustomer = async (): Promise<void> => {
        await confirmDeliveryMethod({ enableLoading: false });
        await validateShippingAddress({ enableLoading: false });
        await validateBillingAddress({ enableLoading: false });

        setChekoutDataLoading(false);
    };

    useEffect(() => {
        setChekoutDataLoading(true);

        if (!isValidating && checkoutData && globalContext?.basket?.productItems?.length) {
            const deliveryMethodData = checkoutData?.data?.deliveryMethods?.items?.find(
                (elm) => elm.id === storelocatorContext.deliveryMethodId
            );

            if (deliveryMethodData) {
                if (
                    !deliveryMethodData?.isStorePickup &&
                    !deliveryMethodData?.requiresDate &&
                    checkoutData?.data?.primaryAddressData.isPrimary
                ) {
                    returningCustomer();
                } else {
                    setIstorePickupAccordionState({
                        isOpen: false,
                        canBeClosed: false,
                        canBeOpened: false,
                    });

                    setShippingAddressAccordionState({
                        isOpen: false,
                        canBeClosed: false,
                        canBeOpened: false,
                    });

                    setBillingAddressAccordionState({
                        isOpen: false,
                        canBeClosed: false,
                        canBeOpened: false,
                    });

                    setDeliveryMethodsAccordionState({
                        isOpen: true,
                        canBeClosed: false,
                        canBeOpened: false,
                    });

                    setIsDeliveryMethodConfirmed(false);
                    setChekoutDataLoading(false);
                }
            }
        } else {
            setChekoutDataLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValidating, checkoutData?.data?.deliveryMethods?.items, checkoutData?.data?.primaryAddressData?.isPrimary]);

    const handlePlaceOrder = async (): Promise<void> => {
        setIsPlacingOrder(true);

        try {
            const { data: newBasket } = await addPaymentMethodToBasketFetcher(
                addPaymentMethodToBasketQuery,
                "STRIPE_CREDIT_CARD"
            );

            globalContext.setBasket(newBasket);

            const res = await createOrderFetcher(createOrderQuery, storelocatorContext?.selectedStore?.id);

            router.replace(`/checkout/payment/${res.data.orderNo}`);
            storelocatorContext.setDeliveryMethodId(
                globalData?.data?.storelocatorConfigs?.defaultDeliveryMethodId ?? null
            );
        } catch (error) {
            setIsPlacingOrder(false);
            globalContext.showNotification({
                type: "error",
                message: globalResources.internalServerError,
                autoClose: true,
            });
        }
    };

    return (
        <>
            <Head>
                <title>{i18.pageTitle}</title>
                <meta property="og:title" content={i18.pageTitle} key="title" />
            </Head>
            <CheckoutLayout
                globalResources={globalResources}
                themeVariables={globalContext.themeCssString}
                globalData={globalData}
                locale={locale}
            >
                <CenterContentWrapper>
                    {!checkoutDataLoading && globalContext?.basket?.productItems?.length && !isValidating ? (
                        <section className="flex flex-col items-center lg:items-start lg:flex-row justify-center mt-5 lg:mt-10 py-14">
                            <section className="grow-1 w-full">
                                <Title alignment="left" type="h1">
                                    {i18.title}
                                </Title>
                                <form onSubmit={handleSubmit(handlePlaceOrder)}>
                                    <CheckoutAccordion
                                        title={i18.deliveryMethods}
                                        closedTabContent={
                                            storelocatorContext.deliveryMethodId && (
                                                <TitleContentItems
                                                    title={i18.details}
                                                    items={[
                                                        {
                                                            text: deliveryMethods?.items?.find(
                                                                (i: any) =>
                                                                    i.id === storelocatorContext.deliveryMethodId
                                                            ).name,
                                                        },
                                                    ]}
                                                />
                                            )
                                        }
                                        editBtnText={i18.edit}
                                        isOpen={deliveryMethodsAccordionState.isOpen}
                                        openSetter={(isOpen) => {
                                            setDeliveryMethodsAccordionState({
                                                ...deliveryMethodsAccordionState,
                                                isOpen: isOpen,
                                            });
                                        }}
                                        canBeOpened={deliveryMethodsAccordionState.canBeClosed}
                                        canBeClosed={deliveryMethodsAccordionState.canBeClosed}
                                    >
                                        <RadioButtonsGroup>
                                            <FormGroup tabletViewport={globalContext.viewports.medium} columns="two">
                                                {deliveryMethods &&
                                                    deliveryMethods?.items?.map((deliveryMethod) => {
                                                        return (
                                                            <RadioButton
                                                                error={errors?.deliveryMethodId?.message}
                                                                key={deliveryMethod.id}
                                                                variant="wheel"
                                                                onChange={() =>
                                                                    handleDeliveryMethodSelected(deliveryMethod)
                                                                }
                                                                value={deliveryMethod.id}
                                                                id={deliveryMethod.id}
                                                                label={deliveryMethod.name}
                                                                icon={
                                                                    deliveryMethod.isStorePickup
                                                                        ? "icon-store-1"
                                                                        : "icon-delivery-2"
                                                                }
                                                                subLabel={deliveryMethod.price}
                                                                formHooksRegister={register("deliveryMethodId", {
                                                                    required: i18.deliveryMethodsRequiredError,
                                                                })}
                                                            />
                                                        );
                                                    })}

                                                <section className={`${!showDateTimePicker && "hidden"}`}>
                                                    <DateTimePicker
                                                        className="mt-5"
                                                        selectTimeText={i18.selectTime}
                                                        amText={i18.amText}
                                                        pmText={i18.pmText}
                                                        radioGroupName="deliveryTime"
                                                        error={errors?.deliveryTime?.message}
                                                        chooseHourErrorText={i18.pleaseChooseHour}
                                                        hooksFormRegister={register}
                                                        hooksFormReset={reset}
                                                        hooksFormGetValues={getValues}
                                                        weekDaysTexts={dateTimePickerData?.weekDaysTexts}
                                                        months={dateTimePickerData?.months}
                                                        required={showDateTimePicker}
                                                    />
                                                </section>
                                            </FormGroup>
                                        </RadioButtonsGroup>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() => confirmDeliveryMethod({ enableLoading: true })}
                                            className="mt-6"
                                        >
                                            {i18.confirmDeliveryMethod}
                                        </Button>
                                    </CheckoutAccordion>
                                    {isDeliveryMethodConfirmed && (
                                        <>
                                            {deliveryIsPickup ? (
                                                <CheckoutAccordion
                                                    className={`zmt-5 lg:mt-10`}
                                                    title={i18.pickupDetails}
                                                    closedTabContent={
                                                        <TitleContentItems
                                                            title={i18.pickupAddress}
                                                            items={[{ text: selectedStoreAddress.address1 }]}
                                                        />
                                                    }
                                                    editBtnText={i18.edit}
                                                    isOpen={inStorePickupAccordionState.isOpen}
                                                    openSetter={(isOpen) => {
                                                        setIstorePickupAccordionState({
                                                            ...inStorePickupAccordionState,
                                                            isOpen,
                                                        });
                                                    }}
                                                    canBeClosed={inStorePickupAccordionState.canBeClosed}
                                                    canBeOpened={inStorePickupAccordionState.canBeOpened}
                                                >
                                                    <div>
                                                        <p className="font-primary font-bold text-lg mb-2">
                                                            {i18.pickupAddress}
                                                        </p>
                                                        <address>{selectedStoreAddress.address1}</address>
                                                    </div>
                                                    {savedAddresses?.length > 0 && (
                                                        <div
                                                            className={`${savedAddresses.length === 1 ? "hidden" : ""}`}
                                                        >
                                                            <FormGroup
                                                                tabletViewport={globalContext.viewports.medium}
                                                                columns="one"
                                                            >
                                                                <Select
                                                                    id="activeSavedShippingAddressId"
                                                                    label={i18.savedAddresses}
                                                                    error={
                                                                        errors?.activeSavedShippingAddressId?.message
                                                                    }
                                                                    formHooksRegister={register(
                                                                        "activeSavedShippingAddressId",
                                                                        {
                                                                            required: i18.savedAddressesError,
                                                                        }
                                                                    )}
                                                                    onChange={() => {
                                                                        const chosenAddressId = getValues(
                                                                            "activeSavedShippingAddressId"
                                                                        );

                                                                        const chosenAddress = savedAddresses?.find(
                                                                            (address) => address.id === chosenAddressId
                                                                        );

                                                                        if (deliveryIsPickup) {
                                                                            setCustomerShippingAddress({
                                                                                firstName: chosenAddress.firstName,
                                                                                lastName: chosenAddress.lastName,
                                                                                phone: chosenAddress.phone,
                                                                                address1: selectedStoreAddress.address1,
                                                                                address2:
                                                                                    selectedStoreAddress?.address2 ??
                                                                                    "",
                                                                                city: selectedStoreAddress.city,
                                                                                countryCode:
                                                                                    selectedStoreAddress.countryCode,
                                                                                stateCode:
                                                                                    selectedStoreAddress.stateCode,
                                                                                postalCode:
                                                                                    selectedStoreAddress.postalCode,
                                                                                addressName: chosenAddress.addressName,
                                                                            });
                                                                        } else {
                                                                            setCustomerShippingAddress({
                                                                                stateCode: chosenAddress.state,
                                                                                countryCode: chosenAddress.country,
                                                                                address1: chosenAddress.address1,
                                                                                address2: chosenAddress?.address2 ?? "",
                                                                                city: chosenAddress.city,
                                                                                postalCode: chosenAddress.zip,
                                                                                firstName: chosenAddress.firstName,
                                                                                lastName: chosenAddress.lastName,
                                                                                phone: chosenAddress.phone,
                                                                                addressName: chosenAddress.addressName,
                                                                            });
                                                                        }

                                                                        setSavedShippingAddressId(chosenAddressId);
                                                                    }}
                                                                >
                                                                    {savedAddresses?.map((address) => {
                                                                        return (
                                                                            <option key={address.id} value={address.id}>
                                                                                {address.addressName}
                                                                            </option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </FormGroup>
                                                        </div>
                                                    )}
                                                    <FormGroup
                                                        tabletViewport={globalContext.viewports.medium}
                                                        columns="two"
                                                    >
                                                        <Input
                                                            type="text"
                                                            error={errors?.shippingAddress?.firstName?.message}
                                                            id="shippingAddress.firstName"
                                                            isValidated={
                                                                isSubmitted ||
                                                                shippingAddressValidatedFieldsList.firstName
                                                            }
                                                            placeholder={i18.NamePlaceholder}
                                                            label={i18.Name}
                                                            isRequired={true}
                                                            formHooksRegister={register("shippingAddress.firstName", {
                                                                required: i18.NameRequiredError,
                                                                minLength: {
                                                                    value: 3,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:minLengthError", {
                                                                              number: 3,
                                                                          })
                                                                        : "",
                                                                },
                                                                maxLength: {
                                                                    value: 20,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:maxLengthError", {
                                                                              number: 20,
                                                                          })
                                                                        : "",
                                                                },
                                                            })}
                                                        />
                                                        <Input
                                                            type="text"
                                                            error={errors?.shippingAddress?.lastName?.message}
                                                            id="shippingAddress.lastName"
                                                            isValidated={
                                                                isSubmitted ||
                                                                shippingAddressValidatedFieldsList.lastName
                                                            }
                                                            placeholder={i18.LastNamePlaceholder}
                                                            label={i18.LastName}
                                                            isRequired={true}
                                                            formHooksRegister={register("shippingAddress.lastName", {
                                                                required: i18.LastNameRequiredError,
                                                                minLength: {
                                                                    value: 2,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:minLengthError", {
                                                                              number: 2,
                                                                          })
                                                                        : "",
                                                                },
                                                                maxLength: {
                                                                    value: 20,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:maxLengthError", {
                                                                              number: 20,
                                                                          })
                                                                        : "",
                                                                },
                                                            })}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup
                                                        tabletViewport={globalContext.viewports.medium}
                                                        columns="one"
                                                    >
                                                        <Input
                                                            type="text"
                                                            error={errors?.shippingAddress?.phone?.message}
                                                            id="shippingAddress.phone"
                                                            isValidated={
                                                                isSubmitted || shippingAddressValidatedFieldsList.phone
                                                            }
                                                            placeholder={i18.phonePlaceholder}
                                                            label={i18.phone}
                                                            isRequired={true}
                                                            formHooksRegister={register("shippingAddress.phone", {
                                                                required: i18.phoneRequired,
                                                                minLength: {
                                                                    value: 10,
                                                                    message: i18.phoneInvalid,
                                                                },
                                                                maxLength: {
                                                                    value: 20,
                                                                    message: i18.phoneInvalid,
                                                                },
                                                                validate: {
                                                                    validate: (value) =>
                                                                        validatePhone(value, i18.phoneInvalid),
                                                                },
                                                            })}
                                                        />
                                                    </FormGroup>
                                                    <Button
                                                        type="button"
                                                        variant="primary"
                                                        onClick={async () =>
                                                            await validateShippingAddress({ enableLoading: true })
                                                        }
                                                        className="mt-6"
                                                    >
                                                        {i18.confirmPickup}
                                                    </Button>
                                                </CheckoutAccordion>
                                            ) : (
                                                <CheckoutAccordion
                                                    className={`zmt-5 lg:mt-10`}
                                                    title={i18.shippingAddress}
                                                    closedTabContent={
                                                        <>
                                                            <p className="font-primary text-lg text-t-primary font-bold mt-3">
                                                                {i18.details}
                                                            </p>
                                                            <p className="font-primary text-sm text-t-primary mt-1">
                                                                {customerShippingAddress?.addressName ??
                                                                    savedShippingAddress?.addressName}
                                                            </p>
                                                            <address>
                                                                {`${
                                                                    customerShippingAddress?.address1 ??
                                                                    savedShippingAddress?.address1
                                                                }, `}
                                                                {`${
                                                                    customerShippingAddress?.firstName ??
                                                                    savedShippingAddress?.firstName
                                                                } `}
                                                                {customerShippingAddress?.lastName ??
                                                                    savedShippingAddress?.lastName}
                                                            </address>
                                                        </>
                                                    }
                                                    editBtnText={i18.edit}
                                                    isOpen={shippingAddressAccordionState.isOpen}
                                                    openSetter={(isOpen) => {
                                                        setShippingAddressAccordionState({
                                                            ...shippingAddressAccordionState,
                                                            isOpen: isOpen,
                                                        });
                                                    }}
                                                    canBeOpened={shippingAddressAccordionState.canBeOpened}
                                                    canBeClosed={shippingAddressAccordionState.canBeClosed}
                                                >
                                                    {savedAddresses?.length > 0 && (
                                                        <div
                                                            className={`${savedAddresses.length === 1 ? "hidden" : ""}`}
                                                        >
                                                            <FormGroup
                                                                tabletViewport={globalContext.viewports.medium}
                                                                columns="one"
                                                            >
                                                                <Select
                                                                    id="activeSavedShippingAddressId"
                                                                    label={i18.savedAddresses}
                                                                    error={
                                                                        errors?.activeSavedShippingAddressId?.message
                                                                    }
                                                                    formHooksRegister={register(
                                                                        "activeSavedShippingAddressId",
                                                                        {
                                                                            required: i18.savedAddressesError,
                                                                        }
                                                                    )}
                                                                    onChange={() => {
                                                                        const chosenAddressId = getValues(
                                                                            "activeSavedShippingAddressId"
                                                                        );

                                                                        const chosenAddress = savedAddresses?.find(
                                                                            (address) => address.id === chosenAddressId
                                                                        );

                                                                        setCustomerShippingAddress({
                                                                            stateCode: chosenAddress.state,
                                                                            countryCode: chosenAddress.country,
                                                                            address1: chosenAddress.address1,
                                                                            address2: chosenAddress?.address2 ?? "",
                                                                            city: chosenAddress.city,
                                                                            postalCode: chosenAddress.zip,
                                                                            firstName: chosenAddress.firstName,
                                                                            lastName: chosenAddress.lastName,
                                                                            phone: chosenAddress.phone,
                                                                            addressName: chosenAddress.addressName,
                                                                        });

                                                                        setSavedShippingAddressId(chosenAddressId);
                                                                    }}
                                                                >
                                                                    {savedAddresses?.map((address) => {
                                                                        return (
                                                                            <option key={address.id} value={address.id}>
                                                                                {address.addressName}
                                                                            </option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </FormGroup>
                                                        </div>
                                                    )}

                                                    <FormGroup
                                                        tabletViewport={globalContext.viewports.medium}
                                                        columns="two"
                                                    >
                                                        <Input
                                                            type="text"
                                                            error={errors?.shippingAddress?.firstName?.message}
                                                            id="shippingAddress.firstName"
                                                            isValidated={
                                                                isSubmitted ||
                                                                shippingAddressValidatedFieldsList.firstName
                                                            }
                                                            placeholder={i18.NamePlaceholder}
                                                            label={i18.Name}
                                                            isRequired={true}
                                                            formHooksRegister={register("shippingAddress.firstName", {
                                                                required: i18.NameRequiredError,
                                                                minLength: {
                                                                    value: 3,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:minLengthError", {
                                                                              number: 3,
                                                                          })
                                                                        : "",
                                                                },
                                                                maxLength: {
                                                                    value: 20,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:maxLengthError", {
                                                                              number: 20,
                                                                          })
                                                                        : "",
                                                                },
                                                            })}
                                                        />
                                                        <Input
                                                            type="text"
                                                            error={errors?.shippingAddress?.lastName?.message}
                                                            id="shippingAddress.lastName"
                                                            isValidated={
                                                                isSubmitted ||
                                                                shippingAddressValidatedFieldsList.lastName
                                                            }
                                                            placeholder={i18.LastNamePlaceholder}
                                                            label={i18.LastName}
                                                            isRequired={true}
                                                            formHooksRegister={register("shippingAddress.lastName", {
                                                                required: i18.LastNameRequiredError,
                                                                minLength: {
                                                                    value: 2,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:minLengthError", {
                                                                              number: 2,
                                                                          })
                                                                        : "",
                                                                },
                                                                maxLength: {
                                                                    value: 20,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:maxLengthError", {
                                                                              number: 20,
                                                                          })
                                                                        : "",
                                                                },
                                                            })}
                                                        />
                                                    </FormGroup>
                                                    <Input
                                                        type="text"
                                                        error={errors?.shippingAddress?.address1?.message}
                                                        id="shippingAddress.address1"
                                                        isValidated={
                                                            isSubmitted || shippingAddressValidatedFieldsList.address1
                                                        }
                                                        placeholder={i18.address1Placeholder}
                                                        label={i18.address1}
                                                        isRequired={true}
                                                        formHooksRegister={register("shippingAddress.address1", {
                                                            required: i18.address1RequiredError,
                                                            minLength: {
                                                                value: 2,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:minLengthError", { number: 2 })
                                                                    : "",
                                                            },
                                                            maxLength: {
                                                                value: 40,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:maxLengthError", { number: 40 })
                                                                    : "",
                                                            },
                                                        })}
                                                    />
                                                    <Input
                                                        id="shippingAddress.address2"
                                                        type="text"
                                                        error={errors?.shippingAddress?.address2?.message}
                                                        isValidated={
                                                            isSubmitted || shippingAddressValidatedFieldsList.address2
                                                        }
                                                        placeholder={i18.address2Placeholder}
                                                        label={i18.address2}
                                                        formHooksRegister={register("shippingAddress.address2", {
                                                            minLength: {
                                                                value: 3,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:minLengthError", { number: 3 })
                                                                    : "",
                                                            },
                                                            maxLength: {
                                                                value: 40,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:maxLengthError", { number: 40 })
                                                                    : "",
                                                            },
                                                        })}
                                                    />
                                                    <FormGroup
                                                        tabletViewport={globalContext.viewports.medium}
                                                        columns="two"
                                                    >
                                                        <Select
                                                            label={i18.country}
                                                            formHooksRegister={register("shippingAddress.countryCode")}
                                                            id="shippingAddress.countryCode"
                                                        >
                                                            {countries.map((countryCode: string) => {
                                                                return (
                                                                    <option key={countryCode} value={countryCode}>
                                                                        {i18[countryCode]}
                                                                    </option>
                                                                );
                                                            })}
                                                        </Select>

                                                        <Input
                                                            id="shippingAddress.city"
                                                            type="text"
                                                            error={errors?.shippingAddress?.city?.message}
                                                            isValidated={
                                                                isSubmitted || shippingAddressValidatedFieldsList.city
                                                            }
                                                            placeholder={i18.cityPlaceholder}
                                                            label={i18.city}
                                                            isRequired={true}
                                                            formHooksRegister={register("shippingAddress.city", {
                                                                required: i18.cityRequired,
                                                                minLength: {
                                                                    value: 2,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:minLengthError", {
                                                                              number: 2,
                                                                          })
                                                                        : "",
                                                                },
                                                                maxLength: {
                                                                    value: 40,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:maxLengthError", {
                                                                              number: 40,
                                                                          })
                                                                        : "",
                                                                },
                                                            })}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup
                                                        tabletViewport={globalContext.viewports.medium}
                                                        columns="two"
                                                    >
                                                        <Input
                                                            id="shippingAddress.stateCode"
                                                            type="text"
                                                            error={errors?.shippingAddress?.stateCode?.message}
                                                            isValidated={
                                                                isSubmitted || shippingAddressValidatedFieldsList.state
                                                            }
                                                            placeholder={i18.statePlaceholder}
                                                            label={i18.state}
                                                            isRequired={true}
                                                            formHooksRegister={register("shippingAddress.stateCode", {
                                                                required: i18.stateRequired,
                                                                minLength: {
                                                                    value: 2,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:minLengthError", {
                                                                              number: 2,
                                                                          })
                                                                        : "",
                                                                },
                                                                maxLength: {
                                                                    value: 40,
                                                                    message: i18Fd
                                                                        ? i18Fd.t("checkout:maxLengthError", {
                                                                              number: 40,
                                                                          })
                                                                        : "",
                                                                },
                                                            })}
                                                        />

                                                        <Input
                                                            id="shippingAddress.postalCode"
                                                            type="text"
                                                            error={errors?.shippingAddress?.postalCode?.message}
                                                            isValidated={
                                                                isSubmitted || shippingAddressValidatedFieldsList.zip
                                                            }
                                                            placeholder={i18.postalCodePlaceholder}
                                                            label={i18.postalCode}
                                                            isRequired={true}
                                                            formHooksRegister={register("shippingAddress.postalCode", {
                                                                required: i18.postalCodeRequired,
                                                                validate: (value) =>
                                                                    validatePostalCode(value, i18.postalCodeValid),
                                                            })}
                                                        />

                                                        <Input
                                                            type="text"
                                                            error={errors?.shippingAddress?.phone?.message}
                                                            id="shippingAddress.phone"
                                                            isValidated={
                                                                isSubmitted || shippingAddressValidatedFieldsList.phone
                                                            }
                                                            placeholder={i18.phonePlaceholder}
                                                            label={i18.phone}
                                                            isRequired={true}
                                                            formHooksRegister={register("shippingAddress.phone", {
                                                                required: i18.phoneRequired,
                                                                minLength: {
                                                                    value: 10,
                                                                    message: i18.phoneInvalid,
                                                                },
                                                                maxLength: {
                                                                    value: 20,
                                                                    message: i18.phoneInvalid,
                                                                },
                                                                validate: {
                                                                    validate: (value) =>
                                                                        validatePhone(value, i18.phoneInvalid),
                                                                },
                                                            })}
                                                        />
                                                    </FormGroup>
                                                    <Checkbox
                                                        id="shippingAddress.sameAsBilling"
                                                        label={i18.sameAsBillingAddress}
                                                        formHooksRegister={register("shippingAddress.sameAsBilling")}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="primary"
                                                        onClick={() => validateShippingAddress({ enableLoading: true })}
                                                        className="mt-6"
                                                    >
                                                        {i18.confirmShippingAddress}
                                                    </Button>
                                                </CheckoutAccordion>
                                            )}

                                            <CheckoutAccordion
                                                className={`zmt-5 lg:mt-10`}
                                                title={i18.billingAddress}
                                                closedTabContent={
                                                    <>
                                                        <p className="font-primary text-lg text-t-primary font-bold mt-3">
                                                            {i18.details}
                                                        </p>
                                                        <p className="font-primary text-sm text-t-primary mt-1">
                                                            {billingAddressAccordionState.canBeOpened && (
                                                                <span>
                                                                    {customerBillingAddress?.addressName ??
                                                                        savedBillingAddress?.addressName}
                                                                </span>
                                                            )}
                                                        </p>
                                                        <address>
                                                            {customerBillingAddress?.address1
                                                                ? `${customerBillingAddress?.address1}, `
                                                                : savedBillingAddress?.address1
                                                                ? `${savedBillingAddress?.address1}, `
                                                                : ""}
                                                            {customerBillingAddress?.firstName
                                                                ? `${customerBillingAddress?.firstName} `
                                                                : savedBillingAddress?.firstName
                                                                ? `${savedBillingAddress?.firstName} `
                                                                : ""}
                                                            {customerBillingAddress?.lastName ??
                                                                savedBillingAddress?.lastName}
                                                        </address>
                                                    </>
                                                }
                                                editBtnText={i18.edit}
                                                isOpen={billingAddressAccordionState.isOpen}
                                                openSetter={(isOpen) => {
                                                    setBillingAddressAccordionState({
                                                        ...billingAddressAccordionState,
                                                        isOpen: isOpen,
                                                    });
                                                }}
                                                canBeOpened={billingAddressAccordionState.canBeOpened}
                                                canBeClosed={billingAddressAccordionState.canBeClosed}
                                            >
                                                {savedAddresses?.length > 0 && (
                                                    <div className={`${savedAddresses.length === 1 ? "hidden" : ""}`}>
                                                        <FormGroup
                                                            tabletViewport={globalContext.viewports.medium}
                                                            columns="one"
                                                        >
                                                            <Select
                                                                id="activeSavedBillingAddressId"
                                                                label={i18.savedAddresses}
                                                                formHooksRegister={register(
                                                                    "activeSavedBillingAddressId",
                                                                    {
                                                                        required: i18.savedAddressesError,
                                                                    }
                                                                )}
                                                                onChange={() => {
                                                                    const chosenAddressId = getValues(
                                                                        "activeSavedBillingAddressId"
                                                                    );

                                                                    const chosenAddress = savedAddresses?.find(
                                                                        (address) => address.id === chosenAddressId
                                                                    );

                                                                    setCustomerBillingAddress({
                                                                        stateCode: chosenAddress.state,
                                                                        countryCode: chosenAddress.country,
                                                                        address1: chosenAddress.address1,
                                                                        address2: chosenAddress.address2,
                                                                        city: chosenAddress.city,
                                                                        postalCode: chosenAddress.zip,
                                                                        firstName: chosenAddress.firstName,
                                                                        lastName: chosenAddress.lastName,
                                                                        phone: chosenAddress.phone,
                                                                        addressName: chosenAddress.addressName,
                                                                    });

                                                                    setSavedBillingAddressId(chosenAddressId);
                                                                }}
                                                            >
                                                                {savedAddresses?.map((address) => {
                                                                    return (
                                                                        <option key={address.id} value={address.id}>
                                                                            {address.addressName}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </Select>
                                                        </FormGroup>
                                                    </div>
                                                )}

                                                <FormGroup
                                                    tabletViewport={globalContext.viewports.medium}
                                                    columns="two"
                                                >
                                                    <Input
                                                        type="text"
                                                        error={errors?.billingAddress?.firstName?.message}
                                                        id="billingAddress.firstName"
                                                        isValidated={
                                                            isSubmitted || billingAddressValidatedFieldsList.firstName
                                                        }
                                                        placeholder={i18.NamePlaceholder}
                                                        label={i18.Name}
                                                        isRequired={true}
                                                        formHooksRegister={register("billingAddress.firstName", {
                                                            required: i18.NameRequiredError,
                                                            minLength: {
                                                                value: 3,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:minLengthError", { number: 3 })
                                                                    : "",
                                                            },
                                                            maxLength: {
                                                                value: 20,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:maxLengthError", { number: 40 })
                                                                    : "",
                                                            },
                                                        })}
                                                    />

                                                    <Input
                                                        type="text"
                                                        error={errors?.billingAddress?.lastName?.message}
                                                        id="billingAddress.lastName"
                                                        isValidated={
                                                            isSubmitted || billingAddressValidatedFieldsList.lastName
                                                        }
                                                        placeholder={i18.LastNamePlaceholder}
                                                        label={i18.LastName}
                                                        isRequired={true}
                                                        formHooksRegister={register("billingAddress.lastName", {
                                                            required: i18.LastNameRequiredError,
                                                            minLength: {
                                                                value: 3,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:minLengthError", { number: 3 })
                                                                    : "",
                                                            },
                                                            maxLength: {
                                                                value: 20,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:maxLengthError", { number: 20 })
                                                                    : "",
                                                            },
                                                        })}
                                                    />
                                                </FormGroup>
                                                <Input
                                                    type="text"
                                                    error={errors?.billingAddress?.address1?.message}
                                                    id="billingAddress.address1"
                                                    isValidated={
                                                        isSubmitted || billingAddressValidatedFieldsList.address1
                                                    }
                                                    placeholder={i18.address1Placeholder}
                                                    label={i18.address1}
                                                    isRequired={true}
                                                    formHooksRegister={register("billingAddress.address1", {
                                                        required: i18.address1RequiredError,
                                                        minLength: {
                                                            value: 3,
                                                            message: i18Fd
                                                                ? i18Fd.t("checkout:minLengthError", { number: 3 })
                                                                : "",
                                                        },
                                                        maxLength: {
                                                            value: 40,
                                                            message: i18Fd
                                                                ? i18Fd.t("checkout:maxLengthError", { number: 40 })
                                                                : "",
                                                        },
                                                    })}
                                                />
                                                <Input
                                                    type="text"
                                                    error={errors?.billingAddress?.address2?.message}
                                                    id="billingAddress.address2"
                                                    isValidated={
                                                        isSubmitted || billingAddressValidatedFieldsList.address2
                                                    }
                                                    placeholder={i18.address2Placeholder}
                                                    label={i18.address2}
                                                    formHooksRegister={register("billingAddress.address2", {
                                                        minLength: {
                                                            value: 3,
                                                            message: i18Fd
                                                                ? i18Fd.t("checkout:minLengthError", { number: 3 })
                                                                : "",
                                                        },
                                                        maxLength: {
                                                            value: 40,
                                                            message: i18Fd
                                                                ? i18Fd.t("checkout:maxLengthError", { number: 40 })
                                                                : "",
                                                        },
                                                    })}
                                                />
                                                <FormGroup
                                                    tabletViewport={globalContext.viewports.medium}
                                                    columns="two"
                                                >
                                                    <Select
                                                        label={i18.country}
                                                        formHooksRegister={register("billingAddress.countryCode")}
                                                        id="billingAddress.countryCode"
                                                    >
                                                        {countries.map((countryCode: string) => {
                                                            return (
                                                                <option key={countryCode} value={countryCode}>
                                                                    {i18[countryCode]}
                                                                </option>
                                                            );
                                                        })}
                                                    </Select>

                                                    <Input
                                                        type="text"
                                                        error={errors?.billingAddress?.city?.message}
                                                        id="billingAddress.city"
                                                        isValidated={
                                                            isSubmitted || billingAddressValidatedFieldsList.city
                                                        }
                                                        placeholder={i18.cityPlaceholder}
                                                        label={i18.city}
                                                        isRequired={true}
                                                        formHooksRegister={register("billingAddress.city", {
                                                            required: i18.cityRequired,
                                                            minLength: {
                                                                value: 2,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:minLengthError", { number: 2 })
                                                                    : "",
                                                            },
                                                            maxLength: {
                                                                value: 40,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:maxLengthError", { number: 40 })
                                                                    : "",
                                                            },
                                                        })}
                                                    />
                                                </FormGroup>
                                                <FormGroup
                                                    tabletViewport={globalContext.viewports.medium}
                                                    columns="two"
                                                >
                                                    <Input
                                                        type="text"
                                                        error={errors?.billingAddress?.stateCode?.message}
                                                        id="billingAddress.stateCode"
                                                        isValidated={
                                                            isSubmitted || billingAddressValidatedFieldsList.state
                                                        }
                                                        placeholder={i18.statePlaceholder}
                                                        label={i18.state}
                                                        isRequired={true}
                                                        formHooksRegister={register("billingAddress.stateCode", {
                                                            required: i18.stateRequired,
                                                            minLength: {
                                                                value: 2,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:minLengthError", { number: 2 })
                                                                    : "",
                                                            },
                                                            maxLength: {
                                                                value: 40,
                                                                message: i18Fd
                                                                    ? i18Fd.t("checkout:maxLengthError", { number: 40 })
                                                                    : "",
                                                            },
                                                        })}
                                                    />

                                                    <Input
                                                        type="text"
                                                        error={errors?.billingAddress?.postalCode?.message}
                                                        id="billingAddress.postalCode"
                                                        isValidated={
                                                            isSubmitted || billingAddressValidatedFieldsList.zip
                                                        }
                                                        placeholder={i18.postalCodePlaceholder}
                                                        label={i18.postalCode}
                                                        isRequired={true}
                                                        formHooksRegister={register("billingAddress.postalCode", {
                                                            required: i18.postalCodeRequired,
                                                            validate: (value) =>
                                                                validatePostalCode(value, i18.postalCodeValid),
                                                        })}
                                                    />
                                                </FormGroup>
                                                <Input
                                                    type="text"
                                                    error={errors?.billingAddress?.phone?.message}
                                                    id="billingAddress.phone"
                                                    isValidated={isSubmitted || billingAddressValidatedFieldsList.phone}
                                                    placeholder={i18.phonePlaceholder}
                                                    label={i18.phone}
                                                    isRequired={true}
                                                    formHooksRegister={register("billingAddress.phone", {
                                                        required: i18.phoneRequired,
                                                        minLength: {
                                                            value: 10,
                                                            message: i18.phoneInvalid,
                                                        },
                                                        maxLength: {
                                                            value: 20,
                                                            message: i18.phoneInvalid,
                                                        },
                                                        validate: {
                                                            validate: (value) => validatePhone(value, i18.phoneInvalid),
                                                        },
                                                    })}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    onClick={async () =>
                                                        await validateBillingAddress({ enableLoading: true })
                                                    }
                                                    className="mt-6"
                                                >
                                                    {i18.confirmBillingAddress}
                                                </Button>
                                            </CheckoutAccordion>

                                            <div className="mt-6">
                                                <Divider className="w-full" />
                                                <Button
                                                    isLoading={isPlacingOrder}
                                                    disabled={placeOrderBtnDisabled || isPlacingOrder}
                                                    className={`my-4`}
                                                    variant="primary"
                                                    type="submit"
                                                >
                                                    {i18.placeOrderBtn}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </form>
                            </section>
                            <CheckoutOrderSummaryPanel
                                taxTotal={globalContext?.basket?.taxTotal}
                                totalTaxText={i18.totalTaxText}
                                className="lg:ml-8 mt-4 lg:mt-4"
                                quantityText={globalResources?.quantityText}
                                title={`${globalContext?.basket?.productItems?.length} ${i18.summaryItems}`}
                                orderItems={globalContext?.basket?.productItems}
                                deliveryText={i18.deliveryFeeText}
                                shippingTotal={globalContext?.basket?.shippingTotal}
                                subtotalText={i18.subtotalText}
                                subtotal={globalContext?.basket?.productSubTotal}
                                totalText={i18.totalText}
                                total={globalContext?.basket?.orderTotal}
                                desktopViewport={globalContext.viewports.large}
                            />
                        </section>
                    ) : checkoutDataLoading || isValidating ? (
                        <div className="flex justify-center items-center min-h-custom">
                            <DotsLoader variant="dark" />
                        </div>
                    ) : !globalContext?.basket?.productItems?.length && !isValidating && !checkoutDataLoading ? (
                        <div className="flex justify-center flex-col items-center min-h-custom">
                            <h1 className="text-center text-2xl font-bold">{i18.emptyCart}</h1>
                            <Button
                                className="mt-10"
                                type="button"
                                variant="primary"
                                link={`${
                                    storelocatorContext?.selectedStore?.id
                                        ? `/store/${storelocatorContext?.selectedStore?.id}`
                                        : "/"
                                }`}
                            >
                                {i18.continueShopping}
                            </Button>
                        </div>
                    ) : null}
                </CenterContentWrapper>
            </CheckoutLayout>
            <style jsx>{`
                .min-h-custom {
                    min-height: calc(100vh - (65px + 186px));
                }
            `}</style>
        </>
    );
};

export const getServerSideProps = async ({
    locale,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<CheckoutProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during checkout i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            globalData: globalData,
            i18: {
                title: i18n.t("checkout:title"),
                edit: i18n.t("checkout:edit"),
                shippingAddress: i18n.t("checkout:shippingAddress"),
                billingAddress: i18n.t("checkout:billingAddress"),
                deliveryMethods: i18n.t("checkout:deliveryMethods"),
                paymentDetails: i18n.t("checkout:paymentDetails"),
                savedAddresses: i18n.t("checkout:savedAddresses"),
                savedAddressesError: i18n.t("checkout:savedAddressesError"),
                deliveryMethodsRequiredError: i18n.t("checkout:deliveryMethodsRequiredError"),
                Name: i18n.t("checkout:Name"),
                NamePlaceholder: i18n.t("checkout:NamePlaceholder"),
                NameRequiredError: i18n.t("checkout:NameRequiredError"),
                LastName: i18n.t("checkout:LastName"),
                LastNamePlaceholder: i18n.t("checkout:LastNamePlaceholder"),
                LastNameRequiredError: i18n.t("checkout:LastNameRequiredError"),
                address1: i18n.t("checkout:address1"),
                address1Placeholder: i18n.t("checkout:address1Placeholder"),
                address1RequiredError: i18n.t("checkout:address1RequiredError"),
                address2: i18n.t("checkout:address2"),
                address2Placeholder: i18n.t("checkout:address2Placeholder"),
                country: i18n.t("checkout:country"),
                countryPlaceholder: i18n.t("checkout:countryPlaceholder"),
                countryRequired: i18n.t("checkout:countryRequired"),
                city: i18n.t("checkout:city"),
                cityPlaceholder: i18n.t("checkout:cityPlaceholder"),
                cityRequired: i18n.t("checkout:cityRequired"),
                state: i18n.t("checkout:state"),
                statePlaceholder: i18n.t("checkout:statePlaceholder"),
                stateRequired: i18n.t("checkout:stateRequired"),
                postalCode: i18n.t("checkout:postalCode"),
                postalCodePlaceholder: i18n.t("checkout:postalCodePlaceholder"),
                postalCodeRequired: i18n.t("checkout:postalCodeRequired"),
                postalCodeValid: i18n.t("checkout:postalCodeValid"),
                phone: i18n.t("checkout:phone"),
                phonePlaceholder: i18n.t("checkout:phonePlaceholder"),
                phoneRequired: i18n.t("checkout:phoneRequired"),
                phoneInvalid: i18n.t("checkout:phoneInvalid"),
                sameAsBillingAddress: i18n.t("checkout:sameAsBillingAddress"),
                cardNumber: i18n.t("checkout:cardNumber"),
                cardNumberPlaceholder: i18n.t("checkout:cardNumberPlaceholder"),
                cardNumberRequiredError: i18n.t("checkout:cardNumberRequiredError"),
                cardNumberValidError: i18n.t("checkout:cardNumberValidError"),
                cardExpirationMonth: i18n.t("checkout:cardExpirationMonth"),
                cardExpirationMonthError: i18n.t("checkout:cardExpirationMonthError"),
                cardExpirationYear: i18n.t("checkout:cardExpirationYear"),
                cardExpirationYearError: i18n.t("checkout:cardExpirationYearError"),
                cvv: i18n.t("checkout:cvv"),
                cvvPlaceholder: i18n.t("checkout:cvvPlaceholder"),
                cvvRequiredError: i18n.t("checkout:cvvRequiredError"),
                cvvRequiredValidError: i18n.t("checkout:cvvRequiredValidError"),
                summaryItems: i18n.t("checkout:summaryItems"),
                deliveryFeeText: i18n.t("checkout:deliveryFeeText"),
                subtotalText: i18n.t("checkout:subtotalText"),
                totalText: i18n.t("checkout:totalText"),
                details: i18n.t("checkout:details"),
                confirmShippingAddress: i18n.t("checkout:confirmShippingAddress"),
                confirmBillingAddress: i18n.t("checkout:confirmBillingAddress"),
                confirmDeliveryMethod: i18n.t("checkout:confirmDeliveryMethod"),
                confirmPickup: i18n.t("checkout:confirmPickup"),
                submitPayment: i18n.t("checkout:submitPayment"),
                pleaseChooseHour: i18n.t("checkout:pleaseChooseHour"),
                selectTime: i18n.t("checkout:selectTime"),
                amText: i18n.t("checkout:amText"),
                pmText: i18n.t("checkout:pmText"),
                custom: i18n.t("checkout:custom"),
                somethingWentWrong: i18n.t("checkout:somethingWentWrong"),
                emptyCart: i18n.t("checkout:emptyCart"),
                continueShopping: i18n.t("checkout:continueShopping"),
                totalTaxText: i18n.t("checkout:totalTaxText"),
                pageTitile: i18n.t("checkout:pageTitile"),
                pickupAddress: i18n.t("checkout:pickupAddress"),
                pickupDetails: i18n.t("checkout:pickupDetails"),
                placeOrderBtn: i18n.t("checkout:placeOrderBtn"),
                ...countries.reduce((acc: any, countryCode: string) => {
                    acc[countryCode] = i18n.t(`countries:${countryCode}`);
                    return acc;
                }, {}),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Checkout;
