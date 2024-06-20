import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function CommonCancellationModal({
    attractionOrder,
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
    setTransferOrder,
    transferOrder,
}) {
    const [data, setData] = useState({
        cancellationCharge: "",
        cancellationRemark: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [cancelAtt, setCancelAtt] = useState([]);
    const [cancelTrans, setCancelTrans] = useState([]);
    const navigate = useNavigate();
    const [sum, setSum] = useState(0);
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

    const handleCheckBoxChange = (e, id, section) => {
        if (section === "attraction") {
            let cancelIndex = cancelAtt.findIndex((cancel) => cancel.id == id);

            if (cancelIndex !== -1) {
                setCancelAtt((prev) =>
                    prev.filter((_, index) => index !== cancelIndex)
                );
            } else {
                setCancelAtt((prev) => [...prev, { id: id, charge: "" }]);
            }
        } else if (section === "transfer") {
            let cancelIndex = cancelTrans.findIndex(
                (cancel) => cancel.id == id
            );

            if (cancelIndex !== -1) {
                setCancelTrans((prev) =>
                    prev.filter((_, index) => index !== cancelIndex)
                );
            } else {
                setCancelTrans((prev) => [...prev, { id: id, charge: "" }]);
            }
        }
    };

    const handleChargeChange = (e, id, section) => {
        if (section === "attraction") {
            const index = cancelAtt.findIndex((cancel) => cancel.id === id);

            if (index !== -1) {
                setCancelAtt((prev) =>
                    prev.map((item, i) =>
                        i === index ? { ...item, charge: e.target.value } : item
                    )
                );
            }
        } else if (section === "transfer") {
            const index = cancelTrans.findIndex((cancel) => cancel.id === id);

            if (index !== -1) {
                setCancelTrans((prev) =>
                    prev.map((item, i) =>
                        i === index ? { ...item, charge: e.target.value } : item
                    )
                );
            }
        }
    };

    console.log(order, "order");
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            if (!cancellationTb) {
                const response = await axios.patch(
                    section === "b2c"
                        ? `/orders/b2c/cancel/${orderId}`
                        : `/orders/b2b/cancel/${orderId}`,
                    {
                        attractionCancellations: cancelAtt,
                        transferCancellations: cancelTrans,
                        cancellationRemark: data?.cancellationRemark,
                    },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                const response = await axios.patch(
                    section === "b2c"
                        ? `/orders/b2c/cancel-approval/${cancellationId}`
                        : `/orders/b2b/cancel-approval/${cancellationId}`,
                    {
                        attractionCancellations: cancelAtt,
                        transferCancellations: cancelTrans,
                        cancellationRemark: data?.cancellationRemark,
                    },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
            }

            setIsLoading(false);
            setIsBookingConfirmationModalOpen(false);

            navigate(`/orders`);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const calculateSum = async () => {
        try {
            const sum = [...cancelAtt, ...cancelTrans].reduce(
                (acc, item) => Number(acc) + Number(item?.charge || 0),
                0
            );

            setSum(sum);
        } catch (err) {
            console.log(err);
            setError(err || "Something went wrong, Try again");
        }
    };

    useEffect(() => {
        calculateSum();
    }, [cancelAtt, cancelTrans]);

    useEffect(() => {
        if (cancellationTb) {
            console.log("Cancellation");
            setCancelAtt((prev) => {
                if (
                    !attractionOrder?.cancellations ||
                    !attractionOrder?.activities
                ) {
                    return prev; // Return previous state if either cancellations or activities are undefined or null
                }

                return attractionOrder?.cancellations
                    .map((cancel) => {
                        let act = attractionOrder.activities.find(
                            (att) => att._id === cancel.activityId
                        );

                        return act
                            ? {
                                  id: act._id,
                                  charge: "",
                                  cancellationId: cancel?._id,
                              }
                            : null; // Return null if act is not found
                    })
                    .filter((item) => item !== null); // Filter out any null values
            });

            setCancelTrans((prev) => {
                if (!transferOrder?.cancellations || !transferOrder?.journey) {
                    return prev; // Return previous state if either cancellations or activities are undefined or null
                }

                return transferOrder?.cancellations
                    .map((cancel) => {
                        let joun = transferOrder.journey.find(
                            (tnf) => tnf._id === cancel?.transferId
                        );

                        return joun
                            ? {
                                  id: joun._id,
                                  charge: "",
                                  cancellationId: cancel?._id,
                              }
                            : null; // Return null if act is not found
                    })
                    .filter((item) => item !== null); // Filter out any null values
            });
        }
    }, []);

    console.log(cancelAtt, cancelTrans, cancellationTb, sum, "cancelAtt");

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[180vh] max-w-[1000px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
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
                        {attractionOrder?.activities && (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Check
                                            </th>
                                            <th className="font-[500] p-3">
                                                Activity
                                            </th>
                                            <th className="font-[500] p-3">
                                                Date
                                            </th>
                                            <th className="font-[500] p-3">
                                                Total
                                            </th>
                                            <th className="font-[500] p-3">
                                                Charge
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {attractionOrder?.activities?.map(
                                            (
                                                attractionOrder,
                                                attractionOrderIndex
                                            ) => {
                                                return (
                                                    <tr>
                                                        <td className="p-3">
                                                            {" "}
                                                            <input
                                                                type="checkbox"
                                                                name="allGuestDetailsRequired"
                                                                checked={cancelAtt.find(
                                                                    (cancel) =>
                                                                        cancel.id ===
                                                                        attractionOrder._id
                                                                )}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleCheckBoxChange(
                                                                        e,
                                                                        attractionOrder._id,
                                                                        "attraction"
                                                                    );
                                                                }}
                                                                className="w-[17px] h-[17px]"
                                                                id="allGuestDetailsRequired"
                                                            />{" "}
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex gap-3">
                                                                <div>
                                                                    <span className="font-[500] block mt-1">
                                                                        {
                                                                            attractionOrder
                                                                                ?.activity
                                                                                ?.name
                                                                        }{" "}
                                                                        <span className="capitalize">
                                                                            (
                                                                            {
                                                                                attractionOrder?.bookingType
                                                                            }
                                                                            )
                                                                        </span>
                                                                    </span>
                                                                    <span className="block mt-1">
                                                                        {
                                                                            attractionOrder
                                                                                ?.attraction
                                                                                ?.title
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            {moment(
                                                                attractionOrder?.date
                                                            ).format(
                                                                "MMM D, YYYY"
                                                            )}
                                                        </td>

                                                        <td className="p-3">
                                                            {
                                                                attractionOrder?.grandTotal
                                                            }{" "}
                                                            AED
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                name="markup"
                                                                value={
                                                                    cancelAtt.find(
                                                                        (
                                                                            cancel
                                                                        ) =>
                                                                            cancel.id ===
                                                                            attractionOrder._id
                                                                    )?.charge ||
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleChargeChange(
                                                                        e,
                                                                        attractionOrder._id,
                                                                        "attraction"
                                                                    );
                                                                }}
                                                                className="h-[100%] arrow-hidden p-0 px-2 border-1 w-[150px]"
                                                                disabled={
                                                                    !cancelAtt.find(
                                                                        (
                                                                            cancel
                                                                        ) =>
                                                                            cancel.id ===
                                                                            attractionOrder._id
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {transferOrder?.journey && (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Check
                                            </th>
                                            <th className="font-[500] p-3">
                                                Transfer
                                            </th>
                                            <th className="font-[500] p-3">
                                                Date
                                            </th>
                                            <th className="font-[500] p-3">
                                                Total
                                            </th>
                                            <th className="font-[500] p-3">
                                                Charge
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {transferOrder?.journey?.map(
                                            (joun, attractionOrderIndex) => {
                                                return (
                                                    <tr>
                                                        <td className="p-3">
                                                            {" "}
                                                            <input
                                                                type="checkbox"
                                                                name="allGuestDetailsRequired"
                                                                checked={cancelTrans.find(
                                                                    (cancel) =>
                                                                        cancel.id ===
                                                                        joun._id
                                                                )}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleCheckBoxChange(
                                                                        e,
                                                                        joun._id,
                                                                        "transfer"
                                                                    );
                                                                }}
                                                                className="w-[17px] h-[17px]"
                                                                id="allGuestDetailsRequired"
                                                            />{" "}
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex gap-3">
                                                                <span className="">
                                                                    {joun?.trips[0]?.suggestionType.split(
                                                                        "-"
                                                                    )[0] ===
                                                                    "AIRPORT"
                                                                        ? joun
                                                                              ?.trips[0]
                                                                              ?.transferFrom
                                                                              ?.airportName
                                                                        : joun
                                                                              ?.trips[0]
                                                                              ?.transferFrom
                                                                              ?.name}{" "}
                                                                    -
                                                                    {joun?.trips[0]?.suggestionType.split(
                                                                        "-"
                                                                    )[1] ===
                                                                    "AIRPORT"
                                                                        ? joun
                                                                              ?.trips[0]
                                                                              ?.transferTo
                                                                              ?.airportName
                                                                        : joun
                                                                              ?.trips[0]
                                                                              ?.transferTo
                                                                              ?.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            {moment(
                                                                joun?.date
                                                            ).format(
                                                                "MMM D, YYYY"
                                                            )}
                                                        </td>

                                                        <td className="p-3">
                                                            {joun?.netPrice} AED
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                name="charge"
                                                                value={
                                                                    cancelTrans?.find(
                                                                        (
                                                                            cancel
                                                                        ) =>
                                                                            cancel?.id ===
                                                                            joun?._id
                                                                    )?.charge ||
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleChargeChange(
                                                                        e,
                                                                        joun._id,
                                                                        "transfer"
                                                                    );
                                                                }}
                                                                className="h-[100%] arrow-hidden p-0 px-2 border-1 w-[150px]"
                                                                disabled={
                                                                    !cancelTrans?.find(
                                                                        (
                                                                            cancel
                                                                        ) =>
                                                                            cancel?.id ===
                                                                            joun?._id
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                        <div className="flex justify-end items-center">
                            <label htmlFor="">Cancellation Charge Total</label>
                            <p className="ml-2 text-red-500 text-sm">{sum}</p>
                        </div>

                        <div>
                            <label htmlFor="">Cancellation Remark</label>
                            <textarea
                                type="text"
                                placeholder="Enter Cancellation Remark .."
                                name="cancellationRemark"
                                value={data.cancellationRemark || ""}
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
