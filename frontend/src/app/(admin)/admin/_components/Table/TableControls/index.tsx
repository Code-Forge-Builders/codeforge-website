'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"


interface TableControlsProps {
  currentRows?: number
  totalRows?: number
  pageSize?: number
  page?: number
}

const PageSizes = [
  15,
  25,
  50,
  100
]

export default function TableControls({ currentRows, totalRows, page = 1, pageSize = 15 }: TableControlsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedPageSize, setSelectedPageSize] = useState(pageSize)

  useEffect(() => {
    setSelectedPageSize(pageSize)
  }, [pageSize])

  const handlePageSizeChange = useCallback((option: number) => {
    if (searchParams.get('page_size') !== option.toString()) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page_size', option.toString())
      router.push(`${pathname}?${params.toString()}`)
    }
  }, [pathname, router, searchParams])

  if (!totalRows) {
    return <></>
  }

  const pageAmount = Math.ceil(totalRows / pageSize)

  return <div className="flex flex-row justify-between p-2 gap-2">
    <span className="text-zinc-500">Showing {currentRows} of {totalRows} entries</span>
    <div className="flex flex-row gap-2 items-center">
      <div className="flex flex-row gap-2 items-center">
        <span className="text-zinc-500">Show</span>
        <select value={selectedPageSize} onChange={(event) => handlePageSizeChange(parseInt(event.target.value))} className="px-2 py-1 rounded-sm cursor-pointer border border-gray-900">
          {PageSizes.map((ps, idx) => (
            <option key={idx} value={ps}>{ps}</option>
          ))}
        </select>
        <span className="text-zinc-500">entries</span>
      </div>
      <div className="flex flex-row gap-2 ml-4">
        {Array.from({ length: pageAmount }).map((_, i) => {
          return <button className={`px-2 py-1 w-10 h-10 cursor-pointer rounded-sm border border-gray-900 ${page === (i + 1) ? 'bg-gray-900 text-white' : ''}`} key={i}>{i + 1}</button>
        })}
      </div>
    </div>
  </div >
}
