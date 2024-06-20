import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";

export default function TransferCancellationModal({
    setIsBookingConfirmationModalOpen,
    setOrderData,
    orderId,
    bookingId,
    orderedBy,
    cancellationTb,
    cancellationId,
    order,
    setOrder,
    section,
}) {
    const [data, setData] = useState({
        cancellationCharge: "",
        cancellationRemark: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setIsBookingConfirmationModalOpen(false)
    );
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };
    console.log(order, "order");
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            if (!cancellationTb) {
                const response = await axios.patch(
                    section === "b2c"
                        ? `/transfers/order/b2c/${orderId}/cancel/${bookingId}`
                        : `/transfers/order/b2b/${orderId}/cancel/${bookingId}  `,
                    {
                        cancellationCharge: data?.cancellationCharge,
                        cancellationRemark: data?.cancellationRemark,
                    },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                setOrderData((prev) => ({
                    ...prev,

                    cancellations:
                        prev.transferOrder?.cancellations?.length > 0
                            ? [
                                  response.data?.cancellation,
                                  ...prev.transferOrder?.cancellations,
                              ]
                            : [response.data?.cancellation],
                    refunds:
                        prev.transferOrder?.refunds?.length > 0
                            ? [
                                  response.data?.refund,
                                  ...prev.transferOrder?.refunds,
                              ]
                            : [response.data?.refund],
                    journey: prev.transferOrder?.journey.map((joun) => {
                        console.log(joun._id, "act");

                        if (
                            joun?._id.toString() ==
                            response.data.transferId.toString()
                        ) {
                            console.log("eneterd here 22");

                            return {
                                ...act,
                                status: "cancelled", // Assuming you want to set status to "success"
                            };
                        }
                        return joun;
                    }),
                }));
            } else {
                const response = await axios.patch(
                    section === "b2c"
                        ? `/attractions/orders/b2b/approve/canel-request/${cancellationId}`
                        : `/attractions/orders/b2c/approve/canel-request/${cancellationId}`,
                    {
                        cancellationCharge: data?.cancellationCharge,
                        cancellationRemark: data?.cancellationRemark,
                    },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                setOrderData((prev) => ({
                    ...prev,

                    cancellations: prev.transferOrder?.cancellations?.map(
                        (canc) => {
                            console.log(
                                canc._id,
                                cancellationId,
                                "cancellation"
                            );

                            if (
                                canc._id.toString() == cancellationId.toString()
                            ) {
                                console.log("eneterd here");
                                return {
                                    ...canc,
                                    ...response.data.cancellation,
                                };
                            }
                            return canc;
                        }
                    ),
                    journey: prev.transferOrder?.journey?.map((joun) => {
                        console.log(joun._id, response.data.transferId, "act");

                        if (
                            joun?._id.toString() ==
                            response.data.transferId.toString()
                        ) {
                            console.log("eneterd here 22");

                            return {
                                ...act,
                                status: "cancelled", // Assuming you want to set status to "success"
                            };
                        }
                        return joun;
                    }),
                    refunds:
                        prev.transferOrder?.refunds.length > 0
                            ? [
                                  response.data?.refund,
                                  ...prev.transferOrder?.refunds,
                              ]
                            : [response.data?.refund],
                }));
            }

            setIsLoading(false);
            setIsBookingConfirmationModalOpen(false);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Cancel Booking Status</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsBookingConfirmationModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Cancellation Charge</label>
                            <input
                                type="number"
                                placeholder="Enter Cancellation Charge"
                                name="cancellationCharge"
                                value={data?.cancellationCharge || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Cancellation Remark</label>
                            <textarea
                                type="text"
                                placeholder="Enter Cancellation Remark .."
                                name="cancellationRemark"
                                value={data?.cancellationRemark || ""}
                                onChange={handleChange}
                            />
                        </div>
                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() =>
                                    setIsBookingConfirmationModalOpen(false)
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? <BtnLoader /> : "Update Status"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
