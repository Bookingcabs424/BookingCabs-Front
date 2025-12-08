"use client";

import React, { useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { CreditCard } from "lucide-react"; // Lucide icon
import {
  useGetUserCreditTrancations,
  useGetUserWalletBalance,
} from "../hooks/useCommon";
import { useAuth } from "../store/auth";
import BookingTable from "./common/Table";

interface Transaction {
  sno: number;
  date: string;
  bookingId: string;
  bookingType: string;
  creditLimit: number;
  bookingAmount: number;
  creditamount: number;
  debitamount: number;
  balance: number;
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
const columns: Column[] = [
  { key: "sno", header: "S.No", sortable: true },
  { key: "date", header: "Date", sortable: true },
  { key: "bookingId", header: "Bkg ID", sortable: true },
  { key: "bookingType", header: "Bkg Type", sortable: true },
  { key: "creditLimit", header: "Credit Limit", sortable: true },
  { key: "bookingAmount", header: "Bkg Amount", sortable: true },
  // { key: "creditamount", header: "Credit Amount", sortable: true },
  // { key: "debitamount", header: "Debit Amount", sortable: true },
  { key: "balance", header: "Balance", sortable: true },
];

export default function CreditBalanceTable() {
  const { user } = useAuth();
  const { mutate: creditLimitTransaction, data: creditLimitData } =
    useGetUserCreditTrancations();

  const { data: wallet } = useGetUserWalletBalance();

  // Call the API on mount
  useEffect(() => {
    if (user?.company_id && user?.id) {
      creditLimitTransaction({
        company_id: user.company_id,
        user_id: user.id,
      });
    }
  }, [user, creditLimitTransaction]);
  const transactions: Transaction[] = [];

  if (Array.isArray(creditLimitData) && creditLimitData.length > 0) {
    let currentBalance = creditLimitData[0].credit_limit_amount || 0;

    creditLimitData.forEach((item: any, index: number) => {
      const bookingAmount = item.booking_amount || 0;
      const balance = item.credit_balance ?? currentBalance - bookingAmount;

      transactions.push({
        sno: index + 1,
        date: item.from_date || "N/A",
        bookingId: item.reference_no || "N/A",
        bookingType: item.booking_type || "N/A",
        creditLimit: currentBalance,
        bookingAmount,
        creditamount: item.creditamount || 0,
        debitamount: item.debitamount || 0,
        balance,
      });

      currentBalance = balance;
    });
  }

  const finalBalance = transactions.length
    ? transactions[transactions.length - 1].balance
    : 0;

  localStorage.setItem("currentBalance", String(finalBalance));

  return (
    <div className="p-6">
      <BookingTable
        data={transactions}
        columns={columns}
        heading={[
          { heading: "Credit Balance" },
          { price: `₹ ${finalBalance}` },
        ]}
        searchable={false}
        filterable={false}
        sortable={false}
      />
    </div>
  );
}
