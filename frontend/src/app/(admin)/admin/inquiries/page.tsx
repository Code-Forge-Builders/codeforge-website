import Card from "../dashboard/_components/Card"
import getInquiries, { Inquiries } from "./getInquiries.ts"
import { InquiriesTable } from "./InquiriesTable.tsx"


export default async function InquiriesPage() {
  const result = await getInquiries()

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Inquiries</h1>
        </div>
      </Card>
      <Card>
        <InquiriesTable result={result}/>
      </Card>
    </div>
  )
}

