import React, { useContext } from "react";
import { GlobalContext } from "context/global";
import { GetServerSidePropsResult, GetServerSidePropsContext } from "next";
import MainLayout from "components/layouts/main";
import i18Init from "i18";
import Input from "components/UI/forms/Input";
import Select from "components/UI/forms/Select";
import Checkbox from "components/UI/forms/Checkbox";
import RadioButton from "components/UI/forms/RadioButton";
import RadioButtonsGroup from "components/UI/forms/RadioButtonsGroup";
import FormGroup from "components/UI/forms/FormGroup";
import Button from "components/UI/Button";
import CenterWrapper from "components/UI/layoutControls/CenterContentWrapper";
import { useForm } from "react-hook-form";
import populateGlobalResources from "i18/populateGlobalResources";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import { FetcherResponse } from "bdConnector/types";

interface ExampleProps {
    i18: Record<string, string>;
    globalResources: Record<string, string>;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
}

interface FormProps {
    name: string;
    lastName: string;
    agree: boolean;
    radio: string;
    mySelect: string;
    WheelRadioButtonExample: string;
}

const onSubmit = (data): void => {
    console.log("form data", data);
};

const PDP = ({ globalResources, globalData, locale }: ExampleProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<FormProps>({
        defaultValues: {
            name: "My Name",
            lastName: "My Last Name",
            radio: "radio1",
            agree: true,
            mySelect: "option-2",
            WheelRadioButtonExample: "radio3",
        },
    });

    return (
        <MainLayout
            globalResources={globalResources}
            themeVariables={globalContext.themeCssString}
            globalData={globalData}
            locale={locale}
        >
            <div>
                <CenterWrapper maxWidth={globalContext.viewports.xlarge}>
                    <div className="test">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup tabletViewport={globalContext.viewports.medium} columns="two">
                                <Input
                                    type="text"
                                    error={errors.name ? errors.name.message : ""}
                                    id="name"
                                    isValidated={isSubmitted}
                                    placeholder="Name"
                                    label="Your Name"
                                    onInput={(ev) => {
                                        const target = ev.target as HTMLInputElement;
                                        console.log(target.value);
                                    }}
                                    isRequired={true}
                                    formHooksRegister={register("name", {
                                        required: "You did not fill first name",
                                        minLength: {
                                            value: 3,
                                            message: "Min Lengs should be more than 3",
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: "Too many characters",
                                        },
                                    })}
                                />

                                <Input
                                    type="text"
                                    error={errors.lastName ? errors.lastName.message : ""}
                                    id="lastName"
                                    isValidated={isSubmitted}
                                    placeholder="Last Name"
                                    label="I am Last Name"
                                    onInput={(ev) => {
                                        const target = ev.target as HTMLInputElement;
                                        console.log(target.value);
                                    }}
                                    isRequired={true}
                                    formHooksRegister={register("lastName", {
                                        required: "You did not fill last name",
                                        minLength: {
                                            value: 3,
                                            message: "Min Lengs should be more than 3",
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: "Too many characters",
                                        },
                                        validate: {
                                            starnFromUpperCase: (value) => {
                                                return (
                                                    (value.match("^[A-Z].*") && true) || "Must Start From Upper Case"
                                                );
                                            },
                                        },
                                    })}
                                />
                            </FormGroup>

                            <Checkbox
                                error={errors.agree ? errors.agree.message : ""}
                                id="agree"
                                label="I agree"
                                onInput={(ev) => {
                                    const target = ev.target as HTMLInputElement;
                                    console.log(target.value);
                                }}
                                formHooksRegister={register("agree", {
                                    required: "You did not check agree",
                                })}
                            />

                            <RadioButtonsGroup>
                                <FormGroup tabletViewport={globalContext.viewports.medium} columns="one">
                                    <RadioButton
                                        value="radio1"
                                        id="radio1"
                                        label="Check to radio1"
                                        onInput={(ev) => {
                                            const target = ev.target as HTMLInputElement;
                                            console.log(target.value);
                                        }}
                                        formHooksRegister={register("radio", { required: "You need to choose" })}
                                    />
                                    <RadioButton
                                        error={errors.radio ? errors.radio.message : ""}
                                        value="radio2"
                                        id="radio2"
                                        label="Check to radio2"
                                        onInput={(ev) => {
                                            const target = ev.target as HTMLInputElement;
                                            console.log(target.value);
                                        }}
                                        formHooksRegister={register("radio", { required: "You need to choose" })}
                                    />
                                </FormGroup>
                            </RadioButtonsGroup>
                            <FormGroup tabletViewport={globalContext.viewports.medium} columns="one">
                                <Select
                                    id="mySelect"
                                    label="My saved addresses"
                                    error={errors.mySelect ? errors.mySelect.message : ""}
                                    formHooksRegister={register("mySelect", { required: "You need to select value" })}
                                    onChange={(ev) => {
                                        const target = ev.target as HTMLInputElement;
                                        console.log(target.value);
                                    }}
                                >
                                    <option value="option-1">Option 1</option>
                                    <option value="option-2">Option 2</option>
                                </Select>
                            </FormGroup>

                            <RadioButtonsGroup>
                                <FormGroup tabletViewport={globalContext.viewports.medium} columns="one">
                                    <RadioButton
                                        id="radio3"
                                        value="radio3"
                                        variant="wheel"
                                        label="Check to radio3"
                                        subLabel="Sublabel 1"
                                        onInput={(ev) => {
                                            const target = ev.target as HTMLInputElement;
                                            console.log("console:", target.value);
                                        }}
                                        formHooksRegister={register("WheelRadioButtonExample", {
                                            required: "You need to choose WheelRadioButtonExample",
                                        })}
                                        error={
                                            errors.WheelRadioButtonExample ? errors.WheelRadioButtonExample.message : ""
                                        }
                                    />
                                    <RadioButton
                                        id="radio4"
                                        value="radio4"
                                        variant="wheel"
                                        label="Check to radio4"
                                        onInput={(ev) => {
                                            const target = ev.target as HTMLInputElement;
                                            console.log("console:", target.value);
                                        }}
                                        formHooksRegister={register("WheelRadioButtonExample", {
                                            required: "You need to choose WheelRadioButtonExample",
                                        })}
                                        error={
                                            errors.WheelRadioButtonExample ? errors.WheelRadioButtonExample.message : ""
                                        }
                                    />
                                </FormGroup>
                            </RadioButtonsGroup>
                            <Button variant="primary" type="submit">
                                Submit Form
                            </Button>
                        </form>
                    </div>
                </CenterWrapper>
            </div>
        </MainLayout>
    );
};

export const getServerSideProps = async ({
    locale,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<ExampleProps>> => {
    let i18n: any;
    const isValidProduct = true; //To be replaced by real data from graphql

    if (isValidProduct) {
        try {
            i18n = await i18Init(locale);
        } catch (e) {
            console.log("Error during homepage i18n initialization:", e);
        }

        const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

        return {
            props: {
                locale,
                globalData,
                i18: {
                    hello: i18n.t("pdp:hello"),
                },
                globalResources: populateGlobalResources(i18n),
            },
        };
    } else {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
};

export default PDP;
