import React, {
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from 'react';

// Simple animation helper using Web Animations API
function animateElement(
  element: HTMLElement,
  keyframes: Record<string, any>,
  options?: KeyframeAnimationOptions,
) {
  const defaultOptions: KeyframeAnimationOptions = {
    duration: 300,
    easing: 'ease-out',
    fill: 'forwards',
    ...options,
  };

  // Convert keyframes object to Web Animations API format
  // From {opacity: 1, x: 100} to [{opacity: 1, transform: 'translateX(100px)'}]
  const webAnimKeyframes: Record<string, any> = {};
  const transforms: string[] = [];
  
  Object.entries(keyframes).forEach(([key, value]) => {
    if (key === 'x') {
      transforms.push(`translateX(${typeof value === 'number' ? `${value}px` : value})`);
    } else if (key === 'y') {
      transforms.push(`translateY(${typeof value === 'number' ? `${value}px` : value})`);
    } else if (key === 'scale') {
      transforms.push(`scale(${value})`);
    } else {
      webAnimKeyframes[key] = typeof value === 'number' && key !== 'opacity' && key !== 'zIndex'
        ? `${value}px`
        : value;
    }
  });
  
  if (transforms.length > 0) {
    webAnimKeyframes.transform = transforms.join(' ');
  }

  return element.animate([webAnimKeyframes], defaultOptions);
}

// Motion component factory
function createMotionComponent<T extends keyof JSX.IntrinsicElements>(
  component: T,
) {
  return React.forwardRef<
    HTMLElement,
    ComponentProps<T> & {
      initial?: Record<string, any>;
      animate?: Record<string, any>;
      exit?: Record<string, any>;
      transition?: KeyframeAnimationOptions;
      whileHover?: Record<string, any>;
      whileTap?: Record<string, any>;
      layout?: boolean;
      layoutId?: string;
    }
  >((props, ref) => {
    const {
      initial,
      animate: animateProp,
      exit,
      transition,
      whileHover,
      whileTap,
      layout,
      layoutId,
      style,
      ...rest
    } = props;

    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      // Apply initial styles immediately (only on client)
      if (initial) {
        const transforms: string[] = [];
        
        Object.entries(initial).forEach(([key, value]) => {
          try {
            if (key === 'x') {
              transforms.push(`translateX(${typeof value === 'number' ? `${value}px` : value})`);
            } else if (key === 'y') {
              transforms.push(`translateY(${typeof value === 'number' ? `${value}px` : value})`);
            } else if (key === 'scale') {
              transforms.push(`scale(${value})`);
            } else {
              element.style[key as any] =
                typeof value === 'number' && key !== 'opacity' && key !== 'zIndex'
                  ? `${value}px`
                  : value;
            }
          } catch (e) {
            // Silently ignore style setting errors
            console.warn('Failed to set style:', key, value, e);
          }
        });
        
        if (transforms.length > 0) {
          element.style.transform = transforms.join(' ');
        }
      }

      // Animate to target state using Web Animations API (only if animateProp is provided)
      if (animateProp) {
        const animation = animateElement(element, animateProp, transition);
        return () => animation.cancel();
      }
    }, [animateProp, initial, transition]);

    // Handle hover animations
    useEffect(() => {
      const element = elementRef.current;
      if (!element || !whileHover) return;

      const handleMouseEnter = () => {
        animateElement(element, whileHover, {duration: 200});
      };

      const handleMouseLeave = () => {
        if (animateProp) {
          animateElement(element, animateProp, {duration: 200});
        }
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [whileHover, animateProp]);

    return React.createElement(component, {
      ...rest,
      ref: (node: HTMLElement) => {
        elementRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as any).current = node;
        }
      },
      style,
    });
  });
}

// Create motion components
export const m = {
  div: createMotionComponent('div'),
  span: createMotionComponent('span'),
  a: createMotionComponent('a'),
  button: createMotionComponent('button'),
  nav: createMotionComponent('nav'),
  ul: createMotionComponent('ul'),
  li: createMotionComponent('li'),
  section: createMotionComponent('section'),
  header: createMotionComponent('header'),
  footer: createMotionComponent('footer'),
  main: createMotionComponent('main'),
  p: createMotionComponent('p'),
  h1: createMotionComponent('h1'),
  h2: createMotionComponent('h2'),
  h3: createMotionComponent('h3'),
  h4: createMotionComponent('h4'),
  h5: createMotionComponent('h5'),
  h6: createMotionComponent('h6'),
  img: createMotionComponent('img'),
  form: createMotionComponent('form'),
  input: createMotionComponent('input'),
  textarea: createMotionComponent('textarea'),
  select: createMotionComponent('select'),
  label: createMotionComponent('label'),
  svg: createMotionComponent('svg'),
  path: createMotionComponent('path'),
  circle: createMotionComponent('circle'),
};

// AnimatePresence - simplified version
export function AnimatePresence({
  children,
  mode,
}: {
  children?: ReactNode;
  mode?: 'sync' | 'wait' | 'popLayout';
  initial?: boolean;
  exitBeforeEnter?: boolean;
}) {
  return <>{children}</>;
}

// LazyMotion - no-op for compatibility
export function LazyMotion({
  children,
  features,
  strict,
}: {
  children?: ReactNode;
  features: any;
  strict?: boolean;
}) {
  return <>{children}</>;
}

// Hooks
export function useMotionValue(initial: number) {
  const ref = useRef(initial);
  return {
    get: () => ref.current,
    set: (value: number) => {
      ref.current = value;
    },
  };
}

export function useTransform(
  value: any,
  inputRange: number[],
  outputRange: number[] | string[],
) {
  return useMotionValue(0);
}

export function useScroll(options?: any) {
  const scrollY = useMotionValue(0);
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollY.set(y);
      scrollYProgress.set(maxScroll > 0 ? y / maxScroll : 0);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY, scrollYProgress]);

  return {
    scrollY,
    scrollYProgress,
    scrollX: useMotionValue(0),
    scrollXProgress: useMotionValue(0),
  };
}

export function useMotionValueEvent(
  value: any,
  event: string,
  callback: (latest: any) => void,
) {
  // No-op for now
}

export function useInView(ref: any, options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = React.useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      options || {threshold: 0.1},
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

// Transform utility
export function transform(
  value: number,
  inputRange: number[],
  outputRange: number[],
) {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;

  const clampedValue = Math.max(inputMin, Math.min(inputMax, value));
  const progress = (clampedValue - inputMin) / (inputMax - inputMin);
  return outputMin + progress * (outputMax - outputMin);
}

// Feature bundles (no-op for compatibility)
export const domMax = {};
export const domAnimation = {};

// Types
export type Variants = Record<string, any>;
export type Transition = KeyframeAnimationOptions;
export type MotionProps = Record<string, any>;
export type HTMLMotionProps<T> = ComponentProps<any> & {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: KeyframeAnimationOptions;
};

// Export motion as well
export const motion = m;

// Default export
export default {
  m,
  motion,
  AnimatePresence,
  LazyMotion,
  useMotionValue,
  useTransform,
  useScroll,
  useMotionValueEvent,
  useInView,
  transform,
  domMax,
  domAnimation,
};
