import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

import axios from "../../axios";
import { EmailModal } from "../../features/EmailSettings";
import { PageLoader } from "../../components";

export default function EmailSettingsEmailsPage() {
    const [emailsModal, setEmailsModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedEmail, setSelectedEmail] = useState({});
    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchEmails = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get("/emails/all", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setEmails(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteEmail = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/emails/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filteredEmails = emails?.filter((email) => {
                    return email?._id !== id;
                });
                setEmails(filteredEmails);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Emails</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email-settings" className="text-textColor">
                        Email Settings{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Emails </span>
                </div>
            </div>

            {emailsModal?.isOpen && (
                <EmailModal
                    emailsModal={emailsModal}
                    setEmailsModal={setEmailsModal}
                    selectedEmail={selectedEmail}
                    emails={emails}
                    setEmails={setEmails}
                />
            )}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Emails</h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setEmailsModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Email
                            </button>
                        </div>
                        {emails?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Emails found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Email</th>
                                            <th className="font-[500] p-3">Email Type</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {emails?.map((email, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">{email?.email}</td>
                                                    <td className="p-3 capitalize">
                                                        {email?.emailType}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteEmail(email?._id)
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedEmail(email);
                                                                    setEmailsModal({
                                                                        isOpen: true,
                                                                        isEdit: true,
                                                                    });
                                                                }}
                                                            >
                                                                <BiEditAlt />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
