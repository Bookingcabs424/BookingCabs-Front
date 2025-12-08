import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { useCountry, useCity, activeCity, useUserRole } from '@/store/common'
import { MESSAGES } from '@/constants/messages';
import axios from 'axios';
import { useAuth } from '@/store/auth';
import { toast } from 'react-toastify';
// updatePickupDateTime
export const updatePickupDateTime = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const response = await api.post('/booking/updatePickupDateTime', body);
      return response.data;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
};

export const useAssignedBookingMutation = () => {
  return useMutation({
    mutationFn: async (body: {
      user_type_id?: number;
      user_id?: number;
      page?: number;
      limit?: number;
      status?: 3;
    }) => {
      const res = await api.post("/booking/booking-list", body, {});
      return res?.data?.responseData?.response?.data?.data;
    },
  });
};

export const useCompleteCabBilling = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/driver/cab-billing-complete', payload);
      return response.data;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
}
//update Rating
export const useUpdateRating = () => {
  return useMutation({
    mutationFn: async (payload: {
      booking_Id: string;
      driver_Id: number;
      user_Id: number;
      rating: number
    }) => {
      const response = await api.post('/booking/updateClientRating', payload);
      return response.data;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
};

export const handleBookingListMutation = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/booking/booking-list", body);
      return res?.data?.responseData?.response?.data?.data;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
};
export const useCompanydetails = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/company/company-detail", body);
      console.log(res.data)
      return res?.data?.responseData?.response?.data?.companyData?.[0];
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
}
export const useGetCityDataMutation = () => {
  const { setCityData } = useCity();
  return useMutation({
    mutationFn: (city: string) => api.post("/user/city-name", { city }),
    onSuccess: (res) => {
      const cityData = res?.data?.responseData?.response?.data?.cityData;
      setCityData(cityData);
    },
    onError: (err) => {
      console.error(MESSAGES.FAILED_FETCHED, err);
    },
  });
};

export const useGetCountryDataMutation = () => {
  const { setCountryData } = useCountry();
  return useMutation({
    mutationFn: (country: string) =>
      api.post("/user/country-name", { country }),
    onSuccess: (res) => {
      const countryData = res?.data?.responseData?.response?.data?.countryData;
      setCountryData(countryData);
    },
    onError: (err) => {
      console.error(MESSAGES.FAILED_FETCHED, err);
    },
  });
};

type PersonalInfoRequest = {
  father_name: string;
  alternate_email: string;
  alternate_mobile: string;
  dob: string;
  gender: string;
  address: string;
  pincode: string;
  mobile: string;
  email: string;
  typeId: string;
};
type CompanyInfoRequest = {
  company_name?: string,
  company_address?: string,
  city_id?: string,
  pincode?: string,
  service_tax_gst?: string,
  pancard_no?: string,
  contact_person_name?: string,
  landline_no?: string,
  mobile_no?: string,
  email?: string,
  website_url: string,
  // logo: string,
  // gst_file: string,
  // pan_file: string,
  user_email?: string,
  user_mobile?: string,
  typeId: string,
  id?: string |number
};
export const usePersonalInfo = () => {
  return useMutation({
    mutationFn: (body: PersonalInfoRequest) =>
      api.post("/user/personal-info", {
        ...body,
      }),
    onSuccess: (res) => {
      return true;
    },
  });
};
export const useCompanyInfo = () => {
  return useMutation({
    mutationFn: (body: CompanyInfoRequest) =>
      api.post("/company/company-info", body, {}),
    onSuccess: (res) => {
      const companyData = res?.data?.responseData?.response?.data?.countryData;
    },
  });
};
// export const
// export const useVerfiyOtpDataMutation = () => {
//     return useMutation({
//         mutationFn: (country: string) =>
//             api.post('/user/country-name', { country }),
//         onSuccess: (res) => {
//             const countryData = res?.data?.responseData?.response?.data?.countryData;
//             return
//         },
//         onError: (err) => {
//             console.error(MESSAGES.FAILED_FETCHED, err);
//         }
//     })
// }

const fetchCityActivePackage = async (cityname: string, type: number) => {
  const response = await api.get(`/city/city-active-package`, {
    params: { cityname, type },
  });
  return response.data;
};

export const useCityActivePackage = (cityname: string, type: number) => {
  return useQuery({
    queryKey: ["cityActivePackage", cityname, type],
    queryFn: () => fetchCityActivePackage(cityname, type),
    enabled: !!cityname && !!type, // prevents firing if data is not ready
  });
};

export const useLocalPackages = (params: any) => {
  return useQuery({
    queryKey: ['localPackages', params],
    queryFn: () => api.get(`/local/get-local-package`, {
      params: params,
    }),
    enabled: !!params,
  });
};

export const useGetAddress = (area: string) => {
  const { cityData, setCityData } = activeCity();

  return useQuery({
    queryKey: ['getarea', area],
    queryFn: () => api.get(`/location/get-location`, {
      params: {
        area,
        cityId: cityData?.city_id
      },
    }),
    enabled: area?.length>2,
  });
}

export const getDetailedAddress = (address: string) => {
  const { cityData, setCityData } = activeCity();

  return useQuery({
    queryKey: ['address', address],
    queryFn: () => api.get('/address/get-address', {
      params: { address, city_id: cityData?.city_id },
    }).then((res) => res.data.responseData.response.data),
    enabled: address?.length>2, // prevent query if address is empty
  });
}

export const getAirportAddress = (city_id: string) => {

  return useQuery({
    queryKey: ['airportAddress'],
    queryFn: () => api.get('/address/get-airport-railway', {
      params: { city_id: city_id },
    }).then((res) => res.data.responseData.response.data),
    enabled: !!city_id, // prevent query if address is empty
  });
}



export const getNationality = (nationality: string) => {
  return useQuery({
    queryKey: ['nationality', nationality],
    queryFn: () => api.get('/country/get-country', {
      params: { country_name: nationality },
    }).then((res) => res.data.responseData.response.data),
    enabled: !!nationality, // prevent query if address is empty
  });
}

export const getCityByname = (city: string) => {
  return useQuery({
    queryKey: ['SearchCity'],
    queryFn: () =>
      api.get(`/city/packageCity?city_name=${city}`).then((res) =>
        res.data,
      ),
    enabled: !!city, // Prevent auto-fetching

  })
}

export const getCityByNameHeader = (city: string) => {
  return useQuery({
    queryKey: ['SearchCityH'],
    queryFn: () =>
      api.get(`/city/packageCity?city_name=${city}`).then((res) =>
        res.data,
      ),
    enabled: !!city, // Prevent auto-fetching

  })
}

export const getVehiclebySeatingCapicity = (seating: number) => {
  let capacity = seating > 4 ? seating : 4
  return useQuery({
    queryKey: ['VehiclebySeating'],
    queryFn: () => api.get(`/vehicle/get-vehicle-types?seating_capacity=${capacity}`).then((res) =>
      res,
    ),
    enabled: true, // Prevent auto-fetching

  })
}


export const getLatLong = (address: string) => {

  return useQuery({
    queryKey: ['Address', address], // include address to cache correctly
    queryFn: () => api.get(`/distance/geoCode?address=${address}`).then((res) =>
      res,
    ),
    enabled: !!address, // Prevent auto-fetching

  })
}
export const getDistancefromLatLong = (origin: string, destination: string) => {
  return useQuery({
    queryKey: ['distance', origin, destination],
    queryFn: () => api
      .get(`/distance`, {
        params: { origin, destination },
      })
      .then((res) => res.data), // assuming your successResponse sends data under `.data`
    enabled: !!origin && !!destination, // Only run when both are provided
  });
};



export const useFareDetails = () => {
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post("/fare/faredetails", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};
export const usegetCities = () => {
  return useMutation({

    mutationFn: ({ city, toCity }: { city: string; toCity: boolean }) =>
      api.get(`/city/packageCity?city_name=${city}${toCity ? '&toCity=true' : ''}`).then((res) =>
        res.data,
      ),

    onSuccess: (res) => {
      const companyData =
        res?.data?.responseData?.response?.data?.countryData;
    },

  });
};
export const useGetLatLongMutation = () => {
  return useMutation({
    mutationFn: (address: string) => {
      if (!address) {
        throw new Error("Address is required");
      }
      return api.get(`/distance/geoCode?address=${address}`).then((res) => res.data);
    },
  });
};
export const usecheckCoupon = () => {
  return useMutation({
    mutationFn: async (body:any) => {
      const response = await api.post("/fare/apply-coupon", body);
      return response?.data?.data;
    },
    onSuccess: (res) => {
      const companyData = res?.data?.data;
      console.log("Coupon Applied Successfully:", companyData);
      // You can optionally update state here or call a callback
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.data?.msg);
    }
  });
};

export const useHandleQuotation = () => {
  return useMutation({
    mutationFn: (body) =>
      api.post("/booking/finalquotation", body, {
      }),
    onSuccess: (res) => {
      console.log({ res: res?.data })
      const companyData =
        res?.data
    },

  })
}
export const useCreateBookingFromCart = () => {
  return useMutation({
    mutationFn: (body) =>
      api.post("/booking/finalquotationBooking", body, {
      }),
    onSuccess: (res) => {
      console.log({ res: res?.data })
      const companyData =
        res?.data
    },

  })
}
export const useSubmitBooking = () => {
  return useMutation({
    mutationFn: (body) =>
      api.post("/booking/finalbooking", body, {
      }),
    onSuccess: (res) => {
      const companyData =
        res?.data
    },

  })
}


export const useWalletAmount = (user_id: any) => {
  return useMutation({
    mutationFn: (body) =>
      api.post("/creditLimit/wallet", { user_id }, {
      }),
    onSuccess: (res) => {
      const companyData =
        res?.data
    },

  })
}

export const useGetBookingInfo = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/booking/listBookingData", body);
      return res.data?.responseData?.response?.data?.[0]; // ✅ return only what you need
    },
    onSuccess: (data) => {
      // handle success if needed, data is the booking info object
      // e.g., console.log('Booking info:', data);
    },
  });
}
export const useGetQuotationInfo = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/booking/listQuotationData", body);
      return res.data?.responseData?.response?.data; // ✅ return only what you need
    },
    onSuccess: (data) => {
      console.log(data)
      // handle success if needed, data is the booking info object
      // e.g., console.log('Booking info:', data);
    },
  });
}
export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/payment/initiatePayment", body);
      return res.data?.responseData?.response?.data // ✅ return only what you need
    },
    onSuccess: (data) => {
      // handle success if needed, data is the booking info object
      // e.g., console.log('Booking info:', data);
    },
  });
}

