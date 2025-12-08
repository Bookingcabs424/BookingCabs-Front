"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Eye, NotebookPen, Share2, Trash, X } from "lucide-react";
import PrintQuotationModal from "./PrintQuotationModal"; 
import PrintQuotationModal2 from "./PrintQuotationModal2";
import SendEmailModal from "./SendEmailModal"; 
import SendWhatsappModal from "./SendWhatsappModal"; 
import { useAuth } from "@/store/auth";
import { useGetCompany, useQuotationEmail } from "@/hooks/useCommon";
import SendSMSModal from "./SendSMSModal";

type Booking = {
  sno: number;
  id?: number;
  itineraryId: string;
  bookingId: string;
  pickupTime: string;
  pickupDate: string;
  vehicle: string;
  client: string;
  depature: string;
  drop: string;
  booking_type: string;
  partner: string;
  status: string;
  action: string;
  clientname: string;
  client_mobile: string;
  domain_name: string;
  device_type: string;
  departure: string;
};

interface BookingHistoryTableProps {
  data?: Booking[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  total?: number;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  pageSize?: number;
  nextPage?: () => void;
  prevPage?: () => void;
  goToPage?: (page: number) => void;
  setPageSize?: (size: number) => void;
  deleteQuotationHandler?: (id: number) => void;
}


export default function BookingHistoryTable({
  data,
  pagination,
  total,
  page = 1,
  setPage,            
  pageSize = 10,
  nextPage,
  prevPage,
  goToPage,
  setPageSize,
  deleteQuotationHandler,    
}: BookingHistoryTableProps) {


  const [selected, setSelected] = useState<any>(null);
  const [openModal, setOpenModal] = useState("");
  const [selectedRow, setSelectedRow] = useState<Booking | null>();
  const shareRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showPrice, setShowPrice] = useState(true);
 const {mutate}= useQuotationEmail()
  const channels = ["email", "whatsapp", "sms"] as const;
  type Channel = (typeof channels)[number];

  const [checkedChannels, setCheckedChannels] = useState<
    Record<Channel | "showPrice", boolean>
  >({
    email: false,
    whatsapp: false,
    sms: false,
    showPrice: false,
  });

  const [selectedTemplates, setSelectedTemplates] = useState<
    Record<Channel, string>
  >({
    email: "",
    whatsapp: "",
    sms: "",
  });

