import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import {
    AiOutlineDownload,
    AiOutlineMail,
    AiOutlinePhone,
} from "react-icons/ai";
import { MdNoTransfer } from "react-icons/md";
import { FaBus } from "react-icons/fa";
import moment from "moment";

import { PageLoader } from "../../components";
import axios from "../../axios";
import { config } from "../../constants";
import StatusModal from "./StatusModal";
import SingleAttrOrderActivitiesTableRow from "../../features/Attractions/components/SingleAttrOrderActivitiesTableRow";
import AttractionOrderCancellationTableRow from "../../features/Attractions/components/AttractionOrderCancellationTableRow";
import { formatDate } from "../../utils";
import SingleTransferOrderTableRow from "../../features/Attractions/components/SingleTransferOrderTableRow";
import ActivityCancellationModal from "../../features/Orders/components/ActivityCancellationModal";
import CommonCancellationModal from "../../features/Orders/components/CommonCancellationModal";
import TransferOrderCancellationTableRow from "../../features/Transfer/TransferOrderCancellationTableRow";

const sections = {
    payments: "Payments",
    cancellations: "Cancellations",
    refunds: "Refunds",
};

export default function SingleOrderDetailsPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [order, setOrder] = useState({});
    const [attractionOrder, setAttractionOrder] = useState({});
    const [transferOrder, setTransferOrder] = useState({});
    const [selectedSection, setSelectedSection] = useState("payments");
    const [isModal, setIsModal] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCancelApproveModalOpen, setIsCancelApproveModalOpen] =
        useState(false);

    const [cancellations, setCancellations] = useState([]);
    const [refunds, setRefunds] = useState([]);
    const { orderId, section, orderType } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchorder = async () => {
        try {
            setIsPageLoading(true);
            let response;
            if (section === "b2b") {
                response = await axios.get(`/orders/b2b/single/${orderId}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
            } else {
                response = await axios.get(`/orders/b2c/single/${orderId}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
            }

            setOrder({
                ...response?.data?.order,
                payments: response?.data?.payments,
            });
            setCancellations(response?.data?.cancellations || []);
            setRefunds(response?.data?.refunds || []);

            setTransferOrder(response?.data?.order?.transferOrder);
            setAttractionOrder(response?.data?.order?.attractionOrder);

            if (orderType === "cancelletion") {
                let statusChange = await axios.patch(
                    `/cancellation/orders/count/${orderId}`,
                    { type: section },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                let statusChange = await axios.patch(
                    `/orders/count/${orderId}`,
                    { type: section },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };
    const handleDownloadInvoice = async () => {
        try {
            if (section === "b2b") {
                const pdfBuffer = await axios.get(
                    `/orders/b2b/invoice/${orderId}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                        responseType: "arraybuffer",
                    }
                );

                console.log(pdfBuffer, "pdfBuffer");
                const blob = new Blob([pdfBuffer.data], {
                    type: "application/pdf",
                });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = `${orderId}-invoice.pdf`;
                document.body.appendChild(link);
                link.click();
            } else {
                const pdfBuffer = await axios.get(
                    `/orders/b2c/invoice/${orderId}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                        responseType: "arraybuffer",
                    }
                );

                console.log(pdfBuffer, "pdfBuffer");
                const blob = new Blob([pdfBuffer.data], {
                    type: "application/pdf",
                });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = `${orderId}-invoice.pdf`;
                document.body.appendChild(link);
                link.click();
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchorder();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Order Details
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>{">"} </span>
                    <Link to="/orders" className="text-textColor">
                        Orders{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>B2B </span>
                    <span>{">"} </span>
                    <span>
                        {orderId?.slice(0, 3)}...{orderId?.slice(-3)}
                    </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div>
                    {/* <div className="p-6 pb-0">
                        <div
                            className={
                                "w-full rounded shadow-sm p-3 " +
                                (hotelOrder?.status === "cancelled"
                                    ? "bg-[#f065481A] text-[#f06548]"
                                    : hotelOrder?.status === "confirmed"
                                    ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                    : "bg-[#f7b84b1A] text-[#f7b84b]")
                            }
                        >
                            <span className="capitalize font-medium text-[15px]">
                                {hotelOrder?.isCancellationPending === true
                                    ? "Order cancellation request recieved from B2B"
                                    : `Hotel Order ${hotelOrder?.status}`}
                                .
                            </span>
                            {hotelOrder?.status === "cancelled" && (
                                <span className="block text-sm mt-1">{hotelOrder?.cancellationRemark}</span>
                            )}
                        </div>
                    </div> */}
                    <div className="p-6">
                        <div className="bg-white p-4 shadow-sm rounded">
                            <div className="flex items-start justify-between gap-[20px]">
                                <div className="flex gap-[20px]">
                                    {/* <div className="w-[200px] h-[100px] rounded overflow-hidden bg-gray-200">
                                        <img
                                            src={
                                                config.SERVER_URL +
                                                order?.activities[0]?.attraction
                                                    ?.images[0]
                                            }
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div> */}
                                    <div>
                                        <h1 className="font-[600] text-lg">
                                            {order?.referenceNumber}
                                        </h1>
                                        <span className="block text-sm text-grayColor mt-1">
                                            {moment(order?.createdAt).format(
                                                "MMM D, YYYY HH:mm"
                                            )}
                                        </span>
                                        {section === "b2b" ? (
                                            <>
                                                {" "}
                                                <span className="block mt-2 font-[500] text-sm">
                                                    <Link
                                                        to={`/b2b/${order?.reseller?._id}/details`}
                                                        className="underline text-blue-500"
                                                    >
                                                        {
                                                            order?.reseller
                                                                ?.companyName
                                                        }
                                                    </Link>{" "}
                                                    - (
                                                    {order?.reseller?.agentCode}
                                                    )
                                                </span>
                                                <span className="block mt-1 text-sm">
                                                    {order?.reseller?.name} (
                                                    {order?.reseller?.email})
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                {" "}
                                                <span className="block mt-2 font-[500] text-sm">
                                                    <Link
                                                        to={`/users/${order?.user?._id}/details`}
                                                        className="underline text-blue-500"
                                                    >
                                                        {order?.user?.name}
                                                    </Link>{" "}
                                                </span>
                                                <span className="block mt-1 text-sm">
                                                    {order?.user?.email}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-[25px] ">
                                    {order?.orderStatus === "completed" ? (
                                        <div className="text-center flex gap-2">
                                            <span className="block text-[12px] text-grayColor font-medium">
                                                Download Invoice
                                            </span>
                                            <span
                                                className="font-[600] text-lg text-green-600 flex items-center cursor-pointer"
                                                onClick={handleDownloadInvoice}
                                            >
                                                <AiOutlineDownload />
                                            </span>
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                    <div className="text-center">
                                        <span className="block text-[12px] text-grayColor font-medium">
                                            Net Price
                                        </span>
                                        <span className="font-[600] text-lg text-green-600">
                                            {order?.netPrice?.toFixed(2)} AED
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[12px] text-grayColor font-medium mb-1">
                                            Payment State
                                        </span>
                                        <span
                                            className={
                                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                (order?.paymentState ===
                                                "non-paid"
                                                    ? "bg-[#f065481A] text-[#f06548]"
                                                    : order?.paymentState ===
                                                      "fully-paid"
                                                    ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                    : "bg-[#f7b84b1A] text-[#f7b84b]")
                                            }
                                        >
                                            {order?.paymentState || "N/A"}
                                        </span>
                                    </div>
                                    <div className="">
                                        <span className="block text-[12px] text-grayColor font-medium mb-1">
                                            Order Status
                                        </span>
                                        <span
                                            className={
                                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                (order?.orderStatus === "failed"
                                                    ? "bg-[#f065481A] text-[#f06548]"
                                                    : order?.orderStatus ===
                                                      "completed"
                                                    ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                    : "bg-[#f7b84b1A] text-[#f7b84b]")
                                            }
                                        >
                                            {order?.orderStatus || "N/A"}
                                        </span>
                                    </div>
                                    {/* {order?.order === "confirmed" && (
                                        <button
                                            className="px-3 bg-[#299cdb] flex items-center gap-2"
                                            onClick={handleVocherDownload}
                                        >
                                            <span className="text-lg">
                                                <AiOutlineCloudDownload />
                                            </span>
                                            Download
                                        </button>
                                    )} */}
                                    {order?.orderStatus === "completed" &&
                                        cancellations?.length < 1 && (
                                            <div className="text-center">
                                                <span className="block text-[12px] text-grayColor font-medium">
                                                    Cancel Order
                                                </span>
                                                <span
                                                    className={
                                                        "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                        "bg-red-200 text-red-500 cursor-pointer"
                                                    }
                                                    onClick={(e) => {
                                                        setIsCancelModalOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Cancel
                                                </span>
                                            </div>
                                        )}

                                    {order?.orderStatus === "completed" &&
                                        cancellations?.length > 0 && (
                                            <div className="text-center">
                                                <span className="block text-[12px] text-grayColor font-medium">
                                                    Cancellation Request
                                                </span>
                                                <span
                                                    className={
                                                        "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                        "bg-red-200 text-red-500 cursor-pointer"
                                                    }
                                                    onClick={(e) => {
                                                        setIsCancelApproveModalOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Cancellation Request
                                                </span>
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-6 w-full">
                                <div>
                                    <table className="w-full text-[15px]">
                                        <tbody>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2 w-[180px]">
                                                    Supplier
                                                </td>
                                                <td className="p-2 font-medium uppercase text-green-500">
                                                    Be Happy
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2 w-[180px]">
                                                    Order Type
                                                </td>
                                                <td className="p-2">
                                                    {section === "b2c"
                                                        ? "B2C PORTAL"
                                                        : order?.orderType ===
                                                          "b2b-api"
                                                        ? "API Gateway"
                                                        : "B2B Portal"}
                                                </td>
                                            </tr>
                                            {section === "b2B" ? (
                                                <tr className="odd:bg-[#f3f6f9]">
                                                    <td className="p-2 w-[180px]">
                                                        Agent Ref.No
                                                    </td>
                                                    <td className="p-2">
                                                        {order?.agentReferenceNumber ||
                                                            "N/A"}
                                                    </td>
                                                </tr>
                                            ) : (
                                                ""
                                            )}
                                            {section === "b2B" ? (
                                                <tr className="odd:bg-[#f3f6f9]">
                                                    <td className="p-2">
                                                        Special Request
                                                    </td>
                                                    <td className="p-2">
                                                        {order?.specialRequest
                                                            ? order?.specialRequest
                                                            : "N/A"}
                                                    </td>
                                                </tr>
                                            ) : (
                                                ""
                                            )}
                                        </tbody>
                                    </table>
                                    <div>
                                        <div className="mt-7">
                                            <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                <BsFillArrowRightCircleFill />{" "}
                                                Contact Details
                                            </h1>
                                            <div className="flex gap-[25px] flex-wrap text-[15px]">
                                                <div className="flex items-center gap-[10px]">
                                                    <span>
                                                        <AiOutlineMail />
                                                    </span>
                                                    {order?.email}
                                                </div>
                                                <div className="flex items-center gap-[10px]">
                                                    <span>
                                                        <AiOutlinePhone />
                                                    </span>
                                                    {order?.country?.phonecode}{" "}
                                                    {order?.phoneNumber}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="px-2">
                                        {attractionOrder && (
                                            <>
                                                {" "}
                                                <div className="odd:bg-[#f3f6f9]">
                                                    <h2 className="p-2 w-[180px]">
                                                        Activities
                                                    </h2>
                                                </div>
                                                <table className="w-full text-[15px]">
                                                    <tbody>
                                                        {attractionOrder?.activities?.map(
                                                            (
                                                                orderItem,
                                                                orderItemIndex
                                                            ) => {
                                                                return (
                                                                    <>
                                                                        <tr
                                                                            key={
                                                                                orderItemIndex
                                                                            }
                                                                        >
                                                                            <td className="font-medium py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        {
                                                                                            orderItem
                                                                                                ?.activity
                                                                                                ?.name
                                                                                        }
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        {orderItem?.grandTotal?.toFixed(
                                                                                            2
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            key={
                                                                                orderItemIndex
                                                                            }
                                                                        >
                                                                            <td className="text-grayColor py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Activity
                                                                                        Cost
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        {orderItem?.grandTotal?.toFixed(
                                                                                            2
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            key={
                                                                                orderItemIndex
                                                                            }
                                                                        >
                                                                            <td className="text-grayColor py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Market
                                                                                        Markup
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        0
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            key={
                                                                                orderItemIndex
                                                                            }
                                                                        >
                                                                            <td className="text-grayColor py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Admin
                                                                                        Markup
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        0
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            key={
                                                                                orderItemIndex
                                                                            }
                                                                        >
                                                                            <td className="text-grayColor py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Agent
                                                                                        To
                                                                                        Sub
                                                                                        Agent
                                                                                        Markup
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        0
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="text-grayColor py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Client
                                                                                        Markup
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        0
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                );
                                                            }
                                                        )}
                                                        <tr>
                                                            <td className="font-medium py-1 w-full">
                                                                <div className="flex gap-[15px] items-center w-full">
                                                                    <span className="">
                                                                        Total
                                                                        Offer
                                                                    </span>
                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                    <span className="text-right">
                                                                        -{" "}
                                                                        {order
                                                                            ?.attractionOrder
                                                                            ?.discountOffer ||
                                                                            0}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="font-medium py-2 w-full">
                                                                <div className="flex gap-[15px] items-center w-full">
                                                                    <span className="">
                                                                        Net
                                                                        Price
                                                                    </span>
                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                    <span className="text-right font-[600] text-lg text-green-500 whitespace-nowrap">
                                                                        AED{" "}
                                                                        {attractionOrder?.totalAmount?.toFixed(
                                                                            2
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </>
                                        )}
                                        {transferOrder && (
                                            <>
                                                <div className="odd:bg-[#f3f6f9]">
                                                    <h2 className="p-2 w-[180px]">
                                                        Transfer
                                                    </h2>
                                                </div>
                                                <table className="w-full text-[15px]">
                                                    <tbody>
                                                        {transferOrder?.journey?.map(
                                                            (
                                                                item,
                                                                orderItemIndex
                                                            ) => {
                                                                return (
                                                                    <>
                                                                        <tr
                                                                            key={
                                                                                orderItemIndex
                                                                            }
                                                                        >
                                                                            <td className="font-medium py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        {item?.trips[0]?.suggestionType.split(
                                                                                            "-"
                                                                                        )[0] ===
                                                                                        "AIRPORT"
                                                                                            ? item
                                                                                                  ?.trips[0]
                                                                                                  ?.transferFrom
                                                                                                  ?.airportName
                                                                                            : item
                                                                                                  ?.trips[0]
                                                                                                  ?.transferFrom
                                                                                                  ?.name}{" "}
                                                                                        -
                                                                                        {item?.trips[0]?.suggestionType.split(
                                                                                            "-"
                                                                                        )[1] ===
                                                                                        "AIRPORT"
                                                                                            ? item
                                                                                                  ?.trips[0]
                                                                                                  ?.transferTo
                                                                                                  ?.airportName
                                                                                            : item
                                                                                                  ?.trips[0]
                                                                                                  ?.transferTo
                                                                                                  ?.name}
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        {item?.netPrice?.toFixed(
                                                                                            2
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            key={
                                                                                orderItemIndex
                                                                            }
                                                                        >
                                                                            <td className="text-grayColor py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Transfer
                                                                                        Cost
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        {item.netCost?.toFixed(
                                                                                            2
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            key={
                                                                                orderItemIndex
                                                                            }
                                                                        >
                                                                            <td className="text-grayColor py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Market
                                                                                        Markup
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        {item?.marketMarkup ||
                                                                                            0}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            key={
                                                                                orderItemIndex
                                                                            }
                                                                        >
                                                                            <td className="text-grayColor py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Profile
                                                                                        Markup
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        {item?.profileMarkup ||
                                                                                            0}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            key={
                                                                                orderItemIndex
                                                                            }
                                                                        >
                                                                            <td className="text-grayColor py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Agent
                                                                                        To
                                                                                        Sub
                                                                                        Agent
                                                                                        Markup
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        0
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="text-grayColor py-1 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Client
                                                                                        Markup
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600]">
                                                                                        0
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="font-medium py-2 w-full">
                                                                                <div className="flex gap-[15px] items-center w-full">
                                                                                    <span className="">
                                                                                        Net
                                                                                        Price
                                                                                    </span>
                                                                                    <div className="border-b border-dashed flex-1"></div>
                                                                                    <span className="text-right font-[600] text-lg text-green-500 whitespace-nowrap">
                                                                                        AED{" "}
                                                                                        {item?.netPrice?.toFixed(
                                                                                            2
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </>
                                        )}
                                        {order.isCardPayment && (
                                            <>
                                                <div className="odd:bg-[#f3f6f9]">
                                                    <h2 className="p-2 w-[180px]">
                                                        Card Payment
                                                    </h2>
                                                </div>
                                                <div className="flex gap-[15px] items-center w-full">
                                                    <span className="">
                                                        Net Price
                                                    </span>
                                                    <div className="border-b border-dashed flex-1"></div>
                                                    <span className="text-right font-[600] text-lg text-green-500 whitespace-nowrap">
                                                        AED{" "}
                                                        {order?.cardCharge?.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {attractionOrder && (
                                <>
                                    <div className="mt-10">
                                        <table className="w-full">
                                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                                <tr>
                                                    <th className="font-[500] p-3">
                                                        Activity
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Date
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Pax
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Transfer
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Tickets / Id
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Amount
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Status
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {attractionOrder?.activities?.map(
                                                    (
                                                        orderItem,
                                                        orderItemIndex
                                                    ) => {
                                                        return (
                                                            <SingleAttrOrderActivitiesTableRow
                                                                key={
                                                                    orderItemIndex
                                                                }
                                                                orderItem={
                                                                    orderItem
                                                                }
                                                                section={
                                                                    section
                                                                }
                                                                setOrder={
                                                                    setAttractionOrder
                                                                }
                                                                order={
                                                                    attractionOrder
                                                                }
                                                            />
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-7">
                                        <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                            <BsFillArrowRightCircleFill />{" "}
                                            Cancellation Requests
                                        </h1>
                                        {attractionOrder?.cancellations
                                            ?.length < 1 ? (
                                            <div className="p-4 flex flex-col items-center">
                                                <span className="text-sm text-grayColor block mt-[6px]">
                                                    Oops.. No Cancellations
                                                    Found
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-[14px]">
                                                    <tbody>
                                                        <tr className="odd:bg-[#f3f6f9]">
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Activity Name
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Date
                                                            </td>

                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Charge
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Remark
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Cancelled By
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Admin
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Status
                                                            </td>
                                                        </tr>
                                                        {attractionOrder?.cancellations?.map(
                                                            (
                                                                cancellation,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <AttractionOrderCancellationTableRow
                                                                        key={
                                                                            index
                                                                        }
                                                                        cancellation={
                                                                            cancellation
                                                                        }
                                                                        setOrder={
                                                                            setAttractionOrder
                                                                        }
                                                                        order={
                                                                            order
                                                                        }

                                                                        // setHotelOrder={
                                                                        //     setHotelOrder
                                                                        // }
                                                                    />
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-7">
                                        <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                            <BsFillArrowRightCircleFill />{" "}
                                            Refunds
                                        </h1>
                                        {attractionOrder?.refunds?.length <
                                        1 ? (
                                            <div className="p-4 flex flex-col items-center">
                                                <span className="text-sm text-grayColor block mt-[6px]">
                                                    Oops.. No Refunds Found
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-[14px]">
                                                    <tbody>
                                                        <tr className="odd:bg-[#f3f6f9]">
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Activity Name
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Date
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Payment Method
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Amount
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Note
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Status
                                                            </td>
                                                        </tr>
                                                        {attractionOrder?.refunds?.map(
                                                            (refund, index) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="odd:bg-[#f3f6f9]"
                                                                    >
                                                                        {" "}
                                                                        <td className="p-2">
                                                                            {
                                                                                refund?.activityName
                                                                            }
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {formatDate(
                                                                                refund?.createdAt,
                                                                                true
                                                                            )}
                                                                        </td>
                                                                        <td className="p-2 capitalize">
                                                                            {
                                                                                refund?.paymentMethod
                                                                            }
                                                                        </td>
                                                                        <td className="p-2 whitespace-nowrap">
                                                                            {refund?.amount?.toFixed(
                                                                                2
                                                                            )}{" "}
                                                                            AED
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {refund?.note ||
                                                                                "N/A"}
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <span
                                                                                className={
                                                                                    "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                                                    (refund?.status ===
                                                                                    "failed"
                                                                                        ? "bg-[#f065481A] text-[#f06548]"
                                                                                        : refund?.status ===
                                                                                          "success"
                                                                                        ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                                        : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                                                }
                                                                            >
                                                                                {
                                                                                    refund?.status
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {transferOrder && (
                                <>
                                    <div className="mt-10">
                                        <table className="w-full">
                                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                                <tr>
                                                    <th className="font-[500] p-3">
                                                        Transfer
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Type
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Vehicle
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Date
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Pax
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Amount
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Status
                                                    </th>
                                                    {/* <th className="font-[500] p-3">
                                                        Action
                                                    </th> */}
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {transferOrder?.journey?.map(
                                                    (item, orderItemIndex) => {
                                                        return (
                                                            <SingleTransferOrderTableRow
                                                                key={
                                                                    orderItemIndex
                                                                }
                                                                item={item}
                                                                transferOrder={
                                                                    transferOrder
                                                                }
                                                                section={
                                                                    section
                                                                }
                                                                setOrder={
                                                                    setTransferOrder
                                                                }
                                                                order={order}
                                                            />
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                            {transferOrder && (
                                <>
                                    <div className="mt-7">
                                        <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                            <BsFillArrowRightCircleFill />{" "}
                                            Cancellation Requests
                                        </h1>
                                        {transferOrder?.cancellations?.length <
                                        1 ? (
                                            <div className="p-4 flex flex-col items-center">
                                                <span className="text-sm text-grayColor block mt-[6px]">
                                                    Oops.. No Cancellations
                                                    Found
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-[14px]">
                                                    <tbody>
                                                        <tr className="odd:bg-[#f3f6f9]">
                                                            {/* <td className="p-2 text-sm text-grayColor font-medium">
                                                                Activity Name
                                                            </td> */}
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Date
                                                            </td>

                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Charge
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Remark
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Cancelled By
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Admin
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Status
                                                            </td>
                                                        </tr>
                                                        {transferOrder?.cancellations?.map(
                                                            (
                                                                cancellation,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <TransferOrderCancellationTableRow
                                                                        key={
                                                                            index
                                                                        }
                                                                        cancellation={
                                                                            cancellation
                                                                        }
                                                                        setOrder={
                                                                            setTransferOrder
                                                                        }
                                                                        order={
                                                                            order
                                                                        }
                                                                        section={
                                                                            section
                                                                        }

                                                                        // setHotelOrder={
                                                                        //     setHotelOrder
                                                                        // }
                                                                    />
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-7">
                                        <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                            <BsFillArrowRightCircleFill />{" "}
                                            Refunds
                                        </h1>
                                        {transferOrder?.refunds?.length < 1 ? (
                                            <div className="p-4 flex flex-col items-center">
                                                <span className="text-sm text-grayColor block mt-[6px]">
                                                    Oops.. No Refunds Found
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-[14px]">
                                                    <tbody>
                                                        <tr className="odd:bg-[#f3f6f9]">
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Date
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Payment Method
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Amount
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Note
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Status
                                                            </td>
                                                        </tr>
                                                        {transferOrder?.refunds?.map(
                                                            (refund, index) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="odd:bg-[#f3f6f9]"
                                                                    >
                                                                        {" "}
                                                                        <td className="p-2">
                                                                            {formatDate(
                                                                                refund?.createdAt,
                                                                                true
                                                                            )}
                                                                        </td>
                                                                        <td className="p-2 capitalize">
                                                                            {
                                                                                refund?.paymentMethod
                                                                            }
                                                                        </td>
                                                                        <td className="p-2 whitespace-nowrap">
                                                                            {refund?.amount?.toFixed(
                                                                                2
                                                                            )}{" "}
                                                                            AED
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {refund?.note ||
                                                                                "N/A"}
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <span
                                                                                className={
                                                                                    "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                                                    (refund?.status ===
                                                                                    "failed"
                                                                                        ? "bg-[#f065481A] text-[#f06548]"
                                                                                        : refund?.status ===
                                                                                          "success"
                                                                                        ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                                        : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                                                }
                                                                            >
                                                                                {
                                                                                    refund?.status
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            <div className="mt-10">
                                <div className="flex items-center">
                                    <ul className="dir-btn">
                                        {Object.keys(sections)?.map(
                                            (section, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        className={
                                                            selectedSection ===
                                                            section
                                                                ? "active"
                                                                : ""
                                                        }
                                                        onClick={() => {
                                                            setSelectedSection(
                                                                section
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            {sections[section]}
                                                        </span>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </div>
                                {selectedSection === "payments" && (
                                    <div className="mt-2">
                                        {order?.payments?.length < 1 ? (
                                            <div className="p-4 flex flex-col items-center">
                                                <span className="text-sm text-grayColor block mt-[6px]">
                                                    Oops.. No Payments Found
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-[14px]">
                                                    <tbody>
                                                        <tr className="odd:bg-[#f3f6f9]">
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Date
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Payment Method
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Amount
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Message
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Status
                                                            </td>
                                                        </tr>
                                                        {order?.payments?.map(
                                                            (
                                                                payment,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="odd:bg-[#f3f6f9]"
                                                                    >
                                                                        <td className="p-2">
                                                                            {moment(
                                                                                payment?.createdAt
                                                                            ).format(
                                                                                "MMM D, YYYY HH:mm"
                                                                            )}
                                                                        </td>
                                                                        <td className="p-2 capitalize">
                                                                            {
                                                                                payment?.paymentMethod
                                                                            }
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {payment?.amount?.toFixed(
                                                                                2
                                                                            )}{" "}
                                                                            AED
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {payment?.paymentStateMessage ||
                                                                                "N/A"}
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <span
                                                                                className={
                                                                                    "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                                                    (payment?.paymentState ===
                                                                                    "failed"
                                                                                        ? "bg-[#f065481A] text-[#f06548]"
                                                                                        : payment?.paymentState ===
                                                                                          "success"
                                                                                        ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                                        : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                                                }
                                                                            >
                                                                                {
                                                                                    payment?.paymentState
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {selectedSection === "cancellations" && (
                                    <div className="mt-2">
                                        {cancellations?.length < 1 ? (
                                            <div className="p-4 flex flex-col items-center">
                                                <span className="text-sm text-grayColor block mt-[6px]">
                                                    Oops.. No Cancellations
                                                    Found
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-[14px]">
                                                    <tbody>
                                                        <tr className="odd:bg-[#f3f6f9]">
                                                            {/* <td className="p-2 text-sm text-grayColor font-medium">
                                                                Activity Name
                                                            </td> */}
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Date
                                                            </td>

                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Charge
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Remark
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Cancelled By
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Admin
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Status
                                                            </td>
                                                        </tr>
                                                        {cancellations?.map(
                                                            (
                                                                cancellation,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <tr className="odd:bg-[#f3f6f9]">
                                                                        {" "}
                                                                        <td className="p-2">
                                                                            {formatDate(
                                                                                cancellation?.createdAt,
                                                                                true
                                                                            )}
                                                                        </td>
                                                                        <td className="p-2 whitespace-nowrap">
                                                                            {cancellation?.cancellationCharge
                                                                                ? `${cancellation?.cancellationCharge?.toFixed(
                                                                                      2
                                                                                  )} AED`
                                                                                : "N/A"}
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {cancellation?.cancellationRemark ||
                                                                                "N/A"}
                                                                        </td>
                                                                        <td className="p-2 capitalize">
                                                                            {
                                                                                cancellation?.cancelledBy
                                                                            }
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {cancellation
                                                                                ?.adminId
                                                                                ?.name ||
                                                                                "N/A"}
                                                                        </td>
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
                                                                        <td className="p-2">
                                                                            {cancellation?.cancellationStatus ||
                                                                                "N/A"}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}{" "}
                                {selectedSection === "refunds" && (
                                    <div className="mt-2">
                                        {refunds?.length < 1 ? (
                                            <div className="p-4 flex flex-col items-center">
                                                <span className="text-sm text-grayColor block mt-[6px]">
                                                    Oops.. No Refunds Found
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-[14px]">
                                                    <tbody>
                                                        <tr className="odd:bg-[#f3f6f9]">
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Date
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Payment Method
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Amount
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Note
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Status
                                                            </td>
                                                        </tr>
                                                        {refunds?.map(
                                                            (refund, index) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="odd:bg-[#f3f6f9]"
                                                                    >
                                                                        {" "}
                                                                        <td className="p-2">
                                                                            {formatDate(
                                                                                refund?.createdAt,
                                                                                true
                                                                            )}
                                                                        </td>
                                                                        <td className="p-2 capitalize">
                                                                            {
                                                                                refund?.paymentMethod
                                                                            }
                                                                        </td>
                                                                        <td className="p-2 whitespace-nowrap">
                                                                            {refund?.amount?.toFixed(
                                                                                2
                                                                            )}{" "}
                                                                            AED
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {refund?.note ||
                                                                                "N/A"}
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <span
                                                                                className={
                                                                                    "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                                                    (refund?.status ===
                                                                                    "failed"
                                                                                        ? "bg-[#f065481A] text-[#f06548]"
                                                                                        : refund?.status ===
                                                                                          "success"
                                                                                        ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                                        : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                                                }
                                                                            >
                                                                                {
                                                                                    refund?.status
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isCancelModalOpen && (
                <CommonCancellationModal
                    setIsBookingConfirmationModalOpen={setIsCancelModalOpen}
                    setAttractionOrder={setAttractionOrder}
                    attractionOrder={attractionOrder}
                    setTransferOrder={setTransferOrder}
                    transferOrder={transferOrder}
                    orderId={orderId}
                    // bookingId={orderItem?._id}
                    // orderedBy={section}
                    // order={order}
                    cancellationTb={false}
                    section={section}
                />
            )}
            {isCancelApproveModalOpen && (
                <CommonCancellationModal
                    setIsBookingConfirmationModalOpen={
                        setIsCancelApproveModalOpen
                    }
                    setAttractionOrder={setAttractionOrder}
                    attractionOrder={attractionOrder}
                    setTransferOrder={setTransferOrder}
                    transferOrder={transferOrder}
                    orderId={orderId}
                    cancellationId={cancellations[0]?._id}
                    cancellationTb={true}
                    // order={order}
                    section={section}
                />
            )}
        </div>
    );
}