export const useGetPaymentDetails = (company_id: number = 1, status: number = 1) => {
  return useQuery({
    queryKey: ['paymentGatewayDetails', company_id, origin],
    queryFn: () =>
      api
        .get(`/payment/get-paymentGatewayDetails`, {
          params: { company_id, status },
        })
        .then((res) => res.data.responseData.response.data.data[0]),

  });
};

export const useShoppingCart = () => {
  return useQuery({
    queryKey: ["shoppingCart"],
    queryFn: async () => {
      const res = await api.get("/booking/quotationItineraryList");
      return res.data;
    },
  });
};
export const getSingleQuotation = (itinerary_id: String) => {
  return useQuery({
    queryKey: ["shoppingCart"],
    queryFn: async () => {
      const res = await api.get("/booking/quotationItineraryList?itinerary_id=" + itinerary_id);
      return res.data;
    },
  });
};
export const usegetItineraryDetails = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/booking/getItineraryDetails", body);
      return res.data.responseData.response.data// ✅ return only what you need
    },
    onSuccess: (data) => {
      // handle success if needed, data is the booking info object
      // e.g., console.log('Booking info:', data);
    },
  });
}

export const addCartToQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/booking/addCartToQuotation", body);
      return res.data.responseData.response// ✅ return only what you need
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingCart"] });

      // handle success if needed, data is the booking info object
      // e.g., console.log('Booking info:', data);
    },
  });
}
export const discardShoppingCartQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/booking/discardShoppingCartQuotation", body);
      return res.data.responseData.response// ✅ return only what you need
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingCart"] });

      // handle success if needed, data is the booking info object
      // e.g., console.log('Booking info:', data);
    },
  });
}
export const useGetGSTNumberVerificationMutation = () => {
  return useMutation({
    mutationFn: (gst: string) =>
      api.post('/user/gst-verification', { gst }),
    onSuccess: (res) => {
      const data = res?.data?.responseData?.response?.data;
      return data;
    },
    onError: (err) => {
      console.error(MESSAGES.FAILED_FETCHED, err);
    }
  })
}

