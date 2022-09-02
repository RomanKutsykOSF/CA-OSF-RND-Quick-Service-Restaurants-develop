import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";

type Badge = {
    text: string;
    color: string;
};

export interface ProductTileProps {
    name: string;
    description?: string;
    price: string;
    weight?: string;
    badges?: Badge[];
    id: string;
    imgUrl: string;
    isLoadingTile?: boolean;
    isAvailableInStore?: boolean;
    isAvailableInStoreText?: string;
}

const ProductTile = ({
    name,
    id,
    description,
    price,
    weight,
    badges,
    imgUrl,
    isAvailableInStore,
    isAvailableInStoreText,
    isLoadingTile = false,
}: ProductTileProps): JSX.Element => {
    const nameSlug = slugify(name);
    const link = `/product/${id}/${nameSlug}`;

    return (
        <>
            {!isLoadingTile ? (
                <Link href={link}>
                    <a
                        className={`block product-tile ${!isAvailableInStore ? "pointer-events-none" : ""}`}
                        data-id={id}
                        data-name={name}
                        title={name}
                    >
                        <div
                            className={`${
                                !isAvailableInStore ? "product-unavailable" : ""
                            } image-wrapper relative mb-2`}
                        >
                            <div className="absolute top-2 flex left-2 text-center text-t-secondary-2 text-sm font-bold">
                                {badges?.length &&
                                    badges.map((badge, i) => (
                                        <div
                                            key={i}
                                            title="Vegan"
                                            className="cursor-default flex items-center justify-center"
                                        >
                                            <span className="z-10 bg-bgr-primary w-8 h-8 rounded-full flex items-center justify-center">
                                                {badge.text}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                            <Image
                                src={imgUrl}
                                layout="responsive"
                                className="rounded-lg w-full"
                                width={273}
                                height={248}
                            ></Image>
                        </div>
                        <div>
                            <h1 className={"mb-2 text-sm font-bold text-t-secondary font-primary"}>{name}</h1>
                            <p className={"mb-2 text-t-secondary text-xs font-primary"}>{description}</p>
                            {!isAvailableInStore ? (
                                <p className="text-t-secondary text-sm font-primary">{isAvailableInStoreText}</p>
                            ) : (
                                <>
                                    <span className={"text-t-primary text-lg font-bold font-primary"}>{price}</span>
                                    {weight && (
                                        <span
                                            className={`text-sm inline-block ${
                                                price ? "ml-6" : ""
                                            } text-t-disabled font-bold`}
                                        >
                                            {weight}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </a>
                </Link>
            ) : (
                <div>
                    <div className="skeleton-image gradient"></div>
                    <div className="skeleton-line my-2 gradient"></div>
                    <div className="flex max-w-custom">
                        <div className="skeleton-line mr-2 gradient"></div>
                        <div className="skeleton-line gradient"></div>
                    </div>
                </div>
            )}
            <style jsx>
                {`
                    .product-unavailable {
                        filter: grayscale(100%);
                    }

                    .skeleton-image {
                        width: 100%;
                        height: 210px;
                    }

                    .skeleton-line {
                        width: 100%;
                        height: 15px;
                    }

                    .max-w-custom {
                        width: 60%;
                    }

                    .gradient {
                        background: linear-gradient(
                                to right,
                                rgba(255, 255, 255, 0),
                                rgba(255, 255, 255, 0.5) 50%,
                                rgba(255, 255, 255, 0) 80%
                            ),
                            lightgray;
                        background-repeat: repeat-y;
                        background-size: 50px 500px;
                        background-position: -35px 0;
                        animation: shine 1.3s infinite linear;
                    }

                    @keyframes shine {
                        to {
                            background-position: 120% 0, /* move highlight to right */ 0 0;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default ProductTile;
