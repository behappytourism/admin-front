import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { AttractionBookingOrdersTable } from "../../features/Orders";

export default function SingleUserOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        referenceNo: "",
        agentCode: "",
        orderDateFrom: "",
        orderDateTo: "",
        orderStatus: "",
        traveller: "",
        skip: 0,
        limit: 5,
        totalOrders: 0,
    });

    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

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
                limit: 5,
                totalOrders: 0,
            };
        });
        fetchOrders({
            referenceNo: "",
            agentCode: "",
            orderDateFrom: "",
            orderDateTo: "",
            orderStatus: "",
            traveller: "",
            skip: 0,
            limit: 5,
            totalOrders: 0,
        });
    };

    const fetchOrders = async ({ section, ...filters }) => {
        try {
            setIsLoading(true);

            let response;

            response = await axios.get(
                `/orders/b2c/all?userId=${id}&skip=${filters.skip}&limit=${filters.limit}&referenceNo=${filters.referenceNo}&orderDateFrom=${filters.orderDateFrom}&orderDateTo=${filters.orderDateTo}&orderStatus=${filters.orderStatus}&traveller=${filters.traveller}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setOrders(response?.data?.orders || []);
            setFilters((prev) => {
                return { ...prev, totalOrders: response?.data?.totalOrders };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDownload = async () => {
        try {
            const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}&referenceNo=${filters.referenceNo}&status=${filters.status}&attraction=${filters.attraction}&activity=${filters.activity}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&travellerEmail=${filters.travellerEmail}`;

            const response = await axios({
                url: `/attractions/orders/b2b/reseller/${id}/all/sheet?bookingType=booking&${searchQuery}`,
                method: "GET",
                responseType: "blob",
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            });
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
        fetchOrders({ ...filters });
    }, [filters.skip]);

    return (
        <div>
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

            {isLoading ? (
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
                                <th className="font-[500] p-3">Ref.No</th>
                                <th className="font-[500] p-3">Order Type</th>

                                <th className="font-[500] p-3">Traveller</th>
                                <th className="font-[500] p-3">Activities</th>
                                <th className="font-[500] p-3">Amount</th>
                                <th className="font-[500] p-3">
                                    Payment Status
                                </th>
                                <th className="font-[500] p-3">Order Status</th>
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
                                                `/orders/single/${order?._id}/b2c`
                                            )
                                        }
                                    >
                                        <td className="p-3">
                                            {order?.referenceNumber}
                                        </td>
                                        <td className="p-3 capitalize">
                                            B2C portal
                                            <span className="block text-sm text-grayColor mt-1">
                                                {moment(
                                                    order?.createdAt
                                                ).format("MMM D, YYYY HH:mm")}
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            {order?.name}
                                            <span className="block">
                                                {order?.email}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {order?.activitiesCount} Activities
                                        </td>
                                        <td className="p-3">
                                            {order?.netPrice} AED
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
                                                {order?.paymentState || "N/A"}
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
    );
}
