import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import { HiArrowRight, HiArrowDown, HiArrowUp } from "react-icons/hi";

import { useHandleClickOutside } from "../../hooks";
import { logoutAdmin } from "../../redux/slices/adminSlice";
import { useDispatch } from "react-redux";

const navPages = [
    {
        name: "Home",
        path: "/",
    },
    {
        name: "Profile",
        path: "/profile",
    },
    {
        name: "Profile Settings",
        path: "/profile/edit",
    },
    {
        name: "Attractions List",
        path: "/attractions",
    },
    {
        name: "Attraction Categories",
        path: "/attractions/categories",
    },
    {
        name: "Add Attraction",
        path: "/attractions/add",
    },
    {
        name: "Attraction Ticket Inventory",
        path: "/attractions/tickets/inventory",
    },
    {
        name: "Itineraries",
        path: "/attractions/itineraries",
    },
    {
        name: "Attraction Orders",
        path: "/attractions/orders",
    },
    {
        name: "Attraction Bookings",
        path: "/attractions/orders/bookings",
    },
    {
        name: "Attraction Order Statistics",
        path: "/attractions/statistics",
    },
    // {
    //     name: "All Hotels",
    //     path: "/hotels",
    // },
    // {
    //     name: "Add Hotel",
    //     path: "/hotels/add",
    // },
    // {
    //     name: "Hotel Boards",
    //     path: "/hotels/boards",
    // },
    // {
    //     name: "Hotel Groups",
    //     path: "/hotels/groups",
    // },
    // {
    //     name: "Hotel Chains",
    //     path: "/hotels/chains",
    // },
    // {
    //     name: "Hotel Star Categories",
    //     path: "/hotels/star-categories",
    // },
    // {
    //     name: "Hotel Amenities",
    //     path: "/hotels/amenities",
    // },
    // {
    //     name: "Accommodation Types",
    //     path: "/hotels/accommodation-types",
    // },
    // {
    //     name: "Room Occupancies",
    //     path: "/hotels/room-occupancies",
    // },
    // {
    //     name: "Add Room Occupancy",
    //     path: "/hotels/room-occupancies/add",
    // },
    // {
    //     name: "Hotel Inventory Control",
    //     path: "/hotels/availability",
    // },
    // {
    //     name: "Hotel Requests",
    //     path: "/hotels/requests",
    // },
    // {
    //     name: "Hotel Reservation",
    //     path: "/hotels/reservation",
    // },
    // {
    //     name: "Featured Hotels",
    //     path: "/hotels/featured-hotels",
    // },
    // {
    //     name: "Hotel Banned Ads",
    //     path: "/hotels/banner-ads",
    // },
    // {
    //     name: "Flight Bookings",
    //     path: "/flights/bookings",
    // },
    // {
    //     name: "Airports",
    //     path: "/airports",
    // },
    // {
    //     name: "Add Airport",
    //     path: "/airports/add",
    // },
    // {
    //     name: "Airlines",
    //     path: "/airlines",
    // },
    // {
    //     name: "Add Airlines",
    //     path: "/airlines/add",
    // },
    // {
    //     name: "Visa Types",
    //     path: "/visa",
    // },
    // {
    //     name: "Add Visa Type",
    //     path: "/visa/add",
    // },
    // {
    //     name: "Visa Requests",
    //     path: "/visa/request",
    // },
    // {
    //     name: "Visa Countries",
    //     path: "/visa/country",
    // },
    // {
    //     name: "Add Visa Country",
    //     path: "/visa/country/add",
    // },
    // {
    //     name: "Visa Enquiries",
    //     path: "/visa/enquires",
    // },
    // {
    //     name: "A2A List",
    //     path: "/a2a",
    // },
    // {
    //     name: "Add A2A",
    //     path: "/a2a/add",
    // },
    // {
    //     name: "A2A Enquiries",
    //     path: "/a2a/enquiry",
    // },
    // {
    //     name: "A2A Summary",
    //     path: "/a2a/summary",
    // },
    // {
    //     name: "A2A Statistics",
    //     path: "/a2a/statistics",
    // },
    // {
    //     name: "Quotation Dashboard",
    //     path: "/quotations/dashboard",
    // },
    // {
    //     name: "Create Quotation",
    //     path: "/quotations/add",
    // },
    // {
    //     name: "Quotations List",
    //     path: "/quotations",
    // },
    // {
    //     name: "Quotation Resellers",
    //     path: "/quotations/reseller",
    // },
    // {
    //     name: "Insurance Plans",
    //     path: "/insurance/plans",
    // },
    // {
    //     name: "Insurance Enquiries",
    //     path: "/insurance/enquiries",
    // },
    // {
    //     name: "Tour Packages",
    //     path: "/tour-packages",
    // },
    // {
    //     name: "Add Tour Package",
    //     path: "/tour-packages/add",
    // },
    // {
    //     name: "Tour Package Themes",
    //     path: "/tour-packages/themes",
    // },
    // {
    //     name: "Tour Package Enquiries",
    //     path: "/tour-packages/enquiries",
    // },
    {
        name: "Admins",
        path: "/admins",
    },
    {
        name: "Add Admin",
        path: "/admins/add",
    },
    {
        name: "Admin Roles",
        path: "/admins/roles",
    },
    {
        name: "Add Admin Role",
        path: "/admins/roles/add",
    },
    {
        name: "B2B List",
        path: "/b2b",
    },
    {
        name: "Add B2B",
        path: "/b2b/add",
    },
    {
        name: "Sub Agents",
        path: "/sub-agents",
    },
    {
        name: "B2B Configurations",
        path: "/b2b/configurations",
    },
    {
        name: "B2B Wallet Statistics",
        path: "/b2b/wallet/statistics",
    },
    {
        name: "B2B Deposits List",
        path: "/b2b/wallet/deposits",
    },
    {
        name: "B2B Deposit Requests",
        path: "/b2b/wallet/deposit-requests",
    },
    {
        name: "B2B Withdrawals",
        path: "/b2b/wallet/withdrawals",
    },
    {
        name: "B2B Withdrawal Requests",
        path: "/b2b/wallet/withdraw-requests",
    },
    {
        name: "Countries",
        path: "/countries",
    },
    {
        name: "Destinations",
        path: "/destinations",
    },
    {
        name: "Currencies",
        path: "/currencies",
    },
    {
        name: "Markets",
        path: "/markets",
    },
    // {
    //     name: "Tour Schedules",
    //     path: "/vouchers",
    // },
    // {
    //     name: "Add Tour Schedule",
    //     path: "/vouchers/add",
    // },
    // {
    //     name: "Daily Reports (Tour Schedule)",
    //     path: "/vouchers/daily-reports",
    // },
    // {
    //     name: "Voucher Settings",
    //     path: "/vouchers/settings",
    // },
    {
        name: "Transactions",
        path: "/transactions",
    },
    {
        name: "Bank Accounts",
        path: "/bank-accounts",
    },
    {
        name: "B2C Users",
        path: "/users",
    },
    {
        name: "Markup Profiles",
        path: "/markup/profile",
    },
    {
        name: "Market Startegy",
        path: "/market/startegy",
    },
    {
        name: "API Master",
        path: "/api-master",
    },
    {
        name: "Invoice Settings",
        path: "/invoice/settings",
    },
    {
        name: "B2C Home Logo",
        path: "/home/settings/logo",
    },
    {
        name: "B2C Home Hero",
        path: "/home/settings/hero",
    },
    {
        name: "B2C Home Cards",
        path: "/home/settings/cards",
    },
    {
        name: "B2C Home Sections",
        path: "/home/settings/sections",
    },
    {
        name: "B2C Home Footer",
        path: "/home/settings/footer",
    },
    {
        name: "B2C Home Contact Details",
        path: "/home/settings/contact-details",
    },
];

