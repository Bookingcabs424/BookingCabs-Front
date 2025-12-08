import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { LandmarkIcon } from "lucide-react";
import {
  useBankUserDetailAdd,
  useBankUserDetailUpdate,
  useBankUserDetailList,
} from "../hooks/useCommon";
import { useEffect } from "react";

const BankDetailSchema = z.object({
  bank_id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(1, "Bank Name is required"),
  ac_holder_name: z.string().min(1, "Account Holder Name is required"),
  ac_no: z.string().min(1, "Account No. is required"),
  branch: z.string().min(1, "Branch is required"),
  address: z.string().min(1, "Address is required"),
  ifsc_code: z.string().min(1, "IFSC Code is required"),
});

type BankDetail = z.infer<typeof BankDetailSchema>;
type FormValues = {
  bankDetails?: BankDetail[];
};
export default function ProfileBankForm() {
  const { data: bankDetailsData } = useBankUserDetailList();
  const { mutate: addBankDetail } = useBankUserDetailAdd();
  const { mutate: updateBankDetail } = useBankUserDetailUpdate();

  // Extract your bank data correctly
  const data = bankDetailsData?.responseData?.response?.data?.bankAccount;

  const {
    register,
    handleSubmit,
    control,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      z.object({
        bankDetails: z.array(BankDetailSchema).optional(),
      })
    ),
    defaultValues: {
      bankDetails: [
        {
          name: "",
          ac_holder_name: "",
          ac_no: "",
          branch: "",
          address: "",
          ifsc_code: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bankDetails",
  });

  // Update form values when API data arrives
  useEffect(() => {
    if (data?.length) {
      reset({ bankDetails: data });
    }
  }, [data, reset]);
  const handleSave = (bank: any) => {
    if (bank.bank_id) {
      const { bank_id, ...payload } = bank;
      updateBankDetail({ id: bank_id, ...payload });
    } else {
      addBankDetail(bank);
    }
  };

  return (
    <div className="w-full bg-white flex flex-col gap-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 w-full">
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <LandmarkIcon className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-[16px] font-semibold text-gray-800">
              Bank Details
            </h3>
          </div>

          {fields.map((field, index) => (
            <form
              key={field.id}
              onSubmit={handleSubmit((formData) =>
                handleSave(formData.bankDetails[index])
              )}
              className="border border-gray-200 p-4 rounded-md space-y-3 relative"
            >
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}

              <input
                type="hidden"
                {...register(`bankDetails.${index}.bank_id`)}
              />

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    {...register(`bankDetails.${index}.name`)}
                    className="border border-gray-300 py-1 px-3 rounded-sm w-full text-[10px]"
                    placeholder="Enter Bank Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Account Holder Name
                  </label>
                  <input
                    {...register(`bankDetails.${index}.ac_holder_name`)}
                    className="border border-gray-300 py-1 px-3 rounded-sm w-full text-[10px]"
                    placeholder="Enter Account Holder Name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Account No.
                  </label>
                  <input
                    {...register(`bankDetails.${index}.ac_no`)}
                    className="border border-gray-300 py-1 px-3 rounded-sm w-full text-[10px]"
                    placeholder="Enter Account No."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    IFSC Code
                  </label>
                  <input
                    {...register(`bankDetails.${index}.ifsc_code`)}
                    className="border border-gray-300 py-1 px-3 rounded-sm w-full text-[10px]"
                    placeholder="Enter IFSC Code"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Branch
                  </label>
                  <input
                    {...register(`bankDetails.${index}.branch`)}
                    className="border border-gray-300 py-1 px-3 rounded-sm w-full text-[10px]"
                    placeholder="Enter Branch"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    {...register(`bankDetails.${index}.address`)}
                    className="border border-gray-300 py-1 px-3 rounded-sm w-full text-[10px]"
                    placeholder="Enter Address"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() =>
                    resetField(`bankDetails.${index}` as any, {
                      defaultValue: {
                        name: "",
                        ac_holder_name: "",
                        ac_no: "",
                        branch: "",
                        address: "",
                        ifsc_code: "",
                      },
                    })
                  }
                  className="text-[10px] py-1 px-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="text-[10px] py-1 px-3 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700"
                >
                  {field.bank_id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          ))}

          <button
            type="button"
            onClick={() =>
              append({
                name: "",
                ac_holder_name: "",
                ac_no: "",
                branch: "",
                address: "",
                ifsc_code: "",
              })
            }
            className="mt-4 text-[10px] py-1 px-3 border border-blue-500 rounded-md text-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            + Add Another Bank
          </button>
        </div>
      </div>
    </div>
  );
}
