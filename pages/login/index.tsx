import React, { useContext, useEffect, useState } from "react";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import i18nInit from "i18";

import { GlobalContext } from "../../context/global";
import MainLayout from "components/layouts/main";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import Title from "components/UI/Title";
import Input from "components/UI/forms/Input";
import Button from "components/UI/Button";
import Divider from "components/UI/Divider";
import populateGlobalResources from "i18/populateGlobalResources";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import loginStartFetcher, { loginStartMutation } from "bdConnector/account/login_PKCE_Start";
import loginEndFetcher, { loginEndMutation } from "bdConnector/account/login_PKCE_End";
import { FetcherResponse } from "bdConnector/types";
import Head from "next/head";

export interface FormProps {
    username: string;
    password: string;
    formError: string;
}

export interface LoginProps {
    i18: Record<string, string>;
    locale: string;
    globalResources: Record<string, string>;
    globalData: FetcherResponse<GlobalData>;
}

const Login = ({ i18, locale, globalData, globalResources }: LoginProps): JSX.Element => {
    const router = useRouter();
    const [isFetching, setIsFetching] = useState(false);
    const globalContext = useContext(GlobalContext);

    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        formState: { errors, isSubmitted, isSubmitting, isValid },
    } = useForm<FormProps>();

    const triggerLogin = async (codeVerifier: string, code: string, usid: string): Promise<void> => {
        setIsFetching(true);
        const { data, errorCode } = await loginEndFetcher(loginEndMutation, {
            codeVerifier,
            code: code as string,
            usid: usid as string,
        });

        if (errorCode) {
            await globalContext.useSwrGetUserDataMutate({ data: { isLoggedIn: false } }, false);
            return;
        }

        if (data) {
            await globalContext.useSwrGetUserDataMutate({ data }, false);
            return;
        }

        globalContext.showNotification({
            type: "error",
            autoClose: true,
            message: i18.loginPortalformError,
        });

        setIsFetching(false);
    };

    useEffect(() => {
        const { code, usid } = router.query;
        const codeVerifier = Cookies.get("session.code-verifier");

        if (code && usid && codeVerifier && !globalContext.isUserLoggedIn) {
            triggerLogin(codeVerifier, code as string, usid as string);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query]);

    useEffect(() => {
        if (isValid) clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValid]);

    const onSubmit = async (formData: FormProps): Promise<void> => {
        const { data, errorCode } = await loginStartFetcher(loginStartMutation, formData);

        if (errorCode === "INVALID_CREDENTIALS") {
            setError("formError", { message: i18.loginPortalInvalidCredentials });
            return;
        } else if (!data) {
            globalContext.showNotification({
                type: "error",
                message: i18.loginPortalformError,
                autoClose: true,
            });
            return;
        }

        await router.push(data.redirectURL);
    };

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
                locale={locale}
            >
                <CenterContentWrapper maxWidth={578}>
                    <Title type="h1" className="pt-8">
                        {i18.loginPortalTitle}
                    </Title>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {errors.formError && (
                            <div
                                className="bg-bgr-error border mt-2 text-t-error px-4 py-2 rounded relative"
                                role="alert"
                            >
                                <span className="block leading-normal text-sm sm:inline">
                                    {errors.formError?.message}
                                </span>
                                <span
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && clearErrors(["formError"])}
                                    onClick={() => clearErrors([`formError`])}
                                    role="button"
                                    className="absolute flex items-center icon-cross top-0 bottom-0 right-0 text-lg"
                                />
                            </div>
                        )}
                        <Input
                            type="email"
                            error={errors.username ? errors.username.message : undefined}
                            id="username"
                            placeholder={i18.loginPortalPlaceholderEmail}
                            label={i18.loginPortalEmail}
                            isValidated={isSubmitted}
                            isRequired={true}
                            formHooksRegister={register("username", {
                                required: i18.loginPortalErrorFillEmail,
                                validate: (value) => !!value.trim() || i18.loginPortalErrorFillEmail,
                            })}
                        />
                        <Input
                            type="password"
                            error={errors.password ? errors.password.message : ""}
                            id="password"
                            placeholder={i18.loginPortalPlaceholderPassword}
                            label={i18.loginPortalPassword}
                            isValidated={isSubmitted}
                            isRequired={true}
                            formHooksRegister={register("password", {
                                required: i18.loginPortalErrorFillPassword,
                                validate: (value) => !!value.trim() || i18.loginPortalErrorFillPassword,
                            })}
                        />
                        <div className="mt-7 mr-auto flex flex-col w-40">
                            <Button
                                className="transition-all duration-150"
                                disabled={isSubmitting || isFetching}
                                variant="primary"
                                cssIconClass=""
                                type="submit"
                            >
                                {isFetching || isSubmitting ? i18.loginPortalLoadingText : i18.loginPortalBtn1Text}
                            </Button>
                        </div>
                        <Divider theme="light" className="my-5" />

                        <div className="mt-2 mx-auto mb-20 flex flex-col align-center max-w-xs">
                            <p className="text-center mb-2">{i18.loginPortalSubtitle1}</p>

                            <Button
                                disabled={isSubmitting || isFetching}
                                variant="outline-custom"
                                type="button"
                                link="/register"
                            >
                                {i18.loginPortalBtn2Text}
                            </Button>
                        </div>
                    </form>
                </CenterContentWrapper>
            </MainLayout>
            <style jsx>{`
                i:before {
                    display: block;
                }
            `}</style>
        </>
    );
};

export const getStaticProps = async ({ locale }: GetStaticPropsContext): Promise<GetStaticPropsResult<LoginProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during Login i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            globalData,
            i18: {
                loginPortalTitle: i18n.t("loginPortal:title"),
                loginPortalEmail: i18n.t("loginPortal:emailText"),
                loginPortalPassword: i18n.t("loginPortal:passwordText"),
                loginPortalPlaceholderEmail: i18n.t("loginPortal:placeholderEmail"),
                loginPortalPlaceholderPassword: i18n.t("loginPortal:placeholderPassword"),
                loginPortalBtn1Text: i18n.t("loginPortal:btn1Text"),
                loginPortalBtn2Text: i18n.t("loginPortal:btn2Text"),
                loginPortalSubtitle1: i18n.t("loginPortal:subtitle1"),
                loginPortalErrorFillEmail: i18n.t("loginPortal:errorFillEmail"),
                loginPortalErrorFillPassword: i18n.t("loginPortal:errorFillPassword"),
                loginPortalErrorMinLength: i18n.t("loginPortal:errorMinLength"),
                loginPortalErrorTooMuch: i18n.t("loginPortal:errorTooMuch"),
                loginPortalInvalidCredentials: i18n.t("loginPortal:errorInvalidCredentials"),
                loginPortalformError: i18n.t("loginPortal:internalServerError"),
                loginPortalLoadingText: i18n.t("loginPortal:loadingText"),
                pageTitle: i18n.t("loginPortal:pageTitle"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Login;
