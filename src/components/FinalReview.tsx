import CancellationPolicy from "./CancellationPolicy";
import CarPickupDetails from "./CarPickupDetails";
import MeetingPoint from "./MeetingPoint";
import SightseeingSummaryPanel from "./SightseeingSummaryPanel";
import TravellerDetailsReview from "./TravellerDetailsReview";

interface FinalReviewProps {
  currStep: number;
  setCurrStep: React.Dispatch<React.SetStateAction<number>>;
}
export default function FinalReview({
  currStep,
  setCurrStep,
}: FinalReviewProps) {
  return (
    <>
      <CarPickupDetails isEdit={false} />
      <TravellerDetailsReview/>
      <SightseeingSummaryPanel isEdit={false} />
      <MeetingPoint />
      <CancellationPolicy />
      <div className="flex items-center justify-end">
        <button onClick={() => setCurrStep(4)} className="bg-[#dfad08] col-span-1 text-[12px] font-semibold w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition">
          Continue to Payment
        </button>
      </div>
    </>
  );
}
