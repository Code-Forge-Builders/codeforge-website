"use client"
import Table, { Column } from "../_components/Table"
import { copy } from "@/utils/copy"
import { Inquiries, InquiriesResponseBody } from "./getInquiries"
import { IoCopyOutline } from "react-icons/io5";
import { parsePhoneNumber } from "libphonenumber-js/min";
import { useToast } from "@/components/Toast/ToastContext"
import { useSearchParams } from "next/navigation";
import { FaPhone, FaPlay } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { apiHttpClient } from "@/lib/httpClient";

interface InquiriesTableProps {
  result: InquiriesResponseBody
}

const InquiriesStates = [
  "Open",
  "Attempting Contact",
  "Contacted",
  "Contact Failed",
  "Scheduled Meeting",
  "Discovery",
  "In progress",
  "Cancelled",
  "Resolved",
]

export function InquiriesTable({ result }: InquiriesTableProps) {
  const { showToast } = useToast()
  const searchParams = useSearchParams()

  const [currentResult, setCurrentResult] = useState<InquiriesResponseBody>(result)

  useEffect(() => {
    setCurrentResult(result)
  }, [result])

  const handleStartContact = useCallback((inquiryId: string) => {
    apiHttpClient.patch(`/inquiries/${inquiryId}/contact-customer`, {
      credentials: "include",
    })
    .then(() => {
      apiHttpClient.get<InquiriesResponseBody>(`/inquiries?${new URLSearchParams(searchParams.toString()).toString()}`, {
        credentials: "include",
      })
      .then((res) => {
        setCurrentResult(res)
      })
      .catch((err) => {
        showToast({
          message: "Failed to get inquiries",
          type: "error"
        })
      })

      showToast({
        message: "Inquiry customer contacted successfully",
        type: "success"
      })
    })
    .catch((err) => {
      showToast({
        message: "Failed to contact inquiry customer",
        type: "error"
      })
    })
  }, [showToast])

  const InquiriesColumns: Column<any>[] = [
    {
      key: "customer_name",
      label: "Customer Name"
    },
    {
      key: "customer_email",
      label: "Customer Email",
      render: (value) => {
        return <div className="flex flex-row gap-2 items-center">
          <span className="px-4 py-2 bg-zinc-300 rounded-full text-zinc-700">{value}</span>
          <button className="p-1 rounded-full cursor-pointer hover:bg-gray-900 hover:text-white" onClick={() => {
            copy(value.toString())
            showToast({
              message: "Copied email to clipboard",
              type: "success"
            })
          }}>
            <IoCopyOutline />
          </button>
        </div>
      }
    },
    {
      key: "customer_phone",
      label: "Customer Phone",
      render: (value) => {
        return <div className="flex flex-row gap-2 items-center">
          <span className="px-4 py-2 bg-zinc-300 rounded-full text-zinc-700">{parsePhoneNumber(value.toString()).format('INTERNATIONAL')}</span>
          <button className="p-1 rounded-full cursor-pointer hover:bg-gray-900 hover:text-white" onClick={() => {
            copy(parsePhoneNumber(value.toString()).format('INTERNATIONAL'))
            showToast({
              message: "Copied phone to clipboard",
              type: "success"
            })
          }}>
            <IoCopyOutline />
          </button>
        </div>
      }
    },
    {
      key: "state",
      label: "State",
      render: (value: string | number) => {
        const label = InquiriesStates[value as number]

        return (
          <span>
            {label}
          </span>
        )
      }
    },
    {
      key: "created_at",
      label: "Creation Date",
      render: (value: string | number) => {
        return new Date(value).toLocaleString()
      }
    },
    {
      key: "",
      label: "Actions",
      render: (_: any, row: Inquiries) => {
        const state = InquiriesStates[row.state as number]
        return <>
        {
          state === InquiriesStates[0] && (
            <div className="flex flex-row gap-2 items-center">
              <button className="p-2 rounded cursor-pointer hover:bg-gray-900 hover:text-white" onClick={() => handleStartContact(row.id)}>
                <FaPlay />
              </button>
            </div>
          )
        }
        </>
      }

    }
  ]

  return <Table columns={InquiriesColumns} data={currentResult.inquiries} totalRows={currentResult.total} pageSize={parseInt(searchParams.get('page_size') ?? '15') ?? currentResult.page_size} page={ parseInt(searchParams.get('page') ?? '1') ?? currentResult.page} />
}
