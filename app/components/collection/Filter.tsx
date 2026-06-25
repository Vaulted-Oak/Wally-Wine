import type {Location} from 'react-router';
import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import type {SyntheticEvent} from 'react';

import {
  PrefetchPageLinks,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import type {AppliedFilter} from './SortFilterLayout';

import {Checkbox} from '../ui/Checkbox';
import {Input} from '../ui/Input';
import {Label} from '../ui/Label';
import {FILTER_URL_PREFIX} from './SortFilterLayout';
import type {
  FilterManagerFilters,
  KlevuFilterResultOptions,
  KlevuFilterResultSlider,
} from '@klevu/core';

export function DefaultFilter(props: {
  appliedFilters: FilterManagerFilters[];
  option: {id: string; name: string; count: number};
}) {
  const {appliedFilters, option} = props;

  if (!option.id || !option.name) {
    console.error('DefaultFilter: Invalid option received', {option});
    return null; // Skip rendering if option is invalid
  }

  const [params] = useSearchParams();
  const location = useLocation();
  const addFilterLink = getFilterLink(option.id, params, location);
  const appliedFilter = getAppliedFilter(option, appliedFilters);

  const removeFilterLink = useMemo(() => {
    if (!appliedFilter) {
      return location.pathname;
    }
    return getAppliedFilterLink(appliedFilter, params, location);
  }, [appliedFilter, params, location]);

  return (
    <div>
      <FilterCheckbox
        addFilterLink={addFilterLink}
        filterIsApplied={Boolean(appliedFilter)}
        option={option}
        removeFilterLink={removeFilterLink}
      />
    </div>
  );
}

function FilterCheckbox({
  addFilterLink,
  filterIsApplied,
  option,
  removeFilterLink,
}: {
  addFilterLink: string;
  filterIsApplied: boolean;
  option: any;
  removeFilterLink: string;
}) {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const filterKey = `filter.${option.id}`;
  const isChecked = params.getAll(filterKey).includes(option.value); // Check if the value is applied

  const handleToggleFilter = () => {
    const existingValues = params.getAll(filterKey);

    if (isChecked) {
      // Remove the value from the filter
      const updatedValues = existingValues.filter((v) => v !== option.value);
      params.delete(filterKey);
      updatedValues.forEach((v) => params.append(filterKey, v));
    } else {
      // Add the new value to the filter
      params.append(filterKey, option.value);
    }

    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  };

  return (
    <div className="flex text-black gap-[8px] items-center text-sm">
      <Checkbox
        aria-label={option.name}
        checked={isChecked} // Reflect the checked state
        id={`${option.id}-${option.value}`}
        onCheckedChange={handleToggleFilter}
        className="checkbox"
      />
      <Label
        className="flex items-center gap-[8px]"
        htmlFor={`${option.id}-${option.value}`}
      >
        <span>{option.name}</span>
        <span className="text-[#797979]">({option.count})</span>
      </Label>
    </div>
  );
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

export function PriceRangeFilter({
  appliedFilters,
}: {
  appliedFilters: FilterManagerFilters[];
}) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const priceFilter = params.get(`filter.klevu_price`);
  const price = (priceFilter && priceFilter.split(',')) || undefined;
  const min = isNaN(Number(price?.[0])) ? undefined : Number(price?.[0]);
  const max = isNaN(Number(price?.[1])) ? undefined : Number(price?.[1]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const {optimisticData} =
    useOptimisticNavigationData<boolean>('clear-all-filters');
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const {themeContent} = useSanityThemeContent();

  useEffect(() => {
    // Reset prices when the user clears all filters
    if (optimisticData) {
      setMinPrice(undefined);
      setMaxPrice(undefined);
      setErrorMessage(null);
    } else if (!min && !max) {
      setErrorMessage(null);
      setMinPrice(undefined);
      setMaxPrice(undefined);
    }
  }, [optimisticData, price]);

  const onChangeMax = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMaxPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMaxPrice(newMaxPrice);
    setErrorMessage(null);
  };

  const onChangeMin = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMinPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMinPrice(newMinPrice);
    setErrorMessage(null);
  };

  const handleApplyPriceFilter = useCallback(() => {
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      setErrorMessage('Min price cannot be greater than max price.');
      return;
    }
    setErrorMessage(null);
    const filterKey = `filter.klevu_price`;
    params.delete(filterKey);
    if (minPrice !== undefined && maxPrice !== undefined) {
      params.append(
        filterKey,
        `${minPrice.toString()},${maxPrice?.toString()}`,
      );
      navigate(`${window.location.pathname}?${params.toString()}`, {
        replace: true,
      });
    }
  }, [minPrice, maxPrice]);

  const numberInputOnWheelPreventChange = (e) => {
    // Prevent the input value change
    e.target.blur();

    // Prevent the page/container scrolling
    e.stopPropagation();

    // Refocus immediately, on the next tick (after the current function is done)
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };

  return (
    <div className="flex justify-between pb-[20px] flex-wrap">
      <label className="flex-[0_0_48%]">
        {/*<span>{themeContent?.collection?.from}</span>*/}
        <Input
          className="!border-2 !border-[#DCDCDC] h-[48px] !ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none !focus-visible:ring-0 !focus-visible:ring-offset-0 !ring-offset-0"
          min={0}
          name="minPrice"
          onChange={onChangeMin}
          placeholder={'$ min'}
          type="number"
          value={minPrice ?? ''}
          onWheel={numberInputOnWheelPreventChange}
        />
      </label>
      <label className="flex-[0_0_48%]">
        {/*<span>{themeContent?.collection?.to}</span>*/}
        <Input
          className="!border-2 !border-[#DCDCDC] h-[48px] !ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none !focus-visible:ring-0 !focus-visible:ring-offset-0 !ring-offset-0"
          min={0}
          name="maxPrice"
          onChange={onChangeMax}
          placeholder={'$ max'}
          type="number"
          value={maxPrice ?? ''}
          onWheel={numberInputOnWheelPreventChange}
        />
      </label>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      <button
        className="border-2 border-primaryGreen text-primaryGreen h-[48px] my-[20px] cursor-pointer flex-[0_0_100%]"
        onClick={handleApplyPriceFilter}
        disabled={maxPrice === undefined || minPrice === undefined}
      >
        Update price
      </button>
    </div>
  );
}