const actions = [
    {
        key: "logout",
        name: "Logout",
    },
];

export default function GlobalSearchModal({ setIsSearchModalOpen }) {
    const [search, setSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState(0);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => {
        setIsSearchModalOpen(false);
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const filteredSearches = search
        ? navPages?.filter((page) => page.name?.toLowerCase()?.includes(search?.toLowerCase()))
        : [];

    const filteredActions = search
        ? actions?.filter((action) => action.name?.toLowerCase()?.includes(search?.toLowerCase()))
        : [];

    const handleKeyDownEvent = (event) => {
        if (event.key === "Escape") {
            setIsSearchModalOpen(false);
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedItem((prev) => {
                if (prev < filteredSearches.length + filteredActions.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedItem((prev) => {
                if (prev > 0) {
                    return prev - 1;
                }
                return prev;
            });
        } else if (event.key === "Enter") {
            if (selectedItem < filteredSearches?.length) {
                navigate(filteredSearches[selectedItem].path);
            } else {
                if (filteredActions[selectedItem - filteredSearches.length]?.key === "logout") {
                    dispatch(logoutAdmin());
                }
            }
            setIsSearchModalOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDownEvent, false);

        return () => {
            document.removeEventListener("keydown", handleKeyDownEvent, false);
        };
    }, [selectedItem, filteredSearches]);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex justify-center z-20">
            <div
                ref={wrapperRef}
                className="bg-white w-full mt-[100px] h-max max-h-[80vh] rounded max-w-[500px] shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)]"
            >
                <div className="border-b px-4">
                    <form
                        action=""
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Type a command or search..."
                            className="border-none outline-none px-0 h-[60px]"
                            autoFocus
                            value={search || ""}
                            onChange={(e) => {
                                setSelectedItem(0);
                                setSearch(e.target.value);
                            }}
                        />
                    </form>
                </div>
                {(filteredSearches?.length > 0 || filteredActions?.length > 0) && (
                    <div className="py-4 max-h-[300px] overflow-y-auto">
                        {filteredSearches?.length > 0 && (
                            <>
                                <h2 className="text-sm mb-2 px-4">Navigation</h2>
                                <div className="mb-3">
                                    {filteredSearches?.map((page, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={
                                                    "relative flex items-center gap-3 text-sm h-[40px] px-4 cursor-pointer transtion-all hover:bg-tableBorderColor hover:text-[#222] " +
                                                    (selectedItem === index
                                                        ? "bg-tableBorderColor text-[#222]"
                                                        : "text-gray-500")
                                                }
                                                onClick={() => {
                                                    navigate(page.path);
                                                    setIsSearchModalOpen(false);
                                                }}
                                            >
                                                <span>
                                                    <HiArrowRight />
                                                </span>
                                                <span>Go to {page?.name} Page</span>
                                                {selectedItem === index && (
                                                    <span className="absolute top-0 left-0 w-[2px] h-full bg-primaryColor"></span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {filteredActions?.length > 0 && (
                            <>
                                <h2 className="text-sm mb-2 px-4">Actions</h2>
                                <div className="">
                                    {filteredActions?.map((page, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={
                                                    "relative flex items-center gap-3 text-sm h-[40px] px-4 cursor-pointer transtion-all hover:bg-tableBorderColor hover:text-[#222] " +
                                                    (selectedItem === index + filteredSearches?.length
                                                        ? "bg-tableBorderColor text-[#222]"
                                                        : "text-gray-500")
                                                }
                                                onClick={() => {
                                                    dispatch(logoutAdmin());
                                                    setIsSearchModalOpen(false);
                                                }}
                                            >
                                                <span>
                                                    <HiArrowRight />
                                                </span>
                                                <span>{page?.name}</span>
                                                {selectedItem === index + filteredSearches?.length && (
                                                    <span className="absolute top-0 left-0 w-[2px] h-full bg-primaryColor"></span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="px-4 py-3 flex items-center justify-between border-t">
                    <div className="flex gap-3">
                        <div className="text-[13px] flex">
                            <span className="flex items-center justify-center bg-gray-200 mr-1 px-[5px] rounded-sm">
                                <HiArrowUp />
                            </span>
                            <span className="flex items-center justify-center bg-gray-200 mr-1 px-[5px] rounded-sm">
                                <HiArrowDown />
                            </span>
                            to navigate
                        </div>
                        <div className="text-[13px] flex">
                            <span className="flex items-center justify-center bg-gray-200 mr-1 px-[5px] rounded-sm">
                                <MdSubdirectoryArrowLeft />
                            </span>
                            to select
                        </div>
                    </div>
                    <span className="text-[13px]">
                        <span className="bg-gray-200 mr-1 px-[5px] rounded-sm">ESC</span>to close
                    </span>
                </div>
            </div>
        </div>
    );
}
