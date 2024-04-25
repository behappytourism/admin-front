import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
    bookingCancelledPng,
    bookingConfirmedPng,
    bookingReceivedPng,
    ticketBoughtPng,
    ticketCancelledPng,
    ticketConfirmedPng,
    totalRevenuePng,
    usersPng,
} from "../../assets/images";
import axios from "../../axios";
import { PageLoader } from "../../components";
import {
    TopSellingActivitiesCard,
    TopSellingResellersCard,
} from "../../features/AttractionsStatistics";
import { TopCard } from "../../features/Dashboard";
import B2bDashboardCard from "../../features/Dashboard/components/B2bDashboardCard";
import B2cDashboardCard from "../../features/Dashboard/components/B2cDashboardCard";
import LatestOrdersCard from "../../features/Orders/components/LatestOrderCard";

export default function Dashboard() {
    const [data, setData] = useState({
        totalProfit: "",
        totalCost: "",
        totalOrders: "",
        topSellingResellers: [],
        topSellingActivities: [],
        latestOrders: [],
    });
    const [section, setSection] = useState("b2b");
    const [limit, setLimit] = useState(10);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { admin, jwtToken } = useSelector((state) => state.admin);
    const fetchDashboardData = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                `/dashboard/all?section=${section}&limit=${limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setData((prev) => {
                return {
                    ...prev,
                    totalProfit: response.data?.totalProfit || 0,
                    totalCost: response.data?.totalCost || 0,
                    totalPrice: response.data?.totalPrice || 0,
                    totalOrders: response.data?.totalOrders || [],
                    topSellingActivities:
                        response.data?.topSellingActivities || [],
                    topSellingResellers:
                        response.data?.topSellingResellers || [],
                    latestOrders: response.data?.latestOrders || [],
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSectionChange = (e, value) => {
        e.preventDefault();
        setSection(value);
    };

    useEffect(() => {
        fetchDashboardData();
    }, [section, limit]);
    return (
        <div className="p-6">
            <div className="flex items-center justify-between gap-[10px] mb-5">
                <div>
                    <span className="font-medium text-textColor">
                        Good morning, {admin?.name}
                    </span>
                    <span className="block mt-1 text-[13px] text-grayColor">
                        Here's what's happening with your website today.
                    </span>
                </div>
                <div>
                    <select
                        name="limit"
                        id=""
                        className="w-[150px]"
                        onChange={(e) => {
                            setLimit(e.target.value);
                        }}
                    >
                        <option value="1">30</option>
                        <option value="60">60</option>
                        <option value="180">180</option>
                        <option value="360">360</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                <button
                    className={
                        "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                        (section === "b2b"
                            ? "border-b border-b-orange-500"
                            : "")
                    }
                    onClick={(e) => {
                        handleSectionChange(e, "b2b");
                    }}
                >
                    B2B
                </button>

                <button
                    className={
                        "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                        (section === "b2c"
                            ? "border-b border-b-orange-500"
                            : "")
                    }
                    onClick={(e) => {
                        handleSectionChange(e, "b2c");
                    }}
                >
                    B2C
                </button>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="mt-5">
                    <div className={` ${section === "b2b" ? "" : "hidden"}`}>
                        <B2bDashboardCard data={data} />{" "}
                    </div>
                    <div className={` ${section === "b2c" ? "" : "hidden"}`}>
                        <B2cDashboardCard data={data} />
                    </div>
                </div>
            )}
        </div>
    );
}
