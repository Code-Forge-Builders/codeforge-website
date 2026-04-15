"use client"
import Table, { Column } from "../_components/Table"
import { copy } from "@/utils/copy"
import { Inquiries, InquiriesResponseBody } from "./getInquiries"
import { IoCopyOutline } from "react-icons/io5";
import { parsePhoneNumber } from "libphonenumber-js/min";
import { useToast } from "@/components/Toast/ToastContext"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaCheck, FaCompass, FaPlay, FaWrench } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { apiHttpClient } from "@/lib/httpClient";
import ConfirmationModal from "../_components/ConfirmationModal";
import { FaArrowRotateLeft, FaCalendarCheck, FaX } from "react-icons/fa6";

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

interface TransitionAction {
  endpoint: string
  targetState: number
  confirmTitle: string
  confirmMessage: string
  confirmLabel: string
  successMessage: string
  errorMessage: string
  tooltip: string
}

const TransitionActionsByState: Record<number, TransitionAction[]> = {
  0: [
    {
      endpoint: "contact-customer",
      targetState: 1,
      confirmTitle: "Start inquiry?",
      confirmMessage: 'Are you sure you want to start this inquiry and move it to the "Attempting Contact" state?',
      confirmLabel: "Yes, start inquiry",
      successMessage: "Inquiry customer contacted successfully",
      errorMessage: "Failed to contact inquiry customer",
      tooltip: "Start inquiry"
    }
  ],
  1: [
    {
      endpoint: "mark-contacted",
      targetState: 2,
      confirmTitle: "Mark as contacted?",
      confirmMessage: 'Are you sure you want to move this inquiry to the "Contacted" state?',
      confirmLabel: "Yes, mark contacted",
      successMessage: "Inquiry marked as contacted successfully",
      errorMessage: "Failed to mark inquiry as contacted",
      tooltip: "Mark as contacted"
    },
    {
      endpoint: "mark-contact-failed",
      targetState: 3,
      confirmTitle: "Mark as contact failed?",
      confirmMessage: 'Are you sure you want to move this inquiry to the "Contact Failed" state?',
      confirmLabel: "Yes, mark failed",
      successMessage: "Inquiry marked as contact failed successfully",
      errorMessage: "Failed to mark inquiry as contact failed",
      tooltip: "Mark as contact failed"
    }
  ],
  2: [
    {
      endpoint: "schedule-meeting",
      targetState: 4,
      confirmTitle: "Schedule meeting?",
      confirmMessage: 'Are you sure you want to move this inquiry to the "Scheduled Meeting" state?',
      confirmLabel: "Yes, schedule meeting",
      successMessage: "Inquiry meeting scheduled successfully",
      errorMessage: "Failed to schedule inquiry meeting",
      tooltip: "Schedule meeting"
    },
    {
      endpoint: "cancel",
      targetState: 7,
      confirmTitle: "Cancel inquiry?",
      confirmMessage: "Are you sure you want to cancel this inquiry?",
      confirmLabel: "Yes, cancel inquiry",
      successMessage: "Inquiry cancelled successfully",
      errorMessage: "Failed to cancel inquiry",
      tooltip: "Cancel inquiry"
    }
  ],
  3: [
    {
      endpoint: "retry-contact",
      targetState: 1,
      confirmTitle: "Retry contact?",
      confirmMessage: 'Are you sure you want to move this inquiry back to the "Attempting Contact" state?',
      confirmLabel: "Yes, retry contact",
      successMessage: "Inquiry moved back to attempting contact successfully",
      errorMessage: "Failed to retry inquiry contact",
      tooltip: "Retry contact"
    },
    {
      endpoint: "cancel",
      targetState: 7,
      confirmTitle: "Cancel inquiry?",
      confirmMessage: "Are you sure you want to cancel this inquiry?",
      confirmLabel: "Yes, cancel inquiry",
      successMessage: "Inquiry cancelled successfully",
      errorMessage: "Failed to cancel inquiry",
      tooltip: "Cancel inquiry"
    }
  ],
  4: [
    {
      endpoint: "start-discovery",
      targetState: 5,
      confirmTitle: "Start discovery?",
      confirmMessage: 'Are you sure you want to move this inquiry to the "Discovery" state?',
      confirmLabel: "Yes, start discovery",
      successMessage: "Inquiry moved to discovery successfully",
      errorMessage: "Failed to start inquiry discovery",
      tooltip: "Start discovery"
    },
    {
      endpoint: "cancel",
      targetState: 7,
      confirmTitle: "Cancel inquiry?",
      confirmMessage: "Are you sure you want to cancel this inquiry?",
      confirmLabel: "Yes, cancel inquiry",
      successMessage: "Inquiry cancelled successfully",
      errorMessage: "Failed to cancel inquiry",
      tooltip: "Cancel inquiry"
    }
  ],
  5: [
    {
      endpoint: "start-implementation",
      targetState: 6,
      confirmTitle: "Start implementation?",
      confirmMessage: 'Are you sure you want to move this inquiry to the "In progress" state?',
      confirmLabel: "Yes, start implementation",
      successMessage: "Inquiry moved to in progress successfully",
      errorMessage: "Failed to start inquiry implementation",
      tooltip: "Start implementation"
    },
    {
      endpoint: "cancel",
      targetState: 7,
      confirmTitle: "Cancel inquiry?",
      confirmMessage: "Are you sure you want to cancel this inquiry?",
      confirmLabel: "Yes, cancel inquiry",
      successMessage: "Inquiry cancelled successfully",
      errorMessage: "Failed to cancel inquiry",
      tooltip: "Cancel inquiry"
    }
  ],
  6: [
    {
      endpoint: "finish",
      targetState: 8,
      confirmTitle: "Finish inquiry?",
      confirmMessage: 'Are you sure you want to move this inquiry to the "Resolved" state?',
      confirmLabel: "Yes, finish inquiry",
      successMessage: "Inquiry finished successfully",
      errorMessage: "Failed to finish inquiry",
      tooltip: "Finish inquiry"
    },
    {
      endpoint: "cancel",
      targetState: 7,
      confirmTitle: "Cancel inquiry?",
      confirmMessage: "Are you sure you want to cancel this inquiry?",
      confirmLabel: "Yes, cancel inquiry",
      successMessage: "Inquiry cancelled successfully",
      errorMessage: "Failed to cancel inquiry",
      tooltip: "Cancel inquiry"
    }
  ]
}

