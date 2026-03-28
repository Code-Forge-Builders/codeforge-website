'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export default function SearchForm() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return <form>
    <div className=" flex flex-row border border-zinc-300 rounded-lg">
      <input
        name="search"
        className="px-4 py-2 min-w-90 focus:min-w-120 transition-all ease-in-out delay-300"
        placeholder="Search"
        defaultValue={searchParams.get("search") ?? ''}
        autoFocus={searchParams.get('search') !== '' && searchParams.get('search') !== null}
      />
      <button className="px-4 py-2 cursor-pointer border-l-1 border-zinc-300" type="submit"><FaSearch /></button>
    </div>
  </form>
}
