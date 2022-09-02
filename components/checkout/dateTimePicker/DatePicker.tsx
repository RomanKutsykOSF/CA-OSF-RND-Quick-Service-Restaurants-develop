import React, { useState, useContext } from "react";
import { Month } from "./DateTimePicker";
import HoursPicker from "components/checkout/dateTimePicker/HoursPicker";
import { PickerRadioButtonContext } from "./PickerRadioButtonsGroup";

interface DatePickerProps {
    currentMonth: Month;
    weekDaysTexts: string[];
    radioGroupName: string;
    hooksFormReset: any;
    hooksFormRegister: any;
    hooksFormGetValues: any;
    selectTimeText: string;
    amText: string;
    pmText: string;
    chooseHourErrorText: string;
    required: boolean;
}

const DatePicker = ({
    currentMonth,
    selectTimeText,
    weekDaysTexts,
    radioGroupName,
    hooksFormRegister,
    hooksFormReset,
    hooksFormGetValues,
    amText,
    pmText,
    chooseHourErrorText,
    required,
}: DatePickerProps): JSX.Element => {
    const radioButtonContext = useContext(PickerRadioButtonContext);
    const [currentDate, setCurrentDate] = useState(currentMonth.days[0]);
    return (
        <>
            {weekDaysTexts?.length && (
                <ul className="flex justify-between mt-6">
                    {weekDaysTexts.map((dayText) => {
                        return (
                            <li className="month-title text-center" key={dayText}>
                                {dayText}
                            </li>
                        );
                    })}
                </ul>
            )}

            <section className="flex w-full justify-start mt-3 flex-wrap">
                {currentMonth.days.map((day) => {
                    return (
                        <div
                            key={`${currentMonth.year}-${currentMonth.number}-${day.id}`}
                            className={`date-container mt-3 day-of-week-${day.dayOfAWeek} flex justify-center items-center`}
                        >
                            <button
                                className={`date-button w-10 h-10 rounded-full ${
                                    `${currentMonth.year}-${currentMonth.number}-${currentDate.id}` ===
                                    `${currentMonth.year}-${currentMonth.number}-${day.id}`
                                        ? "bg-bgr-tertiary text-t-tertiary"
                                        : "bg-bgr-faded text-t-primary"
                                }`}
                                disabled={!day.isAvailable}
                                onClick={() => {
                                    if (day.isAvailable) {
                                        setCurrentDate(day);
                                        hooksFormReset({ ...hooksFormGetValues(), [radioGroupName]: "" });
                                        radioButtonContext.setActiveRadioId("");
                                    }
                                }}
                            >
                                {day.isAvailable} {day.id}
                            </button>
                        </div>
                    );
                })}
            </section>

            <p className="mt-5">{selectTimeText}</p>

            <HoursPicker
                className="mt-4"
                chooseHourErrorText={chooseHourErrorText}
                currentMonth={currentMonth}
                currentDate={currentDate}
                amText={amText}
                pmText={pmText}
                radioGroupName={radioGroupName}
                hooksFormRegister={hooksFormRegister}
                hooksFormReset={hooksFormReset}
                hooksFormGetValues={hooksFormGetValues}
                required={required}
            />

            <style jsx>{`
                .month-title {
                    width: 14.28%;
                }

                .date-container {
                    width: 14.28%;
                }

                .date-button[disabled] {
                    color: var(--t-faded);
                    cursor: default;
                }

                .day-of-week-2:first-of-type {
                    margin-left: calc(14.28% * 1);
                }

                .day-of-week-3:first-of-type {
                    margin-left: calc(14.28% * 2);
                }

                .day-of-week-4:first-of-type {
                    margin-left: calc(14.28% * 3);
                }

                .day-of-week-5:first-of-type {
                    margin-left: calc(14.28% * 4);
                }

                .day-of-week-6:first-of-type {
                    margin-left: calc(14.28% * 5);
                }

                .day-of-week-7:first-of-type {
                    margin-left: calc(14.28% * 6);
                }
            `}</style>
        </>
    );
};

export default DatePicker;
