import { Controller, useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo, useEffect } from "react";
import MultiSelect from "./MultiSelect";
import { useCity, useCountry } from "../store/common";
import { debounce } from "lodash";
import {
  useGetCityDataMutation,
  useGetWishlist,
  useRemoveWishlist,
  useUpdateWishlist,
  useAddWishlist,
} from "../hooks/useCommon";
import { toast } from "react-toastify";
import { FileCog, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../store/auth";

// Updated schema to handle multiple entries
const dutySchema = z.object({
  entries: z
    .array(
      z.object({
        duty_type: z.array(z.string()).min(1, "Duty Type is required"),
        city: z.array(z.string()).min(1, "Pref. City to Drive Cab is required"),
      })
    )
    .min(1, "At least one entry is required"),
});

const dutyType = [
  { id: "1", label: "Rental" },
  { id: "2", label: "City Taxi" },
  { id: "3", label: "Airport Transfer" },
  { id: "4", label: "Outstation" },
  { id: "5", label: "One Way" },
  { id: "6", label: "Activity" },
  { id: "7", label: "Transport Package" },
];

export type dutyData = z.infer<typeof dutySchema>;

export default function ProfileDutyForm() {
  const { user: authUser } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<dutyData>({
    resolver: zodResolver(dutySchema),
    defaultValues: {
      entries: [{ duty_type: [], city: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "entries",
  });

  const { mutate: getCityData } = useGetCityDataMutation();
  const { cityData } = useCity();

  // State for each row's city input and suggestions
  const [cityInputs, setCityInputs] = useState<string[]>([""]);
  const [showSuggestions, setShowSuggestions] = useState<boolean[]>([false]);
  const [selectedCitiesPerRow, setSelectedCitiesPerRow] = useState<any[][]>([
    [],
  ]);

  const { data, isLoading } = useGetWishlist(authUser?.id);
  const { mutate } = useAddWishlist();
  const { mutate: updateMutate } = useUpdateWishlist();

  // Initialize state arrays when fields change
  useEffect(() => {
    const currentLength = fields.length;
    setCityInputs((prev) => {
      const newInputs = [...prev];
      while (newInputs.length < currentLength) {
        newInputs.push("");
      }
      return newInputs.slice(0, currentLength);
    });

    setShowSuggestions((prev) => {
      const newSuggestions = [...prev];
      while (newSuggestions.length < currentLength) {
        newSuggestions.push(false);
      }
      return newSuggestions.slice(0, currentLength);
    });

    setSelectedCitiesPerRow((prev) => {
      const newSelected = [...prev];
      while (newSelected.length < currentLength) {
        newSelected.push([]);
      }
      return newSelected.slice(0, currentLength);
    });
  }, [fields.length]);

  useEffect(() => {
    if (data?.length > 0) {
      const packageIds = [
        ...new Set(data.map((item: any) => String(item.package_id))),
      ];
      const cityNames = [
        ...new Set(data.map((item: any) => String(item.name))),
      ];

      const selectedDutyTypes = packageIds
        .map((id) => {
          const match = dutyType.find((d) => d.id === id);
          return match ? match.label : null;
        })
        .filter(Boolean);
      setValue("entries.0.duty_type", selectedDutyTypes);
      setValue("entries.0.city", cityNames as any);

      const cityOptions = cityNames.map((name) => {
        const city = cityData?.find(
          (c: any) => c.name.toLowerCase() === String(name).toLowerCase()
        );
        return city
          ? {
              id: city.id,
              label: `${city.name} (${city.state_name}, ${city.country_code})`,
            }
          : { id: name, label: name };
      });

      setSelectedCitiesPerRow((prev) => {
        const updated = [...prev];
        updated[0] = cityOptions;
        return updated;
      });
    }
  }, [data, cityData, setValue]);

  const debouncedGetCity = useMemo(() => {
    return debounce((val: string) => {
      if (!val) return;
      getCityData(val);
    }, 500);
  }, [getCityData]);

  const handleCityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number
  ) => {
    const value = e.target.value;
    setCityInputs((prev) => {
      const updated = [...prev];
      updated[rowIndex] = value;
      return updated;
    });

    setShowSuggestions((prev) => {
      const updated = [...prev];
      updated[rowIndex] = true;
      return updated;
    });

    debouncedGetCity(value);
  };

  const handleCitySelect = (label: string, id: string, rowIndex: number) => {
    const currentSelected = selectedCitiesPerRow[rowIndex] || [];
    if (!currentSelected.find((c) => c.id === id)) {
      const updated = [...currentSelected, { id, label }];

      setSelectedCitiesPerRow((prev) => {
        const newSelected = [...prev];
        newSelected[rowIndex] = updated;
        return newSelected;
      });

      const val = updated?.map((c) => c.id);
      setValue(`entries.${rowIndex}.city`, val);
    }

    setCityInputs((prev) => {
      const updated = [...prev];
      updated[rowIndex] = "";
      return updated;
    });

    setShowSuggestions((prev) => {
      const updated = [...prev];
      updated[rowIndex] = false;
      return updated;
    });
  };

  const removeCity = (id: string, rowIndex: number) => {
    const currentSelected = selectedCitiesPerRow[rowIndex] || [];
    const updated = currentSelected.filter((c) => c.id !== id);

    setSelectedCitiesPerRow((prev) => {
      const newSelected = [...prev];
      newSelected[rowIndex] = updated;
      return newSelected;
    });

    const val = updated?.map((c) => c.id);
    setValue(`entries.${rowIndex}.city`, val);
  };

  const addMoreEntry = () => {
    append({ duty_type: [], city: [] });
  };

  const removeEntry = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      setCityInputs((prev) => prev.filter((_, i) => i !== index));
      setShowSuggestions((prev) => prev.filter((_, i) => i !== index));
      setSelectedCitiesPerRow((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit = (formData: any) => {
    const allDutyTypes: string[] = [];
    const allCities: string[] = [];

    formData.entries.forEach((entry: any) => {
      const duty_type_ids = entry.duty_type
        .map((label: string) => {
          const matched = dutyType.find((type) => type.label === label);
          return matched ? matched.id : null;
        })
        .filter(Boolean);

      allDutyTypes.push(...duty_type_ids);
      allCities.push(...entry.city);
    });

    const payload = {
      package_id: allDutyTypes.join(","),
      pref_city: allCities.join(","),
      user_id: authUser?.id,
    };

    if (data?.wishlist?.length > 0) {
      updateMutate(
        { id: data.wishlist[0].id, payload },
        {
          onSuccess: () => {
            toast.success("Wishlist updated successfully", {
              position: "top-right",
              autoClose: 5000,
            });
          },
          onError: (err: any) => {
            toast.error(
              err.response?.data?.responseData?.response?.message ||
                "Failed to update wishlist",
              {
                position: "top-right",
                autoClose: 5000,
              }
            );
          },
        }
      );
    } else {
      mutate(payload as any, {
        onSuccess: () => {
          toast.success("Wishlist added successfully", {
            position: "top-right",
            autoClose: 5000,
          });
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.responseData?.response?.message ||
              "Failed to add wishlist",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full bg-white flex"
    >
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 overflow-hidden w-full">
        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <FileCog className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[16px] font-semibold text-gray-800">
                Preferences
              </h3>
            </div>

            {/* Dynamic Entries */}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50"
              >
                {/* Row Header */}
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-medium text-gray-700">
                    Preference {index + 1}
                  </h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                  <div className="space-y-2 relative">
                    <label className="block text-[10px]  font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="hidden"
                      {...register(`entries.${index}.city`)}
                      value={
                        selectedCitiesPerRow[index]?.map((c) => c.id) || []
                      }
                    />
                    <div className="border border-gray-300 rounded-md min-h-[40px] p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {selectedCitiesPerRow[index]?.map((city) => (
                          <span
                            key={city.id}
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {city.label}
                            <button
                              type="button"
                              onClick={() => removeCity(city.id, index)}
                              className="text-red-500 hover:text-red-700 ml-1 text-[10px]"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder={
                          selectedCitiesPerRow[index]?.length > 0
                            ? "Add more cities..."
                            : "Enter City Name"
                        }
                        onBlur={() =>
                          setTimeout(() => {
                            setShowSuggestions((prev) => {
                              const updated = [...prev];
                              updated[index] = false;
                              return updated;
                            });
                          }, 200)
                        }
                        onChange={(e) => handleCityInputChange(e, index)}
                        value={cityInputs[index] || ""}
                        className="outline-none w-full text-[10px] border-none p-0 bg-transparent"
                        onFocus={() => {
                          setShowSuggestions((prev) => {
                            const updated = [...prev];
                            updated[index] = true;
                            return updated;
                          });
                        }}
                      />
                    </div>

                    {/* City Suggestions */}
                    {showSuggestions[index] && cityData?.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {cityData?.map((city: any, idx: number) => (
                          <div
                            key={idx}
                            onClick={() =>
                              handleCitySelect(
                                `${city.name} (${city.state_name}, ${city.country_code})`,
                                `${city.id}`,
                                index
                              )
                            }
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-[10px] border-b border-gray-100 last:border-b-0"
                          >
                            {`${city.name} (${city.state_name}, ${city.country_code})`}
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.entries?.[index]?.city && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.entries[index]?.city?.message}
                      </p>
                    )}
                  </div>

                  {/* Duty Type Input */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-medium text-gray-700">
                      Duty Type <span className="text-red-600">*</span>
                    </label>

                    <Controller
                      control={control}
                      name={`entries.${index}.duty_type`}
                      render={({ field }) => (
                        <MultiSelect
                          selected={field.value || []}
                          setSelected={field.onChange}
                          options={dutyType.map((d) => d.label)}
                          className="border border-gray-300 py-2 px-3 outline-none rounded-md w-full text-[10px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                    {errors.entries?.[index]?.duty_type && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.entries[index]?.duty_type?.message}
                      </p>
                    )}
                  </div>
                  {index === fields.length - 1 && (
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addMoreEntry}
                        className="py-1 mt-12 px-3 cursor-pointer border border-transparent rounded-md shadow-md text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                      >
                        {/* <Plus className="w-2 h-2" /> */}
                        Add More
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {errors.entries && typeof errors.entries.message === "string" && (
              <p className="text-[10px] text-red-600">{errors.entries.message}</p>
            )}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="py-1 px-3 border border-gray-300 rounded-md shadow-sm text-[10px] font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setValue("entries", [{ duty_type: [], city: [] }]);
                  setCityInputs([""]);
                  setSelectedCitiesPerRow([[]]);
                  setShowSuggestions([false]);
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="py-1  px-3 cursor-pointer border border-transparent rounded-md shadow-md text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
