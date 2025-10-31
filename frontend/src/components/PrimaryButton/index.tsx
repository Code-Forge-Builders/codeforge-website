import { MouseEvent, useEffect, useState } from "react";
import { Spinner } from "../LoaderSpinner";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  width?: number
}

const PrimaryButton = ({ children, loading, onClick }: PrimaryButtonProps) => {
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
    className="bg-primary px-4 py-2 rounded cursor-pointer min-w-32"
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

export default PrimaryButton
