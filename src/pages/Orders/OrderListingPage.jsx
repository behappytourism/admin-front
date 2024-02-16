import React, { useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";

export default function OrdersListingPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [filters, setFilters] = useState({
        referenceNo: "",
        agentCode: "",
        orderDateFrom: "",
        orderDateTo: "",
        orderStatus: "",
        traveller: "",
        skip: 0,
        limit: 10,
        totalOrders: 0,
    });
    const [section, setSection] = useState("b2b");
    const [searchParams, setSearchParams] = useSearchParams();

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleDownload = () => {};

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                referenceNo: "",
                agentCode: "",
                orderDateFrom: "",
                orderDateTo: "",
                orderStatus: "",
                traveller: "",
                skip: 0,
                limit: 10,
                totalOrders: 0,
            };
        });
        fetchOrders({
            section,
            referenceNo: "",
            agentCode: "",
            orderDateFrom: "",
            orderDateTo: "",
            orderStatus: "",
            traveller: "",
            skip: 0,
            limit: 10,
            totalOrders: 0,
        });
    };

    const fetchOrders = async ({ section, ...filters }) => {
        try {
            setIsPageLoading(true);

            let response;
            if (section === "b2b") {
                response = await axios.get(
                    `/orders/b2b/all?skip=${filters.skip}&limit=${filters.limit}&referenceNo=${filters.referenceNo}&agentCode=${filters.agentCode}&orderDateFrom=${filters.orderDateFrom}&orderDateTo=${filters.orderDateTo}&orderStatus=${filters.orderStatus}&traveller=${filters.traveller}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                response = await axios.get(
                    `/orders/b2c/all?skip=${filters.skip}&limit=${filters.limit}&referenceNo=${filters.referenceNo}&orderDateFrom=${filters.orderDateFrom}&orderDateTo=${filters.orderDateTo}&orderStatus=${filters.orderStatus}&traveller=${filters.traveller}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }

            setOrders(response?.data?.orders || []);
            setFilters((prev) => {
                return { ...prev, totalOrders: response?.data?.totalOrders };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        let query = searchParams.get("section") || "b2b";

        if (query) {
            setSection(query);
        }
        fetchOrders({ section: query, ...filters });
    }, [searchParams, filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Orders</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>

                    <span>Orders</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Orders</h1>
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
                                className=""
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
                            <label htmlFor="">Order Date From</label>
                            <input
                                type="date"
                                className=""
                                name="orderDateFrom"
                                value={filters.orderDateFrom || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Order Date To</label>
                            <input
                                type="date"
                                className=""
                                name="orderDateTo"
                                value={filters.orderDateTo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Traveller</label>
                            <input
                                type="text"
                                placeholder="Search name or email..."
                                className=""
                                name="traveller"
                                value={filters.traveller || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Order Status</label>
                            <select
                                name="orderStatus"
                                id=""
                                value={filters.orderStatus || ""}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
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
                                (section === "b2b"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, section: "b2b" };
                                })
                            }
                        >
                            B2B
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

                    {isPageLoading ? (
                        <PageLoader />
                    ) : orders?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Orders Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Ref.No
                                        </th>
                                        <th className="font-[500] p-3">
                                            Order Type
                                        </th>
                                        {section !== "b2c" && (
                                            <th className="font-[500] p-3">
                                                Reseller
                                            </th>
                                        )}
                                        <th className="font-[500] p-3">
                                            Traveller
                                        </th>
                                        <th className="font-[500] p-3">
                                            Activities
                                        </th>
                                        <th className="font-[500] p-3">
                                            Amount
                                        </th>
                                        <th className="font-[500] p-3">
                                            Payment Status
                                        </th>
                                        <th className="font-[500] p-3">
                                            Order Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {orders?.map((order, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                                                onClick={() =>
                                                    navigate(
                                                        `single/${order?._id}/${section}`
                                                    )
                                                }
                                            >
                                                <td className="p-3">
                                                    {order?.referenceNumber}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {section === "b2b"
                                                        ? "B2B portal "
                                                        : "B2C portal"}

                                                    <span className="block text-sm text-grayColor mt-1">
                                                        {moment(
                                                            order?.createdAt
                                                        ).format(
                                                            "MMM D, YYYY HH:mm"
                                                        )}
                                                    </span>
                                                </td>
                                                {section !== "b2c" && (
                                                    <td className="p-3">
                                                        {
                                                            order?.reseller
                                                                ?.companyName
                                                        }{" "}
                                                        (
                                                        {
                                                            order?.reseller
                                                                ?.agentCode
                                                        }
                                                        )
                                                    </td>
                                                )}
                                                <td className="p-3">
                                                    {order?.name}
                                                    <span className="block">
                                                        {order?.email}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    {order?.activitiesCount}{" "}
                                                    Activities
                                                </td>
                                                <td className="p-3">
                                                    {order?.totalAmount} AED
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={
                                                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                            (order?.paymentState ===
                                                            "fully-paid"
                                                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                        }
                                                    >
                                                        {order?.paymentState ||
                                                            "N/A"}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={
                                                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                            (order?.orderStatus ===
                                                            "failed"
                                                                ? "bg-[#f065481A] text-[#f06548]"
                                                                : order?.orderStatus ===
                                                                  "completed"
                                                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                        }
                                                    >
                                                        {order?.orderStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

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
                    )}
                </div>
            </div>
        </div>
    );
}
