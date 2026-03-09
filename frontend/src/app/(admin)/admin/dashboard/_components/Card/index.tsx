export default function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`w-full p-6 bg-white rounded-lg shadow-lg ${className ?? ""}`}>
    {children}
  </div>
}