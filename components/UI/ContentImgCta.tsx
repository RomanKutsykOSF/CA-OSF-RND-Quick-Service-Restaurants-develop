import ConditionalWrapper from "components/Utils/ConditionalWrapper";
import Image from "next/image";
import Button from "./Button";
import CenterContentWrapper from "./layoutControls/CenterContentWrapper";

interface ContentImgCtaProps {
    title: string;
    subtitle: string;
    description: string;
    btnText: string;
    link: string;
    img: string;
    enableTopMargin?: boolean;
    alignment: "left" | "right";
    type: "overflowBottom" | "noOverflowBottom" | "noOverflowWithBackground";
    fullWidth: boolean;
}

const ContentImgCta = ({
    title,
    subtitle,
    description,
    btnText,
    link,
    img,
    enableTopMargin,
    alignment,
    type,
    fullWidth,
}: ContentImgCtaProps): JSX.Element => {
    return (
        <section
            className={`${enableTopMargin ? "mt-6 lg:mt-14" : ""} ${
                type === "noOverflowWithBackground" ? "bg-bgr-tertiary-faded pb-8 pt-14 lg:pt-32 lg:pb-14" : ""
            } ${type === "overflowBottom" ? "lg:-mb-28" : ""}${
                fullWidth
                    ? "flex-col lg:flex-row lg:flex px-4 lg:px-name lg:justify-around items-center "
                    : "md:flex-row md:grid md:justify-around items-center "
            }`}
        >
            <ConditionalWrapper
                condition={!fullWidth}
                wrapper={(_children) => (
                    <CenterContentWrapper className="flex flex-column flex-col lg:flex-row lg:items-center justify-between">
                        {_children}
                    </CenterContentWrapper>
                )}
            >
                <>
                    <div className={alignment === "left" ? "lg:order-none" : "lg:order-1"}>
                        <Image src={img} alt="" width={678} height={452} />
                    </div>
                    <div className={`${alignment === "left" ? "lg:pl-16" : "lg:pr-4"}`}>
                        <h4 className="font-bold font-primary text-t-secondary-2 text-lg mt-4 lg:mt-1">{subtitle}</h4>
                        <h1 className="font-bold font-primary text-t-primary text-xl lg:text-xxl mt-2">{title}</h1>
                        <p
                            className={`font-primary text-t-secondary text-sm mt-6 ${
                                fullWidth ? "max-w-xl" : "max-w-lg"
                            }`}
                        >
                            {description}
                        </p>
                        <Button link={link} className="mt-4" variant="primary">
                            {btnText}
                        </Button>
                    </div>
                </>
            </ConditionalWrapper>
        </section>
    );
};

export default ContentImgCta;
