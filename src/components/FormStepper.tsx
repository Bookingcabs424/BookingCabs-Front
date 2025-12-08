
"use client";

import { Fragment } from "react";

interface FormStepperProps {
  currStep: number;
  setCurrStep: (step: number) => void;
}

export default function FormStepper({
  currStep,
  setCurrStep,
}: FormStepperProps) {
  const steps = ["Pickup Details", 
    // "Add On",
    // "Review",
     "Payment"];

  return (
    <div className="flex items-center justify-evenly py-6 px-3 sm:px-6">
      {steps.map((step, idx) => (
        <Fragment key={idx}>
          <div className="flex flex-col items-center justify-center mt-3">
            <div
              onClick={() => {
                // if (idx + 1 < 4) {
                if (idx + 1 <= 2) {
                  setCurrStep(idx + 1);
                }
              }}
              key={step}
              className={` w-[max-content] px-3 py-1 rounded-full cursor-pointer ${
                idx + 1 <= currStep ? "bg-[#dfad08]" : "border border-[#dfad08]"
              }`}
            >
              {idx + 1}
            </div>
            <p className="text-[9px] text-gray-600 whitespace-nowrap sm:text-[12px]">{step}</p>
          </div>
          {idx + 1 < steps.length && (
            <div className={`border-t border-gray-200 w-full`} />
          )}
        </Fragment>
      ))}
    </div>
  );
}
