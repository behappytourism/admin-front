import React, { useEffect, useState } from "react";
import moment from "moment";
import { MdNoTransfer } from "react-icons/md";
import { FaBus } from "react-icons/fa";
import AttractionOrdersTicketsModal from "./AttractionOrdersTicketsModal";
import { AiFillEye } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { config } from "../../../constants";
import axios from "../../../axios";
import BookingConfirmationModal from "../../Orders/components/BookingConfirmationModal";
import ActivityCancellationModal from "../../Orders/components/ActivityCancellationModal";
import TransferCancellationModal from "../../Orders/components/TransferCancellationModal";

export default function SingleTransferOrderTableRow({
    item,
    transferOrder,
    section,
    order,
    setOrder,
    orderItemIndex,
}) {
    const { jwtToken } = useSelector((state) => state.admin);
    const [isBookingConfirmationModalOpen, setIsBookingConfirmationModalOpen] =
        useState(false);
    const [isBookingCancellationModalOpen, setIsBookingCancellationModalOpen] =
        useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    const handleDownloadTickets = async () => {
        try {
            let pdfBuffer;
            if (section === "b2b") {
                pdfBuffer = await axios.get(
                    `/attractions/orders/b2b/${attractionOrder?._id}/orderItems/${orderItem?._id}/tickets`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                        responseType: "arraybuffer",
                    }
                );
            } else if (section === "b2c") {
                pdfBuffer = await axios.get(
                    `/attractions/orders/b2c/${attractionOrder?._id}/orderItems/${orderItem?._id}/tickets`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                        responseType: "arraybuffer",
                    }
                );
            }

            console.log(pdfBuffer, "pdfBuffer");
            const blob = new Blob([pdfBuffer.data], {
                type: "application/pdf",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `${attractionOrder?._id}.pdf`;
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.log(err);
        }
    };

    // useEffect(() => {
    //     setOrderData((prev) => {
    //         return {
    //             ...prev,
    //             status: orderItem?.status,
    //             bookingConfirmationNumber: orderItem?.bookingConfirmationNumber,
    //         };
    //     });
    // }, [attractionOrder, orderItem]);

    console.log(
        isBookingCancellationModalOpen,
        "isBookingCancellationModalOpen"
    );

    return (
        <>
            <tr key={orderItemIndex}>
                <td className="p-3">
                    <div className="flex gap-3">
                        <span className="">
                            {item?.trips[0]?.suggestionType.split("-")[0] ===
                            "AIRPORT"
                                ? item?.trips[0]?.transferFrom?.airportName
                                : item?.trips[0]?.transferFrom?.name}{" "}
                            -
                            {item?.trips[0]?.suggestionType.split("-")[1] ===
                            "AIRPORT"
                                ? item?.trips[0]?.transferTo?.airportName
                                : item?.trips[0]?.transferTo?.name}
                        </span>
                    </div>
                </td>
                <td className="p-3 capitalize">{item.transferType}</td>
                <td className="p-3 capitalize">
                    <div>
                        Ow -{" "}
                        {item.trips[0]?.vehicleTypes.map((type) => (
                            // Use + operator or template string to concatenate name and count
                            <span key={type.name}>
                                {type?.name} x ({type?.count}) ,
                            </span>
                        ))}
                    </div>
                    {item?.trips[1] && (
                        <div>
                            Rtn -{" "}
                            {item?.trips[1]?.vehicleTypes.map((type) => (
                                // Use + operator or template string to concatenate name and count
                                <span key={type.name}>
                                    {type?.name} x{type?.count}{" "}
                                </span>
                            ))}
                        </div>
                    )}
                </td>

                <td className="p-3">
                    {moment(item?.date).format("MMM D, YYYY")}
                </td>
                <td className="p-3">
                    {item?.noOfAdults} ADT, {item?.noOfChildrens} CHD{" "}
                </td>
                <td className="p-3">{item?.netPrice} AED</td>
                <td className="p-3">
                    <span
                        className={
                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                            (item?.status === "cancelled"
                                ? "bg-[#f065481A] text-[#f06548]"
                                : item?.status === "confirmed"
                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                        }
                    >
                        {item?.status}
                    </span>
                </td>
                {/* <td>
                    {item?.status === "confirmed" && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <select
                                className="h-[35px] py-0 w-[90px] mt-5"
                                onChange={(e) => {
                                    if (e.target.value === "confirm") {
                                        setIsBookingConfirmationModalOpen(true);
                                    } else if (e.target.value === "cancel") {
                                        e.target.value = e.target.value;
                                        setIsBookingCancellationModalOpen(true);
                                    }
                                }}
                                value={item.status}
                            >
                                {" "}
                                <option value="">Select</option>
                                <option value="cancel">Cancel</option>
                            </select>
                        </div>
                    )}
                </td> */}
                {/* <td className="p-3">
            <span
                className={
                    "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                    (item?.status ===
                    "cancelled"
                        ? "bg-[#f065481A] text-[#f06548]"
                        : item?.status ===
                          "confirmed"
                        ? "text-[#0ab39c] bg-[#0ab39c1A]"
                        : "bg-[#f7b84b1A] text-[#f7b84b]")
                }
            >
                {
                    item?.status
                }
            </span>
        </td> */}
            </tr>{" "}
            {isBookingCancellationModalOpen && (
                <TransferCancellationModal
                    setIsBookingConfirmationModalOpen={
                        setIsBookingCancellationModalOpen
                    }
                    setOrderData={setOrder}
                    orderId={transferOrder?._id}
                    bookingId={item?._id}
                    orderedBy={section}
                    order={order}
                    cancellationTb={false}
                    section={section}
                />
            )}
        </>
    );
}
