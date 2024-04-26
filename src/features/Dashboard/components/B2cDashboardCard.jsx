import React from "react";
import { Link } from "react-router-dom";
import {
    TopSellingActivitiesCard,
    TopSellingResellersCard,
} from "../../AttractionsStatistics";
import LatestOrdersCard from "../../Orders/components/LatestOrderCard";
import TopCard from "./TopCard";
import {
    bookingCancelledPng,
    bookingConfirmedPng,
    bookingReceivedPng,
    totalRevenuePng,
} from "../../../assets/images";

export default function B2cDashboardCard({ data }) {
    return (
        <div>
            {" "}
            <div className="grid grid-cols-4 gap-6">
                <TopCard
                    title={"Total Turn Over"}
                    value={data.totalPrice}
                    link="/"
                    linkText="View all details"
                    icon={totalRevenuePng}
                    isAmount={true}
                />
                <TopCard
                    title={"Total Revenue"}
                    value={data.totalProfit}
                    link="/"
                    linkText="View all booking"
                    icon={bookingConfirmedPng}
                />
                <TopCard
                    title={"Total Cost"}
                    value={data.totalCost}
                    link="/"
                    linkText="View all booking"
                    icon={bookingReceivedPng}
                />

                <TopCard
                    title={"Total Orders"}
                    value={data.totalOrders}
                    link="/"
                    linkText="View all booking"
                    icon={bookingCancelledPng}
                />
                {/* <TopCard
        title={"Total Users Signed"}
        value={20}
        link="/"
        linkText="View all booking"
        icon={usersPng}
    />
    <TopCard
        title={"Total Ticket Bought"}
        value={10}
        link="/"
        linkText="View all booking"
        icon={ticketBoughtPng}
    />
    <TopCard
        title={"Total Ticket Confirmed"}
        value={6}
        link="/"
        linkText="View all booking"
        icon={ticketConfirmedPng}
    />
    <TopCard
        title={"Total Ticket Cancelled"}
        value={4}
        link="/"
        linkText="View all booking"
        icon={ticketCancelledPng}
    /> */}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5">
                <LatestOrdersCard
                    data={data.latestOrders || []}
                    section="b2c"
                />
                <TopSellingActivitiesCard
                    data={data.topSellingActivities || []}
                />
                <TopSellingResellersCard
                    data={data.topSellingResellers || []}
                    section="b2c"
                />
            </div>
        </div>
    );
}
