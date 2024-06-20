import React, { useState } from "react";

import { formatDate } from "../../../utils";
import ActivityCancellationModal from "../../Orders/components/ActivityCancellationModal";

export default function AttractionOrderCancellationTableRow({
    cancellation,
    order,
    setOrder,
    section,
}) {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    return (
        <tr className="odd:bg-[#f3f6f9]">
            {" "}
            <td className="p-2">{cancellation?.activityName || "N/A"}</td>
            <td className="p-2">{formatDate(cancellation?.createdAt, true)}</td>
            <td className="p-2 whitespace-nowrap">
                {cancellation?.cancellationCharge
                    ? `${cancellation?.cancellationCharge?.toFixed(2)} AED`
                    : "N/A"}
            </td>
            <td className="p-2">{cancellation?.cancellationRemark || "N/A"}</td>
            <td className="p-2 capitalize">{cancellation?.cancelledBy}</td>
            <td className="p-2">{cancellation?.adminId?.name || "N/A"}</td>
            {/* <td className="p-2">
                {cancellation?.cancellationStatus === "pending" ? (
                    <div onClick={(e) => e.stopPropagation()}>
                        <select
                            className="h-[35px] py-0 w-[100px] capitalize"
                            onChange={(e) => {
                                if (e.target.value === "cancel") {
                                    setIsCancelModalOpen(true);
                                }
                            }}
                            value={cancellation?.cancellationStatus}
                        >
                            <option value="" hidden>
                                {cancellation?.cancellationStatus}
                            </option>
                            <option value="cancel">Cancel</option>
                        </select>
                        {isCancelModalOpen && (
                            <ActivityCancellationModal
                                setIsBookingConfirmationModalOpen={
                                    setIsCancelModalOpen
                                }
                                cancellationTb={true}
                                setOrderData={setOrder}
                                order={order}
                                cancellationId={cancellation?._id}
                                section={section}
                            />
                        )}
                    </div>
                ) : (
                    <span
                        className={
                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                            (cancellation?.cancellationStatus === "failed"
                                ? "bg-[#f065481A] text-[#f06548]"
                                : cancellation?.cancellationStatus === "success"
                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                        }
                    >
                        {cancellation?.cancellationStatus}
                    </span>
                )}
            </td> */}
            <td className="p-2">{cancellation?.cancellationStatus || "N/A"}</td>
        </tr>
    );
}
