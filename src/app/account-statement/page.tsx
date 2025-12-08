"use client";
import React from "react";
import StatementOfAccounts from "../../components/StatementOfAccounts";
import UserAccountStatement from "../../components/UserAccountStatement";

const AccountStatement = () => {
  return (
    <div className="min-h-screen w-full bg-white rounded-md shadow-md p-6 dark:bg-white">
      <StatementOfAccounts />
      <UserAccountStatement />
    </div>
  );
};

export default AccountStatement;
