import type { Location } from 'react-router';

import {
  PrefetchPageLinks,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router';
import { useCallback, useMemo, useState } from 'react';

import {
  type CmsSectionSettings,
  useColorsCssVars,
} from '~/hooks/useColorsCssVars';
import { useOptimisticNavigationData } from '~/hooks/useOptimisticNavigationData';
import { useSanityThemeContent } from '~/hooks/useSanityThemeContent';
import { cn } from '~/lib/utils';

import type { SortParam } from './SortFilterLayout';

import { IconSort } from '../icons/IconSort';
import { iconButtonClass } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { Label } from '../ui/Label';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';

type SortItem = {
  key: SortParam;
  label: string;
};

function useSortItems({type='plp'}:{type?:string}) {
  const { search } = useLocation();
  const { optimisticData: clearFilters } =
    useOptimisticNavigationData<boolean>('clear-all-filters');
  const { optimisticData } = useOptimisticNavigationData<SortParam>('sort-radio');
  const { themeContent } = useSanityThemeContent();
  const items: SortItem[] = useMemo(
    () => {
      if (type === 'search') {
        return [
          {
            key: 'RELEVANCE',
            label: 'Relevance',
          },
          {
            key: 'PRICE_ASC',
            label: 'Price: Low - High',
          },
          {
            key: 'PRICE_DESC',
            label: 'Price: High - Low',
          },
        ];
      }
      return [
        {
          key: 'RELEVANCE',
          label: 'Relevance',
        },
        {
          key: 'PRICE_ASC',
          label: 'Price: Low - High',
        },
        {
          key: 'PRICE_DESC',
          label: 'Price: High - Low',
        },
        {
          key: 'NAME_ASC',
          label: 'A - Z',
        },
        {
          key: 'NAME_DESC',
          label: 'Z - A',
        },
        {
          key: 'NEW_ARRIVAL_ASC',
          label: 'Newest',
        },
      ];
    },
    [themeContent, type],
  );

  if (optimisticData) {
    return {
      activeItem: items.find((item) => item.key === optimisticData),
      items,
    };
  }
  // Optimistically reset to default sort item when clearing all filters
  else if (clearFilters) {
    return {
      activeItem: items[0],
      items,
    };
  }
  return {
    activeItem:
      items.find((item) => search.includes(`?sort=${item.key}`) || search.includes(`&sort=${item.key}`)) || items[0],
    items,
  };
}

export function DesktopSort(props: { sectionSettings?: CmsSectionSettings;type?:string }) {
  const colorsCssVars = useColorsCssVars({ settings: props.sectionSettings });
  const { activeItem, items } = useSortItems({type:props.type});
  const { themeContent } = useSanityThemeContent();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(iconButtonClass, 'notouch:hover:bg-transparent w-auto gap-[10px]')}>
        {/*<IconSort strokeWidth={1} />*/}
          <span className="font-medium">
            {themeContent?.collection?.sortBy}:
          </span>
          <span className="font-medium">{(activeItem || items[0]).label}</span>
            <span>
                <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.75L5 5.25L8.5 1.75" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="!shadow-cardShadow" onCloseAutoFocus={(e) => e.preventDefault()}>
        <style dangerouslySetInnerHTML={{ __html: colorsCssVars }} />
        <SortRadioGroup layout="desktop" type={props.type}>
          {items.map((item) => (
            <SortRadioItem item={item} key={item.label} layout="desktop" />
          ))}
        </SortRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileSort({ type }: { type?: string }) {
  const { items } = useSortItems({type});
  const { themeContent } = useSanityThemeContent();

  return (
    <div>
      <div className="flex items-center gap-3">
        <IconSort strokeWidth={1} />
        <span>
          <span className="px-2 text-xl font-medium">
            {themeContent?.collection?.sortBy}
          </span>
        </span>
      </div>
      <SortRadioGroup className="mt-3 flex flex-col gap-0" layout="mobile" type={type}>
        {items.map((item) => (
          <SortRadioItem item={item} key={item.key} layout="mobile" />
        ))}
      </SortRadioGroup>
    </div>
  );
}

function SortRadioGroup(props: {
  children: React.ReactNode;
  className?: string;
  type?: string;
  layout: 'desktop' | 'mobile';
}) {
  const { activeItem, items } = useSortItems({type:props.type});
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleSort = useCallback(
    (value: SortParam) => {
      const to = getSortLink(value, params, location);
      navigate(to, {
        preventScrollReset: true,
        replace: true,
        state: {
          optimisticData: value,
          optimisticId: 'sort-radio',
        },
      });
    },
    [params, location, navigate],
  );

  if (props.layout === 'desktop') {
    return (
      <DropdownMenuRadioGroup
        className={cn([props.className])}
        onValueChange={(value) => handleToggleSort(value as SortParam)}
        value={activeItem?.key || items[0].key}
      >
        {props.children}
      </DropdownMenuRadioGroup>
    );
  }

  return (
    <RadioGroup
      className={cn([props.className])}
      onValueChange={handleToggleSort}
      value={activeItem?.key || items[0].key}
    >
      {props.children}
    </RadioGroup>
  );
}

function SortRadioItem(props: {
  className?: string;
  item: SortItem;
  layout: 'desktop' | 'mobile';
}) {
  const { item, layout } = props;
  const [prefetchPage, setPrefetchPage] = useState<null | string>(null);
  const location = useLocation();
  const [params] = useSearchParams();
  const { pending } = useOptimisticNavigationData<SortParam>('sort-radio');

  // Prefetch the page that will be navigated to when the user hovers or touches
  const handleSetPrefetch = useCallback(() => {
    const sortLink = getSortLink(item.key, params, location);
    setPrefetchPage(sortLink);
  }, [item.key, params, location]);

  if (layout === 'desktop') {
    return (
      <>
        <DropdownMenuRadioItem
          className={cn([
            // If the navigation is pending, animate after a delay
            // to avoid flickering when navigation is fast
            pending && 'pointer-events-none animate-pulse delay-500',
            props.className,
          ])}
          onMouseEnter={handleSetPrefetch}
          onTouchStart={handleSetPrefetch}
          value={item.key}
        >
          {item.label}
        </DropdownMenuRadioItem>
        {prefetchPage && <PrefetchPageLinks page={prefetchPage} />}
      </>
    );
  }

  return (
    <div
      className={cn([
        'flex items-center gap-x-3 py-3',
        // If the navigation is pending, animate after a delay
        // to avoid flickering when navigation is fast
        pending && 'pointer-events-none animate-pulse delay-500',
        props.className,
      ])}
      key={item.key}
      onMouseEnter={handleSetPrefetch}
      onTouchStart={handleSetPrefetch}
    >
      <RadioGroupItem id={item.key} value={item.key} />
      <Label className="w-full font-medium" htmlFor={item.key}>
        {item.label}
      </Label>
      {prefetchPage && <PrefetchPageLinks page={prefetchPage} />}
    </div>
  );
}

function getSortLink(
  sort: SortParam,
  params: URLSearchParams,
  location: Location,
) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}
