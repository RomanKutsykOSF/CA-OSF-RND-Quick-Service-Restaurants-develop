import React, { useState, useContext } from "react";
import { Day, Month } from "./DateTimePicker";
import PickerRadioButton from "./PickerRadioButton";
import { PickerRadioButtonContext } from "./PickerRadioButtonsGroup";

interface HoursPickerProps {
    currentMonth: Month;
    currentDate: Day;
    amText: string;
    pmText: string;
    hooksFormRegister: any;
    hooksFormReset: any;
    hooksFormGetValues: any;
    radioGroupName: string;
    chooseHourErrorText: string;
    className?: string;
    required: boolean;
}

const HoursPicker = ({
    currentDate,
    amText,
    pmText,
    hooksFormRegister,
    hooksFormReset,
    hooksFormGetValues,
    radioGroupName,
    chooseHourErrorText,
    currentMonth,
    className,
    required,
}: HoursPickerProps): JSX.Element => {
    const radioButtonContext = useContext(PickerRadioButtonContext);
    const [activeTimePeriod, setActiveTimePeriod] = useState("am");

    return (
        <section className={`hours-picker ${className && className}`}>
            <section className="flex">
                <button
                    className={`border h-9 px-6 rounded-3xl mr-2 ${
                        activeTimePeriod === "am"
                            ? "bg-bgr-tertiary-faded border-br-primary"
                            : "bg-bgr-primary border-br-secondary"
                    }`}
                    onClick={() => {
                        setActiveTimePeriod("am");
                        hooksFormReset({ ...hooksFormGetValues(), [radioGroupName]: "" });
                        radioButtonContext.setActiveRadioId("");
                    }}
                >
                    {amText}
                </button>
                <button
                    className={`border h-9 px-6 rounded-3xl ${
                        activeTimePeriod === "pm"
                            ? "bg-bgr-tertiary-faded border-br-primary"
                            : "bg-bgr-primary border-br-secondary"
                    }`}
                    onClick={() => {
                        setActiveTimePeriod("pm");
                        hooksFormReset({ ...hooksFormGetValues(), [radioGroupName]: "" });
                        radioButtonContext.setActiveRadioId("");
                    }}
                >
                    {pmText}
                </button>
            </section>
            <section className={`mt-6 ${activeTimePeriod !== "am" && "hidden"}`}>
                {currentDate.hours
                    .filter((hour) => {
                        return hour.period === "am";
                    })
                    .map((hour) => {
                        return (
                            <PickerRadioButton
                                isAvailable={hour.isAvailable}
                                key={`${currentMonth.year}_${currentMonth.number}_${currentDate.id}_${hour.id}`}
                                variant="default"
                                value={`${currentMonth.year}_${currentMonth.number}_${currentDate.id}_${hour.id}`}
                                id={`${currentMonth.year}_${currentMonth.number}_${currentDate.id}_${hour.id}`}
                                label={hour.name}
                                formHooksRegister={hooksFormRegister(radioGroupName, {
                                    required: required ? chooseHourErrorText : false,
                                })}
                            />
                        );
                    })}
            </section>

            <section className={`mt-6 ${activeTimePeriod !== "pm" && "hidden"}`}>
                {currentDate.hours
                    .filter((hour) => {
                        return hour.period === "pm";
                    })
                    .map((hour) => {
                        return (
                            <PickerRadioButton
                                isAvailable={hour.isAvailable}
                                key={`${currentMonth.year}_${currentMonth.number}_${currentDate.id}_${hour.id}`}
                                variant="default"
                                value={`${currentMonth.year}_${currentMonth.number}_${currentDate.id}_${hour.id}`}
                                id={`${currentMonth.year}_${currentMonth.number}_${currentDate.id}_${hour.id}`}
                                label={hour.name}
                                formHooksRegister={hooksFormRegister(radioGroupName, {
                                    required: required ? chooseHourErrorText : false,
                                })}
                            />
                        );
                    })}
            </section>
        </section>
    );
};

export default HoursPicker;
