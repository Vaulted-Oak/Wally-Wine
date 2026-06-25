import type { Variants } from '~/lib/motion';
import type { CSSProperties } from 'react';

import { Await, Form, Link, NavLink, useLocation } from 'react-router';
import { getImageDimensions } from '@sanity/asset-utils';
import { stegaClean } from '@sanity/client/stega';
import { cx } from 'class-variance-authority';
import { m, transform, useMotionValueEvent, useTransform } from '~/lib/motion';
import React, { useEffect, useState, useRef, Suspense } from 'react';

import { useBoundedScroll } from '~/hooks/useBoundedScroll';
import { useColorsCssVars } from '~/hooks/useColorsCssVars';
import { useLocalePath } from '~/hooks/useLocalePath';
import { cn } from '~/lib/utils';
import { useRootLoaderData } from '~/root';

import { headerVariants } from '../cva/header';
import { IconAccount } from '../icons/IconAccount';
import { DesktopNavigation } from '../navigation/DesktopNavigation';
import { MobileNavigation } from '../navigation/MobileNavigation';
import { Button, IconButton } from '../ui/Button';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
import SearchAutocomplete from "../search/SearchAutocomplete";
import { IconSearch } from "../icons/IconSearch";
import { useOutsideClick } from 'outsideclick-react';
import { useSanityThemeContent } from '~/hooks/useSanityThemeContent';

export function Header() {
  const rootData = useRootLoaderData();
  const { sanityRoot, isLoggedIn } = rootData || {};
  const data = sanityRoot?.data;
  const header = data?.header;
  const logoWidth = header?.desktopLogoWidth
    ? `${header?.desktopLogoWidth}px`
    : undefined;
  const homePath = useLocalePath({ path: '/' });
  const colorsCssVars = useColorsCssVars({
    selector: 'header',
    settings: header,
  });
  const { pathname } = useLocation();
  const isMatchingPage = header?.selectedPages?.some(page =>
    pathname.startsWith(`/${page.slug.current}`)
  );
  const path = useLocalePath({ path: '/account/logout' });
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const ref = useOutsideClick(() => {
    setIsAccountVisible(false);
  });
  const searchRef = useOutsideClick(() => {
    setIsSearchVisible(false);
  });

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
  };
  const { themeContent } = useSanityThemeContent();
  const searchContainerRef: any = useRef(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        toggleSearch();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAccount = () => {
    setIsAccountVisible((prev) => !prev);
  };

  return (
    <HeaderWrapper>
      <style dangerouslySetInnerHTML={{ __html: colorsCssVars }} />
      <div className="px-[20px]">
        <div className="flex items-center justify-between">
          {isMatchingPage ? <MobileNavigation data={header?.cmsMenu} /> : <MobileNavigation data={header?.menu} />}
          <Link className="group w-[80px] md:w-[100px] mr-auto lg:mr-0 ml-[20px] lg:ml-0" prefetch="intent" to={homePath}>
            <Logo
              className="h-auto w-[var(--logoWidth)]"
              sizes={logoWidth}
            /*style={
              {
                '--logoWidth': logoWidth || 'auto',
                'width':'135px'
              } as CSSProperties
            }*/
            />
          </Link>

          {isMatchingPage ? <DesktopNavigation data={header?.cmsMenu} /> : <DesktopNavigation data={header?.menu} />}

          {!isMatchingPage ? <div className="flex items-baseline gap-[20px]">
            <div ref={searchRef} className="flex items-center">
              <button
                onClick={toggleSearch}
                className="px-2 focus:ring-primary/5"
                aria-label="Toggle Search"
              >
                <IconSearch className="" />
              </button>

              {isSearchVisible && (
                <div className="absolute w-full md:top-[82px] top-[80px] left-0 bg-white shadow-menuShadow z-50 p-2 h-screen md:h-auto overflow-auto">
                  <div className="container">
                    <div className="flex w-full items-center gap-[20px]">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && searchTerm.trim().length >= 3) {
                            window.location.href = `/searchresults?q=${encodeURIComponent(searchTerm)}`;
                            setSearchTerm('');
                          }
                        }}
                        className="border-b border-primaryGreen h-[50px] px-2 py-1 w-full focus-visible:outline-none"
                      />
                      <Link
                        to={searchTerm.trim().length >= 3 ? `/searchresults?q=${encodeURIComponent(searchTerm)}` : '#'}
                        className="focus:ring-primary/5"
                        onClick={(e) => {
                          if (searchTerm.trim().length < 3) {
                            e.preventDefault();
                          } else {
                            toggleSearch();
                            setSearchTerm('');
                          }
                        }}
                      >
                        <button className="focus:ring-primary/5">
                          <IconSearch className="w-6 h-6" />
                        </button>
                      </Link>
                      <span
                        className="cursor-pointer"
                        onClick={toggleSearch}
                      >
                        <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="1" y1="-1" x2="26.3636" y2="-1" transform="matrix(0.730887 0.682499 -0.730887 0.682499 0 1.3241)" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <line x1="1" y1="-1" x2="26.3636" y2="-1" transform="matrix(-0.730887 0.682499 -0.730887 -0.682499 20 0)" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                    <SearchAutocomplete setSearchTerm={setSearchTerm} searchTerm={searchTerm} toggleSearch={toggleSearch} />
                  </div>
                </div>
              )}
            </div>
            <div ref={ref} className="flex relative">
              <button
                onClick={toggleAccount}
              >
                <IconAccount className="size-6" />
              </button>
              {isAccountVisible && (
                <div className="absolute right-[-20px] top-[54px] w-[170px] bg-white px-[20px] py-[10px] drop-shadow-3xl after:absolute after:right-[15px] after:top-[-14px] after:border-b-[15px] after:border-l-[15px] after:border-r-[15px] after:border-solid after:border-b-white after:border-l-transparent after:border-r-transparent">
                  <ul>
                    <li className="my-[10px]">
                      <Suspense fallback={<Link to='/account'>Sign in</Link>}>
                        <Await
                          resolve={Promise.resolve(isLoggedIn)}
                          errorElement={<Link to='/account'>Sign in</Link>}
                        >
                          {(isLoggedIn) => (
                            <Link to='/account'>{isLoggedIn ? 'Account' : 'Sign in'}</Link>
                          )}
                        </Await>
                      </Suspense>
                    </li>
                    <Suspense fallback={<Link to='/account'>Sign in</Link>}>
                      <Await
                        resolve={Promise.resolve(isLoggedIn)}
                        errorElement={<Link to='/account'>Sign in</Link>}
                      >
                        {(isLoggedIn) =>
                          isLoggedIn && (
                            <li className="my-[10px]">
                              <Form action={path} method="post">
                                <Button className="px-0" type="submit" variant="link">
                                  {themeContent?.account.signOut || "Sign Out"}
                                </Button>
                              </Form>
                            </li>
                          )
                        }
                      </Await>
                    </Suspense>
                  </ul>
                </div>
              )}
            </div>
            <CartDrawer isMatchingPage={isMatchingPage}/>
          </div> : null}
          {isMatchingPage && <CartDrawer isMatchingPage={isMatchingPage}/>}
        </div>
      </div>
    </HeaderWrapper>
  );
}

