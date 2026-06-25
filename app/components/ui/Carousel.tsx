import type { EmblaCarouselType } from 'embla-carousel';

import { useLocation } from 'react-router';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import * as React from 'react';

import { cn } from '~/lib/utils';

import { IconChevron } from '../icons/IconChevron';
import { Button, IconButton } from './Button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  orientation?: 'horizontal' | 'vertical';
  plugins?: CarouselPlugin;
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = CarouselProps & {
  api: ReturnType<typeof useEmblaCarousel>[1];
  canScrollNext: boolean;
  canScrollPrev: boolean;
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  scrollNext: () => void;
  scrollPrev: () => void;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  CarouselProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      children,
      className,
      opts,
      orientation = 'horizontal',
      plugins,
      setApi,
      ...props
    },
    ref,
  ) => {
    const slidesPerView = Number(props?.style?.['--slides-per-view']) || 1;
    const isEven = slidesPerView % 2 === 0;    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
        ...(isEven ? { slidesToScroll: 2 } : {}),
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const { pathname } = useLocation();

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      api?.scrollTo(0);
    }, [pathname, api]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on('reInit', onSelect);
      api.on('select', onSelect);

      return () => {
        api?.off('select', onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          api: api,
          canScrollNext,
          canScrollPrev,
          carouselRef,
          opts,
          orientation:
            orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollNext,
          scrollPrev,
        }}
      >
        <div
          aria-roledescription="carousel"
          className={cn(
            'relative',
            '[--slide-size:calc(100%_/_var(--slides-per-view))]',
            className,
          )}
          onKeyDownCapture={handleKeyDown}
          ref={ref}
          role="region"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div className="w-full overflow-hidden" ref={carouselRef}>
      <div
        className={cn(
          'flex touch-pan-y [backface-visibility:hidden]',
          'ml-[calc(var(--slide-spacing)*-1)] two-banners',
          orientation === 'vertical' && 'flex-col',
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      aria-roledescription="slide"
      className={cn(
        'min-w-0 select-none',
        'flex-[0_0_var(--slide-size)] pl-[--slide-spacing] md:flex-[0_0_var(--slide-size)]',
        className,
      )}
      ref={ref}
      role="group"
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof IconButton>
>(({ className, ...props }, ref) => {
  const { canScrollPrev, orientation, scrollPrev } = useCarousel();

  return (
      <IconButton
          className="slider-arrow prev-arrow !bg-inherit"
          disabled={!canScrollPrev}
          onClick={scrollPrev}
          ref={ref}
          {...props}
      >
          <span></span>
      </IconButton>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof IconButton>
>(({ className, ...props }, ref) => {
  const { canScrollNext, orientation, scrollNext } = useCarousel();

  return (
      <IconButton
          className="slider-arrow next-arrow !bg-inherit"
          disabled={!canScrollNext}
          onClick={scrollNext}
          ref={ref}
          {...props}
      >
          <span></span>
      </IconButton>
  );
});
CarouselNext.displayName = 'CarouselNext';

const CarouselNextAndPrevButtonWithDashes = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof IconButton>
>(({ className, ...props }, ref) => {
  const { api, canScrollNext, canScrollPrev, scrollPrev, orientation, scrollNext } = useCarousel();
  const { onDotButtonClick, scrollSnaps, selectedIndex } =
    useCarouselPagination(api);
  return (
    <div className='flex justify-between md:absolute relative bottom-[20px] md:right-[30px] md:w-[31%] w-full bg-lightGreen lg:bg-transparent'>
      <IconButton
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        ref={ref}
        {...props}
      >
          <svg width="23" height="15" viewBox="0 0 23 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.292893 6.79289C-0.0976314 7.18342 -0.0976315 7.81658 0.292892 8.2071L6.65685 14.5711C7.04738 14.9616 7.68054 14.9616 8.07107 14.5711C8.46159 14.1805 8.46159 13.5474 8.07107 13.1569L2.41421 7.5L8.07107 1.84314C8.46159 1.45262 8.46159 0.819455 8.07107 0.428931C7.68054 0.0384065 7.04738 0.0384064 6.65686 0.428931L0.292893 6.79289ZM23 6.5L1 6.5L1 8.5L23 8.5L23 6.5Z" fill="#00461C"/>
          </svg>
        <span className="sr-only">Previous slide</span>
      </IconButton>
      <div className="flex justify-center gap-4">
        {scrollSnaps.map((_, index) => (
          <Button
            className={cn(className, 'p-1')}
            key={index}
            onClick={() => onDotButtonClick(index)}
            ref={ref}
            size="primitive"
            variant="primitive"
            {...props}
          >
            <span
              className={cn(
                'block h-[3px] w-[24px] bg-white',
                index === selectedIndex && 'bg-primaryGreen w-[64px]',
              )}
            />
          </Button>
        ))}
      </div>
      <IconButton
        disabled={!canScrollNext}
        onClick={scrollNext}
        ref={ref}
        {...props}
      >
          <svg width="23" height="15" viewBox="0 0 23 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.7071 8.20711C23.0976 7.81658 23.0976 7.18342 22.7071 6.79289L16.3431 0.428932C15.9526 0.0384078 15.3195 0.0384078 14.9289 0.428932C14.5384 0.819457 14.5384 1.45262 14.9289 1.84315L20.5858 7.5L14.9289 13.1569C14.5384 13.5474 14.5384 14.1805 14.9289 14.5711C15.3195 14.9616 15.9526 14.9616 16.3431 14.5711L22.7071 8.20711ZM0 8.5H22V6.5H0V8.5Z" fill="#00461C"/>
          </svg>
      </IconButton>
    </div>
  );
});
CarouselNext.displayName = 'CarouselNextAndPrevButtonWithDashes';

const CarouselNextAndPrevButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof IconButton>
>(({ className, ...props }, ref) => {
  const { api, canScrollNext, canScrollPrev, scrollPrev, orientation, scrollNext } = useCarousel();
  const { onDotButtonClick, scrollSnaps, selectedIndex } =
    useCarouselPagination(api);
  return (
    <div className='flex justify-end gap-[20px] relative z-1'>
      <IconButton
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        ref={ref}
        {...props}
        className={cn(
          'rounded-full',
          orientation === 'horizontal'
            ? '-left-12 top-1/2 rotate-180'
            : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
          className,
        )}
      >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="55.5" y="55.5" width="55" height="55" rx="27.5" transform="rotate(-180 55.5 55.5)" stroke="#00461C"/>
              <path d="M36.7071 28.7071C37.0976 28.3166 37.0976 27.6834 36.7071 27.2929L30.3431 20.9289C29.9526 20.5384 29.3195 20.5384 28.9289 20.9289C28.5384 21.3195 28.5384 21.9526 28.9289 22.3431L34.5858 28L28.9289 33.6569C28.5384 34.0474 28.5384 34.6805 28.9289 35.0711C29.3195 35.4616 29.9526 35.4616 30.3431 35.0711L36.7071 28.7071ZM20 29L36 29L36 27L20 27L20 29Z" fill="#00461C"/>
          </svg>
        <span className="sr-only">Previous slide</span>
      </IconButton>
      <IconButton
      className={cn(
        'rounded-full',
        orientation === 'horizontal'
          ? '-right-12 top-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        ref={ref}
        {...props}
      >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="55.5" y="55.5" width="55" height="55" rx="27.5" transform="rotate(-180 55.5 55.5)" stroke="#00461C"/>
              <path d="M36.7071 28.7071C37.0976 28.3166 37.0976 27.6834 36.7071 27.2929L30.3431 20.9289C29.9526 20.5384 29.3195 20.5384 28.9289 20.9289C28.5384 21.3195 28.5384 21.9526 28.9289 22.3431L34.5858 28L28.9289 33.6569C28.5384 34.0474 28.5384 34.6805 28.9289 35.0711C29.3195 35.4616 29.9526 35.4616 30.3431 35.0711L36.7071 28.7071ZM20 29L36 29L36 27L20 27L20 29Z" fill="#00461C"/>
          </svg>
      </IconButton>
    </div>
  );
});
CarouselNext.displayName = 'CarouselNextAndPrevButton';

const CarouselPagination = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { api } = useCarousel();
  const { onDotButtonClick, scrollSnaps, selectedIndex } =
    useCarouselPagination(api);

  return (
    <div className="mt-3 flex justify-center gap-2">
      {scrollSnaps.map((_, index) => (
        <Button
          className={cn(className, 'p-1')}
          key={index}
          onClick={() => onDotButtonClick(index)}
          ref={ref}
          size="primitive"
          variant="primitive"
          {...props}
        >
          <span
            className={cn(
              'aspect-square size-[10px] rounded-full bg-[#797979] border border-[#797979] opacity-85 transition-colors',
              index === selectedIndex && 'bg-current',
            )}
          />
        </Button>
      ))}
    </div>
  );
});
CarouselPagination.displayName = 'CarouselDots';

const CarouselCounter = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, className, ...props }, ref) => {
  const { api } = useCarousel();
  const { selectedIndex } = useCarouselPagination(api);

  return (
    <div className="flex items-center gap-1 tabular-nums text-muted-foreground">
      <span className={cn(className)} ref={ref} {...props}>
        {selectedIndex + 1}
      </span>
      <span>/</span>
      {children}
    </div>
  );
});
CarouselCounter.displayName = 'CarouselCounter';

function useCarouselPagination(emblaApi: EmblaCarouselType | undefined): {
  onDotButtonClick: (index: number) => void;
  scrollSnaps: number[];
  selectedIndex: number;
} {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = React.useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    onDotButtonClick,
    scrollSnaps,
    selectedIndex,
  };
}

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
  CarouselNextAndPrevButtonWithDashes,
  CarouselNextAndPrevButton
};