  const handleCheckboxChange = (channel: Channel | "showPrice") => {
    setCheckedChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));

    if (checkedChannels[channel] && channel !== "showPrice") {
      setSelectedTemplates((prev) => ({
        ...prev,
        [channel as Channel]: "",
      }));
    }
  };

  const handleTemplateSelect = (channel: Channel, template: string) => {
    setSelectedTemplates((prev) => ({
      ...prev,
      [channel]: template,
    }));
  };

  const columns: ColumnDef<Booking>[] = [
    { accessorKey: "itinerary_id", header: "Itinerary ID" },
    { accessorKey: "id", header: "Booking ID" },
    { accessorKey: "ordertime", header: "Pickup Time" },
    {
      accessorKey: "vehicle",
      header: "Vehicle",
      cell: ({ row }) => (
        <span className="">
          {row.original.vehicle}
          <br />
          {row.original.booking_type}
        </span>
      ),
    },
    {
      accessorKey: "clientname",
      header: "Client",
      cell: ({ row }) => (
        <span>
          {row.original.clientname}
          <br />
          {row.original.client_mobile}
        </span>
      ),
    },
    {
      accessorKey: "partner",
      header: "Partner",
      cell: ({ row }) => (
        <span>
          {row.original.domain_name}
          <br />( {row.original.device_type || "undefined"})
        </span>
      ),
    },
    {
      accessorKey: "departure",
      header: "Departure",
      cell: ({ row }) => <span>{row.original.departure.slice(0, 20)}...</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusClasses =
          status === "Confirmed"
            ? "bg-green-100 text-green-800"
            : status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-700";

        return (
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-[12px] font-[500] ${statusClasses}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <>
          <button
            className="text-blue-600 outline-none underline hover:text-blue-800 cursor-pointer"
            onClick={() => {
              setSelected(row.original);
              setOpenModal("quotation");
            }}
          >
            <Eye size={16} />
          </button>

          <button
            className="text-green-600 outline-none underline hover:text-green-800 cursor-pointer mx-2"
            onClick={() => {
              setSelected(row.original);
              setOpenModal("quotation2");
            }}
          >
            <Eye size={16} />
          </button>
          <button className="text-red-600 underline hover:text-red-800 cursor-pointer">
            <Trash size={16} />
          </button>

          <input
            type="checkbox"
            checked={selectedRow?.id == row?.original?.id}
            onChange={(e) => {
              const isChecked = e.target.checked;
              if (isChecked) {
                setSelectedRow(row.original);
                setSelected(row.original);
              } else {
                setSelectedRow(null);
              }
            }}
            className="border border-gray-300 outline-none mx-2 cursor-pointer"
          />
        </>
      ),
    },
  ];

  const table = useReactTable({
    data: data ?? [],   
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil((total ?? data.length) / pageSize);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const {user}=useAuth()
  console.log({user})
  const { data: company, refetch } = useGetCompany({id:user?.company_id});
  useEffect(() => {
    console.log({selected})
    
  }, [selected]);
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl  overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <NotebookPen className="w-5 h-5 text-green-600" />
            Recent Quotations
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Total: {total ?? data.length}
            </span>
            {selectedRow?.id && (
              <>
                <div className="relative" ref={shareRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-blue-400 px-3 py-1 text-[12px] rounded-md text-white hover:bg-blue-500 outline-none cursor-pointer"
                  >
                    Share
                  </button>

                  {isOpen && (
                    <div className="absolute top-full right-0">
                      <div className="bg-white w-[450px] h-[240px] shadow-md border border-gray-100 px-4 py-5">
                        <div className="grid grid-cols-4 gap-4 items-center text-[12px]">
                          <div className="font-semibold">Channel</div>
                          <div className="font-semibold">Template 1</div>
                          <div className="font-semibold">Template 2</div>
                          <div className="font-semibold">Share</div>

                          {channels.map((channel) => (
                            <React.Fragment key={channel}>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="cursor-pointer"
                                  checked={checkedChannels[channel]}
                                  onChange={() => handleCheckboxChange(channel)}
                                />
                                <label className="capitalize">{channel}</label>
                              </div>

                              <div className="flex items-center gap-1">
                                <input
                                  type="radio"
                                  name={`${channel}Template`}
                                  disabled={!checkedChannels[channel]}
                                  checked={
                                    selectedTemplates[channel] === "template1"
                                  }
                                  onChange={() =>
                                    handleTemplateSelect(channel, "template1")
                                  }
                                />
                                <label>Template 1</label>
                              </div>

                              <div className="flex items-center gap-1">
                                <input
                                  type="radio"
                                  name={`${channel}Template`}
                                  disabled={!checkedChannels[channel]}
                                  checked={
                                    selectedTemplates[channel] === "template2"
                                  }
                                  onChange={() =>
                                    handleTemplateSelect(channel, "template2")
                                  }
                                />
                                <label>Template 2</label>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  className={`${
                                    checkedChannels[channel] &&
                                    selectedTemplates[channel] !== ""
                                      ? " cursor-pointer"
                                      : " cursor-not-allowed"
                                  } rounded text-blue-500 hover:text-blue-600`}
                                  disabled={
                                    !checkedChannels[channel] ||
                                    selectedTemplates[channel] === ""
                                  }
                                  onClick={() =>
                                    setOpenModal(
                                      selectedTemplates[channel] === "template1"
                                        ? "quotation"
                                        : "quotation2"
                                    )
                                  }
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  className={`${
                                    checkedChannels[channel] &&
                                    selectedTemplates[channel] !== ""
                                      ? "cursor-pointer"
                                      : "cursor-not-allowed"
                                  } text-[12px] rounded text-green-500 hover:text-green-600`}
                                  disabled={
                                    !checkedChannels[channel] ||
                                    selectedTemplates[channel] === ""
                                  }
                                  onClick={() =>
                                    checkedChannels[channel] == true &&
                                    setOpenModal(channel)
                                  }
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>
                              </div>
                            </React.Fragment>
                          ))}

                          <div className="flex items-center gap-2 mt-3">
                            <input
                              defaultChecked={showPrice}
                              onChange={() => setShowPrice(!showPrice)}
                              type="checkbox"
                              className="cursor-pointer"
                            />
                            <label>Show Price</label>
                          </div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>

                        <button
                          onClick={() => {
                            // Find the first checked channel
                            const checkedChannel = channels.find(
                              (ch) => checkedChannels[ch]
                            );
                            if (checkedChannel) {
                              setOpenModal(
                                selectedTemplates[checkedChannel] ===
                                  "template1"
                                  ? "quotation"
                                  : "quotation2"
                              );
                            }
                          }}
                          className="w-full mt-2 text-[12px] bg-blue-400 font-sm text-center py-1 cursor-pointer font-[500] hover:bg-blue-500 rounded-sm"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700 font-semibold">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-3 text-left whitespace-nowrap font-sm text-[12px]"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 py-2 whitespace-nowrap text-gray-700 font-sm text-[12px]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(nextPage || prevPage) && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 text-[12px] rounded hover:bg-gray-300 cursor-pointer disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-[12px]">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-200 text-[12px] rounded hover:bg-gray-300 cursor-pointer disabled:opacity-50"
              >
                Next
              </button>
            </div>

            {/* Jump to page */}
            {goToPage && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Jump to:</label>
                <select
                  value={page}
                  onChange={(e) => goToPage(Number(e.target.value))}
                  className="px-2 py-1 border rounded"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            {/* Page size selector */}
            {setPageSize && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Rows:</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 outline-none text-[12px] rounded"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>
      {openModal == "quotation" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#00000090] bg-opacity-5">
          <div className="relative w-full max-w-xl bg-white mt-20 p-4 max-h-[80%] overflow-y-auto">
            <div
              onClick={() => setOpenModal("")}
              className="flex justify-end mb-2"
            >
              <button className="float-right cursor-pointer">
                <X />
              </button>
            </div>
            <PrintQuotationModal data={selected} />
          </div>
        </div>
      )}

      {openModal == "quotation2" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#00000090] bg-opacity-5">
          <div className="relative w-full max-w-xl bg-white mt-20 p-4 max-h-[80%] overflow-y-auto">
            <div
              onClick={() => setOpenModal("")}
              className="flex justify-end mb-2"
            >
              <button className="float-right cursor-pointer">
                <X />
              </button>
            </div>
            <PrintQuotationModal2 data={selected} showPrice={showPrice} />
          </div>
        </div>
      )}

      {openModal === "email" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#00000090] bg-opacity-5">
          <div className="relative w-full max-w-xl bg-white mt-20 p-4 max-h-[80%] overflow-y-auto">
            <div
              onClick={() => setOpenModal("")}
              className="flex justify-end mb-2"
            >
              <button className="float-right cursor-pointer">
                <X />
              </button>
            </div>
            <SendEmailModal type={"quotation"} id={selected?.booking_id} selected={selected} setOpenModal={setOpenModal}/>
          </div>
        </div>
      )}

      {openModal === "whatsapp" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#00000090] bg-opacity-5">
          <div className="relative w-full max-w-xl bg-white mt-20 p-4 max-h-[80%] overflow-y-auto">
            <div
              onClick={() => setOpenModal("")}
              className="flex justify-end mb-2"
            >
              <button className="float-right cursor-pointer">
                <X />
              </button>
            </div>
            <SendWhatsappModal />
          </div>
        </div>
      )}

      {openModal === "sms" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#00000090] bg-opacity-5">
          <div className="relative w-full max-w-xl bg-white mt-20 p-4 max-h-[80%] overflow-y-auto">
            <div
              onClick={() => setOpenModal("")}
              className="flex justify-end mb-2"
            >
              <button className="float-right cursor-pointer">
                <X />
              </button>
            </div>
            <SendSMSModal selected={selected} />
          </div>
        </div>
      )}
    </div>
  );
}
