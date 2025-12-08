"use client";

import { useEffect } from "react";
import Modal from "react-modal";
import { useGetTripDetails } from "../hooks/useCommon";
import { X, MapPinned } from "lucide-react";

interface TripDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinearyId: string;
}

const TripDetailModal = ({
  isOpen,
  onClose,
  itinearyId,
}: TripDetailModalProps) => {
  const {
    data: tripDetails,
    error,
    isLoading,
  } = useGetTripDetails(itinearyId || "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const nextApp = document.getElementById("__next");
      if (nextApp) {
        Modal.setAppElement(nextApp);
      }
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50"
      className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4 outline-none"
      contentLabel="Trip Details Modal"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPinned className="text-blue-600" size={20} />
            <h2 className="text-[16px] font-semibold text-gray-800">
              Trip Details –{" "}
              <span className=" text-[16px] text-blue-600">#{itinearyId}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="text-center text-sm text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-[16px] text-red-500">
            Error loading trip details.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <Detail label="Days" value={tripDetails?.days || "N/A"} />
            <Detail label="Distance" value={`${tripDetails?.distance} km`} />
            <Detail label="Pickup Date" value={tripDetails?.pickup_date || "N/A"} />
            <Detail label="Drop Date" value={tripDetails?.drop_date || "N/A"}  />
            <Detail label="Pickup Time" value={tripDetails?.pickup_time || "N/A"} />
            <Detail label="Drop Time" value={tripDetails?.drop_time || "N/A"} />
            <Detail label="Pickup City" value={tripDetails?.pick_city_name || "N/A"} />
            <Detail label="Drop City" value={tripDetails?.drop_city_name || "N/A"} />
            <Detail
              label="Pickup Address"
              value={tripDetails?.pickup_address ||"N/A"}
              full
            />
            <Detail
              label="Drop Address"
              value={tripDetails?.drop_address || "N/A"}
              full
            />
            <Detail label="Duration" value={tripDetails?.duration || "N/A"} full />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[10px] bg-gray-200 hover:bg-gray-300 text-sm rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};


const Detail = ({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string | undefined;
  full?: boolean;
}) => (
  <div className={full ? "col-span-2" : ""}>
    <span className="font-bold">{label}:</span>{" "}
    {value || <span className="text-gray-400">N/A</span>}
  </div>
);

export default TripDetailModal;
