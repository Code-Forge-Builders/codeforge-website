import { forwardRef } from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  resize?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, resize, id, className, ...rest }: TextareaProps, ref) => {
  return <div className={`flex flex-col gap-2 ${className}`}>
    <label htmlFor={id}>{label}</label>
    <textarea ref={ref} id={id} className={`px-2 py-1 rounded-sm bg-zinc-800 text-white ${resize ? 'resize' : 'resize-none'}`} {...rest} />
  </div>
})

Textarea.displayName = 'Textarea'

export default Textarea