function AccountLink({ className }: { className?: string }) {
  return (
    <IconButton asChild>
      <Link className={className} to="/account">
        <IconAccount className="size-6" />
      </Link>
    </IconButton>
  );
}

function HeaderWrapper(props: { children: React.ReactNode }) {
  const rootData = useRootLoaderData();
  const { sanityRoot } = rootData || {};
  const data = sanityRoot?.data;
  const header = data?.header;
  const showSeparatorLine = header?.showSeparatorLine;
  const blur = header?.blur;
  const sticky = stegaClean(header?.sticky);

  const headerClassName = cx([
    'section-padding bg-background text-foreground md:py-[14px] py-[18px] sticky top-0 z-50',
    sticky !== 'none' && 'sticky top-0 z-50',
    blur &&
    'bg-opacity-95 backdrop-blur supports-[backdrop-filter]:bg-opacity-85',
    headerVariants({
      optional: showSeparatorLine ? 'separator-line' : null,
    }),
  ]);

  return (
    <>
      <header className={headerClassName}>{props.children}</header>
      <HeaderHeightCssVars />
    </>
  );
}

function HeaderAnimation(props: {
  children: React.ReactNode;
  className: string;
}) {
  const { pathname } = useLocation();
  const [activeVariant, setActiveVariant] = useState<
    'hidden' | 'initial' | 'visible'
  >('initial');
  const desktopHeaderHeight = useHeaderHeigth()?.desktopHeaderHeight || 0;
  const { scrollYBoundedProgress } = useBoundedScroll(250);
  const scrollYBoundedProgressDelayed = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1],
  );

  useEffect(() => {
    // Reset the header position on route change
    setActiveVariant('initial');
  }, [pathname]);

  useMotionValueEvent(scrollYBoundedProgressDelayed, 'change', (latest) => {
    if (latest === 0) {
      setActiveVariant('visible');
    } else if (latest > 0.5) {
      setActiveVariant('hidden');
    } else {
      setActiveVariant('visible');
    }

    const newDesktopHeaderHeight = transform(
      latest,
      [0, 1],
      [`${desktopHeaderHeight}px`, '0px'],
    );

    // Reassign header height css var on scroll
    document.documentElement.style.setProperty(
      '--desktopHeaderHeight',
      newDesktopHeaderHeight,
    );
  });

  const variants: Variants = {
    hidden: {
      transform: 'translateY(-100%)',
    },
    initial: {
      transform: 'translateY(0)',
      transition: {
        duration: 0,
      },
    },
    visible: {
      transform: 'translateY(0)',
    },
  };

  // Header animation inspired by the fantastic Build UI recipes
  // (Check out the original at: https://buildui.com/recipes/fixed-header)
  // Credit to the Build UI team for the awesome Header animation.
  return (
    <>
      <m.header
        animate={activeVariant}
        className={cn(props.className)}
        initial="visible"
        transition={{
          duration: 0.2,
        }}
        variants={variants}
      >
        {props.children}
      </m.header>
    </>
  );
}

function HeaderHeightCssVars() {
  const desktopHeaderHeight = useHeaderHeigth()?.desktopHeaderHeight || 0;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root { --desktopHeaderHeight: ${desktopHeaderHeight}px; }`,
      }}
    />
  );
}

function useHeaderHeigth() {
  const rootData = useRootLoaderData();
  const { sanityRoot } = rootData || {};
  const data = sanityRoot?.data;
  const headerPadding = {
    bottom: data?.header?.padding?.bottom || 0,
    top: data?.header?.padding?.top || 0,
  };
  const desktopLogoWidth = data?.header?.desktopLogoWidth || 1;
  const headerBorder = data?.header?.showSeparatorLine ? 1 : 0;
  const sanitySettings = data?.settings;
  const logo = sanitySettings?.logo;
  const width = logo ? getImageDimensions(logo._ref).width : 0;
  const height = logo ? getImageDimensions(logo._ref).height : 0;
  const desktopLogoHeight =
    logo?._ref && width && height ? (desktopLogoWidth * height) / width : 44;

  const desktopHeaderHeight = (
    desktopLogoHeight +
    headerPadding.top +
    headerPadding.bottom +
    headerBorder
  ).toFixed(2);

  return { desktopHeaderHeight };
}
