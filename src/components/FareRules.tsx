export default function FareRules() {
  return (
    <>
      <h2 className="text-[14px] font-semibold mb-2">Fare Rules</h2>
      <hr className="border-t border-gray-300" />
      <h1 className="mt-2 text-[12px] font-semibold">Inclusions & Exclusions</h1>
      <h1 className="text-[12px] font-semibold">Inclusions</h1>
      <ul className="list-disc list-inside text-[10px]">
        <li>
          Distance Package 4Hrs - 40km Km for the exact Itinerary listed above
        </li>
        <li>No Route Deviation allowed Unless Listed in Itinerary GST</li>
      </ul>
      <h1 className="text-[12px] font-semibold mt-2">Exclusions</h1>
      <ul className="text-[10px] list-disc list-inside">
        <li>Toll Taxes (As Per Actual)</li>
        <li>Parking (As Per Actual)</li>
        <li>Night Pickup Allowance excluded</li>
        <li>Night Drop off Allowance excluded</li>
        <li>Peak Charges & Waiting Charges as per Tariff</li>
      </ul>

      <p className="text-[10px] my-2">
        Driver Allowance (Night Charges) Applicable. Vehicle Fare Rule: Approx
        Distance 4Hrs - 40km (As Per Quote).
        <br />
        Minimum Charged: ₹2000 (As per Min Distance)
        <br />
        Per Km Rate: ₹25
        <br />
        Per Hour Rate: ₹300
        <br />
        Driver Allowance: ₹300 (Per Day)
        <br />
        <strong className="my-2">Extra Charges:</strong>
        <br />
        • Distance: If you exceed 4Hrs - 40km, ₹25/km extra
        <br />
        • Time: Post 21:00 Hrs, extra ₹300 Driver Allowance applies
        <br />
        <strong>Note:</strong> One day = One calendar day (00:00 to 23:59).
        <br />
        Garage-to-garage calculation. AC may be off in hills.
        <br />
        If driving between 21:00–05:00, extra ₹300 Night Charges apply.
      </p>
    </>
  );
}
