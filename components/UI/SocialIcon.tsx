import ConditionalWrapper from "components/Utils/ConditionalWrapper";
import Link from "next/link";

interface SocialIconProps {
    socialMediaType: "facebook" | "twitter" | "youtube" | "instagram";
    url: string;
    self?: boolean;
}

const SocialIcon = ({ socialMediaType, url, self }: SocialIconProps): JSX.Element => {
    return (
        <>
            <ConditionalWrapper condition={self} wrapper={(_children) => <Link href={url}>{_children}</Link>}>
                <a href={url} rel="noreferrer" target={self ? "_self" : "_blank"}>
                    <i className={`icon-${socialMediaType} text-t-tertiary text-xxl mr-2`}></i>
                </a>
            </ConditionalWrapper>
        </>
    );
};

export default SocialIcon;
