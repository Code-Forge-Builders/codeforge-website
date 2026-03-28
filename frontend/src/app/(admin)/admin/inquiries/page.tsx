import Card from "../dashboard/_components/Card"
import getInquiries, { IGetInquiriesPayload } from "./getInquiries"
import { InquiriesTable } from "./InquiriesTable"
import SearchForm from "./_components/SearchForm"


export default async function InquiriesPage({ searchParams }: { searchParams: Promise<IGetInquiriesPayload> }) {
  const { search } = await searchParams

  const result = await getInquiries({
    search,
  })

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

