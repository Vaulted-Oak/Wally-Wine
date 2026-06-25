import { Link, useLocation, useMatches } from "react-router";
import { z } from "zod";
import React from "react";
import { IconChevron } from "./icons/IconChevron";

export const breadcrumbTypeSchema = z.enum(['collections', 'collection', 'product']);
export type TBreadcrumbType = z.infer<typeof breadcrumbTypeSchema>;

export default function Breadcrumbs() {
    const matches = useMatches();
    const deepestRoute = matches.at(-1);

    const parsedBreadcrumbsType = breadcrumbTypeSchema.safeParse(deepestRoute?.handle?.breadcrumbType);
    const isValidBreadcrumbType = parsedBreadcrumbsType?.success;

    const pages: { href: string, name: string }[] = [{ href: '/homepage', name: 'Home' }]
    if (isValidBreadcrumbType) {
        switch (parsedBreadcrumbsType.data) {
            case 'collections':
                pages.push({
                    href: '/collections',
                    name: 'Collections'
                });
                break;
            case 'collection':
                pages.push({
                    href: '/collections',
                    name: 'Collections'
                });
                pages.push({
                    href: `/collections/${deepestRoute?.data?.collection?.handle}`,
                    name: `${deepestRoute?.data?.collection?.title}`
                });
                break;
            case 'product':
                pages.push({
                    href: '/collections',
                    name: 'Collections'
                });
                const collection = deepestRoute?.data?.product?.collections?.nodes?.at(0);
                if(collection) {
                    pages.push({
                        href: `/collections/${collection?.handle}`,
                        name: `${collection?.title}`
                    });
                }
                pages.push({
                    href: `/products/${deepestRoute?.data?.product?.handle}`,
                    name: `${deepestRoute?.data?.product?.title}`
                });
                break;
        }
    } else {
        return null;
    };

    const location = useLocation();

    return (
        <nav className={`${location.pathname.startsWith('/collection') ? 'w-full max-w-[1480px] px-[20px] mx-auto' : 'container'} md:my-[40px] my-[20px]`} aria-label="Breadcrumb">
            <ol role="list" className="flex items-center md:space-x-4 space-x-2">
                {
                    pages.map((page, index) => {
                        const currentPage = index === pages.length - 1;
                        const homepage = page.href === '/';

                        const separator = index !== 0 && (
                            <span className="h-5 w-5 flex-shrink-0 text-black">
                                /
                            </span>
                            /*<IconChevron direction="right" className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />*/
                        );
                        return (
                            <li key={index}>
                                <div className="flex items-center">
                                    {separator}
                                    <span className="text-sm font-medium !text-primaryGreen tracking-[1px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[76px] md:max-w-max">
                                        {
                                            currentPage ? (page.name) : (
                                                <Link className="hover:underline text-black" to={page.href}>
                                                    {homepage ? 'Home' : page.name}
                                                </Link>
                                            )
                                        }
                                    </span>
                                </div>
                            </li>
                        )
                    })
                }
            </ol>
        </nav>
    )
}
