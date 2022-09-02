import React, { useContext, useRef } from "react";
import i18nInit from "i18";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { GlobalContext } from "context/global";
import MainLayout from "components/layouts/main";
import AccountNavigation from "components/UI/AccountNavigation";
import Title from "components/UI/Title";
import Divider from "components/UI/Divider";
import Input from "components/UI/forms/Input";
import Button from "components/UI/Button";
import { useForm } from "react-hook-form";
import populateGlobalResources from "i18/populateGlobalResources";
import ButtonList from "components/UI/ButtonList";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import updatePasswordFetcher, { updatePasswordMutation } from "bdConnector/account/updatePassword";
import { handleLogout } from "utils";
import { FetcherResponse } from "bdConnector/types";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import Head from "next/head";
import { useRouter } from "next/router";

interface AccountProps {
    i18: Record<string, string>;
    globalResources: Record<string, string>;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
}

export interface FormProps {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const Password = ({ i18, globalResources, globalData, locale }: AccountProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
        setError,
        watch,
    } = useForm<FormProps>();

    const onSubmit = async ({ oldPassword, newPassword }): Promise<void> => {
        globalContext.setScreenBlockLoader(true);

        const { errorCode } = await updatePasswordFetcher(updatePasswordMutation, oldPassword, newPassword);

        if (errorCode === "INVALID_CURRENT_PASSWORD") {
            globalContext.setScreenBlockLoader(false);

            setError("oldPassword", {
                message: i18.oldPasswordError,
            });
        } else if (errorCode) {
            globalContext.setScreenBlockLoader(false);

            globalContext.showNotification({
                type: "error",
                message: globalResources.internalServerError,
                autoClose: true,
            });
        } else {
            globalContext.setScreenBlockLoader(false);
            globalContext.showNotification({
                type: "success",
                message: i18.passwordUpdateSuccess,
                autoClose: true,
            });

            router.push("/account/profile");
        }
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
            isActive: true,
        },
    ];

    if (globalData.data.sitePreferences.isWishlistEnabled) {
        accountSidebarItems.push({
            title: i18.accountNavigationWishlistText,
            link: "/account/wishlist",
            isActive: false,
        });
    }

    const newPassword = useRef({});
    newPassword.current = watch("newPassword", "");

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
                        <div className="flex-1 mt-5 lg:mt-0">
                            <Title type="h2" className="flex flex-initial font-bold ml-4 lg:my-3 text-xl lg:mt-24">
                                {i18.passwordPortalTitle}
                            </Title>
                            <Divider theme="light" className="w-full lg:block hidden"></Divider>
                            <div className="lg:grid lg:grid-cols-6">
                                <div className="col-span-4">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Input
                                            type="password"
                                            error={errors.oldPassword ? errors.oldPassword.message : ""}
                                            id="oldPassword"
                                            label={i18.currentPasswordLabel}
                                            placeholder={i18.currentPasswordPlaceholder}
                                            isValidated={isSubmitted}
                                            isRequired={true}
                                            formHooksRegister={register("oldPassword", {
                                                required: i18.passwordRequired,
                                            })}
                                        />
                                        <Input
                                            type="password"
                                            error={errors.newPassword ? errors.newPassword.message : ""}
                                            id="newPassword"
                                            placeholder={i18.newPasswordPlaceholder}
                                            label={i18.newPasswordLabel}
                                            isValidated={isSubmitted}
                                            isRequired={true}
                                            formHooksRegister={register("newPassword", {
                                                required: i18.passwordRequired,
                                                minLength: {
                                                    value: 8,
                                                    message: i18.passwordTooShort,
                                                },
                                                validate: (value) => {
                                                    return (
                                                        [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                                                            pattern.test(value)
                                                        ) || i18.registerPortalErrorCharactersPassword
                                                    );
                                                },
                                            })}
                                        />
                                        <Input
                                            type="password"
                                            error={errors.confirmPassword ? errors.confirmPassword.message : ""}
                                            id="confirmPassword"
                                            label={i18.newPasswordConfirmLabel}
                                            placeholder={i18.newPasswordConfirmPlaceholder}
                                            isValidated={isSubmitted}
                                            isRequired={true}
                                            formHooksRegister={register("confirmPassword", {
                                                required: i18.passwordRequired,
                                                validate: (value) => {
                                                    return (
                                                        value === newPassword.current ||
                                                        i18.registerPortalPasswordsDoNotMatch
                                                    );
                                                },
                                            })}
                                        />
                                        <div className="mt-7 mr-auto flex flex-col w-72 mb-40">
                                            <Button variant="primary" type="submit">
                                                {i18.passwordPortalBtn1Text}
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
            globalData: globalData,
            i18: {
                accountNavigationTitle: i18n.t("accountNavigation:title"),
                accountNavigationLogoutText: i18n.t("accountNavigation:logoutText"),
                accountNavigationProfileText: i18n.t("accountNavigation:profileText"),
                accountNavigationAddressesText: i18n.t("accountNavigation:addressesText"),
                accountNavigationOrdersText: i18n.t("accountNavigation:ordersText"),
                accountNavigationPasswordText: i18n.t("accountNavigation:passwordText"),
                accountNavigationWishlistText: i18n.t("accountNavigation:wishlistText"),
                passwordPortalTitle: i18n.t("passwordPortal:title"),
                passwordPortalBtn1Text: i18n.t("passwordPortal:btn1Text"),
                passwordPortalPasswordText: i18n.t("passwordPortal:passwordText"),
                passwordPortalConfirmPasswordText: i18n.t("passwordPortal:confirmPasswordText"),
                registerPortalErrorMinLength: i18n.t("registerPortal:errorMinLength"),
                registerPortalErrorTooMuch: i18n.t("registerPortal:errorTooMuch"),
                registerPortalErrorCharactersPassword: i18n.t("registerPortal:errorCharactersPassword"),
                registerPortalPasswordsDoNotMatch: i18n.t("registerPortal:passwordsDoNotMatch"),
                oldPasswordError: i18n.t("passwordPortal:oldPasswordError"),
                passwordUpdateSuccess: i18n.t("passwordPortal:passwordUpdateSuccess"),
                passwordTooShort: i18n.t("passwordPortal:passwordTooShort"),
                currentPasswordLabel: i18n.t("passwordPortal:currentPasswordLabel"),
                newPasswordConfirmLabel: i18n.t("passwordPortal:newPasswordConfirmLabel"),
                newPasswordLabel: i18n.t("passwordPortal:newPasswordLabel"),
                passwordRequired: i18n.t("passwordPortal:passwordRequired"),
                pageTitle: i18n.t("passwordPortal:pageTitle"),
                currentPasswordPlaceholder: i18n.t("passwordPortal:currentPasswordPlaceholder"),
                newPasswordConfirmPlaceholder: i18n.t("passwordPortal:newPasswordConfirmPlaceholder"),
                newPasswordPlaceholder: i18n.t("passwordPortal:newPasswordPlaceholder"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Password;
