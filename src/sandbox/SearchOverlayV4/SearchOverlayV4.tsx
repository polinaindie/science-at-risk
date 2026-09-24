import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { Nothing } from '@/components/Nothing';
import { expertsIndexV4, searchExpertsV4, type ExpertEntryV4 } from '@/sandbox/searchIndexV4';

export interface SearchOverlayV4Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  locale?: string;
  /** GET target — the same contract the live site's expert search uses. */
  action?: string;
  queryName?: string;
  placeholder?: string;
  hint?: string;
  index?: ExpertEntryV4[];
  /** Artificial delay so the Loader state can be seen; 0 in real use. */
  searchDelayMs?: number;
  /** Focus goes back here on close — the Search button in the bar. */
  returnFocusRef?: RefObject<HTMLElement | null>;
  onSelect?: (entry: ExpertEntryV4) => void;
  onSubmit?: (query: string) => void;
  className?: string;
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/**
 * Site-wide expert search, living in the header bar rather than the hero.
 *
 * Scope is exactly what the site can actually do: free text submits to
 * `/experts?search=`, the same GET form as the live site, so it works with no
 * JavaScript at all. Suggestions are a convenience on top, not the mechanism.
 *
 * A combobox, not a dialog: no `aria-modal`, no focus trap. DOM focus stays in
 * the input the whole time and the active option is named by
 * `aria-activedescendant`, which is what WAI-ARIA 1.2 asks for and what lets a
 * screen reader announce options without moving focus off the field.
 */
export function SearchOverlayV4({
  open = false,
  onOpenChange,
  locale = 'EN',
  action = '/experts',
  queryName = 'search',
  placeholder = 'Scientific field or name',
  hint,
  index = expertsIndexV4,
  searchDelayMs = 0,
  returnFocusRef,
  onSelect,
  onSubmit,
  className = '',
}: SearchOverlayV4Props) {
  const isUa = locale.toUpperCase() === 'UA' || locale.toUpperCase() === 'UK';
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExpertEntryV4[]>([]);
  const [listOpen, setListOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const optionId = (i: number) => `${listboxId}-option-${i}`;
  const labels = isUa
    ? {
        close: 'Закрити пошук',
        search: 'Знайти науковця',
        hint: 'Пошук серед експертів. Історії та дослідження — у меню.',
        results: (n: number) => `${n} результатів`,
        none: 'Нічого не знайдено',
      }
    : {
        close: 'Close search',
        search: 'Find a scientist',
        hint: 'Searches the expert catalogue. Stories and research live in the menu.',
        results: (n: number) => `${n} results`,
        none: 'Nothing found',
      };

  // Focus the field as it opens; reset the query when it closes so the next
  // open starts clean rather than on a stale search.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      return;
    }
    setQuery('');
    setResults([]);
    setListOpen(false);
    setActiveIndex(-1);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setResults([]);
      setListOpen(false);
      setActiveIndex(-1);
      setLoading(false);
      return;
    }

    const run = () => {
      setResults(searchExpertsV4(query, { index }));
      setListOpen(true);
      setActiveIndex(-1);
      setLoading(false);
    };

    if (searchDelayMs <= 0) {
      run();
      return;
    }

    setLoading(true);
    const timer = window.setTimeout(run, searchDelayMs);
    return () => window.clearTimeout(timer);
  }, [query, open, index, searchDelayMs]);

  const close = () => {
    onOpenChange?.(false);
    returnFocusRef?.current?.focus?.();
  };

  const go = (entry: ExpertEntryV4) => {
    if (onSelect) {
      onSelect(entry);
      return;
    }
    window.location.assign(entry.href);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!onSubmit) return; // Let the plain GET through — that is the no-JS path.
    e.preventDefault();
    onSubmit(query);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const count = results.length;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!listOpen && count) {
        setListOpen(true);
        setActiveIndex(0);
        return;
      }
      if (!count) return;
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((i) => (i + delta + count) % count);
      return;
    }

    if (e.key === 'Home' && count) {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (e.key === 'End' && count) {
      e.preventDefault();
      setActiveIndex(count - 1);
      return;
    }

    if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      go(results[activeIndex]);
      return;
    }

    // Two-step: the first Escape dismisses the list and keeps the query, the
    // second closes the search itself.
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (listOpen) {
        setListOpen(false);
        setActiveIndex(-1);
        return;
      }
      close();
    }
  };

  if (!open) return null;

  const showPanel = Boolean(query.trim());

  return (
    <div className={className}>
      <div
        className="fixed inset-0 z-[54] bg-black/20"
        aria-hidden
        onClick={close}
      />

      <div className="relative z-[55]">
        <form
          role="search"
          action={action}
          method="get"
          onSubmit={handleSubmit}
          className="flex items-center gap-4"
        >
          <input
            ref={inputRef}
            type="search"
            name={queryName}
            role="combobox"
            aria-expanded={listOpen}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            aria-label={placeholder}
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="min-w-0 flex-1 border-0 bg-transparent font-ukraine text-[18px] leading-[28px] font-light text-brand-black outline-none placeholder:text-brand-muted md:text-[22px]"
          />
          <Button type="submit" variant="black" className="shrink-0">
            {labels.search}
          </Button>
          <button
            type="button"
            onClick={close}
            aria-label={labels.close}
            className={`flex min-h-11 min-w-11 shrink-0 items-center justify-center border-0 bg-transparent p-0 font-mono text-breadcrumbs text-brand-black ${focusRing}`}
          >
            <img src="/assets/ui/close.svg" alt="" width={20} height={20} className="size-5" />
          </button>
        </form>

        {/* Absolute inside the fixed bar: the page keeps its height, so a hero
            sized to the viewport never shifts when the search opens. */}
        <div
          className={`absolute inset-x-0 top-full border-t-2 border-brand-black bg-brand-white ${
            showPanel ? 'block' : 'hidden'
          } max-h-[calc(100svh-66px)] overflow-y-auto md:max-h-[min(70svh,560px)]`}
        >
          <div className="mx-auto w-full max-w-[1360px] px-6 py-6 md:px-10">
            <p className="mb-4 font-mono text-breadcrumbs text-brand-muted">{hint ?? labels.hint}</p>

            {loading ? <Loader active /> : null}

            {!loading && results.length ? (
              <ul id={listboxId} role="listbox" aria-label={placeholder} className="list-none p-0">
                {results.map((entry, i) => (
                  <li
                    key={entry.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={activeIndex === i}
                    onMouseEnter={() => setActiveIndex(i)}
                    /* mousedown, not click: click fires after blur, by which
                       point the panel has already closed under the pointer. */
                    onMouseDown={(e) => {
                      e.preventDefault();
                      go(entry);
                    }}
                    className={`cursor-pointer border-b border-brand-line-muted py-3 ${
                      activeIndex === i ? 'bg-brand-accent-blue' : ''
                    }`}
                  >
                    <span className="block font-serif text-h3-mobile md:text-h3-desktop">
                      {entry.name}
                    </span>
                    {entry.meta ? (
                      <span className="mt-1 block font-mono text-breadcrumbs text-brand-muted">
                        {entry.meta}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}

            {!loading && !results.length ? (
              <Nothing
                title={labels.none}
                text={
                  isUa
                    ? 'Спробуйте інше слово або натисніть Enter, щоб шукати в усьому каталозі.'
                    : 'Try another keyword, or press Enter to search the whole catalogue.'
                }
              />
            ) : null}
          </div>
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {loading ? '' : results.length ? labels.results(results.length) : labels.none}
      </span>
    </div>
  );
}

export default SearchOverlayV4;