export const useUpdateCompanyInfo = () => {
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string|number } & CompanyInfoRequest) =>
      api.put(`/company/company-detail/${id}`, body, {
      }),
    onSuccess: (res) => {
      const companyData =
        res?.data?.responseData?.response?.data?.countryData;
    },
  });
};


export const useGetRecentBookings = () => {
  return useQuery({
    queryKey: ["bookinglist"],
    queryFn: async () => {
      const res = await api.get("/booking/getRecentBookings");
      return res.data.data;
    },
  });
};

export const useCancelBookingByUser = () => {

  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/booking/cancelBookingByUser", body);
      return res.data.responseData.response// ✅ return only what you need
    },
    onSuccess: (data) => {

      // handle success if needed, data is the booking info object
      // e.g., console.log('Booking info:', data);
    },
  });
}
export const useAddUserMutation = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/user/add-user", body);
      return res.data;
    },
    onSuccess: (data) => {
      // handle success if needed
    },
    onError: (error) => {
      console.error("Failed to add user:", error);
    }
  });
}
export const usegetStaffMutation = () => {
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/user/users", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      // handle success if needed
    },
    onError: (error) => {
      console.error("Failed to add staff:", error);
    }
  });
}


export const useGetUserCreditBalance = () => {
  return useMutation({
    mutationFn: async (body:any) => {
      const res = await api.post("/creditLimit/", body);
      return res.data.responseData.response;
    },
  });
};
export const usefetchQuotation = () => {
  return useMutation({
    mutationFn: async (body:any) => {
      const res = await api.post("booking/quotation-list/", body);
      return res.data;
    },
  });
};
export const usefetchVehicleTypes = () => {
  return useMutation({
    mutationFn: async (body:any) => {
      const res = await api.post("booking/getvehicletype/", body);
      return res.data;
    },
  });
};