function getAppliedFilter(option: any, appliedFilters: any) {
  if (!appliedFilters || !Array.isArray(appliedFilters)) {
    return undefined;
  }

  const foundFilter = appliedFilters.find((appliedFilter) => {
    if (!appliedFilter?.filter || typeof appliedFilter?.filter !== 'object') {
      return false;
    }

    const filterValues = appliedFilter?.filter[option.id];
    if (Array.isArray(filterValues)) {
      return filterValues.includes(option.value); // Check for multi-select
    }
    return filterValues === option.value;
  });

  return foundFilter;
}

function getAppliedFilterLink(
  filter: KlevuFilterResultOptions | KlevuFilterResultSlider,
  params: URLSearchParams,
  location: Location,
) {
  const paramsClone = new URLSearchParams(params);

  if (!filter.filter || typeof filter.filter !== 'object') {
    console.error(
      'getAppliedFilterLink: filter.filter is invalid or missing.',
      {
        filter,
      },
    );
    return location.pathname; // Return the current path as a fallback
  }

  Object.entries(filter.filter).forEach(([key, value]) => {
    const fullKey = `${FILTER_URL_PREFIX}${key}`;
    paramsClone.delete(fullKey, JSON.stringify(value));
  });

  return `${location.pathname}?${paramsClone.toString()}`;
}

function getFilterLink(
  rawInput: ProductFilter | string,
  params: URLSearchParams,
  location: ReturnType<typeof useLocation>,
) {
  if (!rawInput) {
    console.error('getFilterLink: rawInput is null or undefined.', {rawInput});
    return location.pathname; // Fallback to current path
  }

  const paramsClone = new URLSearchParams(params);

  if (typeof rawInput === 'string' && rawInput.trim()) {
    // Append simple string filter with actual value
    const [key, value] = rawInput.split('=');
    if (value) {
      paramsClone.set(`${FILTER_URL_PREFIX}${key}`, value);
    } else {
      paramsClone.set(`${FILTER_URL_PREFIX}${rawInput}`, 'true');
    }
  } else {
    // Process complex filters
    const newParams = filterInputToParams(rawInput, paramsClone);
    return `${location.pathname}?${newParams.toString()}`;
  }

  return `${location.pathname}?${paramsClone.toString()}`;
}

function filterInputToParams(
  rawInput: ProductFilter | string,
  params: URLSearchParams,
) {
  if (!rawInput) {
    console.error('filterInputToParams: rawInput is null or undefined.');
    return params; // Return the original params without modification
  }

  let input: ProductFilter;

  try {
    // Parse only if rawInput is valid JSON
    input =
      typeof rawInput === 'string' && rawInput.trim().startsWith('{')
        ? (JSON.parse(rawInput) as ProductFilter)
        : {[rawInput]: true}; // Convert raw string to object
  } catch (error) {
    console.error('filterInputToParams: Failed to parse rawInput', {
      rawInput,
      error,
    });
    return params; // Return params unchanged if parsing fails
  }

  Object.entries(input).forEach(([key, value]) => {
    if (params.has(`${FILTER_URL_PREFIX}${key}`)) {
      params.set(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    } else {
      params.append(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    }
  });

  return params;
}
