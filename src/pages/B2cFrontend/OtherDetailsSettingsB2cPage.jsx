import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { BtnLoader, PageLoader } from "../../components";

export default function OtherDetailsSettingsB2cPage() {
    const [data, setData] = useState({
        phoneNumber1: "",
        phoneNumber2: "",
        email: "",
        facebookUrl: "",
        instagramUrl: "",
        footerDescription: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchDetails = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                "/frontend/b2c/home/meta-details",
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setData({
                phoneNumber1: response?.data?.phoneNumber1,
                phoneNumber2: response?.data?.phoneNumber2,
                email: response?.data?.email,
                facebookUrl: response?.data?.facebookUrl,
                instagramUrl: response?.data?.instagramUrl,
                footerDescription: response?.data?.footerDescription,
            });
            setIsPageLoading(false);
        } catch (err) {
            setIsPageLoading(false);

            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            await axios.patch(`/frontend/b2c/home/meta/update`, data, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Other Details Setting
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
                    <span>Other Details</span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="">Phone Number 1</label>
                                    <input
                                        type="number"
                                        placeholder="Enter Phone Number"
                                        value={data.phoneNumber1 || ""}
                                        name="phoneNumber1"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Whatsapp Number</label>
                                    <input
                                        type="number"
                                        placeholder="Whatsapp Number"
                                        value={data.phoneNumber2 || ""}
                                        name="phoneNumber2"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={data.email || ""}
                                        onChange={handleChange}
                                        placeholder="Enter Email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Facebook Url</label>
                                    <input
                                        type="text"
                                        value={data.facebookUrl || ""}
                                        name="facebookUrl"
                                        onChange={handleChange}
                                        placeholder="Enter Facebook URL"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Instagram Url</label>
                                    <input
                                        type="text"
                                        value={data.instagramUrl || ""}
                                        name="instagramUrl"
                                        onChange={handleChange}
                                        placeholder="Enter Instagram URL"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">Footer Description</label>
                                <textarea
                                    name="footerDescription"
                                    value={data.footerDescription || ""}
                                    onChange={handleChange}
                                    id=""
                                    placeholder="Enter Description"
                                ></textarea>
                            </div>

                            {error && (
                                <span className="text-sm block text-red-500 mt-2">
                                    {error}
                                </span>
                            )}
                            <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button className="w-[100px]">
                                    {isLoading ? <BtnLoader /> : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
