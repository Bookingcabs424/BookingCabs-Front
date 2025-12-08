import { z } from "zod";

export const airportTransferSchema = z.object({
  city: z.string().min(1, "City is required."),
  airport_or_railway_station: z
    .string()
    .min(1, "Airport/Railway Station is required."),
  flight_train_no: z.string().optional(),
  flight_time: z.string().optional(),
  pickup_location: z.string().min(1, "Pickup Location is required."),
  pickup_address: z.string().min(1, "Pickup Address is required."),
  nationality: z.string().min(1, "Nationality is required."),
  drop_address: z.string().min(1, "Drop Address is required."),
  adults: z.coerce.number().min(1, "Min. 1 Adult"),
  children: z.coerce.number().optional(),
  small_luggage: z.coerce.number().optional(),
  big_luggage: z.coerce.number().optional(),
  vehicles: z.coerce.number().optional(),
});

export const rentalSchema = z.object({
  city: z.string().min(1, "City is required."),
  package: z.string().min(1, "Please select a package."),
  pickup_location: z.string().min(1, "Pickup Location is required."),
  pickup_address: z.string().min(1, "Pickup Address is required."),
  nationality: z.string().min(1, "Nationality is required."),
  from: z.string().min(1, "From is required."),
  to: z.string().min(1, "To is required."),
  days: z.string().min(1, "Days is required."),
  date: z.string().optional(),
  time: z.string().optional(),
  adults: z.coerce.number().min(1, "Min. 1 Adult"),
  children: z.coerce.number().optional(),
  small_luggage: z.coerce.number().optional(),
  big_luggage: z.coerce.number().optional(),
  vehicles: z.coerce.number().optional(),
});

export const outstationOnewaySchema = z
  .object({
    multicity: z.array(
      z.object({
        from: z.string().min(1, "From is required."),
        to: z.string().min(1, "To is required."),
        date: z.string().min(1, "Date is required."),
        time: z.string().min(1, "Time is required."),
        nights: z.coerce.number().min(1, "Min. 1 Night"),
      })
    ),

    round_from: z.string().min(1, "From is required"),
    round_to: z.string().min(1, "To is required"),
    from: z.string().min(1, "From is required."),
    to: z.string().min(1, "To is required."),
    pickup_location: z.string().min(1, "Pickup Location is required."),
    pickup_address: z.string().min(1, "Pickup Address is required."),
    nationality: z.string().min(1, "Nationality is required."),

    days: z.string().min(1, "Days is required."),
    required_date: z.string().min(1, "Date is required"),
    required_time: z.string().min(1, "Time is required"),

    return: z.string().min(1, "Return is required"),

    pickup_area: z.string().min(1, "Pickup Area is required"),

    round_time: z.string().min(1, "Time is required"),
    drop_address: z.string().min(1, "Drop Address is required."),

    adults: z.coerce.number().min(1, "Min. 1 Adult"),
    children: z.coerce.number().optional(),
    small_luggage: z.coerce.number().optional(),
    big_luggage: z.coerce.number().optional(),
    vehicles: z.coerce.number().optional(),
  })
  .refine(
    (data) => {
      if (data.multicity && data.multicity.length > 0) {
        return data.multicity.every(
          (entry) =>
            entry.from && entry.to && entry.date && entry.time && entry.nights
        );
      }
      return true;
    },
    {
      message: "All fields are required.",
      path: ["multicity"],
    }
  );

export const cityTaxiSchema = z.object({
  pickup_area: z.string().min(1, "Pickup Area is required."),
  city: z.string().min(1, "City is required."),
  pickup_address: z.string().min(1, "Pickup Address is required."),
  drop_address: z.string().min(1, "Drop Address is required."),
  date: z.string().optional(),
  time: z.string().optional(),
  adults: z.coerce.number().min(1, "Min. 1 Adult"),
  children: z.coerce.number().optional(),
  small_luggage: z.coerce.number().optional(),
  big_luggage: z.coerce.number().optional(),
  vehicles: z.coerce.number().optional(),
});
