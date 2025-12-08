import React, { useState } from "react";
import { UserRoundPlus, Plane, Hotel, User } from "lucide-react";
import UserRegistrationForm from "./UserRegistrationForm";

type Option = "personal" | "corporate";
type RegistrationOptionsProps = {
  internal: boolean;
};

const RegistrationOptions: React.FC<RegistrationOptionsProps> = ({
  internal = false,
}) => {
  const [selected, setSelected] = useState<Option | null>("personal");

  const renderForm = () => {
    switch (selected) {
      case "personal":
        return (
          <div className="mt-4 py-4 rounded">
            <UserRegistrationForm
              selected={selected}
              setSelected={setSelected}
              formName="Personal"
              typeId={1}
              isInternal={internal}
            />
          </div>
        );
      case "corporate":
        return (
          <div className="mt-4 py-4 rounded">
            <UserRegistrationForm
              selected={selected}
              setSelected={setSelected}
              formName="Corporate"
              typeId={4}
              isInternal={internal}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getButtonClasses = (option: Option, color: string) =>
    ` rounded flex items-center justify-center cursor-pointer gap-2 transition-colors ${
      selected === option ? color : "bg-[#dfad08] hover:" + color
    } py-3 px-2 md:p-4`;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2">
        <button
          onClick={() => setSelected("personal")}
          className={getButtonClasses("personal", "bg-[#bd942e]")}
        >
          <UserRoundPlus className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[12px] sm:text-sm font-[500]">Personal</span>
        </button>

        <button
          onClick={() => setSelected("corporate")}
          className={getButtonClasses("corporate", "bg-[#bd942e]")}
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[12px] sm:text-sm font-[500]">Vendor</span>
        </button>
      </div>

      {renderForm()}
    </div>
  );
};

export default RegistrationOptions;
