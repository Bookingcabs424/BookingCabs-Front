"use client";
import { useSelectedVehicle } from "../store/common";
import { useEffect, useState } from "react";

interface CancellationRule {
  id: number;
  cancellation_master_id: number;
  cancellation_type: string;
  cancellation: {
    name: string;
    description: string;
    order_by: number;
  };
  cancellation_value: number;
  days: string;
  hours: string;
  currency?: {
    fa_icon: string;
  };
  currency_id?: number;
  booking_type?: number;
  master_booking_type_id?: number;
  from_date?: string;
  to_date?: string | null;
  created_by?: number;
  created_date?: string;
  modified_by?: number | null;
  modified_date?: string;
  round_off?: number;
  status?: boolean;
  user_id?: number;
  vehicle_type?: number;
  ip?: string;
}
interface CancellationPolicyProps {
  fareRules?: Array<CancellationRule>; // Replace 'any' with a more specific type if available
}

export default function CancellationPolicy({
  fareRules,
}: CancellationPolicyProps) {
  const { booking } = useSelectedVehicle();
  // Type guard to check if cancellation rules exist

  const hasCancellationRules =
    (fareRules && fareRules?.length > 0) ||
    booking?.cancellation_fare_rule?.length > 0;
  return (
    <div className="w-full my-4 border border-gray-200 rounded-md p-4">
      <h2 className="text-md font-semibold mb-3">Cancellation Policy</h2>

      {hasCancellationRules ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="border border-gray-300 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700">
                  Policy
                </th> */}
                <th className="border border-gray-300 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700">
                  Time Frame
                </th>
                <th className="border border-gray-300 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody>
              {(fareRules && fareRules.length > 0
                ? fareRules
                : booking?.cancellation_fare_rule || []
              ).map((rule: CancellationRule, index: number) => {
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    {/* Description */}
                    {/* {JSON.stringify( rule)} */}
                    <td className="text-center border border-gray-300 px-4 py-2 text-xs sm:text-sm">
                      {rule.cancellation?.name}
                    </td>

                    {/* Timing Condition
                    <td className="border text-center border-gray-300 px-4 py-2 text-xs sm:text-sm">
                      {rule.days === "3-7"
                        ? "3-7 days before"
                        : rule.hours === "0" && rule.days === "0"
                        ? "Anytime"
                        : `${rule.days} days ${rule.hours} hours`}
                    </td> */}

                    {/* Cancellation Amount */}
                    <td className="border text-center border-gray-300 px-4 py-2 text-xs sm:text-sm font-medium">
                      <span
                        className={
                          rule.cancellation_value > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {rule.cancellation_type === "Percentage"
                          ? `${rule.cancellation_value}%`
                          : `₹${rule.cancellation_value}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md">
          No cancellation policy specified for this booking.
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <p>
          <strong>Note:</strong> Cancellation fees are calculated based on the
          total booking amount.
          {booking?.cancellation_fare_rule?.[0]?.currency_icon && (
            <span>
              {" "}
              All fees in{" "}
              {booking.cancellation_fare_rule[0].currency_icon
                .replace("fa fa-", "")
                .toUpperCase()}
              .
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
