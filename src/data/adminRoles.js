const adminRoles = [
    // ATTRACTION
    {
        name: "attractions",
        displayName: "Attractions",
        category: "attraction",
        permissions: [],
    },
    {
        name: "attractions-categories",
        displayName: "Attractions Categories",
        category: "attraction",
        permissions: [],
    },
    {
        name: "ticket-inventory",
        displayName: "Ticket Inventory",
        category: "attraction",
        permissions: [],
    },
    {
        name: "attr-itineraries",
        displayName: "Attraction Itineraries",
        category: "attraction",
        permissions: [],
    },
    {
        name: "attraction-orders",
        displayName: "Attraction Orders",
        category: "attraction",
        permissions: [],
    },
    {
        name: "attraction-statistics",
        displayName: "Attraction Statistics",
        category: "attraction",
        permissions: [],
    },
    {
        name: "attraction-guide",
        displayName: "Guide",
        category: "attraction",
        permissions: [],
    },
    {
        name: "attractions-ticket-themes",
        displayName: "Attractions Ticket Themes",
        category: "attraction",
        permissions: [],
    },

    // HOTEL
    // {
    //     name: "hotels",
    //     displayName: "Hotels",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "hotel-boards",
    //     displayName: "Hotel Boards",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "hotel-groups",
    //     displayName: "Hotel Groups",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "hotel-chains",
    //     displayName: "Hotel Chains",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "star-categories",
    //     displayName: "Star Categories",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "hotel-amenities",
    //     displayName: "Hotel Amenities",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "accommodation-types",
    //     displayName: "Accommodation Types",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "room-occupancies",
    //     displayName: "Room Occupancies",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "hotel-availability",
    //     displayName: "Hotel Availability",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "hotel-requests",
    //     displayName: "Hotel Requests",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "reservations",
    //     displayName: "Reservations",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "contracts",
    //     displayName: "Contracts",
    //     category: "hotel",
    //     permissions: [],
    // },
    // {
    //     name: "hotels-settings",
    //     displayName: "Hotel Settings",
    //     category: "hotel",
    //     permissions: [],
    // },

    // FLIGHT
    // {
    //     name: "flight-bookings",
    //     displayName: "Flight Bookings",
    //     category: "flight",
    //     permissions: [],
    // },
    // {
    //     name: "airports",
    //     displayName: "Airports",
    //     category: "flight",
    //     permissions: [],
    // },
    // {
    //     name: "airlines",
    //     displayName: "Airlines",
    //     category: "flight",
    //     permissions: [],
    // },

    // VISA
    // {
    //     name: "visa-types",
    //     displayName: "Visa Types",
    //     category: "visa",
    //     permissions: [],
    // },
    // {
    //     name: "visa-requests",
    //     displayName: "Visa Requests",
    //     category: "visa",
    //     permissions: [],
    // },
    // {
    //     name: "visa-countries",
    //     displayName: "Visa Countries",
    //     category: "visa",
    //     permissions: [],
    // },
    // {
    //     name: "visa-enquires",
    //     displayName: "Visa Enquires",
    //     category: "visa",
    //     permissions: [],
    // },
    // {
    //     name: "b2c-visa-nationalitites",
    //     displayName: "B2c Visa Nationalitites",
    //     category: "visa",
    //     permissions: [],
    // },

    // TOUR
    // {
    //     name: "tour-schedules",
    //     displayName: "Tour Schedules",
    //     category: "tour",
    //     permissions: [],
    // },
    // {
    //     name: "daily-reports",
    //     displayName: "Daily Reports",
    //     category: "tour",
    //     permissions: [],
    // },
    // {
    //     name: "voucher-settings",
    //     displayName: "Voucher Settings",
    //     category: "tour",
    //     permissions: [],
    // },

    // A2A
    // {
    //     name: "a2a-list",
    //     displayName: "A2A List",
    //     category: "a2a",
    //     permissions: [],
    // },
    // {
    //     name: "a2a-enquiry",
    //     displayName: "A2A Enquiry",
    //     category: "a2a",
    //     permissions: [],
    // },
    // {
    //     name: "a2a-summary",
    //     displayName: "A2A Summary",
    //     category: "a2a",
    //     permissions: [],
    // },
    // {
    //     name: "a2a-statistics",
    //     displayName: "A2A Statistics",
    //     category: "a2a",
    //     permissions: [],
    // },

    // CORE
    {
        name: "admins",
        displayName: "Admins",
        category: "core",
        permissions: [],
    },
    {
        name: "admin-roles",
        displayName: "Admin Roles",
        category: "core",
        permissions: [],
    },
    {
        name: "countries",
        displayName: "Countries",
        category: "core",
        permissions: [],
    },

    // B2B
    {
        name: "b2b-list",
        displayName: "B2B List",
        category: "core",
        permissions: [],
    },
    {
        name: "sub-agents",
        displayName: "Sub Agents List",
        category: "core",
        permissions: [],
    },
    {
        name: "withdraw-requests",
        displayName: "Withdraw Requests",
        category: "core",
        permissions: [],
    },
    {
        name: "b2b-configurations",
        displayName: "B2B Configurations",
        category: "core",
        permissions: [],
    },

    // b2b wallet
    {
        name: "b2b-wallet-statistics",
        displayName: "Wallet Statistics",
        category: "b2b-wallet",
        permissions: [],
    },
    {
        name: "b2b-wallet-deposits",
        displayName: "Wallet Deposits",
        category: "b2b-wallet",
        permissions: [],
    },
    {
        name: "b2b-wallet-withdrawals",
        displayName: "Wallet Withdrawals",
        category: "b2b-wallet",
        permissions: [],
    },
    {
        name: "destinations",
        displayName: "Destinations",
        category: "core",
        permissions: [],
    },
    {
        name: "currencies",
        displayName: "Currencies",
        category: "core",
        permissions: [],
    },
    {
        name: "markets",
        displayName: "Markets",
        category: "core",
        permissions: [],
    },

    // ACCOUNT
    {
        name: "transactions",
        displayName: "Transactions",
        category: "account",
        permissions: [],
    },
    {
        name: "refunds-list",
        displayName: "Refunds List",
        category: "account",
        permissions: [],
    },
    {
        name: "bank-accounts",
        displayName: "Bank Accounts",
        category: "account",
        permissions: [],
    },

    // SETTINGS
    {
        name: "markup-profile",
        displayName: "Markup Profile",
        category: "settings",
        permissions: [],
    },
    {
        name: "market-startegy",
        displayName: "Market Startegy",
        category: "settings",
        permissions: [],
    },
    {
        name: "api-master",
        displayName: "Api Master",
        category: "settings",
        permissions: [],
    },

    //Quotations
    // {
    //     name: "create-quotations",
    //     displayName: "Create Quotations",
    //     category: "quotations",
    //     permissions: [],
    // },
    // {
    //     name: "quotations-list",
    //     displayName: "Quotation Listing",
    //     category: "quotations",
    //     permissions: [],
    // },
    // {
    //     name: "quotations-dashboard",
    //     displayName: "Quotation Dashboard",
    //     category: "quotations",
    //     permissions: [],
    // },
    // {
    //     name: "quotations-reseller-list",
    //     displayName: "Quotation Reseller Listing",
    //     category: "quotations",
    //     permissions: [],
    // },

    //Transfers
    {
        name: "transfers",
        displayName: "Transfer",
        category: "transfer",
        permissions: [],
    },
    {
        name: "transfers-orders",
        displayName: "Transfer Orders",
        category: "transfer",
        permissions: [],
    },
    {
        name: "vehicles",
        displayName: "Vehicles",
        category: "transfer",
        permissions: [],
    },
    {
        name: "drivers",
        displayName: "Drivers",
        category: "transfer",
        permissions: [],
    },
    {
        name: "license-types",
        displayName: "License Types",
        category: "transfer",
        permissions: [],
    },

    //Insurance
    // {
    //     name: "insurance-plans",
    //     displayName: "Insurance Plans",
    //     category: "insurance",
    //     permissions: [],
    // },
    // {
    //     name: "insurance-enquiries",
    //     displayName: "Insurance Enquiries",
    //     category: "insurance",
    //     permissions: [],
    // },

    //Affiliation
    // {
    //     name: "affiliate-settings",
    //     displayName: "Affiliate Settings",
    //     category: "marketing",
    //     permissions: [],
    // },
    // {
    //     name: "affiliate-reports",
    //     displayName: "Affiliate Reports",
    //     category: "marketing",
    //     permissions: [],
    // },
    // {
    //     name: "affiliate-products",
    //     displayName: "Affiliate Products",
    //     category: "marketing",
    //     permissions: [],
    // },
    // {
    //     name: "affiliate-redeem-requests",
    //     displayName: "Affiliate Redeem Requests",
    //     category: "marketing",
    //     permissions: [],
    // },

    // Users
    {
        name: "users",
        displayName: "Users",
        category: "users",
        permissions: [],
    },

    // Orders
    {
        name: "orders",
        displayName: "Orders",
        category: "Orders",
        permissions: [],
    },

    // seasons
    {
        name: "Seasons",
        displayName: "Seasons",
        category: "settings",
        permissions: [],
    },

    // Invoice
    {
        name: "invoice-settings",
        displayName: "Invoice Seasons",
        category: "invoice",
        permissions: [],
    },

    //orders
    {
        name: "attraction-order",
        displayName: "Attraction ",
        category: "order",
        permissions: [],
    },
    {
        name: "attraction-transaction",
        displayName: "Attraction Transaction",
        category: "order",
        permissions: [],
    },
    // {
    //     name: "visa-order",
    //     displayName: "Visa",
    //     category: "order",
    //     permissions: [],
    // },
    // {
    //     name: "a2a-orders",
    //     displayName: "A2a",
    //     category: "order",
    //     permissions: [],
    // },
    // {
    //     name: "flight-orders",
    //     displayName: "Flight",
    //     category: "order",
    //     permissions: [],
    // },

    // Reportings
    // {
    //     name: "recent-hotel-reservations",
    //     displayName: "Recent Hotel Reservations",
    //     category: "reportings",
    //     permissions: [],
    // },
    // {
    //     name: "unconfirmed-hotel-reservations",
    //     displayName: "Unconfirmed Hotel Reservations",
    //     category: "reportings",
    //     permissions: [],
    // },
    // {
    //     name: "hotel-expiring-paylater-report",
    //     displayName: "Hotel Expiring Paylater Report",
    //     category: "reportings",
    //     permissions: [],
    // },
    // {
    //     name: "next-day-arrival-hotel-reservations",
    //     displayName: "Next Day Arrival Hotel Reservations",
    //     category: "reportings",
    //     permissions: [],
    // },
    // {
    //     name: "next-day-departure-hotel-reservations",
    //     displayName: "Next Day Departure Hotel Reservations",
    //     category: "reportings",
    //     permissions: [],
    // },
    // {
    //     name: "hotel-recent-cancellation-requests",
    //     displayName: "Hotel Recent Cancellation Requests",
    //     category: "reportings",
    //     permissions: [],
    // },
    // {
    //     name: "top-hotel-reservation-hotels",
    //     displayName: "Top Hotels",
    //     category: "reportings",
    //     permissions: [],
    // },
    // {
    //     name: "top-hotel-reservation-resellers",
    //     displayName: "Top Hotel Resellers",
    //     category: "reportings",
    //     permissions: [],
    // },

    // TOUR PACKAGES
    {
        name: "b2b-frontend",
        displayName: "B2B Frontend",
        category: "frontend",
        permissions: [],
    },
    {
        name: "b2c-frontend",
        displayName: "B2C Frontend",
        category: "frontend",
        permissions: [],
    },
];

export default adminRoles;
