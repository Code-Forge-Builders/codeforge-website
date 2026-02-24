'use client'
import { Spinner } from "@/components/LoaderSpinner";
import { MouseEvent, useEffect, useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  width?: number
}

const Button = ({ children, loading, onClick, className }: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(loading !== undefined ? loading : false);

  useEffect(() => {
    setIsLoading(loading !== undefined ? loading : false)
  }, [loading])

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;

    // If onClick is not a promise, handle gracefully
    try {
      const result = onClick(e);
      setIsLoading(true);
      await result;
    } catch (err) {
      console.error('Button action failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return <button
    onClick={handleClick}
    className={`bg-primary text-white px-4 py-2 rounded cursor-pointer min-w-32 ${className}`}
  >
    {isLoading ? (
      <span className="flex items-center justify-center gap-2">
        <Spinner />
      </span>
    ) : (
      children
    )}
  </button>
}

export default Button