import type {TypeFromSelection} from 'groqd';

import {useEffect, useMemo, useRef, useState} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {CAROUSEL_SECTION_FRAGMENT} from '~/qroq/sections';

import {useDevice} from '~/hooks/useDevice';

import {SanityImage} from '../sanity/SanityImage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
} from '../ui/Carousel';

type CarouselSectionProps = TypeFromSelection<typeof CAROUSEL_SECTION_FRAGMENT>;

export function CarouselSection(
  props: SectionDefaultProps & {data: CarouselSectionProps},
) {
  const {data} = props;
  const {arrows, autoplay, loop, pagination, slides, title} = data;
  const ref = useRef<HTMLDivElement>(null);
  const slidesPerViewDesktop = data.slidesPerViewDesktop || 3;
  const [inView, setInView] = useState(false);
  const [autoplayPlugin, setAutoplayPlugin] = useState<any[]>([]);

  // Use IntersectionObserver for inView detection
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {threshold: 0.1},
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  // Load Autoplay plugin only on client side
  useEffect(() => {
    if (autoplay && typeof window !== 'undefined') {
      import('embla-carousel-autoplay').then((module) => {
        const Autoplay = module.default;
        setAutoplayPlugin([Autoplay()]);
      });
    }
  }, [autoplay]);

  const plugins = useMemo(() => autoplayPlugin, [autoplayPlugin]);
  const imageSizes = slidesPerViewDesktop
    ? `(min-width: 1024px) ${
        100 / slidesPerViewDesktop
      }vw, (min-width: 768px) 50vw, 100vw`
    : '(min-width: 768px) 50vw, 100vw';
  const device = useDevice();
  const isActive =
    device === 'mobile'
      ? slides?.length! > 1
      : slides?.length! > slidesPerViewDesktop;

  return (
    <div className="container" ref={ref}>
      <h2>{title}</h2>
      {slides && slides?.length > 0 && (
        <Carousel
          className="mt-4 [--slide-spacing:1rem]"
          opts={{
            active: isActive,
            loop: loop || false,
          }}
          plugins={plugins}
          style={
            {
              '--slides-per-view': slidesPerViewDesktop,
            } as React.CSSProperties
          }
        >
          <div className="relative">
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem className="[&>span]:h-full" key={slide._key}>
                  <SanityImage
                    className="size-full object-cover"
                    data={slide.image}
                    loading={inView ? 'eager' : 'lazy'}
                    showBorder={false}
                    showShadow={false}
                    sizes={imageSizes}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {arrows && isActive && (
              <div className="hidden md:block">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            )}
          </div>
          {pagination && isActive && <CarouselPagination />}
        </Carousel>
      )}
    </div>
  );
}
