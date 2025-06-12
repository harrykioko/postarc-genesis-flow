import { useRef, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { PostCard } from './PostCard';
import { examplePosts, templateColors } from './data/postShowcaseData';

/**
 * PostsGrid displays post cards in a swipeable carousel on mobile and a grid on desktop.
 * Uses Embla Carousel for mobile experience.
 */
export const PostsGrid = () => {
  // Embla Carousel setup for mobile
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: 'trimSnaps',
    skipSnaps: false,
  });

  // Optional: Add keyboard navigation for accessibility
  useEffect(() => {
    if (!emblaApi) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') emblaApi.scrollPrev();
      if (e.key === 'ArrowRight') emblaApi.scrollNext();
    };
    emblaApi.containerNode().addEventListener('keydown', handleKeyDown);
    return () => {
      emblaApi.containerNode().removeEventListener('keydown', handleKeyDown);
    };
  }, [emblaApi]);

  return (
    <>
      {/* Mobile: Embla Carousel */}
      <div className="block md:hidden">
        <div
          className="overflow-x-hidden"
          ref={emblaRef}
          tabIndex={0}
          aria-label="Swipeable post carousel"
        >
          <div className="flex gap-4 px-1">
            {examplePosts.map((post, index) => {
              const colors = templateColors[post.template];
              return (
                <div
                  key={post.id}
                  className="min-w-[85vw] max-w-xs flex-shrink-0"
                  aria-roledescription="slide"
                >
                  <PostCard post={post} index={index} colors={colors} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
        {examplePosts.map((post, index) => {
          const colors = templateColors[post.template];
          return (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              colors={colors}
            />
          );
        })}
      </div>
    </>
  );
};
