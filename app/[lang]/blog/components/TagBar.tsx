'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function TagsBar({ tags = [] }: { tags?: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Parse selected tags from the URL query parameter
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    // Get all tag parameters as an array
    return searchParams.getAll('tag');
  });

  // Keep selected tags in sync with URL changes
  useEffect(() => {
    const tagsFromUrl = searchParams.getAll('tag');
    if (JSON.stringify(selectedTags) !== JSON.stringify(tagsFromUrl)) {
      setSelectedTags(tagsFromUrl);
    }
  }, [searchParams, selectedTags]);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const toggleTag = (tag: string) => {
    // Create a new URLSearchParams object based on the current parameters
    const newSearchParams = new URLSearchParams(searchParams);

    // Toggle tag selection logic
    if (selectedTags.includes(tag)) {
      // Remove this tag
      newSearchParams.delete('tag', tag);
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      // Add this tag
      newSearchParams.append('tag', tag);
      setSelectedTags([...selectedTags, tag]);
    }

    // Preserve the current URL path and update only the query parameters
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const clearTags = () => {
    setSelectedTags([]);

    // Create new search params without tags
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('tag');

    // Preserve the current URL path but remove tag parameters
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="relative my-6 w-full">
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute -left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-2 pb-2"
        onScroll={checkScroll}
      >
        <button
          onClick={clearTags}
          className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
            selectedTags.length === 0
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted bg-transparent hover:bg-accent'
          }`}
        >
          All Tags
        </button>

        {Array.isArray(tags) &&
          tags.map((tag) => {
            const tagTitle = tag
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted bg-transparent hover:bg-accent'
                }`}
              >
                {tagTitle}
              </button>
            );
          })}
      </div>

      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute -right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
