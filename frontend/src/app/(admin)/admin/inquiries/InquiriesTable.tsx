"use client"
import Table, { Column } from "../_components/Table"
import { copy } from "@/utils/copy"
import { InquiriesResponseBody } from "./getInquiries.ts"
import { IoCopyOutline } from "react-icons/io5";
import { parsePhoneNumber } from "libphonenumber-js/min";


interface InquiriesTableProps {
  result: InquiriesResponseBody
}

export function InquiriesTable({ result }: InquiriesTableProps) {
  const InquiriesColumns: Column<Inquiries>[] = [
    {
      key: "customer_name",
      label: "Customer Name"
    },
    {
      key: "customer_email",
      label: "Customer Email",
      render: (value: string) => {
        return <div className="flex flex-row gap-2 items-center">
                <span className="px-4 py-2 bg-zinc-300 rounded-full text-zinc-700">{value}</span>
                <button className="p-1 rounded cursor-pointer border border-gray-900 hover:bg-gray-900 hover:text-white" onClick={() => copy(value)}>
                  <IoCopyOutline />
               </button>
              </div>
      }
    },
    {
      key: "customer_phone",
      label: "Customer Phone",
      render: (value) => {
        return <span className="px-4 py-2 bg-zinc-300 rounded-full text-zinc-700">{parsePhoneNumber(value).format('INTERNATIONAL')}</span>
      }
    },
    {
      key: "state",
      label: "State"
    },
    {
      key: "created_at",
      label: "Creation Date",
      render: (value) => {
        return new Date(value).toLocaleString()
      }
    }
  ]

  return <Table columns={InquiriesColumns} data={result.inquiries} />
}
