import React, { useRef, useState, useEffect } from "react";
import DatePicker from "./DatePicker";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import PickerRadioButtonsGroup from "./PickerRadioButtonsGroup";
import "swiper/css";

SwiperCore.use([Navigation]);

export interface Hour {
    isAvailable: boolean;
    name: string;
    id: string;
    period: "am" | "pm";
}

export interface Day {
    isAvailable: boolean;
    name: string;
    id: number;
    dayOfAWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    hours: Hour[];
}

export interface Month {
    isActive: boolean;
    name: string;
    number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    year: number;
    days: Day[];
}

export interface DateTimePickerData {
    weekDaysTexts: string[];
    months: Month[];
}

interface DateTimePickerProps extends DateTimePickerData {
    selectTimeText: string;
    amText: string;
    chooseHourErrorText: string;
    pmText: string;
    error?: string;
    hooksFormRegister: any;
    hooksFormReset: any;
    hooksFormGetValues: any;
    radioGroupName: string;
    className: string;
    required: boolean;
}

const DateTimePicker = ({
    weekDaysTexts,
    months,
    selectTimeText,
    error,
    chooseHourErrorText,
    radioGroupName,
    amText,
    pmText,
    hooksFormRegister,
    hooksFormReset,
    hooksFormGetValues,
    className,
    required,
}: DateTimePickerProps): JSX.Element => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [swiper, setSwiper] = useState(null);

    useEffect(() => {
        //ReInitialises swiper when it gets visible or hidden
        if (swiper) {
            swiper.update();
        }
    });

    return (
        <section className={`w-full date-time-picker text ${className}`}>
            <PickerRadioButtonsGroup>
                <section className="date-time-picker__calendar-container flex relative">
                    {prevRef?.current && (
                        <Swiper
                            onSwiper={(swiper) => {
                                setSwiper(swiper);
                            }}
                            spaceBetween={0}
                            observer
                            slidesPerView={1}
                            updateOnWindowResize
                            navigation={{
                                prevEl: prevRef.current ? prevRef.current : undefined,
                                nextEl: nextRef.current ? nextRef.current : undefined,
                            }}
                        >
                            {months?.map((month) => {
                                return (
                                    <SwiperSlide key={month.number}>
                                        <section>
                                            <h4 className="date-time-picker__calendar-title w-full text-lg lg:text-lg font-bold whitespace-nowrap text-center cursor-pointer z-0 ">
                                                {month.name}
                                            </h4>

                                            <DatePicker
                                                key={month?.number}
                                                amText={amText}
                                                pmText={pmText}
                                                currentMonth={month}
                                                radioGroupName={radioGroupName}
                                                hooksFormReset={hooksFormReset}
                                                hooksFormRegister={hooksFormRegister}
                                                hooksFormGetValues={hooksFormGetValues}
                                                chooseHourErrorText={chooseHourErrorText}
                                                weekDaysTexts={weekDaysTexts}
                                                selectTimeText={selectTimeText}
                                                required={required}
                                            />
                                        </section>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    )}

                    <div
                        className="flex justify-center items-center text-xl arrow-control w-9 h-9 icon-arrow-left left-0 absolute z-10 cursor-pointer bg-bgr-tertiary-faded rounded-full text-t-secondary-2"
                        ref={prevRef}
                    ></div>
                    <div
                        className="flex justify-center items-center text-xl arrow-control w-9 h-9 icon-arrow-right right-0 absolute z-10 cursor-pointer bg-bgr-tertiary-faded rounded-full text-t-secondary-2"
                        ref={nextRef}
                    ></div>
                </section>
                <p className="text-t-error mt-6">{error}</p>
            </PickerRadioButtonsGroup>
            <style jsx>{`
                .date-time-picker {
                    max-width: 343px;
                }

                .arrow-control {
                    transition: background-color 1s linear;
                }

                .date-time-picker__calendar-title {
                    line-height: 36px;
                }

                .arrow-control.swiper-button-disabled {
                    color: var(--t-tertiary);
                    background-color: var(--bgr-tertiary-faded);
                }
            `}</style>
        </section>
    );
};

export default DateTimePicker;
