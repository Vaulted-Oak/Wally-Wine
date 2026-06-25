import { useState, useCallback } from "react";
import { useDevice } from "~/hooks/useDevice";
import { cn } from "~/lib/utils";

import { IconChevron } from "../icons/IconChevron";
import { IconMenu } from "../icons/IconMenu";
import { SanityExternalLink } from "../sanity/link/SanityExternalLink";
import { SanityInternalLink } from "../sanity/link/SanityInternalLink";
import { iconButtonClass } from "../ui/Button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "../ui/Drawer";
import { ScrollArea } from "../ui/ScrollArea";
import { SanityNestedNavigationProps } from "./NestedNavigation";
import { NavigationProps } from "./DesktopNavigation";

const mobileMenuLinkClass = cn(
  "flex items-center justify-between px-4 py-2 w-full rounded-sm text-left transition-colors"
);

export function MobileNavigation({ data }: { data?: NavigationProps }) {
  const [open, setOpen] = useState(false);
  const device = useDevice();

  const handleClose = useCallback(() => setOpen(false), []);

  if (!data) return null;

  return (
    <div className="lg:hidden">
      {/* Hamburger Menu */}
      <Drawer
        direction={device === "desktop" ? "right" : "bottom"}
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerTrigger className="">
          <IconMenu className="size-7" strokeWidth={1.5} />
        </DrawerTrigger>
        <MobileNavigationContent onClose={handleClose}>
          {data.map((item:any) => (
            <li key={item._key}>
              {item._type === "internalLink" && (
                <SanityInternalLink
                  className={mobileMenuLinkClass}
                  data={item}
                  onClick={handleClose}
                />
              )}
              {item._type === "externalLink" && (
                <SanityExternalLink
                  className={mobileMenuLinkClass}
                  data={item}
                />
              )}
              {item._type === "nestedNavigation" && (
                <MobileNavigationNested data={item} handleClose={handleClose} />
              )}
            </li>
          ))}
        </MobileNavigationContent>
      </Drawer>
    </div>
  );
}

function MobileNavigationContent({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <DrawerContent
      className="h-screen w-screen bg-background text-foreground rounded-none border-0 mobile-menu overflow-auto"
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      {/* Add Close Button */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium">Menu</h2>
        {/*<button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Close Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>*/}
      </div>
      {/* Main Content */}
      <div className="p-4">
        <ScrollArea>
          <nav>
            <ul className="flex flex-col gap-4">{children}</ul>
          </nav>
        </ScrollArea>
      </div>
    </DrawerContent>
  );
}

function MobileNavigationNested({
  data,
  handleClose,
  level = 1,
}: {
  handleClose: () => void;
  data?: SanityNestedNavigationProps;
  level?: number;
}) {
  const [open, setOpen] = useState(false);

  if (!data) return null;

  const {childLinks} = data;
  console.log(data?.link?.slug?.current);
  const viewAllLink = {
    link: data?.link,
    _key: data?._key,
    name: 'View All',
    _type: 'internalLink',
    anchor: data?.anchor,
  };
  return (
    <div>
      <button
        className={mobileMenuLinkClass}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {data.name}
        <IconChevron direction={open ? 'down' : 'right'} className="size-5" />
      </button>
      {open && childLinks && (
        <ul className="pl-4">
          {childLinks.map((child: any) => (
            <li key={child._key}>
              {child._type === 'internalLink' ? (
                <SanityInternalLink
                  className={mobileMenuLinkClass}
                  data={child}
                  onClick={handleClose}
                />
              ) : child._type === 'externalLink' ? (
                <SanityExternalLink
                  className={mobileMenuLinkClass}
                  data={child}
                />
              ) : child._type === 'nestedNavigation' ? (
                <MobileNavigationNested
                  data={child}
                  handleClose={handleClose}
                  level={level + 1}
                />
              ) : null}
            </li>
          ))}
          {data?.link?.slug?.current &&
            level === 1 &&
            childLinks?.length > 0 && (
              <li>
                <SanityInternalLink
                  data={viewAllLink}
                  className={mobileMenuLinkClass}
                  onClick={handleClose}
                />
              </li>
            )}
        </ul>
      )}
    </div>
  );
}
