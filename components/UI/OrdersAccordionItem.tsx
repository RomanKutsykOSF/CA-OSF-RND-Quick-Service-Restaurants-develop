import React from "react";
import { ProductLineItem } from "interfaces/globalContext";
import OrderItem from "components/UI/OrderItem";
import Divider from "components/UI/Divider";
import { Disclosure } from "@headlessui/react";
import TitleContentItems from "components/UI/TitleContentItems";
import { Address, ShippingAddressInput } from "interfaces/checkout";
import Button from "./Button";

export interface OrderShipment {
    id: string;
    items: ProductLineItem[];
    shippingStatus: string;
    shippingAddress: ShippingAddressInput;
    deliveryMethod?: {
        name: string;
        description: string;
        requiresDate: boolean;
        isStorePickup: boolean;
    };
}
export interface OrderDataInterface {
    orderNumber: string;
    date: string;
    status: string;
    billingAddress: Address;
    subtotal: string;
    total: string;
    shippingTotal: string;
    shipments: OrderShipment[];
    taxTotal: string;
    paymentStatus: string;
    storeName?: string;
    storeId?: string;
}

interface OrdersAccordionItemProps extends OrderDataInterface {
    defaultOpen: boolean;
    orderNumberText: string;
    dateText: string;
    statusText: string;
    shipmentsText: string;
    billingAddressText: string;
    shippingAddressText: string;
    subTotalText: string;
    deliveryFeeText: string;
    totalText: string;
    quantityText: string;
    paymentStatusText: string;
    payNowBtnText: string;
    reorderCallback: () => void;
    reorderBtnLoading?: boolean;
    orderAgainBtnText: string;
    deliveryMethodText: string;
    pickupAddressText: string;
    storeName: string;
    storeNameText: string;
    storeId: string;
    storeIdText: string;
}
const OrdersAccordionItem = ({
    defaultOpen,
    paymentStatus,
    paymentStatusText,
    orderNumberText,
    orderNumber,
    dateText,
    date,
    statusText,
    status,
    billingAddressText,
    shippingAddressText,
    shipmentsText,
    billingAddress,
    subTotalText,
    quantityText,
    subtotal,
    deliveryFeeText,
    shippingTotal,
    totalText,
    total,
    shipments,
    taxTotal,
    payNowBtnText,
    reorderCallback,
    orderAgainBtnText,
    deliveryMethodText,
    pickupAddressText,
    storeId,
    storeName,
    storeIdText,
    storeNameText,
    reorderBtnLoading = false,
}: OrdersAccordionItemProps): JSX.Element => {
    return (
        <>
            <div className="bg-bgr-faded rounded-lg mt-3 py-1 font-primary">
                <Disclosure as="div" defaultOpen={defaultOpen}>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex justify-between w-full px-4 py-2  text-left rounded-lg focus:outline-none ">
                                <span className="text-lg text-t-primary">
                                    <span className="font-bold">{orderNumberText}:</span>
                                    <span className="font-normal ml-1 mr-28 sm:mr-0">{orderNumber} &nbsp; </span>
                                    <span className="font-bold">{dateText}: </span>
                                    <span className="font-normal">{new Date(date).toLocaleDateString()}</span>
                                </span>
                                <i className={`  ${open ? "icon-minus" : "icon-plus"} w-5 h-5 mr-2 text-lg`} />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pt-4 pb-2 ">
                                <p className="text-lg font-bold text-t-primary mt-3 mb-2">
                                    {orderNumberText}: <span className="font-normal">{orderNumber}</span>
                                </p>
                                <p className="text-lg font-bold text-t-primary mb-2">
                                    {dateText}:{" "}
                                    <span className="font-normal">{new Date(date).toLocaleDateString()}</span>
                                </p>
                                <p className="text-lg font-bold text-t-primary mb-2">
                                    {paymentStatusText}: <span className="font-normal">{paymentStatus}</span>
                                </p>
                                <p className="text-lg font-bold text-t-primary mb-2">
                                    {statusText}: <span className="font-normal">{status}</span>
                                </p>

                                <p className="text-lg font-bold text-t-primary mb-2">
                                    {storeNameText}: <span className="font-normal">{storeName}</span>
                                </p>

                                <p className="text-lg font-bold text-t-primary mb-2">
                                    {storeIdText}: <span className="font-normal">{storeId}</span>
                                </p>

                                <section className={"mt-5"}>
                                    <p className="font-primary text-lg text-t-primary font-bold mt-3">
                                        {billingAddressText}
                                    </p>

                                    <address>{`${billingAddress?.firstName} ${billingAddress?.lastName}, ${
                                        billingAddress.address1
                                    } ${billingAddress?.address2 ?? ""}, ${billingAddress?.country} ${
                                        billingAddress.city
                                    } ${billingAddress.zip}, ${billingAddress.phone}`}</address>
                                </section>

                                <TitleContentItems className="mt-5" title={`${shipmentsText}:`} />
                                <div className="grid lg:grid-cols-2 gap-3">
                                    <div className="col-span-1 lg:col-span-2">
                                        {shipments?.map((shipment, shipmentIndex) => {
                                            return (
                                                <section className="shipment-item" key={shipmentIndex}>
                                                    <Divider theme="light" className="my-3" />

                                                    <section className={"mt-5"}>
                                                        <p className="font-primary text-lg text-t-primary font-bold mt-3">
                                                            {deliveryMethodText}
                                                            <span className="font-normal block mt-1">
                                                                {shipment?.deliveryMethod?.name}
                                                            </span>
                                                        </p>
                                                        {shipment?.deliveryMethod?.isStorePickup ? (
                                                            <>
                                                                <p className="font-primary text-lg text-t-primary font-bold mt-3">
                                                                    {pickupAddressText}
                                                                </p>

                                                                <address className="text-sm text-t-primary mt-1">{`${
                                                                    shipment.shippingAddress?.address1
                                                                } ${
                                                                    shipment.shippingAddress?.address2 ?? ""
                                                                }`}</address>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="font-primary text-lg text-t-primary font-bold mt-3">
                                                                    {shippingAddressText}
                                                                </p>

                                                                <address className="text-sm text-t-primary mt-1">{`${
                                                                    shipment.shippingAddress?.firstName
                                                                } ${shipment.shippingAddress?.lastName}, ${
                                                                    shipment.shippingAddress?.address1
                                                                } ${shipment.shippingAddress?.address2 ?? ""}, ${
                                                                    shipment.shippingAddress?.countryCode
                                                                } ${shipment.shippingAddress?.city ?? ""} ${
                                                                    shipment.shippingAddress?.postalCode ?? ""
                                                                }, ${shipment.shippingAddress?.phone ?? ""}`}</address>
                                                            </>
                                                        )}
                                                    </section>

                                                    <section className="mt-5">
                                                        {shipment?.items.map((item) => {
                                                            return (
                                                                <div className="my-3" key={item.itemId}>
                                                                    <OrderItem
                                                                        itemId={item.itemId}
                                                                        productId={item.productId}
                                                                        image={item.image}
                                                                        productName={item.productName}
                                                                        size={item.size}
                                                                        quantityText={quantityText}
                                                                        quantity={item.quantity}
                                                                        price={item.price}
                                                                        ingredients={item.ingredients}
                                                                        ingredientsString={item.ingredientsString}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </section>
                                                </section>
                                            );
                                        })}
                                    </div>
                                </div>
                                <Divider theme="light" className="w-full my-3"></Divider>
                                <div className="grid lg:grid-cols-2 gap-3">
                                    <div className="col-span-1 lg:col-span-2">
                                        <div className="flex justify-between">
                                            <p className="mb-2">{subTotalText}</p>
                                            <span className="font-bold text-t-primary">{subtotal}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="mb-2">{deliveryFeeText}</p>
                                            <span className="font-bold text-t-primary">{shippingTotal}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="mb-2">{`Tax Total`}</p>
                                            <span className="font-bold text-t-primary">{taxTotal}</span>
                                        </div>
                                        <div className="flex justify-between mb-5">
                                            <p className="font-semibold text-lg text-t-primary mb-2">{totalText}</p>
                                            <span className="text-lg font-bold text-t-primary">{total}</span>
                                        </div>
                                    </div>
                                </div>
                                {paymentStatus === "not_paid" && (
                                    <div className="flex justify-between">
                                        <Button variant="primary" link={`/checkout/payment/${orderNumber}`}>
                                            {payNowBtnText}
                                        </Button>
                                    </div>
                                )}

                                {paymentStatus === "paid" && (
                                    <div className="flex justify-between">
                                        <Button
                                            isLoading={reorderBtnLoading}
                                            disabled={reorderBtnLoading}
                                            onClick={() => reorderCallback()}
                                            variant="primary"
                                        >
                                            {orderAgainBtnText}
                                        </Button>
                                    </div>
                                )}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </>
    );
};

export default OrdersAccordionItem;
