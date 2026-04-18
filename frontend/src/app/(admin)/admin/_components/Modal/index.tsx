import { FaTimes } from "react-icons/fa"

interface ModalProps {
  title?: string
  children: React.ReactNode
  onClose?: () => void
}

export default function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full relative max-w-md rounded-lg bg-white shadow-xl">
        {title ? <div className="flex flex-row justify-between items-center p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          {onClose ? <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 p-2 rounded cursor-pointer">
            <FaTimes />
          </button> : null}
        </div> : (
          onClose ? <button onClick={onClose} className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-700 p-2 rounded cursor-pointer">
            <FaTimes />
          </button> : null
        )}
        <div className="flex flex-col p-6">
          {children}
        </div>
      </div>
    </div>
  )
}