export const useGetStatesbyCountryId = (country_id:number) => {
  return useQuery({
    queryKey: ["stateList"],
    queryFn: async () => {
      const res = await api.get("/states?country_id="+country_id,);
      return res.data.data;
    },
  });
};

export const useGetCitiesbyStateId = (state_id:number) => {
  return useQuery({
    queryKey: ["cityList"],
    queryFn: async () => {
      const res = await api.get("/city/cities?state_id="+state_id,);
      return res.data.data;
    },
    
    enabled:!!state_id
  });
};

export const cancelBookingDriver = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/booking/cancelBookingDriver', payload);
      return response.data;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });

};


export const upateBookingStatus = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/booking/upateBookingStatus', payload);
      return response.data;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
};


export const useExecuteNoShow = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/booking/executeNoShow', payload);
      return response.data;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
};



export const useReDispatch = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/booking/reDispatch', payload);
      return response.data;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
};

export const deleteQuotation = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/booking/updateQuotationStatus', payload);
      return response.data;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
}

export const driverDutyInfo = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/user/add-duty-detail", payload);
      return res?.data?.responseData?.response?.data;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
};
type addCabForm = {
  vehicle_name: string,
  ignition_type: string,
  vehicle_color: string,
  carrier?: string,
  ac?: string,
  owner?: string,
  permit_expiry_date?: string,
  model_year?: string,
  vehicle_code?: string,
  vehicle_reg_no?: string,
  insurance_validity?: string,
  fitness_validity?: string,
  passenger: number,
  big_suitcase: number,
  small_suitcase: number,
  amenities?: string,
  owner_name?: string,
  reg_date?: string,
  chassis_no?: string,
  engine_no?: string,
  insurance_name?: string,
  policy_number?: string,
  policy_issue?: string,
  premium_amount?: string,
  cover_amount?: string,
  rto_address?: string,
  rto_tax_efficiency?: string,
  rto_expiry?: string,
  fitness_number?: string,
  fitness_expiry?: string,
  auth_number?: string,
  auth_expiry?: string,
  speed_governor_detail?: string,
  speed_governor_expiry?: string,
  puc_number?: string,
  puc_expiry?: string,
  permit_type?: string,
  permit_expiry?: string,
  vehicle_name_id?: string,
  amenties_id?: string,
  vmId?: string,
  user_email?: string,
  user_mobile?: string,
  typeId?: string
}
export const useAddUserVehicleMutation = () => {
  return useMutation({
    mutationFn: async (body: addCabForm) => {
      const res = await api.put('/vehicle/vehicle-type/add-user-vehicle', body);
      return res?.data?.responseData?.response;
    }
  });
}

export const getVehicleNameTypeList = () => {
  return useQuery({
    queryKey: ["GetVehicleNameList"],
    queryFn: async () => {
      const res = await api.get(`/vehicle/vehicle-type/get-name`);
      const data = res?.data?.responseData?.response?.data?.vehicleNameData;
      return data;
    },
    enabled: false
  });
}

export const getVehicleColorList = () => {
  return useQuery({
    queryKey: ["GetVehicleColorList"],
    queryFn: async () => {
      const res = await api.get(`/vehicle/vehicle-type/vehicle-color-combo`);
      const data = res?.data?.responseData?.response?.data?.results;
      return data;
    },
    enabled: false
  });
}

export const getVehicleUserList = () => {
  return useQuery({
    queryKey: ["GetVehicleUserList"],
    queryFn: async () => {
      const res = await api.get(`/vehicle/vehicle-type/user-vehicle-list`);
      const data = res?.data?.responseData?.response?.data?.results;
      return data;
    },
    enabled: false
  });
}

