import React, { useContext } from "react";
import i18nInit from "i18";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { GlobalContext } from "context/global";
import MainLayout from "components/layouts/main";
import AccountNavigation from "components/UI/AccountNavigation";
import Title from "components/UI/Title";
import Divider from "components/UI/Divider";
import Button from "components/UI/Button";
import Input from "components/UI/forms/Input";
import { useForm } from "react-hook-form";
import ButtonBack from "components/UI/ButtonBack";
import FormGroup from "components/UI/forms/FormGroup";
import Checkbox from "components/UI/forms/Checkbox";
import ButtonList from "components/UI/ButtonList";
import populateGlobalResources from "i18/populateGlobalResources";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import addAddressFetcher, { addAddressMutation } from "bdConnector/account/addNewAddress";
import { handleLogout, validatePhone, validatePostalCode } from "utils";
import { useRouter } from "next/router";
import { FetcherResponse } from "bdConnector/types";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import Select from "components/UI/forms/Select";
import countries from "../../../../config/countries.json";
import Head from "next/head";

interface AccountProps {
    globalResources: Record<string, string>;
    i18: Record<string, string>;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
}

export interface FormProps {
    primaryAddress: string;
    secondaryAddress: string;
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    addressName: string;
    makePrimary: boolean;
}

const Account = ({ i18, globalResources, globalData, locale }: AccountProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<FormProps>();

    const onSubmit = async ({
        addressName,
        primaryAddress,
        secondaryAddress,
        firstName,
        lastName,
        country,
        city,
        state,
        zipCode,
        phone,
        makePrimary,
    }): Promise<void> => {
        const { errorCode } = await addAddressFetcher(addAddressMutation, {
            id: addressName,
            addressName,
            address1: primaryAddress,
            address2: secondaryAddress,
            firstName,
            lastName,
            country,
            city,
            state,
            zip: zipCode,
            phone,
            isPrimary: makePrimary,
        });
        if (errorCode) {
            globalContext.showNotification({
                type: "error",
                message: globalResources.internalServerError,
                autoClose: true,
            });
            return;
        }

        await router.push("/account/address");
    };

    const accountSidebarItems = [
        {
            title: i18.accountNavigationProfileText,
            link: "/account/profile",
            isActive: false,
        },
        {
            title: i18.accountNavigationAddressesText,
            link: "/account/address",
            isActive: true,
        },
        {
            title: i18.accountNavigationOrdersText,
            link: "/account/orders",
            isActive: false,
        },
        {
            title: i18.accountNavigationPasswordText,
            link: "/account/password",
            isActive: false,
        },
    ];

    if (globalData.data.sitePreferences.isWishlistEnabled) {
        accountSidebarItems.push({
            title: i18.accountNavigationWishlistText,
            link: "/account/wishlist",
            isActive: false,
        });
    }

    return (
        <>
            <Head>
                <title>{i18.pageTitle}</title>
                <meta property="og:title" content={i18.pageTitle} key="title" />
            </Head>
            <MainLayout
                themeVariables={globalContext.themeCssString}
                globalResources={globalResources}
                globalData={globalData}
                isPageLoginProtected={true}
                locale={locale}
            >
                <CenterContentWrapper>
                    <div className="lg:flex">
                        <ButtonBack
                            className="block lg:hidden"
                            path="../../account/address"
                            text="Back"
                            variant="secondary"
                        />
                        <div className="lg:flex lg:mr-28 hidden mt-20">
                            <AccountNavigation
                                title={i18.accountNavigationTitle}
                                items={accountSidebarItems}
                                logoutCallback={async () => {
                                    await handleLogout(
                                        globalContext.setScreenBlockLoader,
                                        globalContext.useSwrGetUserDataMutate,
                                        globalContext.showNotification,
                                        globalResources.internalServerError
                                    );
                                }}
                                logoutText={i18.accountNavigationLogoutText}
                            />
                        </div>
                        <div className="block lg:hidden w-auto">
                            <ButtonList
                                title={i18.accountNavigationTitle}
                                items={accountSidebarItems}
                                logoutText={i18.accountNavigationLogoutText}
                                logoutCallback={async () => {
                                    await handleLogout(
                                        globalContext.setScreenBlockLoader,
                                        globalContext.useSwrGetUserDataMutate,
                                        globalContext.showNotification,
                                        globalResources.internalServerError
                                    );
                                }}
                            />
                        </div>
                        <div className="flex-1 lg:mt-20">
                            <ButtonBack
                                className="hidden lg:flex"
                                path="../../account/address"
                                text="Back"
                                variant="secondary"
                            />
                            <Title type="h2" alignment="left" className="font-bold my-3 lg:mt-0">
                                {i18.addAddressTitle}
                            </Title>
                            <Divider theme="light" className="lg:w-full" />
                            <div className="lg:grid lg:grid-cols-4">
                                <form className="lg:col-span-3" onSubmit={handleSubmit(onSubmit)}>
                                    <Input
                                        type="text"
                                        error={errors.addressName ? errors.addressName.message : undefined}
                                        id="addressName"
                                        isRequired={true}
                                        placeholder={i18.editAddressNamePlaceholder}
                                        label={i18.editAddressName}
                                        isValidated={isSubmitted}
                                        formHooksRegister={register("addressName", {
                                            required: i18.addressNameRequired,
                                            minLength: {
                                                value: 3,
                                                message: i18.profileEditPortalErrorMinLength,
                                            },
                                            maxLength: {
                                                value: 54,
                                                message: i18.profileEditPortalErrorTooMuch,
                                            },
                                        })}
                                    />
                                    <Input
                                        type="text"
                                        error={errors.primaryAddress ? errors.primaryAddress.message : undefined}
                                        id="primaryAddress"
                                        placeholder={i18.editAddressPrimaryAddressPlaceholder}
                                        label={i18.editAddressPrimaryAddress}
                                        isValidated={isSubmitted}
                                        isRequired={true}
                                        formHooksRegister={register("primaryAddress", {
                                            required: i18.editAddressErrorFillPrimaryAddress,
                                            minLength: {
                                                value: 3,
                                                message: i18.profileEditPortalErrorMinLength,
                                            },
                                            maxLength: {
                                                value: 54,
                                                message: i18.profileEditPortalErrorTooMuch,
                                            },
                                        })}
                                    />
                                    <Input
                                        type="text"
                                        error={errors.secondaryAddress ? errors.secondaryAddress.message : undefined}
                                        id="secondaryAddress"
                                        placeholder={i18.editAddressSecondaryAddressPlaceholder}
                                        label={i18.editAddressSecondaryAddress}
                                        isValidated={isSubmitted}
                                        formHooksRegister={register("secondaryAddress", {
                                            minLength: {
                                                value: 3,
                                                message: i18.profileEditPortalErrorMinLength,
                                            },
                                            maxLength: {
                                                value: 54,
                                                message: i18.profileEditPortalErrorTooMuch,
                                            },
                                        })}
                                    />
                                    <FormGroup tabletViewport={globalContext.viewports.medium} columns="two">
                                        <Input
                                            type="text"
                                            error={errors.firstName ? errors.firstName.message : undefined}
                                            id="firstName"
                                            placeholder={i18.editAddressFirstNamePlaceholder}
                                            label={i18.editAddressFirstName}
                                            isValidated={isSubmitted}
                                            isRequired={true}
                                            formHooksRegister={register("firstName", {
                                                required: i18.editAddressErrorFillFirstName,
                                                minLength: {
                                                    value: 3,
                                                    message: i18.profileEditPortalErrorMinLength,
                                                },
                                                maxLength: {
                                                    value: 24,
                                                    message: i18.profileEditPortalErrorTooMuch,
                                                },
                                            })}
                                        />

                                        <Input
                                            type="text"
                                            error={errors.lastName ? errors.lastName.message : undefined}
                                            id="lastName"
                                            placeholder={i18.editAddressLastNamePlaceholder}
                                            label={i18.editAddressLastName}
                                            isValidated={isSubmitted}
                                            isRequired={true}
                                            formHooksRegister={register("lastName", {
                                                required: i18.editAddressErrorFillLastName,
                                                minLength: {
                                                    value: 3,
                                                    message: i18.profileEditPortalErrorMinLength,
                                                },
                                                maxLength: {
                                                    value: 24,
                                                    message: i18.profileEditPortalErrorTooMuch,
                                                },
                                            })}
                                        />
                                    </FormGroup>
                                    <FormGroup tabletViewport={globalContext.viewports.medium} columns="two">
                                        <Select
                                            label={i18.editAddressCountry}
                                            formHooksRegister={register("country")}
                                            id="country"
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
                                            error={errors.city ? errors.city.message : undefined}
                                            id="city"
                                            placeholder={i18.editAddressCityPlaceholder}
                                            label={i18.editAddressCity}
                                            isValidated={isSubmitted}
                                            isRequired={true}
                                            formHooksRegister={register("city", {
                                                required: i18.editAddressErrorFillCity,
                                                minLength: {
                                                    value: 3,
                                                    message: i18.profileEditPortalErrorMinLength,
                                                },
                                                maxLength: {
                                                    value: 24,
                                                    message: i18.profileEditPortalErrorTooMuch,
                                                },
                                            })}
                                        />
                                    </FormGroup>
                                    <FormGroup tabletViewport={globalContext.viewports.medium} columns="two">
                                        <Input
                                            type="text"
                                            error={errors.state ? errors.state.message : undefined}
                                            id="state"
                                            placeholder={i18.editAddressStatePlaceholder}
                                            label={i18.editAddressState}
                                            isValidated={isSubmitted}
                                            isRequired={true}
                                            formHooksRegister={register("state", {
                                                required: i18.editAddressErrorFillState,
                                                minLength: {
                                                    value: 3,
                                                    message: i18.profileEditPortalErrorMinLength,
                                                },
                                                maxLength: {
                                                    value: 24,
                                                    message: i18.profileEditPortalErrorTooMuch,
                                                },
                                            })}
                                        />
                                        <Input
                                            type="text"
                                            error={errors.zipCode ? errors.zipCode.message : undefined}
                                            id="zipCode"
                                            placeholder={i18.editAddressZipCodePlaceholder}
                                            label={i18.editAddressZipCode}
                                            isValidated={isSubmitted}
                                            isRequired={true}
                                            formHooksRegister={register("zipCode", {
                                                required: i18.editAddressErrorFillZipCode,
                                                validate: (value) => validatePostalCode(value, i18.postalCodeInvalid),
                                            })}
                                        />
                                    </FormGroup>

                                    <Input
                                        type="text"
                                        isValidated={isSubmitted}
                                        error={errors?.phone ? errors?.phone.message : ""}
                                        id="phone"
                                        placeholder={i18.phonePlaceholder}
                                        label={i18.phone}
                                        isRequired={true}
                                        formHooksRegister={register("phone", {
                                            required: i18.phoneRequired,
                                            minLength: {
                                                value: 10,
                                                message: i18.phoneInvalid,
                                            },
                                            maxLength: {
                                                value: 20,
                                                message: i18.profileEditPortalErrorTooMuch,
                                            },
                                            validate: (value) => validatePhone(value, i18.phoneInvalid),
                                        })}
                                    />

                                    <Checkbox
                                        error={errors.makePrimary ? errors.makePrimary.message : ""}
                                        id="makePrimary"
                                        label={i18.editAddressCheckboxText}
                                        formHooksRegister={register("makePrimary")}
                                    />
                                    <div className="mt-7 mr-auto flex flex-col w-52 mb-28">
                                        <Button variant="primary" type="submit">
                                            {i18.addAddressSubmitButtonText}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </CenterContentWrapper>
            </MainLayout>
        </>
    );
};

