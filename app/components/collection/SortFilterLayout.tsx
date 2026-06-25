import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';

import {AnimatePresence, m} from '~/lib/motion';
import {useCallback, useMemo, useState} from 'react';

import type {CmsSectionSettings} from '~/hooks/useColorsCssVars';

import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import {IconFilters} from '../icons/IconFilters';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/Accordion';
import {Button, IconButton, iconButtonClass} from '../ui/Button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '../ui/Drawer';
import {ScrollArea} from '../ui/ScrollArea';
import {DefaultFilter, PriceRangeFilter} from './Filter';
import {DesktopSort, MobileSort} from './Sort';
import {useLocation, useNavigate} from 'react-router';
import type {FilterManagerFilters} from '@klevu/core';

export type AppliedFilter = {
  filter: ProductFilter;
  label: string;
};

export type SortParam =
  | 'best-selling'
  | 'featured'
  | 'newest'
  | 'price-high-low'
  | 'price-low-high';

type Props = {
  appliedFilters?: FilterManagerFilters[];
  children: React.ReactNode;
  filters: Filter[];
  onClearAllFilters: () => void;
  productsCount: number;
  sectionSettings?: CmsSectionSettings;
};

export const FILTER_URL_PREFIX = 'filter.';

export function SortFilter({
  appliedFilters = [],
  children,
  filters,
  onClearAllFilters,
  productsCount,
  sectionSettings,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const appliedFilterValues = Array.from(params.entries())
    .filter(([key]) => key.startsWith('filter.'))
    .map(([key, value]) => ({
      key: key.replace('filter.', ''),
      values: [value],
    }));
  const navigate = useNavigate();
  const {optimisticData, pending} =
    useOptimisticNavigationData<boolean>('clear-all-filters');
  const {themeContent} = useSanityThemeContent();

  // Here we can optimistically clear all filters and close DrawerFooter
  if (optimisticData) {
    appliedFilters = [];
  }

  const handleRemoveFilter = useCallback(
    (key: string, value: string) => {
      try {
        const filterKey = `filter.${key}`;
        const existingValues = params.getAll(filterKey);
        const updatedValues = existingValues.filter((v) => v !== value);
        params.delete(filterKey);
        updatedValues.forEach((v) => params.append(filterKey, v));
        navigate(`${window.location.pathname}?${params.toString()}`, {
          replace: true,
        });
        // Call your desired function here
      } catch (e) {}
    },
    [params],
  );
  return (
    <>
      {/* Desktop layout */}
      {/*<div className="hidden w-full touch:hidden lg:flex lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <IconButton onClick={() => setIsOpen(!isOpen)}>
            <span className="sr-only">
              {themeContent?.collection?.filterAndSort}
            </span>
            <IconFilters className="size-4" />
          </IconButton>
          <AnimatePresence>
            {appliedFilterValues && appliedFilterValues.length > 0 && (
              <m.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              >
                <Button
                  className={cn([
                    'flex items-center gap-1',
                    pending && 'pointer-events-none animate-pulse delay-500',
                  ])}
                  onClick={onClearAllFilters}
                  variant="ghost"
                >
                  <span>{themeContent?.collection?.clearFilters}</span>
                   <span className="tabular-nums">
                    ({appliedFilters.length})
                  </span>
                </Button>
              </m.div>
            )}
          </AnimatePresence>
        </div>
        <DesktopSort sectionSettings={sectionSettings} />
      </div>*/}
      <div className="w-full max-w-[1480px] px-[20px] mx-auto relative lg:flex lg:flex-row lg:flex-wrap gap-[50px]">
        <div className="md:mt-6">
          <div
            className={cn([
              'hidden touch:hidden lg:block',
              'transition-all duration-200',
              'sticky top-[100px] opacity-100 md:w-[230px] md:min-w-[230px]',
            ])}
          >
            <h2 className="text-[24px] font-normal mb-[20px]">Filters</h2>
            <div className="flex flex-wrap gap-4">
              {appliedFilterValues?.map((filter, index) =>
                filter.values.map((value, i) => {
                  // Check for 'klevu_price' key and format its value
                  const formattedValue =
                    filter.key === 'klevu_price'
                      ? value.replace(',', ' to ')
                      : value;

                  return (
                    <div
                      key={`${filter.key}-${i}`}
                      className="flex gap-[10px] justify-between items-center px-4 py-2 bg-lightGreen"
                    >
                      <span className="">{formattedValue}</span>
                      <button
                        onClick={() => handleRemoveFilter(filter.key, value)}
                        className=""
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 22 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <line
                            x1="1"
                            y1="-1"
                            x2="26.3636"
                            y2="-1"
                            transform="matrix(0.730887 0.682499 -0.730887 0.682499 0 1.3241)"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="1"
                            y1="-1"
                            x2="26.3636"
                            y2="-1"
                            transform="matrix(-0.730887 0.682499 -0.730887 -0.682499 20 0)"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                }),
              )}
            </div>
            <AnimatePresence>
              {appliedFilterValues && appliedFilterValues.length > 0 && (
                <m.div
                  animate={{opacity: 1}}
                  className="overflow-hidden"
                  exit={{opacity: 0}}
                  initial={{opacity: 0}}
                >
                  <button
                    className={cn([
                      'flex items-center gap-1 mt-[10px] font-normal underline text-primaryGreen',
                      pending && 'pointer-events-none animate-pulse delay-500',
                    ])}
                    onClick={onClearAllFilters}
                    variant="ghost"
                  >
                    <span>{themeContent?.collection?.clear}</span>
                  </button>
                </m.div>
              )}
            </AnimatePresence>
            <DesktopFiltersDrawer
              appliedFilters={appliedFilters}
              filters={filters}
            />
          </div>
        </div>
        <MobileDrawer
          appliedFilters={appliedFilters}
          filters={filters}
          onClearAllFilters={onClearAllFilters}
          productsCount={productsCount}
        />
        <div className="lg:flex-1">{children}</div>
      </div>
    </>
  );
}

interface CustomFilter extends Filter {
  key?: string;
}

function MobileDrawer({
  appliedFilters,
  filters,
  onClearAllFilters,
  productsCount,
}: {
  appliedFilters: FilterManagerFilters[];
  filters: Filter[];
  onClearAllFilters: () => void;
  productsCount: number;
}) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const appliedFilterValues = Array.from(params.entries())
    .filter(([key]) => key.startsWith('filter.'))
    .map(([key, value]) => ({
      key: key.replace('filter.', ''),
      values: [value],
    }));
  const [open, setOpen] = useState(false);
  const {themeContent} = useSanityThemeContent();
  const navigate = useNavigate();
  const heading = themeContent?.collection?.filterAndSort;
  const {pending} = useOptimisticNavigationData<boolean>('clear-all-filters');
  const handleRemoveFilter = useCallback(
    (key: string, value: string) => {
      try {
        const filterKey = `filter.${key}`;
        const existingValues = params.getAll(filterKey);
        const updatedValues = existingValues.filter((v) => v !== value);
        params.delete(filterKey);
        updatedValues.forEach((v) => params.append(filterKey, v));
        navigate(`${window.location.pathname}?${params.toString()}`, {
          replace: true,
        });
        // Call your desired function here
      } catch (e) {}
    },
    [params],
  );
  return (
    <div className="touch:block lg:hidden border-2 text-center my-[30px] border-primaryGreen">
      <Drawer onOpenChange={setOpen} open={open}>
        <DrawerTrigger className={cn(iconButtonClass, 'w-auto gap-2 px-2')}>
          <IconFilters />
          <span>{heading}</span>
        </DrawerTrigger>
        <DrawerContent
          className={cn([
            'h-[--dialog-content-height] max-h-screen w-screen bg-background p-0 text-foreground',
            '[--dialog-content-height:calc(100svh_*_.95)] [--dialog-content-max-width:calc(32rem)]',
            'lg:left-auto lg:right-0 lg:max-w-[--dialog-content-max-width] lg:[--dialog-content-height:100svh]',
          ])}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader className="flex items-center justify-center border-b text-xl font-medium">
            {heading}
          </DrawerHeader>
          <div className="size-full overflow-hidden">
            <ScrollArea className="size-full px-6">
              <div className="pt-6">
                <MobileSort
                  type={
                    location.pathname === '/searchresults' ? 'search' : 'plp'
                  }
                />
              </div>
              {appliedFilterValues?.length > 0 && (
                <div className="flex my-[20px] flex-wrap gap-4">
                  {/*<span>Applied Filters</span>*/}
                  {appliedFilterValues?.map((filter, index) =>
                    filter.values.map((value, i) => {
                      // Check for 'klevu_price' key and format its value
                      const formattedValue =
                        filter.key === 'klevu_price'
                          ? value.replace(',', ' to ')
                          : value;

                      return (
                        <div
                          key={`${filter.key}-${i}`}
                          className="flex gap-[10px] justify-between items-center px-4 py-2 bg-lightGreen"
                        >
                          <span className="text-gray-800 font-medium">
                            {formattedValue}
                          </span>
                          <button
                            onClick={() =>
                              handleRemoveFilter(filter.key, value)
                            }
                            className=""
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 22 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <line
                                x1="1"
                                y1="-1"
                                x2="26.3636"
                                y2="-1"
                                transform="matrix(0.730887 0.682499 -0.730887 0.682499 0 1.3241)"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="1"
                                y1="-1"
                                x2="26.3636"
                                y2="-1"
                                transform="matrix(-0.730887 0.682499 -0.730887 -0.682499 20 0)"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    }),
                  )}
                </div>
              )}
              <nav>
                <Accordion
                  // Open filters by default
                  defaultValue={filters.map((filter) => filter.id)}
                  type="multiple"
                >
                  {filters.map((filter: any, index: number) =>
                    filter.key === 'klevu_price' ? (
                      <AccordionItem
                        className="mb-[20px]"
                        key={filter.key} // Ensure key is unique
                        value={filter.key} // Ensure value matches key
                      >
                        <AccordionTrigger>Price</AccordionTrigger>
                        <AccordionContent>
                          <PriceRangeFilter appliedFilters={appliedFilters} />
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <AccordionItem
                        className="mb-[20px]"
                        key={filter.key} // Ensure key is unique
                        value={filter.key!} // Ensure value matches key
                      >
                        <AccordionTrigger>{filter.label}</AccordionTrigger>
                        <AccordionContent>
                          <ul className="" key={index}>
                            {filter.options?.map(
                              (option: any, index: number) => (
                                <li
                                  className="pb-[25px] last:pb-[20px]"
                                  key={index}
                                >
                                  {filterMarkup(filter, option, appliedFilters)}
                                </li>
                              ),
                            )}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ),
                  )}
                </Accordion>
              </nav>
            </ScrollArea>
          </div>
          <AnimatePresence>
            {appliedFilterValues && appliedFilterValues.length > 0 && (
              <div>
                <m.div
                  animate={{
                    height: 'auto',
                  }}
                  className="overflow-hidden"
                  exit={{
                    height: 0,
                  }}
                  initial={{
                    height: 0,
                  }}
                >
                  <DrawerFooter className="grid grid-flow-col grid-cols-2 items-center justify-center gap-5 border-t py-6">
                    <Button
                      className={cn([
                        'flex items-center gap-1',
                        pending &&
                          'pointer-events-none animate-pulse delay-500',
                      ])}
                      onClick={onClearAllFilters}
                      variant="ghost"
                    >
                      <span>{themeContent?.collection?.clear}</span>
                      {/* <span className="tabular-nums">
                        ({appliedFilters.length})
                      </span> */}
                    </Button>
                    <Button onClick={() => setOpen(false)}>
                      {themeContent?.collection?.apply}
                    </Button>
                  </DrawerFooter>
                </m.div>
              </div>
            )}
          </AnimatePresence>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function DesktopFiltersDrawer({
  appliedFilters = [],
  filters = [],
}: Omit<Props, 'children' | 'onClearAllFilters' | 'productsCount'>) {
  return (
    <ScrollArea
      className={cn(
        'h-[calc(100svh_-_var(--desktopHeaderHeight)_-2rem)] w-full transition-all',
      )}
    >
      <nav>
        <Accordion
          // Open filters by default
          defaultValue={filters.map((filter: any) => filter.id)}
          type="multiple"
        >
          {filters.map((filter: any, index) =>
            filter.key === 'klevu_price' ? (
              <AccordionItem
                className="mb-[20px]"
                key={filter.key} // Ensure key is unique
                value={filter.key} // Ensure value matches key
              >
                <AccordionTrigger>Price</AccordionTrigger>
                <AccordionContent>
                  <PriceRangeFilter appliedFilters={appliedFilters} />
                </AccordionContent>
              </AccordionItem>
            ) : (
              <AccordionItem
                className="mb-[20px]"
                key={filter.key} // Ensure key is unique
                value={filter.key} // Ensure value matches key
              >
                <AccordionTrigger>{filter.label}</AccordionTrigger>
                <AccordionContent>
                  <ul className="" key={index}>
                    {filter.options?.map((option: any, index: number) => (
                      <li className="pb-[25px] last:pb-[20px]" key={index}>
                        {filterMarkup(filter, option, appliedFilters)}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ),
          )}
        </Accordion>
      </nav>
    </ScrollArea>
  );
}

const filterMarkup = (
  filter: CustomFilter,
  option: any,
  appliedFilters: FilterManagerFilters[],
) => {
  switch (filter.type) {
    case 'PRICE_RANGE':
      return <PriceRangeFilter appliedFilters={appliedFilters} />;
    default:
      return (
        <DefaultFilter
          appliedFilters={appliedFilters}
          option={{
            ...option,
            id: filter.key, // Adjust key mapping for Klevu
          }}
        />
      );
  }
};
