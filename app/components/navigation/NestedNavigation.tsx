import { useState } from "react";
import type { TypeFromSelection } from "groqd";
import type { NESTED_NAVIGATION_FRAGMENT } from "~/qroq/links";
import { SanityInternalLink } from "../sanity/link/SanityInternalLink";
import { SanityExternalLink } from "../sanity/link/SanityExternalLink";

export type SanityNestedNavigationProps = TypeFromSelection<
  typeof NESTED_NAVIGATION_FRAGMENT
>;

export function NestedNavigation({
  data,
}: {
  data?: SanityNestedNavigationProps;
}) {
  if (!data || !data.name || !data.childLinks) return null;

  return (
    <nav>
      <ul className="list-none">
        <MenuItem item={data} />
      </ul>
    </nav>
  );
}

function MenuItem({
  item,
  level = 1,
  isParentActive = false,
}: {
  item: SanityNestedNavigationProps;
  level?: number;
  isParentActive?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChildKey, setActiveChildKey] = useState<string | null>(null);

  const handleMouseEnter = () => {
    setIsOpen(true);
    if (item.childLinks && item.childLinks.length > 0) {
      // Automatically activate the first child
      setActiveChildKey(item.childLinks[0]._key || item.childLinks[0].name);
    }
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    setActiveChildKey(null);
  };
  const hasNoChildLinks = item?.childLinks && item?.childLinks?.every((child) => !child.childLinks || child.childLinks.length === 0);

  return (
    <li
      className={`group level-0 has-child ${item.name}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Menu Link */}
      <SanityInternalLink data={item} className="flex items-center gap-[6px]">
        <span>
          {item.name}
        </span>
        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 7L0.5 0.816667L1.4 0L6 5.13333L10.6 0L11.5 0.816667L6 7Z" fill="black" />
        </svg>
      </SanityInternalLink>
      {/* Submenu */}
      {item.childLinks && item.childLinks.length > 0 && (
        <ul
          className={`${level === 2
            ? "absolute sub-sub-menu-class top-0 left-[245px] bg-white"
            : ""
            }${level === 1
              ? "absolute top-[46px] left-[-10px] w-[830px] h-[300px] pt-[30px] bg-lightGreen menu-left-col shadow-menuShadow"
              : ""
            } ${isOpen || isParentActive ? "block" : "hidden"} ${level === 2 ? "block grid-cols-2" : ""
            } ${hasNoChildLinks ? "ul-no-child-links-" + level : ""}
            `}
          style={level === 2 ? { width: "600px" } : undefined} // Multi-column styling
        >
          {item.childLinks.map((child) => (
            <li
              key={child._key || child.name}
              className={`${activeChildKey === (child._key || child.name)
                ? "bg-white level-1"
                : "level-1"
                }
              ${!child?.childLinks || child?.childLinks?.length === 0
                  ? "no-child-links-" + level
                  : ""}
              `}
              onMouseEnter={() =>
                setActiveChildKey(child._key || child.name)
              }
              onMouseLeave={() => setActiveChildKey(null)}
            >
              {child._type === "nestedNavigation" ? (
                <MenuItem
                  item={child}
                  level={level + 1}
                  isParentActive={
                    isOpen && activeChildKey === (child._key || child.name)
                  }
                />
              ) : (
                <MenuLink item={child} />
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function MenuLink({
  item,
}: {
  item: SanityNestedNavigationProps["childLinks"][0];
}) {
  if (item._type === "internalLink") {
    return (
      <SanityInternalLink
        data={item}
        className="block"
      >
        {item.name}
      </SanityInternalLink>
    );
  }

  if (item._type === "externalLink") {
    return (
      <SanityExternalLink
        data={item}
        className="block"
      >
        {item.name}
      </SanityExternalLink>
    );
  }

  return <span className="block">{item.name}</span>;
}
