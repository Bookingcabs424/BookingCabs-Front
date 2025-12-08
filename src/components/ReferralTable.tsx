"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Gift } from "lucide-react";
import BookingTable from "./common/Table";
import { useGetReferralPoints } from "../hooks/useCommon";

interface ReferenceEntry {
  sno: number;
  date: string;
  refCode: string;
  refTo: string;
  amount: number;
  expiresOn: string;
}

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: any;
  render?: (value: any, row?: any) => React.ReactNode;
  hidden?: boolean;
}

const walletPointscolumns: Column[] = [
  { key: "sno", header: "S.No", sortable: true },
  { key: "date", header: "Date", sortable: true },
  { key: "refCode", header: "Ref.Code", sortable: true },
  { key: "refTo", header: "Reffered To", sortable: true },
  { key: "amount", header: "Amount", sortable: true },
  { key: "expiresOn", header: "Expires On", sortable: true },
];

export default function ReferralTable() {
  
  const { data: referralData } = useGetReferralPoints();

  const formatDate = (date: Date): string =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  const referenceData: ReferenceEntry[] =
    referralData?.userReferralHistory?.map(
      (item: any, index: number): ReferenceEntry => {
        const createdDate = item.created ? new Date(item.created) : new Date();
        const expiresOnDate = new Date(createdDate);
        expiresOnDate.setFullYear(createdDate.getFullYear() + 1);

        return {
          sno: item.id ?? index + 1,
          date: formatDate(createdDate),
          refCode: referralData.referral_key,
          refTo: "",
          amount: item.referer_point || 0,
          expiresOn: formatDate(expiresOnDate), // formatted string
        };
      }
    ) || [];
  return (
    <div className="sm:p-4">
      <BookingTable
        data={referenceData}
        columns={walletPointscolumns}
        heading={[
          { heading: "(Referral ID) Wallet Point" },
          { price: `₹ ${referralData?.referral_point || 0}` },
        ]}
        searchable={false}
        filterable={false}
        sortable={false}
      />
    </div>
  );
}
