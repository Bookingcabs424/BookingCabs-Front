// import Dashboard from "@/app/dashboard/page";
// import Company from "@/app/company/page";
// import Quotation from "@/app/quotation/page";
// import Masters from "@/app/masters/page";
// import FeatureCards from "@/app/pricing/page";

export type ModuleKey =
  | "dashboard"
  | "users"
  | "admin_web_panel"
  | "staff_management"
  | "role_management"
  | "relationship_manager"
  | "live_vehicle_mapping"
  | "vehicle_management"
  | "detailed_fare_history"
  | "fare_management"
  | "booking_status_all"
  | "tracking_on_map"
  | "marketing_module"
  | "passenger_details"
  | "passenger_rating"
  | "blacklist_passenger"
  | "referrals"
  | "fare_distance"
  | "fare_hourly"
  | "fare_distance_hour"
  | "fare_distance_waiting"
  | "commission_management"
  | "surcharges_management"
  | "time_management"
  | "booking_history"
  | "activity_booking"
  | "transport_booking"
  | "hotel_booking"
  | "staff"
  | "department"
  | "booking"
  | "local"
  | "point_to_point"
  | "airport"
  | "outstation"
  | "oneway"
  | "bid"
  | "fare_management"
  | "user_management"
  | "cab_fare"
  | "view_local_package_fare"
  | "vendor_cab_fare"
  | "upload_fare"
  | "add_cab_fare"
  | "user"
  | "driver"
  | "vendor"
  | "dmc"
  | "company"
  | "vehicle_management"
  | "add_vehicle"
  | "manage_vehicle"
  | "manage_vehicle_mapping"
  | "guide_fare"
  | "manage_masters"
  | "finance"
  | "statement_of_account"
  | "invoice"
  | "payment_upload"
  | "payment_report"
  | "credit_card_report"
  | "billing_management"
  | "credit_limit"
  | "finance"
  | "add_staff"
  | "add_user_license"
  | "role_management"

export type ModuleDefinition = {
  key: ModuleKey;
  label: string;
  path?: string;
  component?: React.ComponentType;
  children?: ModuleDefinition[];
};
export const commonModules: ModuleKey[] = [
  "dashboard",
  "time_management",
  "booking_history",
  "staff",
  "department",
  "booking",
  "bid",
  "fare_management",
  "user_management",
  "vehicle_management",
  "finance",
  "staff",
];

