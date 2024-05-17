import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SidebarMenu from "./SidebarMenu";
import { sidebarMenus } from "../../data";
import { hasAnyViewPermission, hasPermission } from "../../utils";
import { config } from "../../constants";

const names = [
    "recent-hotel-reservations",
    "unconfirmed-hotel-reservations",
    "hotel-expiring-paylater-report",
    "next-day-arrival-hotel-reservations",
    "next-day-departure-hotel-reservations",
    "hotel-recent-cancellation-requests",
    "top-hotel-reservation-hotels",
    "top-hotel-reservation-resellers",
];
import { fetchOrderData } from "./../../redux/slices/generalSlice";

export default function Sidebar() {
    const { admin } = useSelector((state) => state.admin);
    const { b2bOrderCount, b2cOrderCount } = useSelector(
        (state) => state.general
    );
    const dispatch = useDispatch();

    const location = useLocation();
    const isHotelDashboard = hasAnyViewPermission({
        roles: admin?.roles || [],
        names,
    });
    useEffect(() => {
        dispatch(fetchOrderData());
    }, [location.pathname]);
    const filteredSidebars = {};
    Object.keys(sidebarMenus)?.map((item) => {
        const menus = sidebarMenus[item]?.filter((menu) => {
            if (menu?.link === "#" && menu?.dropdown?.length > 0) {
                const subMenus = menu?.dropdown?.filter((subMenu) => {
                    if (
                        hasPermission({
                            roles: admin?.roles,
                            name: subMenu?.permission && subMenu?.permission[0],
                            permission:
                                subMenu?.permission && subMenu?.permission[1],
                        })
                    ) {
                        return subMenu;
                    }
                });
                if (subMenus?.length > 0) {
                    menu.dropdown = subMenus;
                    return menu;
                }
            } else if (menu?.link === "/") {
                // if (!isHotelDashboard) {
                return menu;
                // }
            } else if (menu?.link === "/dashboard/hotel") {
                if (isHotelDashboard) {
                    return menu;
                }
            } else if (menu?.link === "/dashboard/attraction") {
                return menu;
            } else if (menu?.link !== "#") {
                if (
                    hasPermission({
                        roles: admin?.roles,
                        name: menu?.permission && menu?.permission[0],
                        permission: menu?.permission && menu?.permission[1],
                    })
                ) {
                    return menu;
                }
            }
        });

        if (menus?.length > 0) {
            filteredSidebars[item] = menus;
        }
    });

    return (
        <div className="sidebar top-0 left-0 flex h-[100vh] w-[250px] fixed bg-primaryColor flex-col transition-all ">
            <Link to="/" className="flex items-center justify-center py-5">
                <h2 className="text-lg font-[600] text-white uppercase">
                    {config.COMPANY_NAME?.split(" ")[0]}{" "}
                    <span className="text-sm text-red-500">
                        {config.COMPANY_NAME?.split(" ")[1]}
                    </span>
                </h2>
            </Link>

            <div id="sidebar" className="flex-1 overflow-y-auto mr-[3px]">
                {Object.keys(filteredSidebars)?.map((item, index) => {
                    return (
                        <div key={index} className="relative mt-6 first:mt-0">
                            <h4 className="px-[15px] text-[#b6b2d2] font-medium text-sm uppercase mb-1">
                                {item}
                            </h4>

                            <ul className="h-[100%]">
                                {filteredSidebars[item].map((item, index) => {
                                    // if (
                                    //     item?.role === "super-admin" &&
                                    //     admin?.role !== "super-admin"
                                    // ) {
                                    //     return <></>;
                                    // }
                                    return (
                                        <SidebarMenu
                                            key={index}
                                            {...item}
                                            count={
                                                Number(b2bOrderCount) +
                                                Number(b2cOrderCount)
                                            }
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>

            <div className="px-[30px] mt-[2em] pb-4">
                <p className="text-[#9590ae] text-[12px] font-[500] mt-[5px]">
                    <span className="text-[11px] font-[400]">
                        &#169; {new Date().getFullYear()} All Rights Reserved
                    </span>
                </p>
            </div>
        </div>
    );
}
