import React, { useContext, useState, useEffect } from "react";
import Button from "components/UI/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { GlobalContext } from "context/global";
import css from "styled-jsx/css";
import "swiper/css";
import "swiper/css/scrollbar";
import VerticalCollapse from "components/UI/VerticalCollapse";
export interface TabProps {
    id: string;
    title: string;
    content: string;
}

export interface TabsProps {
    tabsData: TabProps[];
}

const Tabs = ({ tabsData }: TabsProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const [activeTabId, setActiveTabId] = useState(tabsData[0]?.id);

    useEffect(() => {
        setActiveTabId(tabsData[0]?.id);
    }, [tabsData]);

    const setActiveTabIdCb = (tabId) => {
        return () => {
            setActiveTabId(tabId);
        };
    };

    // to style nested SwiperSlide component from the parent
    const { className: slideClass, styles: slideStyles } = css.resolve`
        .tabs__title-slide {
            width: auto;
        }
    `;
    const { className: sliderClass, styles: sliderStyles } = css.resolve`
        @media (min-width: ${globalContext.viewports.large}px) {
            .swiper {
                margin: 0;
            }
        }
    `;

    const titles = tabsData.map((tabData) => {
        const classList = ["mr-4 tabs__title"];
        if (tabData.id === activeTabId) {
            classList.push("tabs__title--active");
        }
        const variant = tabData.id === activeTabId ? "primary" : "outline-custom";

        return (
            <SwiperSlide key={tabData.id} className={`tabs__title-slide ${slideClass}`}>
                <Button variant={variant} onClick={setActiveTabIdCb(tabData.id)}>
                    {tabData.title}
                </Button>
            </SwiperSlide>
        );
    });
    const contents = tabsData.map((tabData) => {
        return (
            <VerticalCollapse
                key={tabData.id}
                minHeight={"100px"}
                buttonTextCollapsed="Read more"
                buttonTextExpanded="Collapse"
                visible={tabData.id == activeTabId}
            >
                <div dangerouslySetInnerHTML={{ __html: tabData.content ? tabData.content : "" }}></div>
            </VerticalCollapse>
        );
    });

    return (
        <div className="tabs">
            <div className="mb-2 flex tabs__header">
                <Swiper slidesPerView="auto" spaceBetween={10} className={sliderClass}>
                    {titles}
                </Swiper>
            </div>
            <ol className="list-none tabs__content">{contents}</ol>
            {sliderStyles}
            {slideStyles}
        </div>
    );
};

export default Tabs;
