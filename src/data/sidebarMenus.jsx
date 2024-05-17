import { SiAmericanairlines } from "react-icons/si";
import { FiHome } from "react-icons/fi";
import {
    MdAddBusiness,
    MdAdminPanelSettings,
    MdAttractions,
    MdEmojiPeople,
    MdEventAvailable,
    MdLocalAirport,
    MdOutlineCategory,
    MdOutlineFastfood,
    MdOutlineHotelClass,
    MdOutlineSummarize,
    MdOutlineTour,
    MdSegment,
} from "react-icons/md";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { HiMiniTicket, HiTicket } from "react-icons/hi2";
import { RxDashboard } from "react-icons/rx";
import { ImAirplane } from "react-icons/im";
import {
    HiOutlineCurrencyDollar,
    HiOutlineDocumentReport,
    HiOutlineDocumentText,
    HiOutlineLocationMarker,
    HiOutlineShoppingCart,
    HiOutlineTicket,
    HiOutlineUsers,
} from "react-icons/hi";
import {
    RiHotelFill,
    RiHotelLine,
    RiSeoFill,
    RiSteeringFill,
} from "react-icons/ri";
import {
    BiCategoryAlt,
    BiGitCompare,
    BiHotel,
    BiMessageDetail,
    BiSolidUserAccount,
    BiTransferAlt,
} from "react-icons/bi";
import {
    AiFillCar,
    AiOutlineApi,
    AiOutlineBank,
    AiOutlineGroup,
    AiOutlineSchedule,
    AiOutlineShop,
    AiOutlineShoppingCart,
    AiOutlineSwap,
    AiOutlineUngroup,
} from "react-icons/ai";
import { RiRefund2Line, RiProfileLine } from "react-icons/ri";
import { GiWavyItinerary } from "react-icons/gi";
import { FaGlobe, FaThList } from "react-icons/fa";
import { BsFillChatLeftQuoteFill, BsImage } from "react-icons/bs";
import { IoBusiness, IoWalletOutline } from "react-icons/io5";
import { TbLicense } from "react-icons/tb";
import { CiDiscount1 } from "react-icons/ci";

