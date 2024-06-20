import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import moment from "moment";

import { PageLoader } from "../../components";
import axios from "../../axios";
import { config } from "../../constants";
import { SingleAttrOrderActivitiesTable } from "../../features/Attractions";
import AttractionOrderCancellationTableRow from "../../features/Attractions/components/AttractionOrderCancellationTableRow";
import { formatDate } from "../../utils";

const sections = {
    payments: "Payments",
};

export default function SingleAttractionB2bOrderDetailsPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [attractionOrder, setAttractionOrder] = useState({});
    const [selectedSection, setSelectedSection] = useState("payments");

    const { orderId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchAttractionOrder = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                `/attractions/orders/b2b/single/${orderId}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setAttractionOrder({
                ...response?.data?.attractionOrder,
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
        fetchAttractionOrder();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Attraction Order Details
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Attractions{" "}
                    </Link>
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
                                    <div className="w-[200px] h-[100px] rounded overflow-hidden bg-gray-200">
                                        {/* <img
                                            src={
                                                config.SERVER_URL +
                                                attractionOrder?.activities[0]
                                                    ?.attraction?.images[0]
                                            }
                                            alt=""
                                            className="w-full h-full object-cover"
                                        /> */}
                                    </div>
                                    <div>
                                        <h1 className="font-[600] text-lg">
                                            {attractionOrder?.referenceNumber}
                                        </h1>
                                        <span className="block text-sm text-grayColor mt-1">
                                            {moment(
                                                attractionOrder?.createdAt
                                            ).format("MMM D, YYYY HH:mm")}
                                        </span>
                                        <span className="block mt-2 font-[500] text-sm">
                                            <Link
                                                to={`/b2b/${attractionOrder?.reseller?._id}/details`}
                                                className="underline text-blue-500"
                                            >
                                                {
                                                    attractionOrder?.reseller
                                                        ?.companyName
                                                }
                                            </Link>{" "}
                                            - (
                                            {
                                                attractionOrder?.reseller
                                                    ?.agentCode
                                            }
                                            )
                                        </span>
                                        <span className="block mt-1 text-sm">
                                            {attractionOrder?.reseller?.name} (
                                            {attractionOrder?.reseller?.email})
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-[25px]">
                                    <div className="text-center">
                                        <span className="block text-[12px] text-grayColor font-medium">
                                            Net Price
                                        </span>
                                        <span className="font-[600] text-lg text-green-600">
                                            {attractionOrder?.totalAmount?.toFixed(
                                                2
                                            )}{" "}
                                            AED
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[12px] text-grayColor font-medium mb-1">
                                            Payment State
                                        </span>
                                        <span
                                            className={
                                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                (attractionOrder?.paymentState ===
                                                "non-paid"
                                                    ? "bg-[#f065481A] text-[#f06548]"
                                                    : attractionOrder?.paymentState ===
                                                      "fully-paid"
                                                    ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                    : "bg-[#f7b84b1A] text-[#f7b84b]")
                                            }
                                        >
                                            {attractionOrder?.paymentState ||
                                                "N/A"}
                                        </span>
                                    </div>
                                    <div className="">
                                        <span className="block text-[12px] text-grayColor font-medium mb-1">
                                            Order Status
                                        </span>
                                        <span
                                            className={
                                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                (attractionOrder?.orderStatus ===
                                                "failed"
                                                    ? "bg-[#f065481A] text-[#f06548]"
                                                    : attractionOrder?.orderStatus ===
                                                      "completed"
                                                    ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                    : "bg-[#f7b84b1A] text-[#f7b84b]")
                                            }
                                        >
                                            {attractionOrder?.status || "N/A"}
                                        </span>
                                    </div>
                                    {/* {attractionOrder?.order === "confirmed" && (
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
                                                    BE HAPPY
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2 w-[180px]">
                                                    Order Type
                                                </td>
                                                <td className="p-2">
                                                    {attractionOrder?.orderType ===
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
                                                    {attractionOrder?.agentReferenceNumber ||
                                                        "N/A"}
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">
                                                    Special Request
                                                </td>
                                                <td className="p-2">
                                                    {attractionOrder?.specialRequest
                                                        ? attractionOrder?.specialRequest
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
                                                    {attractionOrder?.email}
                                                </div>
                                                <div className="flex items-center gap-[10px]">
                                                    <span>
                                                        <AiOutlinePhone />
                                                    </span>
                                                    {
                                                        attractionOrder?.country
                                                            ?.phonecode
                                                    }{" "}
                                                    {
                                                        attractionOrder?.phoneNumber
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="px-2">
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
                                                                Total Offer
                                                            </span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                -{" "}
                                                                {attractionOrder?.discountOffer ||
                                                                    0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-medium py-2 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">
                                                                Net Price
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
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <SingleAttrOrderActivitiesTable
                                    order={attractionOrder}
                                    section={"b2b"}
                                    setOrder={setAttractionOrder}
                                />
                                <div className="mt-7">
                                    <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                        <BsFillArrowRightCircleFill />{" "}
                                        Cancellation Requests
                                    </h1>
                                    {attractionOrder?.cancellations?.length <
                                    1 ? (
                                        <div className="p-4 flex flex-col items-center">
                                            <span className="text-sm text-grayColor block mt-[6px]">
                                                Oops.. No Cancellations Found
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
                                                                    key={index}
                                                                    cancellation={
                                                                        cancellation
                                                                    }
                                                                    setOrder={
                                                                        setAttractionOrder
                                                                    }
                                                                    order={
                                                                        attractionOrder
                                                                    }
                                                                    section={
                                                                        "b2b"
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
                                        <BsFillArrowRightCircleFill /> Refunds
                                    </h1>
                                    {attractionOrder?.refunds?.length < 1 ? (
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
                                                                    key={index}
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
                            </div>

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
                                        {attractionOrder?.payments?.length <
                                        1 ? (
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
                                                        {attractionOrder?.payments?.map(
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
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
