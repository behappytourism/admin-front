import React, { useState } from "react";
import BookingConfirmationModal from "../../Orders/components/BookingConfirmationModal";
import SingleAttrOrderActivitiesTableRow from "./SingleAttrOrderActivitiesTableRow";

export default function SingleAttrOrderActivitiesTable({
    order,
    setOrder,
    section,
}) {
    return (
        <div>
            <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                        <th className="font-[500] p-3">Activity</th>
                        <th className="font-[500] p-3">Date</th>
                        <th className="font-[500] p-3">Pax</th>
                        <th className="font-[500] p-3">Transfer</th>
                        <th className="font-[500] p-3">Tickets / Id</th>
                        <th className="font-[500] p-3">Amount</th>
                        <th className="font-[500] p-3">Status</th>{" "}
                        <th className="font-[500] p-3">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {order?.activities?.map((orderItem, orderItemIndex) => {
                        return (
                            <SingleAttrOrderActivitiesTableRow
                                key={orderItemIndex}
                                orderItem={orderItem}
                                order={order}
                                setOrder={setOrder}
                                section={section}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
