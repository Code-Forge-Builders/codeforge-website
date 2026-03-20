import Table, { Column } from "../_components/Table"
import Card from "../dashboard/_components/Card"

const InquiriesColumns: Column<any>[] = [
  
]

export default function Inquiries() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Inquiries</h1>
        </div>
      </Card>
      <Card>
        <Table  />
      </Card>
    </div>
  )
}

