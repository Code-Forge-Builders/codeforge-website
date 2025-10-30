import { forwardRef } from "react"
import { CountryData } from "../ContactUsForm/fetchCountryData";
import CountrySelect from "./CountrySelect";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  countries: CountryData[]
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({ label, id, className, countries, ...rest }: PhoneInputProps) => {
  return <div className={`flex flex-col gap-2 ${className}`}>
    <label htmlFor={id}>{label}</label>
    <div className="flex flex-row">
      <CountrySelect countries={countries} />
      <input className="px-2 py-1 rounded-r-sm bg-zinc-800 text-white" id={id} {...rest} />
    </div>
  </div>
});

PhoneInput.displayName = 'Input';

export default PhoneInput