export const getStaticProps = async ({
    locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<AccountProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during profile edit i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            globalData,
            i18: {
                accountNavigationTitle: i18n.t("accountNavigation:title"),
                accountNavigationLogoutText: i18n.t("accountNavigation:logoutText"),
                accountNavigationProfileText: i18n.t("accountNavigation:profileText"),
                accountNavigationAddressesText: i18n.t("accountNavigation:addressesText"),
                accountNavigationOrdersText: i18n.t("accountNavigation:ordersText"),
                accountNavigationPasswordText: i18n.t("accountNavigation:passwordText"),
                accountNavigationWishlistText: i18n.t("accountNavigation:wishlistText"),
                editAddressPrimaryAddress: i18n.t("editAddress:primaryAddress"),
                editAddressSecondaryAddress: i18n.t("editAddress:secondaryAddress"),
                editAddressCountry: i18n.t("editAddress:country"),
                editAddressCity: i18n.t("editAddress:city"),
                editAddressState: i18n.t("editAddress:state"),
                editAddressZipCode: i18n.t("editAddress:zipCode"),
                editAddressName: i18n.t("editAddress:addressName"),
                editAddressCheckboxText: i18n.t("editAddress:checkboxText"),
                editAddressPrimaryAddressPlaceholder: i18n.t("editAddress:primaryAddressPlaceholder"),
                editAddressSecondaryAddressPlaceholder: i18n.t("editAddress:secondaryAddressPlaceholder"),
                editAddressCountryPlaceholder: i18n.t("editAddress:countryPlaceholder"),
                editAddressCityPlaceholder: i18n.t("editAddress:cityPlaceholder"),
                editAddressStatePlaceholder: i18n.t("editAddress:statePlaceholder"),
                editAddressZipCodePlaceholder: i18n.t("editAddress:zipCodePlaceholder"),
                editAddressNamePlaceholder: i18n.t("editAddress:addressNamePlaceholder"),
                editAddressErrorFillPrimaryAddress: i18n.t("editAddress:errorFillPrimaryAddress"),
                editAddressErrorFillCountry: i18n.t("editAddress:errorFillCountry"),
                editAddressErrorFillCity: i18n.t("editAddress:errorFillCity"),
                editAddressErrorFillState: i18n.t("editAddress:errorFillState"),
                editAddressErrorFillFirstName: i18n.t("editAddress:errorFillFirstName"),
                editAddressErrorFillLastName: i18n.t("editAddress:errorFillLastName"),
                editAddressErrorFillZipCode: i18n.t("editAddress:errorFillZipCode"),
                profileEditPortalErrorMinLength: i18n.t("profileEditPortal:errorMinLength"),
                profileEditPortalErrorTooMuch: i18n.t("profileEditPortal:errorTooMuch"),
                addAddressTitle: i18n.t("addAddress:title"),
                addAddressSubmitButtonText: i18n.t("addAddress:submitButtonText"),
                editAddressFirstName: i18n.t("editAddress:firstName"),
                editAddressLastName: i18n.t("editAddress:lastName"),
                editAddressFirstNamePlaceholder: i18n.t("editAddress:firstNamePlaceholder"),
                editAddressLastNamePlaceholder: i18n.t("editAddress:lastNamePlaceholder"),
                phone: i18n.t("editAddress:phone"),
                phonePlaceholder: i18n.t("editAddress:phonePlaceholder"),
                phoneRequired: i18n.t("editAddress:phoneRequired"),
                phoneInvalid: i18n.t("editAddress:phoneInvalid"),
                addressNameRequired: i18n.t("addAddress:addressNameRequired"),
                pageTitle: i18n.t("addAddress:pageTitle"),
                postalCodeInvalid: i18n.t("addAddress:postalCodeInvalid"),
                ...countries.reduce((acc: any, countryCode: string) => {
                    acc[countryCode] = i18n.t(`countries:${countryCode}`);
                    return acc;
                }, {}),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Account;
