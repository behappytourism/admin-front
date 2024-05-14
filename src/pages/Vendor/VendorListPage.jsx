import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { ResellersTableRow } from "../../features/Resellers";
import VendorTableRow from "../../features/Vendor/components/VendorTableRow";

export default function VendorListPage() {
    const [resellers, setResellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalVendors: 0,
        searchQuery: "",
        status: "",
        country: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);

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
                totalVendors: 0,
                searchQuery: "",
                status: "",
                country: "",
            };
        });

        fetchResellers({
            skip: 0,
            limit: 10,
            searchQuery: "",
            status: "",
            country: "",
        });
    };

    const fetchResellers = async ({ ...filters }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/vendor/all?skip=${filters.skip}&limit=${filters.limit}&status=${filters.status}&searchQuery=${filters.searchQuery}&country=${filters.country}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setResellers(response.data?.vendors);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalVendors: response.data?.totalVendors,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchResellers({ ...filters });
    }, [filters.skip]);

    const getExcelSheet = async ({ ...filters }) => {
        try {
            const response = await axios.get(
                `/vendor/all-excelSheet?role=reseller&skip=${filters.skip}&limit=${filters.limit}&status=${filters.status}&searchQuery=${filters.searchQuery}&country=${filters.country}`,
                {
                    responseType: "blob",
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const href = URL.createObjectURL(response.data);

            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", "b2b-list.xlsx");
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        } catch (error) {
            console.log(error, "fentch error");
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">B2B</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>b2b </span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All B2B</h1>
                        <div className="flex items-center gap-[10px]">
                            <div>
                                <Link to={`add`}>
                                    <button className="w-[150px]">
                                        + Add New
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <button
                                    className="px-3 bg-orange-500 flex items-center gap-2"
                                    onClick={() =>
                                        getExcelSheet({ ...filters })
                                    }
                                >
                                    <FiDownload />
                                    Download Excel
                                </button>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (filters.skip !== 0) {
                                setFilters({ ...filters, skip: 0 });
                            } else {
                                fetchResellers({ ...filters });
                            }
                        }}
                        className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-4"
                    >
                        <div>
                            <label htmlFor="">Search</label>
                            <input
                                type="text"
                                placeholder="Search here..."
                                name="searchQuery"
                                value={filters.searchQuery || ""}
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
                                <option value="ok">Ok</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="disabled">Disabled</option>
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
                                <option value="10000">All</option>
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
                    ) : resellers?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Resellers found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Vendor Code
                                            </th>
                                            <th className="font-[500] p-3">
                                                Title
                                            </th>
                                            <th className="font-[500] p-3">
                                                User
                                            </th>
                                            <th className="font-[500] p-3">
                                                Country
                                            </th>
                                            <th className="font-[500] p-3">
                                                Phone Number
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {resellers?.map((reseller, index) => {
                                            return (
                                                <VendorTableRow
                                                    reseller={reseller}
                                                    key={index}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalVendors}
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
