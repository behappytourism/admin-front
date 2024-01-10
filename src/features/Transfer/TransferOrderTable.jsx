import React from "react";

import { Pagination } from "../../components";
import TransferOrdersSingleRow from "./TransferOrderSingleRow";

export default function TransferOrdersTable({
    orders,
    filters,
    setFilters,
    section,
}) {
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Ref.No</th>
                            {section !== "b2c" && (
                                <th className="font-[500] p-3">Reseller</th>
                            )}
                            <th className="font-[500] p-3">Booking Date</th>
                            <th className="font-[500] p-3">Adults</th>
                            <th className="font-[500] p-3">Children</th>
                            <th className="font-[500] p-3">Price</th>
                            <th className="font-[500] p-3">Profit</th>
                            <th className="font-[500] p-3">Payment Status</th>
                            <th className="font-[500] p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {orders?.map((order) => {
                            return (
                                <TransferOrdersSingleRow
                                    key={order?._id}
                                    order={order}
                                    section={section}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalOrders}
                    incOrDecSkip={(number) =>
                        setFilters((prev) => {
                            return {
                                ...prev,
                                skip: prev.skip + number,
                            };
                        })
                    }
                    updateSkip={(skip) =>
                        setFilters((prev) => {
                            return { ...prev, skip };
                        })
                    }
                />
            </div>
        </div>
    );
}