export const useUpdateUserVehicleStatus = () => {
  return useMutation({
    mutationFn: async (body: {
      id: number[];
      status?: number;
    }) => {
      const res = await api.put('/vehicle/vehicle-type/update-user-status', body, {});
      return res?.data?.responseData?.response;
    }
  });
}
type AddVehicleTypeInput = {
  file: File;
  folder: string;
  category_id: string;
  status: string;
  vehicle_type: string;
};
export const useUploadVehicleDoc = () => {
  return useMutation({
    mutationFn: async (input: AddVehicleTypeInput) => {
      const formData = new FormData();
      Object.entries(input).forEach(([key, value]) =>
        formData.append(key, value)
      );
      const res = await api.post("/vehicle/vehicle-type/add?folder=vehicle-type-image", formData);
      return res?.data?.responseData?.response ?? {};
    },
  });
};
export const useDriverCombo = () => {
  return useQuery({
    queryKey: ["DriverComboList"],
    queryFn: async () => {
      const res = await api.get(`/driver/driver-combo`);
      return res;
    },
    enabled: true,
  });
};

export const useMapUserWithVehicle = () => {
  return useMutation({
    mutationFn: async (body: {
      user_id: string; user_vehicle_id: string; status: string
    }) => {
      const res = await api.put('/vehicle/vehicle-type/map-user-vehicle', body, {});
      return res?.data?.responseData?.response;
    }
  });
}

export const useCompanyUpdateLogo = (id: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(
        `/company/${id}/photo?folder=${encodeURIComponent(folder)}`,
        formData
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", id] });
    },
  });
};


export const useUpdateUserDoc = (id: number, onSuccessCallback?: (doc: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      folder,
      doc_type_id,
      user_id,
      kyc,
    }: {
      file: File;
      folder: string;
      doc_type_id: string;
      user_id: string;
      kyc?: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      // formData.append("folder", folder);
      formData.append("doc_type_id", doc_type_id);
      formData.append("user_id", user_id);
      if (kyc) {
        formData.append("kyc", kyc);
      }
      const res = await api.post(
        `/user/user-documents?folder=${encodeURIComponent(folder)}`,
        formData
      );
      return res?.data?.responseData?.response?.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userDocProfile", id] });
      if (onSuccessCallback) {
        onSuccessCallback(data?.userDocuments);
      }
    },
  });
};



export const useGetUserKycList = (doc_level_name: string) => {
  return useQuery({
    queryKey: ["doc_level_List", doc_level_name],
    queryFn: async () => {
      const res = await api.get(`/user/documents-list/${doc_level_name}`);
      return res?.data?.responseData?.response?.data?.documentData;
    },
    enabled: !!doc_level_name,
  });
};


export const useGetCompanyDetail = () => {
  return useQuery({
    queryKey: ["CompanyDetail"],
    queryFn: async () => {
      const res = await api.get(`/company/`);
      const data = res?.data?.responseData?.response?.data?.[0].companyData;
      return data;
    },
    enabled: true
  });
}



export const useGetUserProfileInfo = (id: number) => {
  return useQuery({
    queryKey: ["userProfile", id],
    queryFn: async () => {
      const res = await api.get(`/user/${id}`);
      return res?.data?.responseData?.response?.data?.user;
    },
    enabled: !!id,
  });
};

export const useUpdateUserProfilePhoto = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(
        `/user/${id}/photo?folder=${encodeURIComponent(folder)}`,
        formData
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
    },
  });
};

export const useUpateUserProfile = () => {
  return useMutation({
    mutationFn: (body: any) =>
      api.put("/user/profile", body, {}),
    onSuccess: (res) => {
      // const companyData =res?.data?.responseData?.response?.data?.countryData;
      return true;
    },
  });
};

export const useBankUserDetailAdd = () => {
  return useMutation({
    mutationFn: (body: any) =>
      api.post("/bankDetail/add/", body, {}),
    onSuccess: (res) => {
      return true;
    },
  });
}

export const useBankUserDetailUpdate = () => {
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string | number }) =>
      api.put(`/bankDetail/update/${id}`, body, {}),
    onSuccess: (res) => {
      return true;
    },
  });
}

export const useBankUserDetailList = () => {
  return useQuery({
    queryKey: ['bankUserDetailList'],
    queryFn: () => api.get('/bankDetail/list/'),
    select: (res) => res.data,
  });
};

export const useFamilyDetailMutation = () => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...body }: { id?: string | number }) => {
      if (id) {
        return await api.put(`/family/update/${id}`, body);
      } else {
        return await api.post(`/family/add`, body);
      }
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["familyList"] });
    },
    onError: (error: any) => {
      console.error("Mutation failed:", error);
    },
  });
};


export const useGetFamilyDetails = () => {
  return useQuery({
    queryKey: ['familyDetails'],
    queryFn: async () => {
      const { data } = await api.get(`/family/list/`);
      return data;
    }
  });
};

// export const driverDutyInfo = () => {
//   return useMutation({
//     mutationFn: async (payload: any) => {
//       const res = await api.post("/user/add-duty-detail", payload);
//       return res?.data?.responseData?.response?.data;
//     },
//     onError: (error: Error) => {
//       return error?.message;
//     }
//   });
// };

