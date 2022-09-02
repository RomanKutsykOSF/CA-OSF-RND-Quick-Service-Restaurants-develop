import React from "react";

import { GetServerSidePropsResult, GetServerSidePropsContext } from "next";

import slugify from "slugify";
import getProductDataFetcher, { getProductDataQuery } from "bdConnector/product/getProductData";

const Pdp_Redirect = (): JSX.Element => {
    return <></>;
};

export const getServerSideProps = async ({
    params,
    locale,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    let res = null;

    try {
        res = await getProductDataFetcher(getProductDataQuery, params.productId as string, locale);
    } catch (error) {
        console.error(`Error fetching product data: ${error}`);

        return {
            redirect: {
                destination: error === "PRODUCT_NOT_FOUND" ? "/404" : "/500",
                permanent: false,
            },
        };
    }

    const productSlug = slugify(res.data.name);

    return {
        redirect: {
            destination: `/product/${params.productId}/${productSlug}`,
            permanent: false,
        },
    };
};

export default Pdp_Redirect;
