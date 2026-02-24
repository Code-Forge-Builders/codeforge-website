import { forwardRef } from "react"


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, className, ...rest }: InputProps, ref) => {
  return <div className={`flex flex-col gap-2 ${className}`}>
    <label htmlFor={id} className="text-zinc-400">{label}</label>
    <input ref={ref} className="px-3 py-2 rounded-sm border border-zinc-300" id={id} {...rest}/>
  </div>
})

Input.displayName = "Input";

export default Input