export const useGetWishlist = (userId: number) => {
  return useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      const { data } = await api.get(`/wishlist/${userId}`);
      return data?.responseData?.response?.data?.wishlist;
    }
  });
};

export const useAddWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { user_id: number; package_id: number }) => {
      const { data } = await api.post('/wishlist', payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['wishlist', variables.user_id]
      });
    }
  });
};

export const useRemoveWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, product_id }: { user_id: number; product_id: number }) => {
      const { data } = await api.delete(`/wishlist/${user_id}/${product_id}`);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['wishlist', variables.user_id]
      });
    }
  });
};

export const useUpdateWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const { data } = await api.put(`/wishlist/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['wishlist', variables.payload.user_id]
      });
    }
  });
};



export const usePaymentUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post(`/payment/advanceToVendor`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['paymentupload', variables.payload.user_id]
      });
    }
  });
};

export const useGetPaymentUploadList = (user_id: number) => {
  return useQuery({
    queryKey: ["useGetPaymentUploadList"],
    queryFn: async () => {
      const res = await api.get(`payment/uploadedPaymentList`, { params: { user_id } });
      return res?.data?.data
    }
  })
}

export const useUnAssignedBookingMutation = () => {
  return useMutation({
    mutationFn: async (body: {
      draw: number;
      start: number;
      length: number;
      order: { column: number; dir: "asc" | "desc" }[];
      columns: { data: string }[];
      search: { value: string };
      user_type_id?: number;
      user_id?: number;
      // Add any other fields like vehicle_type_id, etc. if needed
    }) => {
      const res = await api.post("/booking/recently-unassigned-booking", body);
      return res?.data?.data;
    },
  });
};

export const useGetUpdateUserDoc = () => {
  return useQuery({
    queryKey: ['UserDocu'],
    queryFn: async () => {
      const { data } = await api.get(`/userDocument/doc`);
      return data?.responseData?.response?.data?.docs;
    }
  });
};

export const useUpdateCompanyKycDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const { data } = await api.patch(`/company/kyc_update/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['companykyc', variables.payload.user_id]
      });
    }
  });
};

export const useGetUserCreditTrancations = () => {
  return useMutation({
    mutationFn: async (body: {
      company_id?: number;
      user_id?: number;
    }) => {
      const res = await api.post("/creditLimit/", body, {});
      return res?.data?.responseData?.response?.data?.allUserCreditLimit;
    },
  });
};
export const useGetUserWalletBalance = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const res = await api.get("/creditLimit/wallet");
      return res?.data?.responseData?.response?.data?.result[0]?.credit_balance ?? 0;
    },
    enabled: true,
  });
};


export const useGetReferralPoints = () => {
  return useQuery({
    queryKey: ["referralPoint"],
    queryFn: async () => {
      const res = await api.get("/creditLimit/referal-points");
      return res?.data?.responseData?.response?.data;
    },
    enabled: true,
  });
};

export const useGetAllCreditLimitTransactions = () => {
  return useMutation({
    mutationFn: async (payload: {
      user_id: any,
      company_id: any
    }) => {
      const res = await api.post("/creditLimit/", payload);
      return res?.data?.responseData?.response?.data?.allUserCreditLimit;
    },
    onError: (error: Error) => {
      return error?.message;
    }
  });
};

export const useGetTripDetails = (itineraryId: string) => {
  return useQuery({
    queryKey: ["Tripdetail", itineraryId],
    queryFn: async () => {
      const res = await api.get(`/booking/trip-details/${itineraryId}`);
      return res?.data?.responseData?.response?.data?.results[0];
    },
    enabled: !!itineraryId,
  });
};
type VendorAcceptJobResponse = {
  status: string;
  message: string;
};
export const useVendorAcceptedJob = () => {
  return useMutation<VendorAcceptJobResponse, Error, { booking_id: number; id: number }>({
    mutationFn: async (body) => {
      const res = await api.post("/driver/vendor-accept-job", body);
      return res?.data?.responseData?.response;
    },
  });
};


export const useBiddingMutation = () => {
  return useMutation({
    mutationFn: async (body: {
      city_distance_id?: number;
      route_id?: number;
      driver_id?: number;
      source_city?: number;
      destination_city?: number;
      multi_vehicle_type?: string;
      from_date?: string;
      to_date?: string;
      user_id?: number;
      page?: number;
      limit?: number;
    }) => {
      const res = await api.post("/bidding/get-bidding", body, {});
      return res?.data?.responseData?.response?.data;
    },
  });
};

