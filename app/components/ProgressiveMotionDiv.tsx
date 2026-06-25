import {type HTMLMotionProps, m} from '~/lib/motion';

import {useIsHydrated} from '~/hooks/useIsHydrated';

/**
 * Renders a progressive motion div based on the hydration status.
 * Useful to render content when JS is disabled.
 */
export function ProgressiveMotionDiv({
  children,
  className,
  forceMotion,
  ...props
}: HTMLMotionProps<'div'> & {
  children: React.ReactNode;
  forceMotion?: boolean;
}) {
  const isHydrated = useIsHydrated();

  // Always render m.div to avoid hydration mismatch
  // Only apply motion props after hydration or if forced
  const motionProps = forceMotion || isHydrated ? props : {};

  return (
    <m.div className={className} {...motionProps}>
      {children}
    </m.div>
  );
}
