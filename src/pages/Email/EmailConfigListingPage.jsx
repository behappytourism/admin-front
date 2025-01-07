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

export default function EmailConfigListingPage() {
    const [configs, setConfig] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalconfigs: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchEmailConfigs = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/email/configs/all?skip=${filters?.skip}&limit=${filters?.limit}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setConfig(response.data?.emailConfigs);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalconfigs: response.data?.totalEmailconfigs,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEmailConfigs();
    }, []);

    const deleteGroup = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/email/configs/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filtered = configs.filter((config) => {
                    return config?._id !== id;
                });
                setConfig(filtered);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Email Configs
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email/configs" className="text-textColor">
                        email configs
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Email Configs</h1>
                            <Link to="/email/configs/add">
                                <button className="px-3">+ Add</button>
                            </Link>
                        </div>
                        {configs?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No email configs Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Name
                                            </th>{" "}
                                            <th className="font-[500] p-3">
                                                Email
                                            </th>{" "}
                                            <th className="font-[500] p-3">
                                                Port
                                            </th>
                                            {/* <th className="font-[500] p-3">
                                                End Date
                                            </th> */}
                                            <th className="font-[500] p-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {configs?.map((config, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        {config?.name}
                                                    </td>{" "}
                                                    <td className="p-3">
                                                        {config?.email}
                                                    </td>{" "}
                                                    <td className="p-3">
                                                        {config?.port}
                                                    </td>
                                                    {/* <td className="p-3 capitalize">
                                                        {formatDate(
                                                            config?.endDate
                                                        )}
                                                    </td> */}
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteGroup(
                                                                        config?._id
                                                                    )
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>

                                                            <Link
                                                                to={`${config?._id}/edit`}
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
                                        total={filters?.totalconfigs}
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
