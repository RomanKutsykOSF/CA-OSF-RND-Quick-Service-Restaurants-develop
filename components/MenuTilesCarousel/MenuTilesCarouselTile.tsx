import Image from "next/image";
import Link from "next/link";

export interface MenuTilesCarouselTileProps {
    title: string;
    linkPath: string;
    linkText: string;
    imgPath: string;
}

const MenuTilesCarouselTile = ({ title, linkPath, linkText, imgPath }: MenuTilesCarouselTileProps): JSX.Element => {
    return (
        <>
            <Image className={"rounded"} src={imgPath} width={373} height={160} />
            <h3 className={`text-lg lg:text-xl py-1 font-bold font-primary text-t-primary`}>{title}</h3>
            <Link href={linkPath}>
                <a className={`text-t-secondary-2 py-1 block font-bold font-primary text-sm`}>
                    {linkText}
                    <i className="icon-arrow-right text-sm text-t-primary"></i>
                </a>
            </Link>
        </>
    );
};

export default MenuTilesCarouselTile;
