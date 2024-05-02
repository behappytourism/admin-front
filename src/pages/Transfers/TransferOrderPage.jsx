import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiDownload } from "react-icons/fi";
import { BiFilter } from "react-icons/bi";

import axios from "../../axios";
import { PageLoader } from "../../components";
import TransferOrdersTable from "../../features/Transfer/TransferOrderTable";

export default function TransferOrderPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        limit: 10,
        skip: 0,
        totalOrders: 0,
        status: "",
        referenceNo: "",
        agentCode: "",
        dateFrom: "",
        dateTo: "",
        attraction: "",
        activity: "",
        travellerEmail: "",
    });
    const [section, setSection] = useState("reseller");
    const [searchParams, setSearchParams] = useSearchParams();

    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                limit: 10,
                skip: 0,
                status: "",
                referenceNo: "",
                agentCode: "",
                dateFrom: "",
                dateTo: "",
                attraction: "",
                activity: "",
                travellerEmail: "",
            };
        });
        fetchOrders({
            section,
            limit: 10,
            skip: 0,
            status: "",
            referenceNo: "",
            agentCode: "",
            dateFrom: "",
            dateTo: "",
            attraction: "",
            activity: "",
            travellerEmail: "",
        });
    };

    const fetchOrders = async ({ section, ...filters }) => {
        try {
            console.log("order fetching...");
            setIsLoading(true);

            const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}&referenceNo=${filters.referenceNo}&status=${filters.status}&attraction=${filters.attraction}&activity=${filters.activity}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&travellerEmail=${filters.travellerEmail}&agentCode=${filters.agentCode}`;
            let response;

            response = await axios.get(
                `/transfers/order/list/all?orderedBy=${section}&${searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setOrders(response?.data?.transferOrders || []);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalOrders: response?.data?.totalTransfers || 0,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDownload = async () => {
        try {
            const searchQuery = `orderedBy=${section}&skip=${filters?.skip}&limit=${filters.limit}&referenceNo=${filters.referenceNo}&status=${filters.status}&attraction=${filters.attraction}&activity=${filters.activity}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&travellerEmail=${filters.travellerEmail}&agentCode=${filters.agentCode}`;

            let response;
            if (section === "b2c") {
                response = await axios({
                    url: `/attractions/orders/b2c/all/sheet?bookingType=ticket&${searchQuery}`,
                    method: "GET",
                    responseType: "blob",
                    headers: {
                        authorization: `Bearer ${jwtToken}`,
                    },
                });
            } else {
                response = await axios({
                    url: `/attractions/orders/b2b/all/sheet?bookingType=ticket&${searchQuery}`,
                    method: "GET",
                    responseType: "blob",
                    headers: {
                        authorization: `Bearer ${jwtToken}`,
                    },
                });
            }
            const href = URL.createObjectURL(response.data);

            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", "orders.xlsx");
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        let query = searchParams.get("section") || "reseller";

        if (query) {
            setSection(query);
        }
        fetchOrders({ section: query, ...filters });
    }, [searchParams, filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Transfer Orders
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/transfer" className="text-textColor">
                        Transfrer{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Orders</span>
                    <span>{">"} </span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Transfer Orders</h1>
                        <button
                            className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                            onClick={handleDownload}
                        >
                            <FiDownload /> Download
                        </button>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (filters.skip !== 0) {
                                setFilters({ ...filters, skip: 0 });
                            } else {
                                fetchOrders({ section, ...filters });
                            }
                        }}
                        className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-4"
                    >
                        <div className="col-span-2">
                            <label htmlFor="">Reference Number</label>
                            <input
                                type="text"
                                placeholder="Search Reference No."
                                name="referenceNo"
                                value={filters.referenceNo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        {section !== "b2c" && (
                            <div className="">
                                <label htmlFor="">Agent Code</label>
                                <input
                                    type="number"
                                    placeholder="Search agent..."
                                    name="agentCode"
                                    value={filters.agentCode || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div className="">
                            <label htmlFor="">Date From</label>
                            <input
                                type="date"
                                name="dateFrom"
                                value={filters.dateFrom || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Date To</label>
                            <input
                                type="date"
                                className=""
                                name="dateTo"
                                value={filters.dateTo || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="">
                            <label htmlFor="">Traveller</label>
                            <input
                                type="text"
                                placeholder="Search email..."
                                className=""
                                name="travellerEmail"
                                value={filters.travellerEmail || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Status</label>
                            <select
                                name="status"
                                id=""
                                value={filters.status || ""}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="booked">Booked</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Limit</label>
                            <select
                                id=""
                                name="limit"
                                value={filters.limit}
                                onChange={handleChange}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <button className="flex items-center justify-center gap-[10px]">
                            <BiFilter /> Filter
                        </button>
                        <button
                            className="bg-slate-200 text-textColor"
                            onClick={clearFilters}
                            type="button"
                        >
                            Clear
                        </button>
                    </form>

                    <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (section === "reseller"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, section: "reseller" };
                                })
                            }
                        >
                            B2b
                        </button>

                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (section === "b2c"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, section: "b2c" };
                                })
                            }
                        >
                            B2C
                        </button>
                    </div>

                    {isLoading ? (
                        <PageLoader />
                    ) : orders?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Ticket Orders found
                            </span>
                        </div>
                    ) : (
                        <TransferOrdersTable
                            orders={orders}
                            filters={filters}
                            setFilters={setFilters}
                            section={section}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
