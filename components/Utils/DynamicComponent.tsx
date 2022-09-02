import React from "react";
import HeaderBanner from "components/UI/HeaderBanner";
import TilesCarousel from "components/UI/TilesCarousel";
import AdvertisementBanner from "components/UI/AdvertisementBanner";
import ProductRecommendations from "components/UI/ProductRecommendations";
import ContentImgCta from "components/UI/ContentImgCta";
import MenuTilesCarousel from "components/MenuTilesCarousel/MenuTilesCarousel";

const Components = {
    HeaderBanner,
    TilesCarousel,
    AdvertisementBanner,
    ProductRecommendations,
    ContentImgCta,
    MenuTilesCarousel,
};

interface DynamicComponentProps {
    componentData: any;
}

const DynamicComponent = ({ componentData }: DynamicComponentProps): JSX.Element => {
    if (typeof Components[componentData?.component] != "undefined") {
        const Component = Components[componentData?.component];

        return <Component {...componentData} />;
    }
    return (
        <div className="font-primary font-bold text-t-primary">
            {componentData?.component} is not defined in the Dynamic Component
        </div>
    );
};

export default DynamicComponent;
