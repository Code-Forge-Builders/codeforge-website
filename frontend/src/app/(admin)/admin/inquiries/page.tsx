import Card from "../dashboard/_components/Card"
import getInquiries, { IGetInquiriesPayload } from "./getInquiries"
import { InquiriesTable } from "./InquiriesTable"
import SearchForm from "./_components/SearchForm"


export default async function InquiriesPage({ searchParams }: { searchParams: Promise<IGetInquiriesPayload> }) {
  const { search, page, page_size, order_by, order } = await searchParams

  const payload: IGetInquiriesPayload = {}

  if (search) {
    payload.search = search
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

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Inquiries</h1>
          </div>
          <SearchForm />
        </div>
      </Card >
      <Card>
        <InquiriesTable result={result} />
      </Card>
    </div >
  )
}

