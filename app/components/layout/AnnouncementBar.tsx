import type { TypeFromSelection } from 'groqd';

import { Link, useLocation } from 'react-router';
import { cx } from 'class-variance-authority';
import { useEffect, useMemo, useState } from 'react';

import type { ANNOUNCEMENT_BAR_FRAGMENT } from '~/qroq/fragments';

import { useColorsCssVars } from '~/hooks/useColorsCssVars';
import { useRootLoaderData } from '~/root';

import { IconArrowRight } from '../icons/IconArrowRight';
import { SanityInternalLink } from '../sanity/link/SanityInternalLink';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/Carousel';

type AnnouncementBarProps = TypeFromSelection<typeof ANNOUNCEMENT_BAR_FRAGMENT>;

export function AnnouncementBar() {
  const rootData = useRootLoaderData();
  const { sanityRoot } = rootData || {};
  const data = sanityRoot?.data;
  const header = data?.header;
  const [autoplayPlugin, setAutoplayPlugin] = useState<any[]>([]);

  // Load Autoplay plugin only on client side
  useEffect(() => {
    if (header?.autoRotateAnnouncements && typeof window !== 'undefined') {
      import('embla-carousel-autoplay').then((module) => {
        const Autoplay = module.default;
        setAutoplayPlugin([Autoplay({ delay: 5000, stopOnMouseEnter: true })]);
      });
    }
  }, [header?.autoRotateAnnouncements]);

  const plugins = useMemo(
    () => autoplayPlugin,
    [autoplayPlugin],
  );
  const { pathname } = useLocation();
  const isMatchingPage = header?.selectedPages?.some(page =>
    pathname.startsWith(`/${page.slug.current}`)
  );
  const announcementBar = isMatchingPage ? header?.cmsAnnouncementBar : header?.announcementBar;

  const colorsCssVars = useColorsCssVars({
    selector: `#announcement-bar`,
    settings: {
      colorScheme: header?.announcementBarColorScheme!,
      customCss: null,
      hide: null,
      padding: null,
    },
  });
  const isActive = announcementBar?.length! > 1;

  if (!announcementBar) return null;

  return (
    <section className="bg-background text-foreground py-[2px]" id="announcement-bar">
      <div className="container">
        <style dangerouslySetInnerHTML={{ __html: colorsCssVars }} />
        <Carousel opts={{ active: isActive, align: 'center' }} plugins={plugins}>
          <CarouselContent className="relative ml-0 justify-center">
            {isMatchingPage ? announcementBar?.map((item) => (
              <CarouselItem key={item._key}>
                <Item
                  _key={item._key}
                  externalLink={item.externalLink}
                  link={item.link}
                  openInNewTab={item.openInNewTab}
                  text={item.text}
                />
              </CarouselItem>
            )) : announcementBar?.map((item) => (
              <CarouselItem key={item._key}>
                <Item
                  _key={item._key}
                  externalLink={item.externalLink}
                  link={item.link}
                  openInNewTab={item.openInNewTab}
                  text={item.text}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {isActive && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}

function Item(props: AnnouncementBarProps) {
  if (!props.text) return null;

  const className = cx('flex w-full justify-center py-3 text-center md:text-base text-[12px]');

  return props.link ? (
    <SanityInternalLink
      className={cx(['group', className])}
      data={{
        _key: props.link.slug.current,
        _type: 'internalLink',
        anchor: props.anchor,
        link: props.link,
        name: props.text,
      }}
    >
      <LinkWrapper>{props.text}</LinkWrapper>
    </SanityInternalLink>
  ) : props.externalLink ? (
    <Link
      className={cx(['group', className])}
      rel={props.openInNewTab ? 'noopener noreferrer' : ''}
      target={props.openInNewTab ? '_blank' : undefined}
      to={props.externalLink}
    >
      <LinkWrapper>{props.text}</LinkWrapper>
    </Link>
  ) : (
    <p className={className}>{props.text}</p>
  );
}

function LinkWrapper({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center text-sm underline-offset-4 group-hover:underline">
      <span className="relative z-[2] block bg-background pr-2">
        {children}
      </span>
      {/* <span className="-translate-x-[2px] transition-transform group-hover:translate-x-[-0.15px]">
        <IconArrowRight />
      </span> */}
    </p>
  );
}