const sidebarMenus = {
    Dashboard: [
        {
            name: "Dashboard",
            link: "/",
            icon: <RxDashboard />,
        },
        // {
        //     name: "Hotel",
        //     link: "/dashboard/hotel",
        //     icon: <BiHotel />,
        // },
        // {
        //     name: "Attraction",
        //     link: "/dashboard/attraction",
        //     icon: <MdAttractions />,
        // },
    ],
    Attraction: [
        {
            name: "Attractions List",
            icon: <MdAttractions />,
            link: "/attractions",
            permission: ["attractions", "view"],
        },
        // {
        //     name: "Add Attraction",
        //     icon: <MdAttractions />,
        //     link: "/attractions/add",
        //     permission: ["attraction-all", "view"],
        // },
        {
            name: "Attraction Categories",
            icon: <BiCategoryAlt />,
            link: "/attractions/categories",
            permission: ["attractions-categories", "view"],
        },
        {
            name: "Ticket Inventory",
            icon: <HiOutlineTicket />,
            link: "/attractions/tickets/inventory",
            permission: ["ticket-inventory", "view"],
        },
        {
            name: "Itineraries",
            icon: <GiWavyItinerary />,
            link: "/attractions/itineraries",
            permission: ["attr-itineraries", "view"],
        },
        {
            name: "Attraction Orders",
            icon: <HiOutlineShoppingCart />,
            link: "#",
            dropdown: [
                {
                    name: "Attraction Orders",
                    link: "/attractions/orders",
                    permission: ["attraction-orders", "view"],
                },
                {
                    name: "Attraction Bookings",
                    link: "/attractions/orders/bookings",
                    permission: ["attraction-orders", "view"],
                },
                {
                    name: "Attraction Tickets",
                    link: "/attractions/orders/tickets",
                    permission: ["attraction-orders", "view"],
                },
                {
                    name: "Order Statistics",
                    link: "/attractions/statistics",
                    permission: ["attraction-statistics", "view"],
                },
            ],
        },
        {
            name: "Guide",
            icon: <MdEmojiPeople />,
            link: "/attractions/guide",
            permission: ["attr-itineraries", "view"],
        },
        {
            name: "Ticket Themes",
            icon: <HiMiniTicket />,
            link: "/attractions/ticket/theme",
            permission: ["attractions-ticket-themes", "view"],
        },
    ],
    // Marketing: [
    //     {
    //         name: "Affiliate",
    //         icon: <HiOutlineShoppingCart />,
    //         link: "#",
    //         dropdown: [
    //             {
    //                 name: "Affiliate Settings",
    //                 link: "/affiliate/settings",
    //                 permission: ["affiliate-settings", "view"],
    //             },
    //             {
    //                 name: "Affiliate Products",
    //                 link: "/affiliate/products",
    //                 permission: ["affiliate-products", "view"],
    //             },
    //             {
    //                 name: "Affiliate Reports",
    //                 link: "/affiliate/reports",
    //                 permission: ["affiliate-reports", "view"],
    //             },
    //             {
    //                 name: "Affiliate Redeem Requests",
    //                 link: "/affiliate/redeem/requests",
    //                 permission: ["affiliate-redeem-requests", "view"],
    //             },
    //         ],
    //     },
    // ],
    Hotel: [
        {
            name: "Hotels List",
            icon: <BiHotel />,
            link: "/hotels",
            permission: ["hotels", "view"],
        },
        //     {
        //         name: "Boards List",
        //         icon: <MdOutlineFastfood />,
        //         link: "/hotels/boards",
        //         permission: ["hotel-boards", "view"],
        //     },
        //     {
        //         name: "Hotel Groups",
        //         icon: <AiOutlineGroup />,
        //         link: "/hotels/groups",
        //         permission: ["hotel-groups", "view"],
        //     },
        //     {
        //         name: "Hotel Chains",
        //         icon: <AiOutlineUngroup />,
        //         link: "/hotels/chains",
        //         permission: ["hotel-chains", "view"],
        //     },
        //     {
        //         name: "Star Categories",
        //         icon: <MdOutlineHotelClass />,
        //         link: "/hotels/star-categories",
        //         permission: ["star-categories", "view"],
        //     },
        //     {
        //         name: "Hotel Amenities",
        //         icon: <RiHotelFill />,
        //         link: "/hotels/amenities",
        //         permission: ["hotel-amenities", "view"],
        //     },
        //     {
        //         name: "Accommodation Types",
        //         icon: <RiHotelLine />,
        //         link: "/hotels/accommodation-types",
        //         permission: ["accommodation-types", "view"],
        //     },
        //     {
        //         name: "Room Occupancies",
        //         icon: <HiOutlineUsers />,
        //         link: "/hotels/room-occupancies",
        //         permission: ["room-occupancies", "view"],
        //     },
        //     {
        //         name: "Inventory Control",
        //         icon: <MdEventAvailable />,
        //         link: "/hotels/availability",
        //         permission: ["hotel-availability", "view"],
        //     },
        //     {
        //         name: "Hotel Requests",
        //         icon: <BiMessageDetail />,
        //         link: "/hotels/requests",
        //         permission: ["hotel-requests", "view"],
        //     },
        //     {
        //         name: "Reservation",
        //         icon: <AiOutlineShoppingCart />,
        //         link: "/hotels/reservation",
        //         permission: ["reservations", "view"],
        //     },
        //     // {
        //     //     name: "Comparison List",
        //     //     icon: <BiGitCompare />,
        //     //     link: "/hotels/comparison-list",
        //     //     permission: ["hotels", "view"],
        //     // },
        //     {
        //         name: "Hotel Settings",
        //         icon: <MdAdminPanelSettings />,
        //         link: "#",
        //         dropdown: [
        //             {
        //                 name: "Featured Hotels",
        //                 link: "/hotels/featured-hotels",
        //                 permission: ["hotels-settings", "view"],
        //             },
        //             {
        //                 name: "Hotel Banner Ads",
        //                 link: "/hotels/banner-ads",
        //                 permission: ["hotels-settings", "view"],
        //             },
        //             {
        //                 name: "Cache Settings",
        //                 link: "/hotels/cache-settings",
        //                 permission: ["hotels-settings", "view"],
        //             },
        //         ],
        //     },
    ],
    // Flight: [
    //     {
    //         name: "Bookings",
    //         icon: <AiOutlineShoppingCart />,
    //         link: "/flights/bookings",
    //         permission: ["flight-bookings", "view"],
    //     },
    //     {
    //         name: "Airports",
    //         icon: <MdLocalAirport />,
    //         link: "/airports",
    //         permission: ["airports", "view"],
    //     },
    //     {
    //         name: "Airlines",
    //         icon: <SiAmericanairlines />,
    //         link: "/airlines",
    //         permission: ["airlines", "view"],
    //     },
    // ],
    // Visa: [
    //     {
    //         name: "Visa Types",
    //         icon: <MdSegment />,
    //         link: "/visa",
    //         permission: ["visa-types", "view"],
    //     },
    //     {
    //         name: "B2c Visa Naitionalities",
    //         link: "/visa/nationalities",
    //         icon: <MdOutlineSummarize />,
    //         permission: ["b2c-visa-nationalitites", "view"],
    //     },
    //     {
    //         name: "Visa Request",
    //         icon: <HiOutlineDocumentText />,
    //         link: "/visa/request",
    //         permission: ["visa-requests", "view"],
    //     },
    //     {
    //         name: "Visa Countries",
    //         link: "/visa/country",
    //         icon: <FaGlobe />,
    //         permission: ["visa-countries", "view"],
    //     },
    //     {
    //         name: "Visa Enquires",
    //         link: "/visa/enquires",
    //         icon: <MdOutlineSummarize />,
    //         permission: ["visa-enquires", "view"],
    //     },
    // ],
    // A2A: [
    //     {
    //         name: "A2A List",
    //         icon: <ImAirplane />,
    //         link: "/a2a",
    //         permission: ["a2a-list", "view"],
    //     },
    //     {
    //         name: "A2A Enquiry",
    //         icon: <HiOutlineDocumentText />,
    //         link: "/a2a/enquiry",
    //         permission: ["a2a-enquiry", "view"],
    //     },
    //     {
    //         name: "A2A Summary",
    //         icon: <MdOutlineSummarize />,
    //         link: "/a2a/summary",
    //         permission: ["a2a-summary", "view"],
    //     },
    //     {
    //         name: "A2A Staistics",
    //         icon: <MdOutlineSummarize />,
    //         link: "/a2a/statistics",
    //         permission: ["a2a-statistics", "view"],
    //     },
    // ],
    // Quotation: [
    //     {
    //         name: "Quotation Dashboard",
    //         icon: <RxDashboard />,
    //         link: "/quotations/dashboard",
    //         permission: ["quotations-dashboard", "view"],
    //     },
    //     {
    //         name: "Create Quotation",
    //         icon: <BsFillChatLeftQuoteFill />,
    //         link: "/quotations/add",
    //         permission: ["create-quotations", "view"],
    //     },
    //     {
    //         name: "Quotation List",
    //         icon: <FaThList />,
    //         link: "/quotations",
    //         permission: ["quotations-list", "view"],
    //     },
    //     {
    //         name: "Quotation Reseller List",
    //         icon: <BiSolidUserAccount />,
    //         link: "/quotations/reseller",
    //         permission: ["quotations-reseller-list", "view"],
    //     },
    // ],
    // Insurance: [
    //     {
    //         name: "Insurance Plans",
    //         icon: <MdOutlineSummarize />,
    //         link: "/insurance/plans",
    //         permission: ["insurance-plans", "view"],
    //     },
    //     {
    //         name: "Insurance Enquiries",
    //         icon: <HiOutlineDocumentText />,
    //         link: "/insurance/enquiries",
    //         permission: ["insurance-enquiries", "view"],
    //     },
    // ],
    Transfer: [
        {
            name: "Transfer",
            icon: <BiTransferAlt />,
            link: "#",
            dropdown: [
                {
                    name: "Create Transfer",
                    link: "/transfers/add",
                    permission: ["transfers", "view"],
                },
                {
                    name: "Transfer List",
                    link: "/transfers",
                    permission: ["transfers", "view"],
                },
                {
                    name: "Create Group Area ",
                    link: "/transfers/area-group/add",
                    permission: ["transfers", "view"],
                },
                {
                    name: "Group Area",
                    link: "/transfers/area-group",
                    permission: ["transfers", "view"],
                },
            ],
        },
        {
            name: "Transfer Order",
            link: "/transfers/orders",
            icon: <RiSteeringFill />,
            permission: ["transfers-orders", "view"],
        },
        {
            name: "Vehicle",
            icon: <AiFillCar />,
            link: "#",
            dropdown: [
                // {
                //     name: "Vehicle List",
                //     link: "/transfers/vehicles",
                //     permission: ["vehicles", "view"],
                // },
                // {
                //     name: "Vehicle Makes",
                //     link: "/transfers/vehicles/makes",
                //     permission: ["vehicles", "view"],
                // },
                {
                    name: "Vehicle Categories",
                    link: "/transfers/vehicles/categories",
                    permission: ["vehicles", "view"],
                },
                // {
                //     name: "Vehicle Body Types",
                //     link: "/transfers/vehicles/body-types",
                //     permission: ["vehicles", "view"],
                // },
            ],
        },
        {
            name: "Drivers",
            link: "/drivers",
            icon: <RiSteeringFill />,
            permission: ["drivers", "view"],
        },
        {
            name: "License Types",
            link: "/license-types",
            icon: <TbLicense />,
            permission: ["license-types", "view"],
        },
    ],
    CMS: [
        {
            name: "B2B ",
            icon: <BiTransferAlt />,
            link: "#",
            dropdown: [
                {
                    name: "Logo",
                    link: "/b2b/frontend/home/settings/logo",
                    permission: ["b2b-frontend", "view"],
                },

                {
                    name: "Hero",
                    link: "/b2b/frontend/home/settings/hero",
                    permission: ["b2b-frontend", "view"],
                },
                {
                    name: "Cards",
                    link: "/b2b/frontend/home/settings/cards",
                    permission: ["b2b-frontend", "view"],
                },
                {
                    name: "Sections",
                    link: "/b2b/frontend/home/settings/sections",
                    permission: ["b2b-frontend", "view"],
                },
                {
                    name: "Footer",
                    link: "/b2b/frontend/home/settings/footer",
                    permission: ["b2b-frontend", "view"],
                },
                {
                    name: "Contact Details",
                    link: "/b2b/frontend/home/settings/contact-details",
                    permission: ["b2b-frontend", "view"],
                },
                {
                    name: "T&C And Policy",
                    link: "/b2b/frontend/home/settings/policy",
                    permission: ["b2b-frontend", "view"],
                },
                {
                    name: "Banners",
                    link: "/b2b/frontend/home/settings/banners",
                    permission: ["b2b-frontend", "view"],
                },
                {
                    name: "Home-sections",
                    link: "/b2b/frontend/home/settings/home-sections",
                    permission: ["b2b-frontend", "view"],
                },
            ],
        },
        {
            name: "B2C ",
            icon: <BiTransferAlt />,
            link: "#",
            dropdown: [
                {
                    name: "Logo",
                    link: "/b2c/frontend/home/settings/logo",
                    permission: ["b2c-frontend", "view"],
                },

                {
                    name: "Hero",
                    link: "/b2c/frontend/home/settings/hero",
                    permission: ["b2c-frontend", "view"],
                },
                {
                    name: "Cards",
                    link: "/b2c/frontend/home/settings/cards",
                    permission: ["b2c-frontend", "view"],
                },
                {
                    name: "Sections",
                    link: "/b2c/frontend/home/settings/sections",
                    permission: ["b2c-frontend", "view"],
                },
                {
                    name: "Footer",
                    link: "/b2c/frontend/home/settings/footer",
                    permission: ["b2c-frontend", "view"],
                },
                {
                    name: "Contact Details",
                    link: "/b2c/frontend/home/settings/contact-details",
                    permission: ["b2c-frontend", "view"],
                },
                {
                    name: "T&C And Policy",
                    link: "/b2c/frontend/home/settings/policy",
                    permission: ["b2c-frontend", "view"],
                },
                {
                    name: "Banners",
                    link: "/b2c/frontend/home/settings/banners",
                    permission: ["b2c-frontend", "view"],
                },
            ],
        },
    ],
    core: [
        {
            name: "Admin",
            link: "#",
            icon: <MdAdminPanelSettings />,
            role: "super-admin",
            dropdown: [
                {
                    name: "Admin List",
                    link: "/admins",
                    permission: ["admins", "view"],
                },
                {
                    name: "Admin Roles",
                    link: "/admins/roles",
                    permission: ["admin-roles", "view"],
                },
            ],
        },
        {
            name: "B2B",
            icon: <MdAddBusiness />,
            link: "#",
            dropdown: [
                {
                    name: "B2B List",
                    link: "/b2b",
                    permission: ["b2b-list", "view"],
                },
                {
                    name: "Sub Agents List",
                    link: "/sub-agents",
                    permission: ["sub-agents", "view"],
                },
                // {
                //     name: "Configurations",
                //     link: "/b2b/configurations",
                //     permission: ["b2b-configurations", "view"],
                // },
                // {
                //     name: "Home Sections",
                //     link: "/b2b/home/sections",
                //     permission: ["b2b-home-sections", "view"],
                // },
            ],
        },
        {
            name: "B2B Wallet",
            icon: <IoWalletOutline />,
            link: "#",
            dropdown: [
                {
                    name: "Wallet Statistics",
                    link: "/b2b/wallet/statistics",
                    permission: ["b2b-wallet-statistics", "view"],
                },
                {
                    name: "Deposits List",
                    link: "/b2b/wallet/deposits",
                    permission: ["b2b-wallet-deposits", "view"],
                },
                {
                    name: "Deposits Requests",
                    link: "/b2b/wallet/deposit-requests",
                    permission: ["b2b-wallet-deposits", "view"],
                },
                {
                    name: "Withdrawals List",
                    link: "/b2b/wallet/withdrawals",
                    permission: ["b2b-wallet-withdrawals", "view"],
                },
                {
                    name: "Withdraw Requests",
                    link: "/b2b/wallet/withdraw-requests",
                    permission: ["b2b-wallet-withdrawals", "view"],
                },
            ],
        },

        {
            name: "Location",
            icon: <HiOutlineLocationMarker />,
            link: "#",
            dropdown: [
                {
                    name: "Countries List",
                    link: "/countries",
                    permission: ["countries", "view"],
                },
                {
                    name: "Destinations",
                    link: "/destinations",
                    permission: ["destinations", "view"],
                },
            ],
        },
        {
            name: "Currencies",
            icon: <HiOutlineCurrencyDollar />,
            link: "/currencies",
            permission: ["currencies", "view"],
        },
        {
            name: "Markets",
            icon: <AiOutlineShop />,
            link: "/markets",
            permission: ["markets", "view"],
        },
    ],
    Vendor: [
        {
            name: "Vendor List",
            icon: <HiOutlineCurrencyDollar />,
            link: "/vendor",
            permission: ["vendor-list", "view"],
        },
    ],
    Marketing: [
        // {
        //     name: "Affiliate",
        //     icon: <HiOutlineShoppingCart />,
        //     link: "#",
        //     dropdown: [
        //         {
        //             name: "Affiliate Settings",
        //             link: "/affiliate/settings",
        //             permission: ["affiliate-settings", "view"],
        //         },
        //         {
        //             name: "Affiliate Products",
        //             link: "/affiliate/products",
        //             permission: ["affiliate-products", "view"],
        //         },
        //         {
        //             name: "Affiliate Reports",
        //             link: "/affiliate/reports",
        //             permission: ["affiliate-reports", "view"],
        //         },
        //         {
        //             name: "Affiliate Reedem Requests",
        //             link: "/affiliate/redeem/requests",
        //             permission: ["affiliate-redeem-requests", "view"],
        //         },
        //     ],
        // },
        {
            name: "SEO Settings",
            icon: <RiSeoFill />,
            link: "#",
            dropdown: [
                {
                    name: "SEO ",
                    link: "/seo/main-category",
                    permission: ["seo-main-cateogry", "view"],
                },
            ],
        },
        {
            name: "PromoCode",
            link: "/promo-code",
            icon: <CiDiscount1 />,
            permission: ["promo-code", "view"],
        },
        // {
        //     name: "Whatsapp Settings",
        //     icon: <FaWhatsapp />,
        //     link: "#",
        //     dropdown: [
        //         {
        //             name: "Whatsapp ",
        //             link: "/whatsapp/lists",
        //             permission: ["whatsapp-list", "view"],
        //         },
        //         {
        //             name: "Whatsapp Management ",
        //             link: "/whatsapp/management/lists",
        //             permission: ["whatsapp-managment", "view"],
        //         },
        //     ],
        // },
        // {
        //     name: "Notification ",
        //     icon: <MdNotificationAdd />,
        //     link: "#",
        //     dropdown: [
        //         {
        //             name: "Add Notification ",
        //             link: "/notification/add",
        //             permission: ["notification-add", "view"],
        //         },
        //         {
        //             name: "Notification List ",
        //             link: "/notification",
        //             permission: ["notification-list", "view"],
        //         },
        //     ],
        // },
    ],
    // Frontend: [
    //     {
    //         name: "B2B Frontend",
    //         icon: <AiOutlineSchedule />,
    //         link: "/b2b-frontend",
    //         permission: ["frontend", "view"],
    //     },
    //     {
    //         name: "Daily Reports",
    //         icon: <HiOutlineDocumentReport />,
    //         link: "/vouchers/daily-reports",
    //         permission: ["daily-reports", "view"],
    //     },
    //     {
    //         name: "Tour Schedules v2",
    //         icon: <AiOutlineSchedule />,
    //         link: "/vouchers/v2",
    //         permission: ["tour-schedules", "view"],
    //     },
    //     {
    //         name: "Daily Reports V2",
    //         icon: <HiOutlineDocumentReport />,
    //         link: "/vouchers/v2/daily-reports",
    //         permission: ["daily-reports", "view"],
    //     },
    //     {
    //         name: "Confirmed Qtns",
    //         icon: <HiOutlineDocumentReport />,
    //         link: "/confirmed-quotations",
    //         permission: ["daily-reports", "view"],
    //     },
    //     {
    //         name: "Tour Settings",
    //         icon: <MdAdminPanelSettings />,
    //         link: "#",
    //         dropdown: [
    //             {
    //                 name: "Voucher Settings",
    //                 link: "/vouchers/settings",
    //                 permission: ["voucher-settings", "view"],
    //             },
    //         ],
    //     },
    // ],
    // Marketing: [
    //     {
    //         name: "Affiliate",
    //         icon: <HiOutlineShoppingCart />,
    //         link: "#",
    //         dropdown: [
    //             {
    //                 name: "Affiliate Settings",
    //                 link: "/affiliate/settings",
    //                 permission: ["affiliate-settings", "view"],
    //             },
    //             {
    //                 name: "Affiliate Products",
    //                 link: "/affiliate/products",
    //                 permission: ["affiliate-products", "view"],
    //             },
    //             {
    //                 name: "Affiliate Reports",
    //                 link: "/affiliate/reports",
    //                 permission: ["affiliate-reports", "view"],
    //             },
    //             {
    //                 name: "Affiliate Reedem Requests",
    //                 link: "/affiliate/redeem/requests",
    //                 permission: ["affiliate-redeem-requests", "view"],
    //             },
    //         ],
    //     },
    // ],
    Accounts: [
        {
            name: "Transactions",
            link: "/transactions",
            icon: <AiOutlineSwap />,
            permission: ["transactions", "view"],
        },
        {
            name: "Refund",
            icon: <RiRefund2Line />,
            link: "#",
            dropdown: [
                {
                    name: "Refund List",
                    link: "/refund/list",
                    permission: ["refunds-list", "view"],
                },
            ],
        },
        {
            name: "Bank Accounts",
            link: "/bank-accounts",
            icon: <AiOutlineBank />,
            permission: ["bank-accounts", "view"],
        },
    ],
    // {
    //     name: "Subscribers",
    //     link: "/subscribers",
    //     icon: <MdSubscriptions />,
    // },
    // {
    //     name: "Blogs",
    //     icon: <ImBlog />,
    //     link: "#",
    //     dropdown: [
    //         {
    //             name: "Blogs List",
    //             link: "/blogs",
    //         },
    //         {
    //             name: "Add Blog",
    //             link: "/blogs/add",
    //         },
    //         {
    //             name: "Blogs Categories",
    //             link: "/blogs/categories",
    //         },
    //     ],
    // },
    // {
    //    name: "Coupons",
    //     link: "/coupons",
    //     icon: <RiCoupon2Line />,
    // },
    // {
    //     name: "Users",
    //     link: "/users",
    //     icon: <HiOutlineUsers />,
    // },
    Users: [
        {
            name: "B2c Users",
            link: "/users",
            icon: <HiOutlineUsers />,
            permission: ["users", "view"],
        },
    ],
    Orders: [
        {
            name: "Orders",
            link: "/orders",
            icon: <HiOutlineUsers />,
            permission: ["orders", "view"],
        },
    ],

    // Create_Orders: [
    //     {
    //         name: "Attraction",
    //         icon: <MdOutlineSummarize />,
    //         link: "#",
    //         dropdown: [
    //             {
    //                 name: " Create  Order",
    //                 link: "/order/attraction",
    //                 permission: ["attraction-order", "view"],
    //             },
    //             {
    //                 name: " Transaction",
    //                 link: "/order/attraction/transaction",
    //                 permission: ["attraction-transaction", "view"],
    //             },
    //         ],
    //     },
    //     {
    //         name: "Visa",
    //         icon: <HiOutlineDocumentText />,
    //         link: "/order/visa",
    //         permission: ["visa-order", "view"],
    //     },
    //     {
    //         name: "A2A",
    //         icon: <HiOutlineDocumentText />,
    //         link: "/order/a2a",
    //         permission: ["a2a-orders", "view"],
    //     },
    //     {
    //         name: "Flight",
    //         icon: <HiOutlineDocumentText />,
    //         link: "/order/flight",
    //         permission: ["flight-orders", "view"],
    //     },
    //     {
    //         name: "Insurance",
    //         icon: <HiOutlineDocumentText />,
    //         link: "/order/insurance",
    //         permission: ["insurance-orders", "view"],
    //     },
    // ],

    settings: [
        {
            name: "Banners",
            icon: <BsImage />,
            link: "/banners",
            permission: ["banners", "view"],
        },
        {
            name: "Markup Profile",
            icon: <RiProfileLine />,
            link: "#",
            dropdown: [
                {
                    name: "Profiles",
                    link: "/markup/profile",
                    permission: ["markup-profile", "view"],
                },
            ],
        },
        {
            name: "Market Strategy",
            icon: <IoBusiness />,
            link: "#",
            dropdown: [
                {
                    name: "Market Strategy List",
                    link: "/market/startegy",
                    permission: ["market-startegy", "view"],
                },
            ],
        },
        {
            name: "Seasons",
            icon: <TiWeatherPartlySunny />,
            link: "/seasons",
            permission: ["seasons", "view"],
        },
        {
            name: "API Master",
            icon: <AiOutlineApi />,
            link: "/api-master",
            permission: ["api-master", "view"],
        },
        // {
        //     name: "Email Settings",
        //     icon: <BiMailSend />,
        //     link: "#",
        //     dropdown: [
        //         {
        //             name: "Settings",
        //             link: "/email-settings",
        //         },
        //         {
        //             name: "Email Services",
        //             link: "/email-settings/services",
        //         },
        //         {
        //             name: "Emails",
        //             link: "/email-settings/emails",
        //         },
        //         // {
        //         //     name: "Sent List",
        //         //     link: "/email-settings/sent-list",
        //         // },
        //         // {
        //         //     name: "Compose Email",
        //         //     link: "/email-settings/compose",
        //         // },
        //     ],
        // },
        // {
        //     name: "Payment Settings",
        //     icon: <MdPayment />,
        //     link: "/payment-settings/services",
        // },
        {
            name: "Email Config",
            link: "/email-config",
            icon: <RiSteeringFill />,
            permission: ["email-config", "view"],
        },
        {
            name: "Email ReceiverConfig",
            link: "/email-receiver-config",
            icon: <RiSteeringFill />,
            permission: ["email-receiver-config", "view"],
        },

        {
            name: "Invoice Settings",
            icon: <FiHome />,
            link: "#",
            role: "super-admin",
            dropdown: [
                {
                    name: "Invoice Settings",
                    link: "/invoice/settings",
                    permission: ["invoice-settings", "view"],
                },
            ],
        },
    ],
};

export default sidebarMenus;
