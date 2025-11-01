'use client'
import { forwardRef, useState } from "react"
import { CountryData } from "../ContactUsForm/fetchCountryData";
import CountrySelect from "./CountrySelect";
import { maskGenericPhone } from "@/utils/phone";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  countries: CountryData[]
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({ label, id, className, countries, ...rest }: PhoneInputProps, ref) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | undefined>(countries.find(country => country.code === 'BR'))

  const prefix = selectedCountry?.phoneCode || '';

  return <div className={`flex flex-col gap-2 ${className}`}>
    <label htmlFor={id}>{label}</label>
    <div className="flex flex-row">
      <CountrySelect countries={countries} value={selectedCountry} onChange={setSelectedCountry} />
      <input type="tel" placeholder="+12029182132" defaultValue={prefix} ref={ref} onChange={(event) => {
        if (/^\+\d{1,}$/.test(event.target.value)) {
          const matched = countries.find(country => country.phoneCode === event.target.value);

          if (matched) {
            setSelectedCountry(matched)
          }
        }
        event.target.value = maskGenericPhone(event.target.value, prefix)
      }} className="px-2 py-1 rounded-r-sm bg-zinc-800 text-white w-full" id={id} {...rest} />
    </div>
  </div>
});

PhoneInput.displayName = 'Input';

export default PhoneInput
