import Button from "components/UI/Button";
import { Store } from "interfaces/storelocatorContext";
import Image from "next/image";
import { FormEventHandler, MouseEventHandler } from "react";

interface StoreTileProps {
    store: Store;
    storeDetailsModalHandler: MouseEventHandler;
    selectStoreHandler: FormEventHandler;
    chooseStoreLabel: string;
    selectedStoreId: string;
}

const StoreTile = ({
    store: { name, address1, postal_code, imgMobile, imgDesktop, id },
    storeDetailsModalHandler,
    selectStoreHandler,
    chooseStoreLabel,
    selectedStoreId,
}: StoreTileProps): JSX.Element => {
    return (
        <div className="grid-col-1 gap-4 lg:gap-0">
            <div>
                <div className="hidden lg:block">
                    <Image src={imgDesktop || "/images/no-image-icon.png"} width={406} height={406}></Image>
                </div>
                <div className={`lg:hidden`}>
                    <Image src={imgMobile || "/images/no-image-icon.png"} width={1372} height={656}></Image>
                </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <p className="font-bold font-primary text-lg lg:h-12 lg:overflow-hidden lg:text-ellipsis lg:resize-y">
                    {name}
                </p>
                <i
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && storeDetailsModalHandler}
                    onClick={storeDetailsModalHandler}
                    className="icon-info text-xl text-t-secondary-2"
                ></i>
            </div>

            <address className="h-28 overflow-scroll overflow-x-hidden">
                <span className="font-primary text-sm mt-1 block">{address1}</span>
                <span className="font-primary text-sm block mt-1">{postal_code}</span>
            </address>
            <div className="mt-2 flex lg:items-start lg:flex-col lg:justify-between">
                <Button
                    disabled={selectedStoreId === id}
                    onClick={selectStoreHandler}
                    className="mr-2 lg:mr-0 md:px-2"
                    variant="primary"
                >
                    {chooseStoreLabel}
                </Button>
            </div>
        </div>
    );
};

export default StoreTile;
