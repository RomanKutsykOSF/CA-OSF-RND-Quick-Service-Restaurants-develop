import React, { useContext, useRef } from "react";
import { GlobalContext } from "context/global";
import CenterWrapper from "components/UI/layoutControls/CenterContentWrapper";
import i18nInit from "i18";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import MainLayout from "components/layouts/main";
import { useForm } from "react-hook-form";
import Input from "components/UI/forms/Input";
import Button from "components/UI/Button";
import FormGroup from "components/UI/forms/FormGroup";
import Title from "components/UI/Title";
import Divider from "components/UI/Divider";
import populateGlobalResources from "i18/populateGlobalResources";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import registerFetcher, { registerMutation } from "bdConnector/account/register";
import { FetcherResponse } from "bdConnector/types";
import { validateEmail, validatePhone } from "utils";
import Head from "next/head";

export interface FormProps {
    firstName: string;
    lastName: string;
    email: string;
    phoneMobile: string;
    password: string;
    confirmPassword: string;
    formError: string;
}

export interface RegisterProps {
    i18: Record<string, string>;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
    globalResources: Record<string, string>;
}

const Register = ({ i18, locale, globalData, globalResources }: RegisterProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitted, isSubmitting },
    } = useForm<FormProps>();

    const password = useRef({});
    password.current = watch("password", "");

    const onSubmit = async (formData: FormProps): Promise<void> => {
        const { data, errorCode } = await registerFetcher(registerMutation, {
            customer: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneMobile: formData.phoneMobile,
            },
            password: formData.password,
        });

        if (data) {
            globalContext.useSwrGetUserDataMutate({ data: { isLoggedIn: true } }, false);
            return;
        }

        if (errorCode === "INVALID_EMAIL") {
            setError("email", { message: i18.registerPortalInvalidEmail });
            return;
        }

        if (errorCode === "INVALID_PASSWORD") {
            setError("password", { message: i18.registerPortalInvalidPassword });
            return;
        }

        if (errorCode === "LOGIN_ALREADY_EXISTS") {
            setError("email", { message: i18.registerPortalEmailAlreadyExists });
            return;
        }

        globalContext.showNotification({
            type: "error",
            message: i18.registerPortalInternalServerError,
            autoClose: true,
        });
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
                <CenterWrapper maxWidth={578}>
                    <div>
                        <Title type="h1" className="pt-8">
                            {i18.registerPortalTitle}
                        </Title>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup tabletViewport={globalContext.viewports.medium} columns="two">
                                <Input
                                    type="text"
                                    error={errors.firstName ? errors.firstName.message : undefined}
                                    id="name"
                                    label={i18.registerPortalName}
                                    placeholder={i18.registerPortalPlaceholderFirstName}
                                    isValidated={isSubmitted}
                                    isRequired={true}
                                    formHooksRegister={register("firstName", {
                                        required: i18.registerPortalErrorFillFirstName,
                                        minLength: {
                                            value: 3,
                                            message: i18.registerPortalErrorMinLength,
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: i18.registerPortalErrorTooMuch,
                                        },
                                        validate: (value) => !!value.trim() || i18.registerPortalErrorFillFirstName,
                                    })}
                                />
                                <Input
                                    type="text"
                                    error={errors.lastName ? errors.lastName.message : undefined}
                                    id="lastName"
                                    label={i18.registerPortalLastName}
                                    placeholder={i18.registerPortalPlaceholderLastName}
                                    isValidated={isSubmitted}
                                    isRequired={true}
                                    formHooksRegister={register("lastName", {
                                        required: i18.registerPortalErrorFillLastName,
                                        minLength: {
                                            value: 3,
                                            message: i18.registerPortalErrorMinLength,
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: i18.registerPortalErrorTooMuch,
                                        },
                                        validate: (value) => !!value.trim() || i18.registerPortalErrorFillLastName,
                                    })}
                                />
                            </FormGroup>
                            <Input
                                type="text"
                                error={errors.email ? errors.email.message : undefined}
                                id="email"
                                placeholder={i18.registerPortalPlaceholderEmail}
                                label={i18.registerPortalEmail}
                                isValidated={isSubmitted}
                                isRequired={true}
                                formHooksRegister={register("email", {
                                    required: i18.registerPortalErrorFillEmail,
                                    minLength: {
                                        value: 3,
                                        message: i18.registerPortalErrorMinLength,
                                    },
                                    maxLength: {
                                        value: 64,
                                        message: i18.registerPortalErrorTooMuch,
                                    },
                                    validate: (value: string) => validateEmail(value, i18.registerPortalInvalidEmail),
                                })}
                            />
                            <Input
                                type="tel"
                                error={errors.phoneMobile ? errors.phoneMobile.message : undefined}
                                id="phoneMobile"
                                placeholder={i18.registerPortalPlaceholderPhone}
                                label={i18.registerPortalPhone}
                                isValidated={isSubmitted}
                                isRequired={true}
                                formHooksRegister={register("phoneMobile", {
                                    required: i18.registerPortalErrorFillPhone,
                                    minLength: {
                                        value: 3,
                                        message: i18.registerPortalErrorMinLength,
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: i18.registerPortalErrorTooMuch,
                                    },
                                    validate: (value: string) =>
                                        validatePhone(value, i18.registerPortalErrorPhoneValidationFailed),
                                })}
                            />
                            <Input
                                type="password"
                                error={errors.password ? errors.password.message : ""}
                                id="password"
                                placeholder={i18.registerPortalPlaceholderPassword}
                                label={i18.registerPortalPassword}
                                isValidated={isSubmitted}
                                isRequired={true}
                                formHooksRegister={register("password", {
                                    required: i18.registerPortalErrorFillPassword,
                                    minLength: {
                                        value: 8,
                                        message: i18.registerPortalErrorMinLength,
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
                                placeholder={i18.registerPortalPlaceholderConfirmPassword}
                                label={i18.registerPortalConfirmPassword}
                                isValidated={isSubmitted}
                                isRequired={true}
                                formHooksRegister={register("confirmPassword", {
                                    required: i18.registerPortalErrorFillConfirmPassword,
                                    validate: {
                                        passwordsMatch: (value) => {
                                            return value === password.current || i18.registerPortalPasswordsDoNotMatch;
                                        },
                                    },
                                })}
                            />
                            <div className="mt-7 mr-auto flex flex-col w-40">
                                <Button disabled={isSubmitting} variant="primary" type="submit">
                                    {i18.registerPortalBtn1Text}
                                </Button>
                            </div>
                        </form>
                        <Divider className="my-5" />
                        <p className="text-center">{i18.registerPortalSubtitle1}</p>
                        <div className="mt-2 mb-32 mx-auto flex flex-col align-center max-w-xs ">
                            <Button disabled={isSubmitting} variant="outline-custom" type="submit" link="/login">
                                {i18.registerPortalBtn2Text}
                            </Button>
                        </div>
                    </div>
                </CenterWrapper>
            </MainLayout>
        </>
    );
};

export const getStaticProps = async ({
    locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<RegisterProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during register page i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            globalData,
            i18: {
                registerPortalTitle: i18n.t("registerPortal:title"),
                registerPortalName: i18n.t("registerPortal:nameText"),
                registerPortalLastName: i18n.t("registerPortal:lastNameText"),
                registerPortalEmail: i18n.t("registerPortal:emailText"),
                registerPortalPhone: i18n.t("registerPortal:phoneText"),
                registerPortalPassword: i18n.t("registerPortal:passwordText"),
                registerPortalConfirmPassword: i18n.t("registerPortal:confirmPasswordText"),
                registerPortalBtn1Text: i18n.t("registerPortal:btn1Text"),
                registerPortalBtn2Text: i18n.t("registerPortal:btn2Text"),
                registerPortalSubtitle1: i18n.t("registerPortal:subtitle1"),
                registerPortalPlaceholderEmail: i18n.t("registerPortal:placeholderEmail"),
                registerPortalPlaceholderPhone: i18n.t("registerPortal:placeholderPhone"),
                registerPortalPlaceholderFirstName: i18n.t("registerPortal:placeholderFirstName"),
                registerPortalPlaceholderLastName: i18n.t("registerPortal:placeholderLastName"),
                registerPortalPlaceholderPassword: i18n.t("registerPortal:placeholderPassword"),
                registerPortalPlaceholderConfirmPassword: i18n.t("registerPortal:placeholderConfirmPassword"),
                registerPortalErrorFillFirstName: i18n.t("registerPortal:errorFillFirstName"),
                registerPortalErrorFillLastName: i18n.t("registerPortal:errorFillLastName"),
                registerPortalErrorFillEmail: i18n.t("registerPortal:errorFillEmail"),
                registerPortalErrorFillPhone: i18n.t("registerPortal:errorFillPhone"),
                registerPortalErrorFillPassword: i18n.t("registerPortal:errorFillPassword"),
                registerPortalErrorFillConfirmPassword: i18n.t("registerPortal:errorFillConfirmPassword"),
                registerPortalErrorMinLength: i18n.t("registerPortal:errorMinLength"),
                registerPortalErrorTooMuch: i18n.t("registerPortal:errorTooMuch"),
                registerPortalErrorPhoneValidationFailed: i18n.t("registerPortal:errorPhoneValidationFailed"),
                registerPortalErrorCharactersPassword: i18n.t("registerPortal:errorCharactersPassword"),
                registerPortalPasswordsDoNotMatch: i18n.t("registerPortal:passwordsDoNotMatch"),
                registerPortalInvalidEmail: i18n.t("registerPortal:invalidEmail"),
                registerPortalInvalidPassword: i18n.t("registerPortal:invalidPassowrd"),
                registerPortalEmailAlreadyExists: i18n.t("registerPortal:emailAlreadyExists"),
                registerPortalInternalServerError: i18n.t("registerPortal:internalServerError"),
                pageTitle: i18n.t("registerPortal:pageTitle"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Register;