const getActionLabel = (action: TransitionAction) => {
  if (action.endpoint === "contact-customer") return <FaPlay />
  if (action.endpoint === "mark-contacted" || action.endpoint === "finish") return <FaCheck/>
  if (action.endpoint === "mark-contact-failed" || action.endpoint === "cancel" ) return <FaX />
  if (action.endpoint === "schedule-meeting") return <FaCalendarCheck />
  if (action.endpoint === "retry-contact") return <FaArrowRotateLeft />
  if (action.endpoint === "start-discovery") return <FaCompass />
  if (action.endpoint === "start-implementation") return <FaWrench />
  return action.tooltip // defaults to its tooltip
}

export function InquiriesTable({ result }: InquiriesTableProps) {
  const { showToast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [currentResult, setCurrentResult] = useState<InquiriesResponseBody>(result)
  const [pendingTransition, setPendingTransition] = useState<{ inquiryId: string, action: TransitionAction } | null>(null)
  const currentState: Number = searchParams.get("state") ? parseInt(searchParams.get("state") ?? '0') : 0

  const handleStateTabClick = useCallback((state: number | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (state === null) {
      params.delete("state")
    } else {
      params.set("state", `${state}`)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])

  useEffect(() => {
    setCurrentResult(result)
  }, [result])

  const handleStateTransition = useCallback((inquiryId: string, action: TransitionAction) => {
    apiHttpClient.patch(`/inquiries/${inquiryId}/${action.endpoint}`, {
      credentials: "include",
    })
    .then(() => {
      const newState = action.targetState;

      const params = new URLSearchParams(searchParams.toString())
      params.set("state", `${newState}`)
      router.push(`${pathname}?${params.toString()}`)

      showToast({
        message: action.successMessage,
        type: "success"
      })
    })
    .catch((_err) => {
      showToast({
        message: action.errorMessage,
        type: "error"
      })
    })
  }, [pathname, router, searchParams, showToast])

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
        const actions = TransitionActionsByState[row.state as number] ?? []

        if (actions.length === 0) {
          return null
        }

        return <>
          <div className="flex flex-row gap-2 items-center">
            {actions.map((action) => (
              <button
                key={`${row.id}-${action.endpoint}`}
                className="p-2 rounded cursor-pointer hover:bg-gray-900 hover:text-white"
                onClick={() => setPendingTransition({ inquiryId: row.id, action })}
                title={action.tooltip}
              >
                {getActionLabel(action)}
              </button>
            ))}
          </div>
        </>
      }

    }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center overflow-x-auto border-b border-zinc-200">
        {InquiriesStates.map((stateLabel, index) => (
          <button
            key={stateLabel}
            className={`px-4 py-2 rounded-t-sm whitespace-nowrap cursor-pointer ${currentState === index ? "bg-gray-900 text-white" : "text-zinc-700 hover:bg-zinc-200 bg-zinc-100"}`}
            onClick={() => handleStateTabClick(index)}
          >
            {stateLabel}
          </button>
        ))}
      </div>
      <Table columns={InquiriesColumns} data={currentResult.inquiries} totalRows={currentResult.total} pageSize={parseInt(searchParams.get('page_size') ?? '15') ?? currentResult.page_size} page={ parseInt(searchParams.get('page') ?? '1') ?? currentResult.page} />

      <ConfirmationModal
        isOpen={!!pendingTransition}
        title={pendingTransition?.action.confirmTitle ?? "Confirm action"}
        message={pendingTransition?.action.confirmMessage ?? "Are you sure you want to continue?"}
        confirmLabel={pendingTransition?.action.confirmLabel ?? "Confirm"}
        cancelLabel="Cancel"
        onCancel={() => setPendingTransition(null)}
        onConfirm={() => {
          if (!pendingTransition) return
          handleStateTransition(pendingTransition.inquiryId, pendingTransition.action)
          setPendingTransition(null)
        }}
      />
    </div>
  )
}
