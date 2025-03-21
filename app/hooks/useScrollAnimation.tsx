"use client";

import { useState, useEffect, useRef, RefObject } from 'react';

interface UseScrollAnimationOptions {
  /**
   * The threshold value between 0 and 1 indicating the percentage of the target element
   * that needs to be visible before triggering the animation.
   * @default 0.1
   */
  threshold?: number;
  
  /**
   * Margin around the root element. Can have values similar to the CSS margin property.
   * @default "0px"
   */
  rootMargin?: string;
  
  /**
   * Delay in milliseconds before the animation starts after the element becomes visible.
   * @default 0
   */
  animationDelay?: number;
  
  /**
   * If true, the observer will disconnect after the element becomes visible once.
   * @default true
   */
  once?: boolean;
}

/**
 * A custom hook that uses Intersection Observer to detect when an element enters the viewport.
 * Returns a ref to attach to the target element and a boolean indicating visibility.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px',
  animationDelay = 0,
  once = true,
}: UseScrollAnimationOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    
    if (!currentRef) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      
      if (entry.isIntersecting) {
        if (animationDelay > 0) {
          const timeoutId = setTimeout(() => {
            setIsVisible(true);
          }, animationDelay);
          
          return () => clearTimeout(timeoutId);
        } else {
          setIsVisible(true);
        }
        
        if (once && observer) {
          observer.disconnect();
        }
      } else if (!once) {
        setIsVisible(false);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    observer.observe(currentRef);

    return () => {
      if (observer && currentRef) {
        observer.unobserve(currentRef);
        observer.disconnect();
      }
    };
  }, [threshold, rootMargin, animationDelay, once]);

  return [ref, isVisible];
}

export default useScrollAnimation;
