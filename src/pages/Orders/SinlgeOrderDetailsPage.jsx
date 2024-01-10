import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { MdNoTransfer } from "react-icons/md";
import { FaBus } from "react-icons/fa";
import moment from "moment";

import { PageLoader } from "../../components";
import axios from "../../axios";
import { config } from "../../constants";

const sections = {
    payments: "Payments",
    cancellations: "Cancellations",
    refunds: "Refunds",
};

export default function SingleOrderDetailsPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [order, setOrder] = useState({});
    const [selectedSection, setSelectedSection] = useState("payments");

    const { orderId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchorder = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/orders/b2b/single/${orderId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setOrder({
                ...response?.data?.b2bOrder,
                payments: response?.data?.payments,
                cancellations: response?.data?.cancellations,
                refunds: response?.data?.refunds,
            });
            setIsPageLoading(false);
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
                                        <span className="block mt-2 font-[500] text-sm">
                                            <Link
                                                to={`/b2b/${order?.reseller?._id}/details`}
                                                className="underline text-blue-500"
                                            >
                                                {order?.reseller?.companyName}
                                            </Link>{" "}
                                            - ({order?.reseller?.agentCode})
                                        </span>
                                        <span className="block mt-1 text-sm">
                                            {order?.reseller?.name} (
                                            {order?.reseller?.email})
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-[25px]">
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
                                            {order?.status || "N/A"}
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
                                                    TCTT
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2 w-[180px]">
                                                    Order Type
                                                </td>
                                                <td className="p-2">
                                                    {order?.orderType ===
                                                    "b2b-api"
                                                        ? "API Gateway"
                                                        : "B2B Portal"}
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2 w-[180px]">
                                                    Agent Ref.No
                                                </td>
                                                <td className="p-2">
                                                    {order?.agentReferenceNumber ||
                                                        "N/A"}
                                                </td>
                                            </tr>
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
                                        {order?.attractionOrder && (
                                            <>
                                                {" "}
                                                <div className="odd:bg-[#f3f6f9]">
                                                    <h2 className="p-2 w-[180px]">
                                                        Activities
                                                    </h2>
                                                </div>
                                                <table className="w-full text-[15px]">
                                                    <tbody>
                                                        {order?.attractionOrder?.activities?.map(
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
                                                                        {order?.attractionOrder?.totalAmount?.toFixed(
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
                                        {order?.transferOrder && (
                                            <>
                                                <div className="odd:bg-[#f3f6f9]">
                                                    <h2 className="p-2 w-[180px]">
                                                        Transfer
                                                    </h2>
                                                </div>
                                                <table className="w-full text-[15px]">
                                                    <tbody>
                                                        {order?.transferOrder?.journey?.map(
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
                                    </div>
                                </div>
                            </div>
                            {order?.attractionOrder && (
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
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {order?.attractionOrder?.activities?.map(
                                                    (
                                                        orderItem,
                                                        orderItemIndex
                                                    ) => {
                                                        return (
                                                            <tr
                                                                key={
                                                                    orderItemIndex
                                                                }
                                                            >
                                                                <td className="p-3">
                                                                    <div className="flex gap-3">
                                                                        <div className="w-[80px] max-h-[50px] rounded overflow-hidden">
                                                                            <img
                                                                                src={
                                                                                    config.SERVER_URL +
                                                                                    orderItem
                                                                                        ?.attraction
                                                                                        ?.images[0]
                                                                                }
                                                                                alt=""
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-[500] block mt-1">
                                                                                {
                                                                                    orderItem
                                                                                        ?.activity
                                                                                        ?.name
                                                                                }{" "}
                                                                                <span className="capitalize">
                                                                                    (
                                                                                    {
                                                                                        orderItem?.bookingType
                                                                                    }

                                                                                    )
                                                                                </span>
                                                                            </span>
                                                                            <span className="block mt-1">
                                                                                {
                                                                                    orderItem
                                                                                        ?.attraction
                                                                                        ?.title
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-3">
                                                                    {moment(
                                                                        orderItem?.date
                                                                    ).format(
                                                                        "MMM D, YYYY"
                                                                    )}
                                                                </td>
                                                                <td className="p-3">
                                                                    {
                                                                        orderItem?.adultsCount
                                                                    }{" "}
                                                                    ADT,{" "}
                                                                    {
                                                                        orderItem?.childrenCount
                                                                    }{" "}
                                                                    CHD,{" "}
                                                                    {
                                                                        orderItem?.infantCount
                                                                    }{" "}
                                                                    INF
                                                                </td>
                                                                <td className="p-3">
                                                                    {orderItem?.transferType ===
                                                                    "without" ? (
                                                                        <span className="flex items-center gap-[7px] mt-2 capitalize">
                                                                            <MdNoTransfer />{" "}
                                                                            {
                                                                                orderItem?.transferType
                                                                            }{" "}
                                                                            Transfer
                                                                        </span>
                                                                    ) : (
                                                                        <div>
                                                                            <span className="flex items-center gap-[7px] mt-2 capitalize">
                                                                                <FaBus />{" "}
                                                                                {
                                                                                    orderItem?.transferType
                                                                                }{" "}
                                                                                Transfer
                                                                            </span>
                                                                            <div>
                                                                                {orderItem?.transferType ===
                                                                                    "private" &&
                                                                                    orderItem?.privateTransfers?.map(
                                                                                        (
                                                                                            transfer,
                                                                                            index
                                                                                        ) => {
                                                                                            return (
                                                                                                <span
                                                                                                    key={
                                                                                                        index
                                                                                                    }
                                                                                                    className="block mt-[6px]"
                                                                                                >
                                                                                                    {
                                                                                                        transfer?.name
                                                                                                    }{" "}
                                                                                                    x{" "}
                                                                                                    {
                                                                                                        transfer?.count
                                                                                                    }
                                                                                                </span>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="p-3">
                                                                    {orderItem?.bookingType ===
                                                                    "booking" ? (
                                                                        <span className="bg-[#f3f6f9] py-1 px-2 text-sm rounded">
                                                                            {
                                                                                orderItem?.bookingConfirmationNumber
                                                                            }
                                                                        </span>
                                                                    ) : orderItem?.bookingType ===
                                                                          "ticket" &&
                                                                      (orderItem
                                                                          ?.adultTickets
                                                                          ?.length >
                                                                          0 ||
                                                                          orderItem
                                                                              ?.childTickets
                                                                              ?.length >
                                                                              0 ||
                                                                          orderItem
                                                                              ?.infantTickets
                                                                              ?.length >
                                                                              0) ? (
                                                                        <div className="flex flex-wrap items-center gap-[10px] mt-2">
                                                                            {orderItem?.adultTickets?.map(
                                                                                (
                                                                                    ticket,
                                                                                    index
                                                                                ) => {
                                                                                    return (
                                                                                        <span
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            className="bg-[#f3f6f9] py-1 px-2 text-sm rounded"
                                                                                            onMouseDown={() =>
                                                                                                handleMouseDownOnTicketNumber(
                                                                                                    {
                                                                                                        ticketNo:
                                                                                                            ticket?.ticketNo,
                                                                                                        loggedFrom:
                                                                                                            "orders-list",
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                ticket?.ticketNo
                                                                                            }
                                                                                        </span>
                                                                                    );
                                                                                }
                                                                            )}
                                                                            {orderItem?.childTickets?.map(
                                                                                (
                                                                                    ticket,
                                                                                    index
                                                                                ) => {
                                                                                    return (
                                                                                        <span
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            className="bg-[#f3f6f9] py-1 px-2 text-sm rounded"
                                                                                            onMouseDown={() =>
                                                                                                handleMouseDownOnTicketNumber(
                                                                                                    {
                                                                                                        ticketNo:
                                                                                                            ticket?.ticketNo,
                                                                                                        loggedFrom:
                                                                                                            "orders-list",
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                ticket?.ticketNo
                                                                                            }
                                                                                        </span>
                                                                                    );
                                                                                }
                                                                            )}
                                                                            {orderItem?.infantTickets?.map(
                                                                                (
                                                                                    ticket,
                                                                                    index
                                                                                ) => {
                                                                                    return (
                                                                                        <span
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            className="bg-[#f3f6f9] py-1 px-2 text-sm rounded"
                                                                                            onMouseDown={() =>
                                                                                                handleMouseDownOnTicketNumber(
                                                                                                    {
                                                                                                        ticketNo:
                                                                                                            ticket?.ticketNo,
                                                                                                        loggedFrom:
                                                                                                            "orders-list",
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                ticket?.ticketNo
                                                                                            }
                                                                                        </span>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        "N/A"
                                                                    )}
                                                                </td>
                                                                <td className="p-3">
                                                                    {
                                                                        orderItem?.grandTotal
                                                                    }{" "}
                                                                    AED
                                                                </td>
                                                                <td className="p-3">
                                                                    <span
                                                                        className={
                                                                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                                            (orderItem?.status ===
                                                                            "cancelled"
                                                                                ? "bg-[#f065481A] text-[#f06548]"
                                                                                : orderItem?.status ===
                                                                                  "confirmed"
                                                                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                                        }
                                                                    >
                                                                        {
                                                                            orderItem?.status
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
                                </>
                            )}

                            {order?.transferOrder && (
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
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {order?.transferOrder?.journey?.map(
                                                    (item, orderItemIndex) => {
                                                        return (
                                                            <tr
                                                                key={
                                                                    orderItemIndex
                                                                }
                                                            >
                                                                <td className="p-3">
                                                                    <div className="flex gap-3">
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
                                                                    </div>
                                                                </td>
                                                                <td className="p-3 capitalize">
                                                                    {
                                                                        item.transferType
                                                                    }
                                                                </td>
                                                                <td className="p-3 capitalize">
                                                                    <div>
                                                                        Ow -{" "}
                                                                        {item.trips[0]?.vehicleTypes.map(
                                                                            (
                                                                                type
                                                                            ) => (
                                                                                // Use + operator or template string to concatenate name and count
                                                                                <span
                                                                                    key={
                                                                                        type.name
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        type?.name
                                                                                    }{" "}
                                                                                    x{" "}
                                                                                    (
                                                                                    {
                                                                                        type?.count
                                                                                    }

                                                                                    ){" "}
                                                                                    ,
                                                                                </span>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                    {item
                                                                        ?.trips[1] && (
                                                                        <div>
                                                                            Rtn
                                                                            -{" "}
                                                                            {item?.trips[1]?.vehicleTypes.map(
                                                                                (
                                                                                    type
                                                                                ) => (
                                                                                    // Use + operator or template string to concatenate name and count
                                                                                    <span
                                                                                        key={
                                                                                            type.name
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            type?.name
                                                                                        }{" "}
                                                                                        x
                                                                                        {
                                                                                            type?.count
                                                                                        }{" "}
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </td>

                                                                <td className="p-3">
                                                                    {moment(
                                                                        item?.date
                                                                    ).format(
                                                                        "MMM D, YYYY"
                                                                    )}
                                                                </td>
                                                                <td className="p-3">
                                                                    {
                                                                        item?.noOfAdults
                                                                    }{" "}
                                                                    ADT,{" "}
                                                                    {
                                                                        item?.noOfChildrens
                                                                    }{" "}
                                                                    CHD{" "}
                                                                </td>
                                                                <td className="p-3">
                                                                    {
                                                                        item?.netPrice
                                                                    }{" "}
                                                                    AED
                                                                </td>
                                                                <td className="p-3">
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
                                                                </td>
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
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
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
                                        {order?.cancellations?.length < 1 ? (
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
                                                                Date
                                                            </td>
                                                            <td className="p-2 text-sm text-grayColor font-medium">
                                                                Provider
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
                                                        {order?.cancellations?.map(
                                                            (
                                                                cancellation,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <HotelReservationCancellationTableRow
                                                                        key={
                                                                            index
                                                                        }
                                                                        cancellation={
                                                                            cancellation
                                                                        }
                                                                        hotelOrder={
                                                                            hotelOrder
                                                                        }
                                                                        setHotelOrder={
                                                                            setHotelOrder
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedSection === "refunds" && (
                                    <div className="mt-2">
                                        {order?.refunds?.length < 1 ? (
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
                                                        {order?.refunds?.map(
                                                            (refund, index) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="odd:bg-[#f3f6f9]"
                                                                    >
                                                                        <td className="p-2">
                                                                            {moment(
                                                                                refund?.createdAt
                                                                            ).format(
                                                                                "MMM D, YYYY HH:mm"
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
        </div>
    );
}