export const useRecentBookingMutation = () => {
  return useMutation({
    mutationFn: async (body: {
      user_type_id?: number;
      user_id?: number;
      page?: number;
      limit?: number;
    }) => {
      const res = await api.post("/booking/recently-viewed", body, {});
      return res?.data?.responseData?.response?.data;
    },
  });
};

export const useAcceptedBookingMutation = () => {
  return useMutation({
    mutationFn: async (body: {
      user_type_id?: number;
      user_id?: number;
      page?: number;
      limit?: number;

    }) => {
      const res = await api.post("/driver/vendor-accept-job", body, {});
      return res?.data?.responseData?.response?.data;
    },

  });
};


export const useAddDepartmentMutation = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/user/department/add", body);
      return res?.data;
    },
  });
};

export const useUpdateDepartmentMutation = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const { id, ...rest } = body;
      const res = await api.put(`/user/department/update/${id}`, rest);
      return res?.data;
    },
  });
};

export const useDeleteDepartmentMutation = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/user/department/delete/${id}`);
      return res?.data;
    },
  });
};

export const useDepartmentsQuery = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await api.get("/user/department/get-all");
      return res?.data?.responseData?.response?.data;
    },
  });
};

export const useDepartmentByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["department", id],
    queryFn: async () => {
      const res = await api.get(`/user/department/get/${id}`);
      return res?.data;
    },
    enabled: !!id, // fetch only if id is provided
  });
};

export const useUpdateDepartmentStatus = () => {
  return useMutation({
    mutationFn: async (body: {
      id: number[];
      status?: number;
    }) => {
      const res = await api.post('/user/department/update-user-status', body, {});
      return res?.data?.responseData?.response;
    }
  });
}



export const useGetUserStaff = () => {
  return useMutation({
    mutationFn: async (body: { user_id: number; user_type_id?: number }) => {
      const res = await api.post("/user/staff", body, {});
      return res?.data?.responseData?.response;
    },
  });
};

export const getAssignModuleByUserTypeId = () => {
  return useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const res = await api.get(`/user/get-assign-module-by-user-type-id`);
      return res?.data?.data || [];
    },
  });
};

export const useGetRole = () => {
  const { setUserRoleData } = useUserRole();

  return useQuery({
    queryKey: ["GetRole"],
    queryFn: async () => {
      const res = await api.get(`/roles/`);
      const data = res?.data?.responseData?.response?.data?.results;
      setUserRoleData(data);
      return data;
    },
    enabled: true,
  });
};
export const useGetDutyInfo = (user_id: any) => {
  return useQuery({
    queryKey: ["UserInfo"],
    queryFn: async () => {
      const res = await api.get(`user/duty-info/${user_id}`);
      return res?.data?.data
    }
  })
}

export const useGetLanguageList = () => {
  return useQuery({
    queryKey: ["Lang"],
    queryFn: async () => {
      const res = await api.get(`lang/`);
      return res?.data?.data
    }
  })
}

export const useGetUserInfo = (user_id: any) => {
  return useQuery({
    queryKey: ["UserInfo"],
    queryFn: async () => {
      const res = await api.get(`/user/get-user-info/${user_id}`);
      return res?.data?.data?.[0]
    }
  })
}

export const useUpdateUserProfile = () => {
  const user = useAuth()
  return useMutation({
    mutationFn: (body: any) =>
      api.put("user/user-info/" + body?.user_id, body, {}),
    onSuccess: () => {
      return true;
    },
  });
};

export const useUpdateProfile = () => {
  const user = useAuth()
  return useMutation({
    mutationFn: (body: any) =>
      api.post("user/edit", body, {}),
    onSuccess: () => {
      return true;
    },
  });
};


export const useGetEditSignature = (user_id: any) => {
  return useQuery({
    queryKey: ["UserInfo"],
    queryFn: async () => {
      const res = await api.get(`/user/signature/${user_id}`);
      return res?.data?.data
    }
  })
}

export const useUpdateSignature = () => {
  return useMutation({
    mutationFn: (body: any) =>
      api.post(`user/signature/${body?.user_id}`, body, {}),
    onSuccess: () => {
      return true;
    },
  });
};


export const useGetCityByName = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/city/get-city-by-name", body);
      return res?.data?.responseData?.response?.data;
    },
  });
};

export const useGetPaymentTypeList = () => {
  return useQuery({
    queryKey: ["paymentType"],
    queryFn: async () => {
      const { data } = await api.get(`paymentType/`);
      console.log({ res: data?.data })
      return data?.responseData?.response?.data
    }
  })
}

export const useGetShiftList = () => {
  return useQuery({
    queryKey: ["shift"],
    queryFn: async () => {
      const res = await api.get(`shift-list/`);
      return res?.data?.data
    }
  })
}


export const useUpsertDutyInfo = () => {
  return useMutation({
    mutationFn: (body: any) =>
      api.post(`user/duty-info/${body?.user_id}`, body, {}),
    onSuccess: () => {
      // returnx true;
      toast.success("Success")
    },
    onError: () => {
      toast.error("Error Updating")
    }
  });
};

export const useGetCountries = () => {
  return useQuery({
    queryKey: ["getcountries"],
    queryFn: async () => {
      const res = await api.get("/country/get-country");
      return res?.data?.responseData?.response?.data;
    },
    enabled: true,
  });
};


export const useUpdateUserKyc = () => {
  const { user } = useAuth()
  return useMutation({
    mutationFn: async (body: any) => {

      const payload = { ...body }

      const res = await api.post(`/user/kyc/${user.id}`, payload)
      return res.data

    }
  })
}

export const useGetKycUserInfo = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user", "kyc", user?.id],
    queryFn: async () => {
      if (!user.id) throw new Error("user not logged in ")
      const res = await api.get(`user/kyc/${user.id}`)
      console.log("responsedata", res)
      return res.data.kycInfo
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  })
}


export const useViewKyc = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (kycId: number) => {
      if (!user?.id) throw new Error("User not logged in");
      const res = await api.get(`/kyc/record/${kycId}`);
      return res.data.kycInfo;
    },
  });
};


export const useEditKyc = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ kycId, body }: { kycId: number; body: any }) => {
      if (!user?.id) throw new Error("User not logged in");
      const payload = { ...body };
      const res = await api.put(`/user/kyc/record/${kycId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate the KYC list query to refresh the list
      queryClient.invalidateQueries({ queryKey:["user", "kyc", user?.id]});
    },
  });
};

