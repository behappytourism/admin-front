import axios from "../../axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEditAlt, BiPlus } from "react-icons/bi";
import AddFooterModal from "../../features/Home/components/AddFooterModal";
import { FooterLinkModal, SingleFooterCard } from "../../features/Home";
import { BtnLoader, PageLoader } from "../../components";

export default function FooterSettingsB2cPage() {
    const [footer, setFooter] = useState([]);
    const [footerModal, setFooterModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedFooter, setSelectedFooter] = useState({
        footerIndex: "",
        footer: {},
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchFooter = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get("/frontend/b2c/home/footer", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setFooter(response?.data?.footer);
            setIsPageLoading(false);
        } catch (err) {
            setIsPageLoading(false);
            setFooter([]);
            console.log(err);
        }
    };

    const addFooter = (title) => {
        footer.push({ title, navLinks: [] });
    };

    const updateFooter = (title) => {
        let tempFooter = footer;
        tempFooter[selectedFooter?.footerIndex].title = title;
        setFooter(tempFooter);
    };

    const handleUpdateFooter = async () => {
        try {
            setIsLoading(true);
            setError("");

            await axios.patch(
                "/frontend/b2c/home/footer/update",
                { footer },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFooter();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Footer Setting
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Home </span>
                    <span>{">"} </span>
                    <span>Settings </span>
                    <span>{">"} </span>
                    <span>Footer</span>
                </div>
            </div>

            {isPageLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Footer Links</h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setFooterModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add New
                            </button>
                        </div>
                        {footer?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Footer Found
                                </span>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-4 gap-6">
                                    {footer?.map((item, index) => {
                                        return (
                                            <SingleFooterCard
                                                key={index}
                                                item={item}
                                                footerIndex={index}
                                                setFooterModal={setFooterModal}
                                                footer={footer}
                                                setFooter={setFooter}
                                                setSelectedFooter={
                                                    setSelectedFooter
                                                }
                                            />
                                        );
                                    })}
                                </div>

                                {error && (
                                    <span className="block text-sm text-red-500 mt-4">
                                        {error}
                                    </span>
                                )}

                                <div className="flex items-center justify-end">
                                    <button
                                        className="w-[140px]"
                                        disabled={isLoading}
                                        onClick={handleUpdateFooter}
                                    >
                                        {isLoading ? (
                                            <BtnLoader />
                                        ) : (
                                            "Update Footer"
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {footerModal?.isOpen && (
                <AddFooterModal
                    footerModal={footerModal}
                    setFooterModal={setFooterModal}
                    addFooter={addFooter}
                    updateFooter={updateFooter}
                    selectedFooter={selectedFooter}
                />
            )}
        </div>
    );
}
