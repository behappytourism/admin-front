import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside, useImageChange } from "../../hooks";
import { BtnLoader, PageLoader } from "../../components";
import axios from "../../axios";
import { config } from "../../constants";
import { TiTick } from "react-icons/ti";

export default function EmailLisitingModal({ setIsModal, selectedListId }) {
    const wrapperRef = useRef();
    const [emailListing, setEmailListing] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchEmailsLists = async (id) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/email/list/emails/${selectedListId}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setEmailListing(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEmailsLists();
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[400px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">View Emails </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                {isLoading ? (
                    <PageLoader />
                ) : (
                    <div className="p-5 gap-5">
                        {emailListing.map((email) => {
                            return (
                                <div className="flex items-center justify-start">
                                    {email}{" "}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
