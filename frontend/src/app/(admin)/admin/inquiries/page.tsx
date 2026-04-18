import Card from "../dashboard/_components/Card"
import { getInquiries, getInquiriesCountByState, IGetInquiriesPayload } from "./getInquiries"
import { InquiriesTable } from "./InquiriesTable"
import SearchForm from "./_components/SearchForm"
import AdvancedFilters from "./_components/AdvancedFilters"
import { dateInputToEndIso, dateInputToStartIso } from "@/utils/date"

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<IGetInquiriesPayload> }) {
  const lastThirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const today = new Date().toISOString().split("T")[0]
  const { search, state, start_date, end_date, page, page_size, order_by, order } = await searchParams

  const payload: IGetInquiriesPayload = {}

  if (search) {
    payload.search = search
  }
  if (start_date) {
    payload.start_date = typeof start_date === "string" ? start_date : start_date[0]
  }
  else {
    payload.start_date = dateInputToStartIso(lastThirtyDays)
  }
  if (end_date) {
    payload.end_date = typeof end_date === "string" ? end_date : end_date[0]
  }
  else {
    payload.end_date = dateInputToEndIso(today)
  }
  if (state !== undefined) {
    payload.state = Number(state)
  }
  else {
    payload.state = 0
  }
  if (page) {
    payload.page = page
  }
  if (page_size) {
    payload.page_size = page_size
  }
  if (order_by) {
    payload.order_by = order_by
  }
  if (order) {
    payload.order = order
  }

  const result = await getInquiries(payload)

  const inquiriesStates = await getInquiriesCountByState(payload)

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-row justify-between items-center gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Inquiries</h1>
          </div>
          <div className="flex flex-row gap-3 items-center flex-wrap justify-end">
            <SearchForm />
            <AdvancedFilters />
          </div>
        </div>
      </Card >
      <Card>
        <InquiriesTable result={result} inquiriesStates={inquiriesStates} />
      </Card>
    </div >
  )
}

