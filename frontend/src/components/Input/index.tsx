import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, className, ...rest }: InputProps) => {
  return <div className={`flex flex-col gap-2 ${className}`}>
    <label htmlFor={id}>{label}</label>
    <input className="px-2 py-1 rounded-sm bg-zinc-800 text-white" id={id} {...rest} />
  </div>
});

Input.displayName = 'Input';

export default Input
