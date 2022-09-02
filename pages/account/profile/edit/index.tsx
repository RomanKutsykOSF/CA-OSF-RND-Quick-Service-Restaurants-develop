import React, { useContext, useEffect } from "react";
import Title from "components/UI/Title";
import i18nInit from "i18";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import FormGroup from "components/UI/forms/FormGroup";
import Input from "components/UI/forms/Input";
import { useForm } from "react-hook-form";
import { GlobalContext } from "context/global";
import ButtonBack from "components/UI/ButtonBack";
import Button from "components/UI/Button";
import Divider from "components/UI/Divider";
import MainLayout from "components/layouts/main";
import AccountNavigation from "components/UI/AccountNavigation";
import populateGlobalResources from "i18/populateGlobalResources";
import ButtonList from "components/UI/ButtonList";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import getProfileDataFetcher, { getProfileDataQuery } from "bdConnector/account/getProfileData";
import updateProfileDataFetcher, { updateProfileDataQuery } from "bdConnector/account/updateProfileData";
import useSWR from "swr";
import { useRouter } from "next/router";
import { handleLogout, validateEmail, validatePhone } from "utils";
import { FetcherResponse } from "bdConnector/types";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import Head from "next/head";

interface ProfileEditProps {
    i18: Record<string, string>;
    globalResources: Record<string, string>;
    globalData: FetcherResponse<GlobalData>;
    locale: string;
}

export interface FormProps {
    name: string;
    lastName: string;
    email: string;
    phone: string;
}

