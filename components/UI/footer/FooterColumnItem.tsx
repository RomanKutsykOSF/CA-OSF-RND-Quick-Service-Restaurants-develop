import Link from "next/link";

interface FooterColumnItemProps {
    text: string;
    url: string;
}

const FooterColumnItem = ({ text, url }: FooterColumnItemProps): JSX.Element => {
    return (
        <Link href={url}>
            <a className="block text-t-tertiary font-semibold text-sm">{text}</a>
        </Link>
    );
};

export default FooterColumnItem;
