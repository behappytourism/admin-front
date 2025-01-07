import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { formatDate } from "../../utils";
import { BiEditAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import EmailLisitingModal from "../../features/Email/EmailListingModal";
import { MdDelete } from "react-icons/md";

export default function EmailListsListingPage() {
    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalEmails: 0,
    });
    const [isModal, setIsModal] = useState(false);
    const [selectedListId, setSelectedListId] = useState("");
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchEmails = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/email/list/all?skip=${filters?.skip}&limit=${filters?.limit}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setEmails(response.data?.emailLists);
            setFilters((prev) => {
                return { ...prev, totalEmails: response.data?.totalEmailLists };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    const deleteGroup = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/email/list/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filtered = emails.filter((email) => {
                    return email?._id !== id;
                });
                setEmails(filtered);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Mailing Lists
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email/lists" className="text-textColor">
                        Mailing List
                    </Link>
                    <span>{">"} </span>
                    <span>Sent </span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Mailing Lists</h1>
                            <Link to="/email/lists/add">
                                <button className="px-3">+ Add</button>
                            </Link>
                        </div>
                        {emails?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Mailing Lists found
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
                                                Type
                                            </th>
                                            <th className="font-[500] p-3">
                                                Date
                                            </th>

                                            <th className="font-[500] p-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {emails?.map((email, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        {email?.name}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {email?.type ===
                                                        "manual"
                                                            ? "upload file"
                                                            : "Configure mailing"}
                                                    </td>

                                                    <td className="p-3">
                                                        {formatDate(
                                                            email?.createdAt
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedListId(
                                                                        email?._id
                                                                    );
                                                                    setIsModal(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                <BsEyeFill className="text-green-500" />
                                                            </button>{" "}
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteGroup(
                                                                        email?._id
                                                                    )
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <Link
                                                                to={`${email?._id}/edit`}
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
                                        total={filters?.totalEmails}
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
            {isModal && (
                <EmailLisitingModal
                    setIsModal={setIsModal}
                    selectedListId={selectedListId}
                />
            )}
        </div>
    );
}
