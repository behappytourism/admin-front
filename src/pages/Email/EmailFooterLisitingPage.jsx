import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { formatDate } from "../../utils";
import { BiEditAlt } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { BsEyeFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

export default function EmailFooterListingPage() {
    const [footers, setFooters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalfooters: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchfooterFooters = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/email/footers/all?skip=${filters?.skip}&limit=${filters?.limit}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setFooters(response.data?.emailFooters);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalFooters: response.data?.totalEmailFooters,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchfooterFooters();
    }, []);

    const deleteGroup = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/email/footers/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filtered = footers.filter((footer) => {
                    return footer?._id !== id;
                });
                setFooters(filtered);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Email Footers
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email/footers" className="text-textColor">
                        Email Footers
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Email Footers</h1>
                            <Link to="/email/footers/add">
                                <button className="px-3">+ Add</button>
                            </Link>
                        </div>
                        {footers?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Email Footers Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Name
                                            </th>
                                            <th className="font-[500] p-3">
                                                Created Date
                                            </th>

                                            <th className="font-[500] p-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {footers?.map((footer, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        {footer?.name}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {formatDate(
                                                            footer?.createdAt
                                                        )}
                                                    </td>

                                                    {/* <td className="p-3 capitalize">
                                                        {formatDate(
                                                            footer?.endDate
                                                        )}
                                                    </td> */}
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteGroup(
                                                                        footer?._id
                                                                    )
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>

                                                            <Link
                                                                to={`${footer?._id}/edit`}
                                                            >
                                                                <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                    <BiEditAlt />
                                                                </button>
                                                            </Link>
                                                        </div>
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
                                        total={filters?.totalfooters}
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
