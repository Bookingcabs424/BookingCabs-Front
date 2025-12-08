"use client";

import { Loader2 } from "lucide-react"; 
import React from "react";

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );
}
