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
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  return <div className="flex flex-col relative" ref={wrapperRef}>
    <button className="px-3 py-2 rounded-l-sm bg-zinc-800 text-white cursor-pointer border-r-1 border-zinc-700 flex gap-2 items-center" onClick={() => setIsOpen(open => !open)} type="button">
      {selected ? (
        <img width={25} src={selected.flagUrl} alt={selected.code} className="max-w-none h-[18px]" />
      ) : (
        <span className="placeholder">Select...</span>
      )}
      <span><FaChevronDown size={10} /></span>
    </button>

    {
      isOpen && (
        <div className="flex flex-col absolute top-[36px]">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            className="p-2 bg-zinc-700 text-white rounded"
          />
          <ul>
            {
              filtered.map(country => (
                <li key={country.code} onClick={() => handleSelect(country)}>
                  <div>
                    <img width={25} src={country.flagUrl} alt={country.code} />
                    <span>{country.name}</span>
                  </div>
                  <span>{country.phoneCode}</span>
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

