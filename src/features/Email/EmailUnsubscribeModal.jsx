import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside, useImageChange } from "../../hooks";
import { BtnLoader } from "../../components";
import axios from "../../axios";
import { config } from "../../constants";

export default function EmailUnSubscribeModal({
    modal,
    setModal,
    selectedEmail,
    setEmails,
    emails,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        email: selectedEmail?.email || "",
    });

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setModal({ isEdit: false, isOpen: false })
    );

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (modal?.isEdit) {
                const response = await axios.patch(
                    `/email/unsubscribe/update/${selectedEmail.id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                setEmails((prev) => {
                    const findEmailIndex = emails.findIndex(
                        (email) => email?._id == selectedEmail?.id
                    );
                    console.log(findEmailIndex);

                    const updatedEmails = [...prev];

                    updatedEmails[findEmailIndex] = response.data;

                    console.log(updatedEmails);
                    return updatedEmails;
                });
            } else {
                const response = await axios.post(
                    `/email/unsubscribe/add`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                setEmails((prev) => {
                    const updatedEmails = [response.data, ...prev];
                    return updatedEmails;
                });
            }

            setIsLoading(false);
            setModal({ isEdit: false, isOpen: false });
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Email Upload</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setModal({ isEdit: false, isOpen: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <form className="p-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="">Name *</label>
                        <input
                            type="text"
                            name="email"
                            value={data.email || ""}
                            onChange={handleChange}
                            placeholder="tctt12345@gmail.com"
                            required
                        />
                    </div>

                    {error && (
                        <span className="block mt-2 text-sm text-red-500">
                            {error}
                        </span>
                    )}
                    <div className="flex items-center justify-end mt-5">
                        <button className="w-[160px]" disabled={isLoading}>
                            {isLoading ? (
                                <BtnLoader />
                            ) : modal?.isEdit ? (
                                "Edit"
                            ) : (
                                "Add"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
