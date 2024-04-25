import React, { useState } from "react";
import { useEffect } from "react";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../axios";
import { PageLoader } from "../../components";
import {
    B2bTransactionsTable,
    B2cTransactionsTable,
} from "../../features/Transactions";

export default function SingleUserTransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalTransactions: 0,
        status: "",
        transactionNo: "",
        paymentProcessor: "",
        transactionType: "",
        dateFrom: "",
        dateTo: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);
    const { id } = useParams();

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                skip: 0,
                limit: 10,
                status: "",
                transactionNo: "",
                paymentProcessor: "",
                transactionType: "",
                dateFrom: "",
                dateTo: "",
            };
        });
        fetchTransactions({
            skip: 0,
            limit: 10,
            status: "",
            transactionNo: "",
            paymentProcessor: "",
            transactionType: "",
            dateFrom: "",
            dateTo: "",
        });
    };

    const fetchTransactions = async ({ ...filters }) => {
        try {
            setIsLoading(true);
            let searchQuery = `userId=${id}&skip=${filters?.skip}&limit=${filters.limit}&transactionNo=${filters.transactionNo}&status=${filters.status}&paymentProcessor=${filters.paymentProcessor}&transactionType=${filters.transactionType}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}`;
            const response = await axios.get(
                `/transactions/b2c/all?${searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setTransactions(response?.data?.result?.data || []);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalTransactions:
                        response?.data?.result?.totalTransactions,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDownload = async () => {
        try {
            const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}&transactionNo=${filters.transactionNo}&status=${filters.status}&paymentProcessor=${filters.paymentProcessor}&transactionType=${filters.transactionType}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}`;

            const response = await axios({
                url: `/transactions/b2b/reseller/${id}/all/sheet?${searchQuery}`,
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
        fetchTransactions({ ...filters });
    }, [filters.skip]);

    return (
        <div>
            <form
                className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    fetchTransactions({ ...filters });
                }}
            >
                <div className="col-span-2">
                    <label htmlFor="">Transaction No</label>
                    <input
                        type="number"
                        placeholder="Search Reference No."
                        className=""
                        name="transactionNo"
                        value={filters.transactionNo || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">Transaction Type</label>
                    <select
                        id=""
                        name="transactionType"
                        value={filters.transactionType}
                        onChange={handleChange}
                    >
                        <option value="">All</option>
                        <option value="deposit">Deposit</option>
                        <option value="markup">Markup</option>
                        <option value="withdraw">Withdraw</option>
                        <option value="deduct">Deduct</option>
                        <option value="refund">Refund</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="">Payment Processor</label>
                    <select
                        id=""
                        name="paymentProcessor"
                        value={filters.paymentProcessor}
                        onChange={handleChange}
                    >
                        <option value="">All</option>
                        <option value="paypal">Paypal</option>
                        <option value="wallet">Wallet</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="">Date From</label>
                    <input
                        type="date"
                        name="dateFrom"
                        value={filters.dateFrom || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">Date To</label>
                    <input
                        type="date"
                        name="dateTo"
                        value={filters.dateTo || ""}
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
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
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
                <div></div>
                <div></div>
                <div></div>
                <button
                    className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                    onClick={handleDownload}
                >
                    <FiDownload /> Download
                </button>
            </form>

            {isLoading ? (
                <PageLoader />
            ) : transactions?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">
                        Oops.. No Transactions Found
                    </span>
                </div>
            ) : (
                <B2cTransactionsTable
                    transactions={transactions}
                    filters={filters}
                    setFilters={setFilters}
                />
            )}
        </div>
    );
}
