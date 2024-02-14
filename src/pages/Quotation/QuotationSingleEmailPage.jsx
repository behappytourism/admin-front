import React, { useCallback, useEffect, useState } from "react";
// import { logoPng } from "../../../../static/imagesB2B";
import { useSelector } from "react-redux";
import { MdContentCopy } from "react-icons/md";
import axios from "../../axios";
import { useParams } from "react-router-dom";
import { config } from "../../constants";
import { PageLoader } from "../../components";

function QuotationSingleEmailPage() {
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { jwtToken } = useSelector((state) => state.admin);
    const { amendementNumber } = useParams();
    const [quotationList, setQuotationList] = useState({});
    const [transfers, setTransfers] = useState([]);

    const fetchQuotaionDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/quotations/amendment/email/${amendementNumber}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            console.log(response.data, "ammendments");
            setQuotationList(response.data.amendment);
            // let transfers =
            //     response?.data.amendment.transferQuotation.stayTransfers.map(
            //         (st) => {
            //             return {
            //                 stays: st.transfers,
            //                 stayNo: st.stayNo,
            //             };
            //         }
            //     );

            // console.log(transfers, "transfer transfers");

            // dispatch(handleTransferChange({ value: transfers }));
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }, [jwtToken, amendementNumber]);

    useEffect(() => {
        fetchQuotaionDetails();
    }, [fetchQuotaionDetails]);

    const copyDocument = () => {
        const element = document.getElementById("email-wrapper");
        let range, sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            range.selectNodeContents(element);
            sel.addRange(range);
        }
        document.execCommand("Copy");
        setIsCopied(true);
    };

    const initalFetch = async () => {
        try {
            let airportToCity = [];

            let cityToAirport = [];

            let cityToCity = [];

            for (
                let i = 0;
                i < quotationList?.transferQuotation?.stayTransfers?.length;
                i++
            ) {
                for (
                    let j = 0;
                    j <
                    quotationList?.transferQuotation?.stayTransfers[i]
                        ?.transfers?.length;
                    j++
                ) {
                    let transfer =
                        quotationList?.transferQuotation.stayTransfers[i]
                            .transfers[j];

                    console.log(transfer, "transfer");
                    if (transfer?.transferType == "airport-city") {
                        let selectedIndex = airportToCity.findIndex((arr) => {
                            return (
                                arr.transferFromHubName ===
                                transfer.transferFromHubName
                            );
                        });
                        if (selectedIndex !== -1) {
                            airportToCity[selectedIndex].transferTo.push({
                                transferToHubName: transfer.transferToHubName,
                                transferToName: transfer.transferToName,
                            });
                        } else {
                            airportToCity.push({
                                transferFromHubName:
                                    transfer.transferFromHubName,
                                transferType: transfer.transferType,
                                transferTo: [
                                    {
                                        transferToHubName:
                                            transfer?.transferToHubName,
                                        transferToName: transfer.transferToName,
                                    },
                                ],
                            });
                        }
                    } else if (transfer?.transferType == "city-airport") {
                        let selectedIndex = cityToAirport.findIndex((arr) => {
                            return (
                                arr?.transferToHubName ===
                                transfer?.transferToHubName
                            );
                        });

                        console.log(selectedIndex, "selected");
                        if (selectedIndex !== -1) {
                            cityToAirport[selectedIndex].transferFrom.push({
                                transferFromHubName:
                                    transfer.transferFromHubName,
                                transferFromName: transfer.transferFromName,
                            });
                        } else {
                            console.log("call reached");
                            cityToAirport.push({
                                transferToHubName: transfer.transferToHubName,
                                transferType: transfer.transferType,
                                transferToName: transfer.transferToName,
                                transferFrom: [
                                    {
                                        transferFromHubName:
                                            transfer.transferFromHubName,
                                        transferFromName:
                                            transfer.transferFromName,
                                    },
                                ],
                            });
                        }
                    } else {
                        cityToCity.push({
                            transferToHubName: transfer.transferToHubName,
                            transferType: transfer.transferType,
                            transferToName: transfer.transferToName,
                            transferFromHubName: transfer.transferFromHubName,
                            transferFromName: transfer.transferFromName,
                        });
                    }
                }
            }
            console.log(airportToCity, cityToAirport, "airportToCity");

            setTransfers([...airportToCity, ...cityToCity, ...cityToAirport]);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        initalFetch();
    }, [quotationList]);

    useEffect(() => {
        let timeOut;
        if (isCopied) {
            timeOut = setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        }
        return () => clearTimeout(timeOut);
    }, [isCopied]);

    console.log("transfers ", transfers);

    return (
        <div className="bg-white">
            {isLoading ? (
                <PageLoader />
            ) : (
                <div
                    style={{ fontFamily: "Poppins" }}
                    className="p-10 text-[12px] "
                >
                    <div className="flex justify-end ">
                        <button
                            onClick={copyDocument}
                            className="text-[14px] font-[600] text-white bg-blue-500 shadow-sm rounded p-2 h-8 flex"
                        >
                            <MdContentCopy />
                            {isCopied ? "Copied" : "Copy"}
                        </button>
                    </div>

                    <div
                        className="container mx-auto p-10  text-black"
                        id="email-wrapper"
                    >
                        <span className="text-[12px]">
                            Dear {quotationList?.clientName}
                        </span>
                        <br />
                        <br />
                        <br />
                        <div className="cust-border">
                            <span className="text-[12px] font-bold cust-border">
                                Greetings from {config.COMPANY_NAME}
                                !!!!
                                <span />
                            </span>
                            <br />
                            <span className="text-[12px] cust-border">
                                Kindly find the below quote for your reference.
                            </span>
                        </div>
                        <br />
                        <div className="mb-5 text-[12px] list-disc ">
                            <table>
                                <tbody>
                                    <tr>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingTop: "2px",
                                                paddingBottom: "2px",
                                            }}
                                            className="cust-border"
                                        >
                                            Quotation Number
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            :
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            {quotationList?.quotationNumber}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingTop: "2px",
                                                paddingBottom: "2px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            Total Pax
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            :
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            {quotationList?.noOfAdults} Adult{" "}
                                            {quotationList?.noOfChildren > 0
                                                ? `${quotationList.noOfChildren} Child`
                                                : ""}
                                            {quotationList?.noOfChildren > 0
                                                ? ` ( ${quotationList.childrenAges
                                                      .map((age) => age)
                                                      .join(",")}  Years )`
                                                : ""}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingTop: "2px",
                                                paddingBottom: "2px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            Package
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            :
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            {quotationList?.noOfNights}N /{" "}
                                            {quotationList?.noOfNights + 1}D
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingTop: "2px",
                                                paddingBottom: "2px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            Check In
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            :
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            {quotationList.checkInDate &&
                                                new Date(
                                                    quotationList?.checkInDate
                                                ).toDateString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingTop: "2px",
                                                paddingBottom: "2px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            Check Out
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            :
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            {quotationList.checkOutDate &&
                                                new Date(
                                                    quotationList?.checkOutDate
                                                ).toDateString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingTop: "2px",
                                                paddingBottom: "2px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            Arrival Airport
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            :
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            {quotationList?.arrivalAirportName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingTop: "2px",
                                                paddingBottom: "2px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            Departure Airport
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            :
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                border: "none",
                                            }}
                                            className="cust-border"
                                        >
                                            {
                                                quotationList?.departureAirportName
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <div className="mb-4 cust-border ">
                            {quotationList?.hotelQuotation ? (
                                !quotationList?.hotelQuotation
                                    .isAlreadyBooked ? (
                                    <div className="cust-border">
                                        <div className="relative overflow-x-auto">
                                            {quotationList?.hotelQuotation?.stays?.map(
                                                (stay, index) => {
                                                    return (
                                                        <div className="mt-6">
                                                            <h2 className="cust-border mb-2 text-[12px] font-bold">
                                                                Stay Option{" "}
                                                                {index + 1}
                                                            </h2>
                                                            <table className=" text-left border w-[1000px]">
                                                                <thead className="">
                                                                    <tr>
                                                                        <th className=" text-[12px] font-bold border px-[8px] py-[8px] w-[120px]">
                                                                            Check
                                                                            In
                                                                            Date
                                                                        </th>
                                                                        <th className="text-[12px] font-bold border px-[8px] py-[8px] w-[120px]">
                                                                            Check
                                                                            Out
                                                                            Date
                                                                        </th>
                                                                        <th className="text-[12px] font-bold border px-[8px] py-[8px] w-[300px]">
                                                                            Name
                                                                            of
                                                                            Hotel
                                                                        </th>
                                                                        <th className="text-[12px] font-bold border px-[8px] py-[8px] w-[180px]">
                                                                            Location
                                                                        </th>
                                                                        {quotationList
                                                                            ?.hotelQuotation
                                                                            ?.stays
                                                                            ?.length >
                                                                            0 &&
                                                                            quotationList?.hotelQuotation?.stays[
                                                                                index
                                                                            ]?.roomOccupancyList?.map(
                                                                                (
                                                                                    roomOccupancy,
                                                                                    index
                                                                                ) => {
                                                                                    return (
                                                                                        roomOccupancy?.priceWithTransfer && (
                                                                                            <th
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                className="text-[12px] font-bold border px-[8px]"
                                                                                            >
                                                                                                {
                                                                                                    roomOccupancy?.occupancyShortName
                                                                                                }
                                                                                            </th>
                                                                                        )
                                                                                    );
                                                                                }
                                                                            )}
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="text-[12px] ">
                                                                    {stay?.hotels?.map(
                                                                        (
                                                                            item,
                                                                            multiHotelIndex
                                                                        ) => {
                                                                            return (
                                                                                <tr
                                                                                    key={
                                                                                        multiHotelIndex
                                                                                    }
                                                                                    className=""
                                                                                >
                                                                                    <td className="border px-[8px] py-[5px] ">
                                                                                        {item?.checkInDate
                                                                                            ? new Date(
                                                                                                  item?.checkInDate
                                                                                              ).toDateString()
                                                                                            : "N/A"}
                                                                                    </td>
                                                                                    <td className="border px-[10px] py-[5px] ">
                                                                                        {item?.checkOutDate
                                                                                            ? new Date(
                                                                                                  item?.checkOutDate
                                                                                              ).toDateString()
                                                                                            : "N/A"}
                                                                                    </td>
                                                                                    <td className="border px-[10px] ">
                                                                                        (
                                                                                        {item?.starCategory
                                                                                            ? item?.starCategory
                                                                                            : "N/A"}{" "}
                                                                                        *
                                                                                        ){" "}
                                                                                        {item?.hotelName ||
                                                                                            "N/A"}{" "}
                                                                                        <br />
                                                                                        {item?.roomOccupancyName && (
                                                                                            <>
                                                                                                <span className="cust-border">
                                                                                                    *{" "}
                                                                                                    {
                                                                                                        item?.roomOccupancyName
                                                                                                    }
                                                                                                </span>
                                                                                                <br />
                                                                                            </>
                                                                                        )}
                                                                                        {/* <span className="block mt-1">
                                                                *{" "}
                                                                {item.isBreakfastIncluded
                                                                    ? "Breakfast Included"
                                                                    : "Room Only"}
                                                            </span>
                                                            <span className="block mt-1">
                                                                *{" "}
                                                                {item?.isRefundable
                                                                    ? "Refundable"
                                                                    : "Non Refundable"}
                                                            </span> */}
                                                                                        <span className="block mt-1 cust-border capitalize">
                                                                                            {
                                                                                                item?.roomTypeName
                                                                                            }{" "}
                                                                                            -{" "}
                                                                                            {
                                                                                                item?.boardTypeCode
                                                                                            }
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="border px-[10px] ">
                                                                                        <div className="flex items-center gap-2 cust-border">
                                                                                            <span className="block mt-1 cust-border">
                                                                                                {
                                                                                                    item?.area
                                                                                                }

                                                                                                ,{" "}
                                                                                                {
                                                                                                    item?.city
                                                                                                }

                                                                                                ,{" "}
                                                                                                {item?.country ===
                                                                                                "united arab emirates"
                                                                                                    ? "UAE"
                                                                                                    : item?.country}
                                                                                            </span>{" "}
                                                                                        </div>
                                                                                    </td>

                                                                                    {multiHotelIndex <
                                                                                        1 &&
                                                                                        stay?.roomOccupancyList?.map(
                                                                                            (
                                                                                                roomOccupancy,
                                                                                                index
                                                                                            ) => {
                                                                                                return (
                                                                                                    roomOccupancy?.priceWithTransfer && (
                                                                                                        <td
                                                                                                            rowSpan={
                                                                                                                stay
                                                                                                                    ?.hotels
                                                                                                                    ?.length >
                                                                                                                0
                                                                                                                    ? stay
                                                                                                                          ?.hotels
                                                                                                                          ?.length
                                                                                                                    : 0
                                                                                                            }
                                                                                                            key={
                                                                                                                index
                                                                                                            }
                                                                                                            className="border px-[10px]"
                                                                                                        >
                                                                                                            {roomOccupancy?.priceWithTransfer
                                                                                                                ? Math.ceil(
                                                                                                                      roomOccupancy?.priceWithTransfer
                                                                                                                  ) +
                                                                                                                  " " +
                                                                                                                  quotationList?.quotationCurrency
                                                                                                                : "N/A"}
                                                                                                        </td>
                                                                                                    )
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                </tr>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {" "}
                                        <div className="mt-5 text-[15px] cust-border">
                                            {quotationList?.noOfAdults && (
                                                <div>
                                                    Per person Adult price:{" "}
                                                    {quotationList?.perPersonAdultPrice?.toFixed(
                                                        2
                                                    )}{" "}
                                                    {
                                                        quotationList?.quotationCurrency
                                                    }
                                                </div>
                                            )}
                                            {quotationList?.noOfChildren > 0 ? (
                                                <div className="mt-1">
                                                    Per person Child price:{" "}
                                                    {quotationList?.perPersonChildPrice?.toFixed(
                                                        2
                                                    )}{" "}
                                                    {
                                                        quotationList?.quotationCurrency
                                                    }
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </>
                                )
                            ) : (
                                <div className="mt-5 text-[15px] cust-border">
                                    {quotationList?.noOfAdults && (
                                        <div className="cust-border">
                                            Per person Adult price:{" "}
                                            {quotationList?.perPersonAdultPrice?.toFixed(
                                                2
                                            )}{" "}
                                            {quotationList?.quotationCurrency}
                                        </div>
                                    )}
                                    {quotationList?.noOfChildren > 0 && (
                                        <div className="mt-1 cust-border">
                                            Per person Child price:{" "}
                                            {quotationList?.perPersonChildPrice?.toFixed(
                                                2
                                            )}{" "}
                                            {quotationList?.quotationCurrency}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="cust-border">
                            <div className="cust-border">
                                {quotationList?.excursionQuotation?.excursions
                                    ?.length ? (
                                    <div>
                                        <h3 className="text-[12px] font-bold pt-5 cust-border">
                                            Inclusions
                                        </h3>
                                    </div>
                                ) : null}
                                <div className="cust-border">
                                    {quotationList?.excursionQuotation?.excursions?.map(
                                        (exc, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="cust-border"
                                                >
                                                    <ul className="list-disc ml-6 text-[12px]">
                                                        <li className="cust-border">
                                                            {exc?.excursionName}{" "}
                                                            -{" "}
                                                            <span className="capitalize">
                                                                {exc?.excursionType.toLowerCase() ===
                                                                "ticket"
                                                                    ? exc?.value.toLowerCase() ===
                                                                      "ticket"
                                                                        ? "Only Ticket"
                                                                        : exc?.value.toLowerCase() ===
                                                                          "shared"
                                                                        ? "Tickets With SIC Transfer"
                                                                        : exc?.value.toLowerCase() ===
                                                                          "private"
                                                                        ? "Tickets With PVT Transfer"
                                                                        : ""
                                                                    : exc?.excursionType.toLowerCase() ===
                                                                      "transfer"
                                                                    ? exc?.value.toLowerCase() ===
                                                                      "private"
                                                                        ? "Only Transfer (Private)"
                                                                        : exc?.value.toLowerCase() ===
                                                                          "shared"
                                                                        ? "Only Transfer (SIC)"
                                                                        : ""
                                                                    : ""}
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>{" "}
                                <div className="cust-border">
                                    {quotationList?.guideQuotation?.guides?.map(
                                        (guide, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="cust-border"
                                                >
                                                    <ul className="list-disc ml-6 text-[12px]">
                                                        <li className="cust-border">
                                                            Guide {guide?.name}{" "}
                                                            -{" "}
                                                            <span className="capitalize">
                                                                Duration(
                                                                {guide.duration}
                                                                {""}hr X {""}
                                                                {guide.count})
                                                            </span>{" "}
                                                        </li>
                                                    </ul>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                                <div className="cust-border">
                                    {transfers.length > 0 && (
                                        <>
                                            {" "}
                                            <div className="cust-border">
                                                <h3 className=" text-[12px] font-bold pt-5 cust-border">
                                                    Transfers
                                                </h3>
                                            </div>
                                            {transfers?.map((transfer, ind) => {
                                                return (
                                                    <div
                                                        key={ind}
                                                        className="cust-border"
                                                    >
                                                        <ul className="list-disc ml-6 text-[12px]">
                                                            {transfer.transferType ===
                                                                "airport-city" && (
                                                                <li className="cust-border">
                                                                    {
                                                                        transfer?.transferFromHubName
                                                                    }{" "}
                                                                    <span className="text-xs font-semibold">
                                                                        To
                                                                    </span>{" "}
                                                                    {transfer.transferTo.map(
                                                                        (
                                                                            to,
                                                                            i
                                                                        ) => {
                                                                            return (
                                                                                <>
                                                                                    <span className="cust-border">
                                                                                        {
                                                                                            to.transferToHubName
                                                                                        }
                                                                                    </span>{" "}
                                                                                    {i !==
                                                                                        transfer
                                                                                            .transferTo
                                                                                            .length -
                                                                                            1 && (
                                                                                        <span className="cust-border">
                                                                                            /
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            );
                                                                        }
                                                                    )}
                                                                    - Private
                                                                    Transfer
                                                                </li>
                                                            )}
                                                            {transfer.transferType ===
                                                                "city-city" && (
                                                                <li className="cust-border">
                                                                    {
                                                                        transfer?.transferFromHubName
                                                                    }{" "}
                                                                    <span className="font-semibold cust-border">
                                                                        To
                                                                    </span>{" "}
                                                                    {
                                                                        transfer?.transferToHubName
                                                                    }{" "}
                                                                    - Private
                                                                    Transfer
                                                                </li>
                                                            )}
                                                            {transfer.transferType ===
                                                                "city-airport" && (
                                                                <li className="cust-border">
                                                                    {transfer?.transferFrom.map(
                                                                        (
                                                                            from,
                                                                            i
                                                                        ) => {
                                                                            return (
                                                                                <>
                                                                                    <span className="cust-border">
                                                                                        {
                                                                                            from?.transferFromHubName
                                                                                        }{" "}
                                                                                    </span>{" "}
                                                                                    {i !==
                                                                                        transfer
                                                                                            .transferFrom
                                                                                            .length -
                                                                                            1 && (
                                                                                        <span className="cust-border">
                                                                                            /
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            );
                                                                        }
                                                                    )}
                                                                    <span className="cust-border font-semibold">
                                                                        To
                                                                    </span>{" "}
                                                                    {
                                                                        transfer?.transferToHubName
                                                                    }{" "}
                                                                    - Private
                                                                    Transfer
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="cust-border">
                            <div className="cust-border">
                                {quotationList?.excSupplementQuotation
                                    ?.excursions?.length ? (
                                    <div className="cust-border">
                                        <h3 className=" text-[12px] font-bold pt-5 cust-border">
                                            Optional Tours Cost
                                        </h3>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="cust-border">
                                    {quotationList?.excSupplementQuotation?.excursions?.map(
                                        (exc, index) => {
                                            return (
                                                <div>
                                                    <ul className="list-disc ml-6 text-[12px]">
                                                        <li className="cust-border">
                                                            {exc?.excursionName}{" "}
                                                            -{" "}
                                                            <span className="capitalize">
                                                                {exc?.excursionType ===
                                                                "ticket"
                                                                    ? exc?.value.toLowerCase() ===
                                                                      "ticket"
                                                                        ? "Only Ticket"
                                                                        : exc?.value.toLowerCase() ===
                                                                          "shared"
                                                                        ? "Tickets With SIC Transfer"
                                                                        : exc?.value.toLowerCase() ===
                                                                          "private"
                                                                        ? "Tickets With PVT Transfer"
                                                                        : ""
                                                                    : exc?.excursionType ===
                                                                      "transfer"
                                                                    ? exc?.value ===
                                                                      "private"
                                                                        ? "Only Transfer (Private)"
                                                                        : exc?.value ===
                                                                          "shared"
                                                                        ? "Only Transfer (SIC)"
                                                                        : ""
                                                                    : ""}
                                                            </span>
                                                            <span>
                                                                {" "}
                                                                - (Adult -{" "}
                                                                {quotationList?.quotationCurrency ===
                                                                "AED"
                                                                    ? exc?.adultPrice
                                                                    : (
                                                                          exc?.adultPrice /
                                                                          3.65
                                                                      )?.toFixed(
                                                                          0
                                                                      )}{" "}
                                                                {
                                                                    quotationList?.quotationCurrency
                                                                }
                                                                , Child -{" "}
                                                                {quotationList?.quotationCurrency ===
                                                                "AED"
                                                                    ? exc?.childPrice
                                                                    : (
                                                                          exc?.childPrice /
                                                                          3.65
                                                                      )?.toFixed(
                                                                          0
                                                                      )}{" "}
                                                                {
                                                                    quotationList?.quotationCurrency
                                                                }
                                                                )
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="cust-border">
                            {quotationList?.visa ? (
                                <div>
                                    <div className="pt-10 cust-border">
                                        <div className="relative overflow-x-auto">
                                            <div className="cust-border">
                                                <h1 className="cust-border text-[12px] font-bold cust-border">
                                                    Visa{" "}
                                                </h1>
                                            </div>
                                            <div className="mb-5 text-[12px] cust-border">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    paddingRight:
                                                                        "10px",
                                                                    paddingTop:
                                                                        "2px",
                                                                    paddingBottom:
                                                                        "2px",
                                                                    border: "none",
                                                                }}
                                                                className="cust-border"
                                                            >
                                                                Visa Name
                                                            </td>
                                                            <td
                                                                style={{
                                                                    paddingRight:
                                                                        "10px",
                                                                    paddingLeft:
                                                                        "10px",
                                                                    border: "none",
                                                                }}
                                                                className="cust-border"
                                                            >
                                                                :
                                                            </td>
                                                            <td
                                                                style={{
                                                                    paddingRight:
                                                                        "10px",
                                                                    paddingLeft:
                                                                        "10px",
                                                                    border: "none",
                                                                }}
                                                                className="cust-border"
                                                            >
                                                                {
                                                                    quotationList
                                                                        ?.visa
                                                                        ?.name
                                                                }
                                                            </td>
                                                        </tr>
                                                        {/* <tr>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingTop:
                                                                    "2px",
                                                                paddingBottom:
                                                                    "2px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            Validity
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            :
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.validity
                                                            }{" "}
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.validityTimeFormat
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingTop:
                                                                    "2px",
                                                                paddingBottom:
                                                                    "2px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            Processing Time
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            :
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.processingTime
                                                            }{" "}
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.processingTimeFormat
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingTop:
                                                                    "2px",
                                                                paddingBottom:
                                                                    "2px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            Stay Period
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            :
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.stayPeriod
                                                            }{" "}
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.stayPeriodFormat
                                                            }
                                                        </td>
                                                    </tr> */}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>

                        <br />
                        <div className="cust-border">
                            <h3 className=" mb-2 text-[12px] font-bold cust-border">
                                Terms and Conditions
                            </h3>
                            <ul className="list-disc ml-6 text-[12px]">
                                <li className="cust-border">
                                    All the above package cost is quoted in
                                    <span className="cust-border px-1">
                                        {" "}
                                        {quotationList.quotationCurrency}
                                    </span>{" "}
                                    per person and is valid till{" "}
                                    {new Date(
                                        new Date(
                                            quotationList?.createdAt
                                        ).setDate(
                                            new Date(
                                                quotationList?.createdAt
                                            ).getDate() + 2
                                        )
                                    ).toDateString()}
                                </li>
                                <li className="cust-border">
                                    The above rates are subject to change as per
                                    hotel's inputs. This could be due to
                                    withdrawal of promotional by the Hotel or
                                    currency fluctuation or any additional taxes
                                    or toll implemented by the Government.
                                </li>
                                <li className="cust-border">
                                    Accommodation for Child as stated is as per
                                    the child policy of the respective Hotel.
                                    Child below 02 Years Is considered as an
                                    infant and from 02 years to 12 years as a
                                    child.
                                </li>
                                <li className="cust-border">
                                    Above package rate is subject to
                                    availability of rooms and offered inclusions
                                    and is subject to change as per availability
                                    at the time of booking. Kindly reconfirm
                                    with our team before confirming to the
                                    client.
                                </li>
                                <li className="cust-border">
                                    Cancellation charges are applicable as per
                                    the Hotel policy. NRF rates are subject to
                                    100% cancellation charges.
                                </li>
                                <li className="cust-border">
                                    All the services included in the package are
                                    compulsory and no refund will be given if
                                    any of the services are not taken.
                                </li>
                                <li className="cust-border">
                                    Tourism Dirham which has been levied by the
                                    hotels in Dubai, same has to be paid
                                    directly by the guest at the hotel upon
                                    check-in.
                                </li>

                                <li className="cust-border">
                                    Please Note the Check-In time is 3:00 PM And
                                    check out time Is 12:00 PM. Early Check-In
                                    or Late Check-Out Is depending upon Hotel
                                    room availability and may be subject to an
                                    extra charge.
                                </li>
                                <li className="cust-border">
                                    Rooms And Rates Are Subject To Availability
                                    At The Time Of Booking Confirmation kindly
                                    reconfirm before the booking.
                                </li>
                            </ul>
                        </div>

                        <br />
                        {/* <div className="cust-border text-xs">
                        <span
                            style={{
                                fontWeight: 500,
                                fontSize: "13px",
                                lineHeight: "26px",
                            }}
                            className="cust-border"
                        >
                            {quotationList?.reseller?.name}
                        </span>
                        <br />
                        <span
                            style={{ fontSize: "14px", lineHeight: "26px" }}
                            className="cust-border"
                        >
                            Email:{" "}
                            <span
                                style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                }}
                                className="cust-border"
                            >
                                {quotationList?.reseller?.email}
                            </span>
                        </span>
                        <br />
                        <span
                            style={{ marginTop: "20px", lineHeight: "26px" }}
                            className="cust-border"
                        >
                            Mobile/Whatsapp:{" "}
                            {quotationList?.reseller?.phoneNumber || ""} | Tel:{" "}
                            Ext.{" "}
                        </span>
                        <br />
                        <span
                            className="cust-border"
                            style={{ lineHeight: "26px" }}
                        >
                            Dubai | Ahmedabad | Kenya | Delhi
                        </span>
                        <br />
                        <span
                            className="cust-border"
                            style={{ lineHeight: "26px" }}
                        >
                            Website: www.travellerschoice.ae B2B Agent Login:
                            https://app.mytcb2b.com/
                        </span>
                        <br />
                    </div>
                    <img
                        width="150"
                        src={config.COMPANY_LOGO}
                        alt=""
                        style={{ marginTop: "15px" }}
                    /> */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuotationSingleEmailPage;