const ProfileEdit = ({ i18, globalResources, globalData, locale }: ProfileEditProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const { data: useSwrProfileData } = useSWR([getProfileDataQuery, locale], getProfileDataFetcher);
    const router = useRouter();

    const {
        register,
        reset,
        setError,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<FormProps>({
        defaultValues: {
            name: useSwrProfileData?.data?.firstName || "",
            lastName: useSwrProfileData?.data?.lastName || "",
            email: useSwrProfileData?.data?.email || "",
            phone: useSwrProfileData?.data?.phone || "",
        },
    });

    useEffect(() => {
        reset({
            name: useSwrProfileData?.data?.firstName || "",
            lastName: useSwrProfileData?.data?.lastName || "",
            email: useSwrProfileData?.data?.email || "",
            phone: useSwrProfileData?.data?.phone || "",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useSwrProfileData]);

    const onSubmit = async (formData): Promise<void> => {
        globalContext.setScreenBlockLoader(true);

        const { errorCode, data } = await updateProfileDataFetcher(updateProfileDataQuery, {
            firstName: formData?.name,
            lastName: formData?.lastName,
            email: formData?.email,
            phone: formData?.phone,
        });

        if (errorCode === "LOGIN_ALREADY_EXISTS") {
            globalContext.setScreenBlockLoader(false);

            setError("email", { message: i18.editProfileEmailAlreadyExists });
        } else if (errorCode) {
            globalContext.setScreenBlockLoader(false);

            globalContext.showNotification({
                type: "error",
                message: globalResources.internalServerError,
                autoClose: true,
            });
        } else {
            if (data.isEmailChanged) {
                await globalContext.useSwrGetUserDataMutate({
                    data: {
                        isLoggedIn: false,
                    },
                });
                globalContext.setScreenBlockLoader(false);
            } else {
                globalContext.setScreenBlockLoader(false);

                router.push("/account/profile");
            }
        }
    };

    const accountSidebarItems = [
        {
            title: i18.accountNavigationProfileText,
            link: "/account/profile",
            isActive: true,
        },
        {
            title: i18.accountNavigationAddressesText,
            link: "/account/address",
            isActive: false,
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
                globalResources={globalResources}
                themeVariables={globalContext.themeCssString}
                globalData={globalData}
                isPageLoginProtected={true}
                locale={locale}
            >
                <CenterContentWrapper>
                    <div className="lg:flex">
                        <ButtonBack
                            className="block lg:hidden"
                            path="/account/profile"
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
                        <div className="block lg:hidden w-auto mt-4">
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
                                path="../../account/profile"
                                text="Back"
                                variant="secondary"
                            />
                            <Title type="h2" alignment="left" className="font-bold mt-3">
                                {i18.profileEditPortalTitle}
                            </Title>
                            <Divider theme="light" className="w-full lg:block hidden"></Divider>
                            <div className="grid lg:grid-cols-4 gap-4">
                                <div className="lg:col-span-3">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <FormGroup tabletViewport={globalContext.viewports.medium} columns="two">
                                            <Input
                                                type="text"
                                                error={errors.name ? errors.name.message : undefined}
                                                id="name"
                                                isRequired
                                                label={i18.profileEditPortalName}
                                                placeholder={i18.profileEditPortalFirstNamePlaceholder}
                                                isValidated={isSubmitted}
                                                formHooksRegister={register("name", {
                                                    required: i18.profileEditPortalErrorFillFirstName,
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
                                                isRequired
                                                label={i18.profileEditPortalLastName}
                                                placeholder={i18.profileEditPortalLastNamePlaceholder}
                                                isValidated={isSubmitted}
                                                formHooksRegister={register("lastName", {
                                                    required: i18.profileEditPortalErrorFillLastName,
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
                                        <Input
                                            type="text"
                                            error={errors.email ? errors.email.message : undefined}
                                            id="email"
                                            inputInfo={i18.editProfileEmailInputNotice}
                                            isRequired
                                            placeholder={i18.profileEditPortalPlaceholderEmail}
                                            label={i18.profileEditPortalEmail}
                                            isValidated={isSubmitted}
                                            formHooksRegister={register("email", {
                                                required: i18.profileEditPortalErrorFillEmail,
                                                minLength: {
                                                    value: 3,
                                                    message: i18.profileEditPortalErrorMinLength,
                                                },
                                                maxLength: {
                                                    value: 64,
                                                    message: i18.profileEditPortalErrorTooMuch,
                                                },
                                                validate: (value) =>
                                                    validateEmail(value, i18.profileEditPortalErrorInvalidEmail),
                                            })}
                                        />
                                        <Input
                                            type="tel"
                                            error={errors.phone ? errors.phone.message : undefined}
                                            id="phone"
                                            isRequired
                                            placeholder={i18.profileEditPortalPlaceholderPhone}
                                            label={i18.profileEditPortalPhone}
                                            isValidated={isSubmitted}
                                            formHooksRegister={register("phone", {
                                                required: i18.profileEditPortalErrorFillPhone,
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
                                        <div className="mt-7 mr-auto flex flex-col w-52 mb-28">
                                            <Button variant="primary" type="submit">
                                                {i18.profileEditPortalSubmitButtonText}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
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
}: GetStaticPropsContext): Promise<GetStaticPropsResult<ProfileEditProps>> => {
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
                profileEditPortalTitle: i18n.t("profileEditPortal:title"),
                profileEditPortalName: i18n.t("profileEditPortal:nameText"),
                profileEditPortalLastName: i18n.t("profileEditPortal:lastNameText"),
                profileEditPortalEmail: i18n.t("profileEditPortal:emailText"),
                profileEditPortalPhone: i18n.t("profileEditPortal:phoneText"),
                profileEditPortalSubmitButtonText: i18n.t("profileEditPortal:submitButtonText"),
                profileEditPortalPlaceholderEmail: i18n.t("profileEditPortal:placeholderEmail"),
                profileEditPortalPlaceholderPhone: i18n.t("profileEditPortal:placeholderPhone"),
                profileEditPortalErrorFillFirstName: i18n.t("profileEditPortal:errorFillFirstName"),
                profileEditPortalErrorFillLastName: i18n.t("profileEditPortal:errorFillLastName"),
                profileEditPortalErrorFillEmail: i18n.t("profileEditPortal:errorFillEmail"),
                profileEditPortalErrorFillPhone: i18n.t("profileEditPortal:errorFillPhone"),
                profileEditPortalErrorMinLength: i18n.t("profileEditPortal:errorMinLength"),
                profileEditPortalErrorTooMuch: i18n.t("profileEditPortal:errorTooMuch"),
                profileEditPortalPhoneValidationFailed: i18n.t("profileEditPortal:errorPhoneValidationFailed"),
                accountNavigationTitle: i18n.t("accountNavigation:title"),
                accountNavigationLogoutText: i18n.t("accountNavigation:logoutText"),
                accountNavigationProfileText: i18n.t("accountNavigation:profileText"),
                accountNavigationAddressesText: i18n.t("accountNavigation:addressesText"),
                accountNavigationOrdersText: i18n.t("accountNavigation:ordersText"),
                accountNavigationPasswordText: i18n.t("accountNavigation:passwordText"),
                accountNavigationWishlistText: i18n.t("accountNavigation:wishlistText"),
                profileEditPortalErrorInvalidEmail: i18n.t("profileEditPortal:errorInvalidEmail"),
                editProfileEmailAlreadyExists: i18n.t("profileEditPortal:emailAlreadyExists"),
                editProfileEmailInputNotice: i18n.t("profileEditPortal:emailInputNotice"),
                phoneInvalid: i18n.t("profileEditPortal:phoneInvalid"),
                pageTitle: i18n.t("profileEditPortal:pageTitle"),
                profileEditPortalFirstNamePlaceholder: i18n.t("profileEditPortal:firstNamePlaceholder"),
                profileEditPortalLastNamePlaceholder: i18n.t("profileEditPortal:lastNamePlaceholder"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default ProfileEdit;