export const allModules: ModuleDefinition[] = [
  // {
  //   key: "dashboard",
  //   label: "Dashboard",
  //   path: "/dashboard",
  //   component: Dashboard,
  // },

  // {
  //   key: "booking_history",
  //   label: "Booking History",
  //   children: [
  //     {
  //       key: "transport_booking",
  //       label: "Transport Booking",
  //       path: "/transport-booking",
  //       component: Company,
  //     },
  //     {
  //       key: "activity_booking",
  //       label: "Activity Booking",
  //       path: "/activity-booking",
  //       component: Company,
  //     },
  //     {
  //       key: "hotel_booking",
  //       label: "Hotel Booking",
  //       path: "/hotel-booking",
  //       component: Company,
  //     },
  //   ],
  // },
  // {
  //   key: "vehicle_management",
  //   label: "Vehicle Management",
  //   children: [
  //     // {
  //     //   key: "add_vehicle",
  //     //   label: "Add Vehicle",
  //     //   path: "/add-vehicle",
  //     //   component: Company,
  //     // },
  //     {
  //       key: "manage_vehicle",
  //       label: "Manage Vehicle",
  //       path: "/manage-vehicle",
  //       component: Company,
  //     },
  //     {
  //       key: "manage_vehicle_mapping",
  //       label: "Manage Vehicle Mapping",
  //       path: "/manage-vehicle-mapping",
  //       component: Company,
  //     },
  //   ],
  // },
  // {
  //   key: "booking",
  //   label: "Booking",
  //   children: [
  //     {
  //       key: "local",
  //       label: "Local",
  //       path: "/local",
  //       component: Company,
  //     },
  //     {
  //       key: "point_to_point",
  //       label: "Point To Point",
  //       path: "/point-to-point",
  //       component: Company,
  //     },
  //     {
  //       key: "airport",
  //       label: "Airport",
  //       path: "/airport",
  //       component: Company,
  //     },

  //     {
  //       key: "outstation",
  //       label: "Outstation",
  //       path: "/outstation",
  //       component: Company,
  //     },

  //     {
  //       key: "oneway",
  //       label: "Oneway",
  //       path: "/oneway",
  //       component: Company,
  //     },
  //   ],
  // },
  // {
  //   key: "bid",
  //   label: "Bid",
  //   path: "/bidding",
  //   component: Company,
  // },

  // {
  //   key: "fare_management",
  //   label: "Fare Management",
  //   children: [
  //     {
  //       key: "cab_fare",
  //       label: "Cab Fare",
  //       children: [
  //         {
  //           key: "upload_fare",
  //           label: "Upload Fare",
  //           path: "/upload-fare",
  //           component: Company,
  //         },
  //         {
  //           key: "add_cab_fare",
  //           label: "Add Cab Fare",
  //           path: "/add-cab-fare",
  //           component: Company,
  //         },
  //       ],
  //     },
  //     {
  //       key: "view_local_package_fare",
  //       label: "View Local Package Fare",
  //       path: "/view-local-package-fare",
  //       component: Company,
  //     },
  //     {
  //       key: "vendor_cab_fare",
  //       label: "Vendor Cab Fare",
  //       path: "/vendor-cab-fare",
  //       component: Company,
  //     },
  //     {
  //       key: "guide_fare",
  //       label: "Guide Fare",
  //       path: "/guide-fare",
  //       component: Company,
  //     },
  //   ],
  // },
  // {
  //   key: "finance",
  //   label: "Finance",
  //   children: [
  //     {
  //       key: "payment_upload",
  //       label: "Payment Upload",
  //       path: "/payment-upload",
  //     },
  //     {
  //       key: "statement_of_account",
  //       label: "Statement of Account",
  //       path: "/statement-of-account",
  //     },
  //     {
  //       key: "invoice",
  //       label: "Invoice",
  //       path: "/invoice",
  //     },
  //     {
  //       key: "billing_management",
  //       label: "Billing Management",
  //       path: "/billing-management",
  //     },
  //     {
  //       key: "credit_limit",
  //       label: "Credit Limit",
  //       path: "/credit-limit",
  //     },
  //     {
  //       key: "payment_report",
  //       label: "Payment Report",
  //       path: "/payment-report",
  //     },
  //     {
  //       key: "credit_card_report",
  //       label: "Credit Card Report",
  //       path: "/credit-card-report",
  //     },
  //   ],
  // },

  // {
  //   key: "staff",
  //   label: "Staff",
  //   children: [
  //     {
  //       key: "add_staff",
  //       label: "Add Staff",
  //       path: "/add-staff",
  //     },
  //     {
  //       key: "department",
  //       label: "Department",
  //       path: "/department",
  //     },
  //     {
  //       key: "role_management",
  //       label: "Role Management",
  //       path: "/role-management",
  //     },
  //   ],
  // },
  // {
  //   key: "user_management",
  //   label: "User Management",
  //   children: [
  //     {
  //       key: "user",
  //       label: "User",
  //       path: "/user",
  //       component: Company,
  //     },
  //     {
  //       key: "vendor",
  //       label: "Vendor",
  //       path: "/vendor",
  //       component: Company,
  //     },
  //     {
  //       key: "driver",
  //       label: "Driver",
  //       path: "/driver",
  //       component: Company,
  //     },
  //     {
  //       key: "dmc",
  //       label: "DMC",
  //       path: "/dmc",
  //       component: Company,
  //     },
  //     {
  //       key: "company",
  //       label: "Company",
  //       path: "/add-company",
  //       component: Company,
  //     },
  //   ],
  // },
 
  // {
  //   key: "manage_masters",
  //   label: "Manage Masters",
  //   path: "/masters",
  //   component: Masters,
  // },
  

  /*
    {
        key: 'quotation',
        label: 'Quotation',
        path: '/quotation',
        component: Quotation,
    },
    {
        key: 'time_management',
        label: 'time_management',
        path: '/time_management',
        component: Quotation,
    },
     {
        key: 'manage_masters',
        label: 'Manage Masters',
        path: '/masters',
        component: Masters,
    },
   {
        key: 'module_pricing',
        label: 'Pricing',
        path: '/pricing',
        component: FeatureCards,
    },

    /*
    {
        key: 'staff_management',
        label: 'Staff Management',
        path: '/staff_management',
        component: Placeholder,
    },
    {
        key: 'role_management',
        label: 'Role Management',
        path: '/role_management',
        component: Placeholder,
    },
    {
        key: 'relationship_manager',
        label: 'Relationship Manager',
        path: '/relationship_manager',
        component: Placeholder,
    },
    {
        key: 'live_vehicle_mapping',
        label: 'Live Vehicle Mapping',
        path: '/live_vehicle_mapping',
        component: Placeholder,
    },
    {
        key: 'vehicle_management',
        label: 'Vehicle Management',
        path: '/vehicle_management',
        component: Placeholder,
    },
    {
        key: 'detailed_fare_history',
        label: 'Detailed Fare History',
        path: '/detailed_fare_history',
        component: Placeholder,
    },
    {
        key: 'fare_management',
        label: 'Fare Management',
        path: '/fare_management',
        component: Placeholder,
    },
    {
        key: 'booking_status_all',
        label: 'Booking Status (All)',
        path: '/booking_status_all',
        component: Placeholder,
    },
    {
        key: 'tracking_on_map',
        label: 'Tracking on Map',
        path: '/tracking_on_map',
        component: Placeholder,
    },
    {
        key: 'marketing_module',
        label: 'Marketing Module',
        path: '/marketing_module',
        component: Placeholder,
    },
    {
        key: 'passenger_details',
        label: 'Passenger Details',
        path: '/passenger_details',
        component: Placeholder,
    },
    {
        key: 'passenger_rating',
        label: 'Passenger Rating',
        path: '/passenger_rating',
        component: Placeholder,
    },
    {
        key: 'blacklist_passenger',
        label: 'Blacklist Passenger',
        path: '/blacklist_passenger',
        component: Placeholder,
    },
    {
        key: 'referrals',
        label: 'Referrals',
        path: '/referrals',
        component: Placeholder,
    },
    {
        key: 'fare_distance',
        label: 'Fare (Distance)',
        path: '/fare_distance',
        component: Placeholder,
    },
    {
        key: 'fare_hourly',
        label: 'Fare (Hourly)',
        path: '/fare_hourly',
        component: Placeholder,
    },
    {
        key: 'fare_distance_hour',
        label: 'Fare (Distance + Hour)',
        path: '/fare_distance_hour',
        component: Placeholder,
    },
    {
        key: 'fare_distance_waiting',
        label: 'Fare (Distance + Waiting)',
        path: '/fare_distance_waiting',
        component: Placeholder,
    },
    {
        key: 'commission_management',
        label: 'Commission Management',
        path: '/commission_management',
        component: Placeholder,
    },
    {
        key: 'surcharges_management',
        label: 'Surcharges Management',
        path: '/surcharges_management',
        component: Placeholder,
    },
    {
        key: 'time_management',
        label: 'Time Management',
        path: '/time_management',
        component: Placeholder,
    },
    */
];
