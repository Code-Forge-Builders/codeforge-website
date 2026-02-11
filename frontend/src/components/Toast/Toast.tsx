import { Toast as ToastType } from "./ToastContext";


export function Toast({ toast }: { toast: ToastType }) {
  const baseClasses =
    "pointer-events-auto w-fit max-w-sm rounded-lg px-4 py-3 text-sm text-white shadow-lg animate-in slide-in-from-right fade-in duration-300"

  const variantClasses =
    toast.type === "success"
      ? "bg-green-600"
      : toast.type === "error"
      ? "bg-red-600"
      : "bg-blue-600"

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      {toast.message}
    </div>
  )
}
