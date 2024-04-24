import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { formatDate } from "../../utils";
import Pagination from "../../components/Pagination";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        limit: 10,
        skip: 0,
        totalUsers: 0,
        searchQuery: "",
        status: "",
        country: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { countries } = useSelector((state) => state.general);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/users/all?skip=${filters?.skip}&limit=${filters?.limit}&searchQuery=${filters.searchQuery}&status=${filters?.status}&country=${filters.country}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setUsers(response?.data?.users);
            setFilters((prev) => {
                return { ...prev, totalUsers: response?.data?.totalUsers };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

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
                totalUsers: 0,
                searchQuery: "",
                status: "",
                country: "",
            };
        });

        fetchUsers();
    };

    const getExcelSheet = async ({ ...filters }) => {
        try {
            const response = await axios.get(
                `/users/all-excelSheet?skip=${filters.skip}&limit=${filters.limit}&status=${filters.status}&searchQuery=${filters.searchQuery}&country=${filters.country}`,
                {
                    responseType: "blob",
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const href = URL.createObjectURL(response.data);

            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", "user-list.xlsx");
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        } catch (error) {
            console.log(error, "fentch error");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Users</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Home{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Users</span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Users</h1>
                            <div className="flex items-center gap-[10px]">
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
                                    fetchUsers({ ...filters });
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
                                <label htmlFor="">Country</label>
                                <select
                                    name="country"
                                    id=""
                                    value={filters.country || ""}
                                    onChange={handleChange}
                                    className="capitalize"
                                >
                                    <option value="">All</option>
                                    {countries?.map((country, index) => {
                                        return (
                                            <option
                                                value={country?._id}
                                                key={index}
                                                className="capitalize"
                                            >
                                                {country?.countryName}
                                            </option>
                                        );
                                    })}
                                </select>
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
                        {users?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Users found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Name & Email
                                            </th>
                                            <th className="font-[500] p-3">
                                                Phone Number
                                            </th>
                                            <th className="font-[500] p-3">
                                                Country
                                            </th>
                                            <th className="font-[500] p-3">
                                                Joined Date
                                            </th>
                                            {/* <th className="font-[500] p-3">
                                                Action
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {users?.map((user, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                    onClick={() =>
                                                        navigate(
                                                            `/users/${user?._id}/details`
                                                        )
                                                    }
                                                >
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-[10px]">
                                                            <img
                                                                src={`https://avatars.dicebear.com/api/identicon/${user?.email}.svg`}
                                                                alt=""
                                                                className="w-[30px] h-[30px] rounded-full"
                                                            />
                                                            <div>
                                                                <span className="block capitalize">
                                                                    {user?.name}
                                                                </span>
                                                                <span className="block">
                                                                    {
                                                                        user?.email
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        {
                                                            user?.country
                                                                ?.phonecode
                                                        }{" "}
                                                        {user?.phoneNumber}
                                                    </td>
                                                    <td className="p-3">
                                                        {
                                                            user?.country
                                                                ?.countryName
                                                        }
                                                    </td>
                                                    <td className="p-3">
                                                        {formatDate(
                                                            user?.createdAt
                                                        )}
                                                    </td>
                                                    {/* <td className="p-3"></td> */}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalUsers}
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
            )}
        </div>
    );
}
