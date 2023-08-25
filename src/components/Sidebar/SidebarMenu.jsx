import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function SidebarMenu({ icon, name, dropdown, link }) {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    const location = useLocation();
    const { admin } = useSelector((state) => state.admin);

    return (
        <li className="group relative">
            <Link
                to={link}
                className={
                    `relative flex items-center text-[14.8px] justify-between px-[15px] py-[10px] transition-all hover:text-[#fff] ` +
                    (location.pathname === link
                        ? "text-[#fff] "
                        : "text-[#b6b2d2] ")
                }
                onClick={() => {
                    setIsDropDownOpen(!isDropDownOpen);
                }}
            >
                <span className="flex items-center gap-[15px] transition-all">
                    <i className="transition-all text-lg">{icon}</i>
                    {name}
                </span>
                <span
                    className={
                        "transition-all " +
                        (isDropDownOpen ? "rotate-90" : "rotate-0")
                    }
                >
                    {dropdown && <FiChevronRight />}
                </span>
            </Link>

            {dropdown && (
                <div className={isDropDownOpen ? "block mt-1 " : "hidden"}>
                    <ul
                        className={
                            `transition duration-150 ease-in-out ` +
                            (isDropDownOpen ? "max-h-[400px] " : "max-h-0  ")
                        }
                    >
                        {dropdown.map((dropItem, index) => {
                            if (
                                dropItem?.role === "super-admin" &&
                                admin.role !== "super-admin"
                            ) {
                                return <></>;
                            }
                            return (
                                <li key={index}>
                                    <Link
                                        to={dropItem.link}
                                        className={
                                            "relative flex items-center gap-[15px] px-0 pl-[26px] mb-[15px] text-[14px] hover:text-[#fff] before:w-[6px] before:h-[1px] before:bg-[#a3a6b7] dark:hover:text-darkTextColor " +
                                            (location.pathname === dropItem.link
                                                ? "text-[#fff] "
                                                : "text-[#9d96b8] ")
                                        }
                                    >
                                        {dropItem.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </li>
    );
}
