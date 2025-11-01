'use client'
import { CountryData } from "@/components/ContactUsForm/fetchCountryData";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface CountrySelectProps {
  countries: CountryData[];
  value?: CountryData | null;
  onChange?: (country: CountryData) => void;
  dropdownMaxHeight?: number;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  countries,
  value,
  onChange,
  dropdownMaxHeight = 240
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CountryData | null>(value ?? countries.find(country => country.code == 'US') ?? null);
  const [maxHeight, setMaxHeight] = useState(dropdownMaxHeight);
  const [openDown, setOpenDown] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      const dropdownHeight = Math.min(dropdownMaxHeight, 300); // estimated

      const openDown = spaceBelow > dropdownHeight || spaceBelow > spaceAbove;

      const mxHght = openDown
        ? Math.min(dropdownMaxHeight, spaceBelow - 10)
        : Math.min(dropdownMaxHeight, spaceAbove - 10);

      setMaxHeight(mxHght);

      setOpenDown(openDown);
    }
  }, [isOpen, dropdownMaxHeight]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return countries.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.phoneCode.includes(term) ||
      c.code.toLowerCase().includes(term)
    );
  }, [countries, search]);

  const handleSelect = (country: CountryData) => {
    setSelected(country);
    onChange?.(country);
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      setHighlightedIndex(0);
      return;
    }

    if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev <= 0 ? filtered.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          handleSelect(filtered[highlightedIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const active = listRef.current.children[highlightedIndex] as HTMLElement;
      if (active) active.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  return <div className="flex flex-col relative" ref={wrapperRef}>
    <button ref={triggerRef} className="px-3 py-2 rounded-l-sm bg-zinc-800 text-white cursor-pointer border-r-1 border-zinc-700 flex gap-2 items-center" onClick={() => setIsOpen(open => !open)} type="button" onKeyDown={handleKeyDown}>
      {selected ? (
        <img width={25} src={selected.flagUrl} alt={selected.code} className="max-w-none h-[18px]" />
      ) : (
        <span className="placeholder">Select...</span>
      )}
      <span><FaChevronDown size={10} /></span>
    </button>

    {
      isOpen && (
        <div className={`flex flex-col absolute bg-zinc-800 border border-zinc-700 rounded shadow-md z-30 ${openDown ? 'top-full mt-1' : 'bottom-full mb-1'
          }`}
          style={{ maxHeight, overflowY: 'auto' }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setHighlightedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            className="px-2 py-1 bg-zinc-700 text-white rounded text-sm"
          />
          <ul ref={listRef} className="divide-y divide-zinc-700">
            {
              filtered.map((country, idx) => (
                <li key={country.code} onClick={() => handleSelect(country)} className={`flex flex-row gap-2 cursor-pointer px-2 py-1 ${idx === highlightedIndex ? 'bg-zinc-600' : 'hover:bg-zinc-700'} text-sm`}>
                  <div className="flex flex-row gap-2 items-center text-sm">
                    <img className="max-w-none h-[18px]" width={25} src={country.flagUrl} alt={country.code} />
                    <span>{country.name}</span>
                  </div>
                  <span className="text-sm">{country.phoneCode}</span>
                </li>
              ))
            }
          </ul>
        </div>
      )
    }
  </div>
}

export default CountrySelect;