export const getUserKycById = (kycId: number) => {
  return useQuery({
    queryKey: ['kyc', kycId],
    queryFn: async () => {
      const res = await api.get(`/user/kyc/record/${kycId}`);
      return res.data;
    },
    enabled: !!kycId,
  })
}

export const useDeleteKyc = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kycId: number) => {
      if (!user?.id) throw new Error("User not logged in");
      const res = await api.delete(`user/kyc/record/${kycId}`);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate the KYC list query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["user", "kyc", user?.id] });
    },
  });
}


export const useAddCoworker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post(`/family/add`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['coworker-list']
      });
    }
  });
};

export const useDeleteCoworker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.delete(`/family/delete/${payload}`);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['coworker-list']
      });
    }
  });
};

export const useGetCoworkerList = () => {
  return useQuery({
    queryKey: ["coworker-list"],
    queryFn: async () => {
      const res = await api.get(`family/list`);
      return res?.data?.responseData?.response?.data?.list
    }
  })
}


export const useUpdateCoworker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.put(`/family/update/${payload.id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['coworker-list']
      });
    }
  });
};


// export const useGetAllVehicleType = () => {
//   return useQuery({
//     queryKey: ["vehicleTypes"],
//     queryFn: async () => {
//       const res = await api.get("/vehicle/get-vehicle-types");
//       return res?.data?.responseData?.response?.data;
//     },
//   });
// };

export const useGetCompany = (filter: any) => {
  return useQuery({
    queryKey: ["companies"], // Changed from "cities" to "companies"
    queryFn: async () => {
      const res = await api.get(`/company/get-companies`, {
        params: filter,
      });
      return res.data.data || []; // Return res.data instead of res
    },
    // Add these options for better debugging
    retry: 1,
    refetchOnWindowFocus: false,
  });
};


export const useQuotationEmail = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/fare_management/send-quotation-mail", body);
      return res.data?.responseData?.response?.data?.[0]; // âœ… return only what you need
    },
    onSuccess: (data) => {
      toast.success("Email sent successfully")
    },
  });
}


export const useBookingEmail = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post("/fare_management/send-booking-mail", body);
      return res.data?.responseData?.response?.data?.[0]; // âœ… return only what you need
    },
    onSuccess: (data) => {
      toast.success("Email sent successfully")
    },
  });
}

export const useQuotationSmS = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/fare/send-sms", payload);
      return res.data?.responseData?.response;
    },
    onSuccess: () => {
      toast.success("SMS sent successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to send SMS");
    }
  });
};


export const useGetAllVehicleType = () => {
  return useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: async () => {
      const res = await api.get("/vehicle/get-vehicle-types");
      return res?.data?.responseData?.response?.data;
    },
    enabled: true,
  });
};


export const useContactMessage = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/contact/add", payload);
      return res.data?.responseData?.response; // same pattern
    },
    onSuccess: () => {
      toast.success("Message sent successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to send message");
    }
  });
};




