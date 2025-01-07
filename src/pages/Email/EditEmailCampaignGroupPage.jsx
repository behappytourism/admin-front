import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import {
    BtnLoader,
    MultipleSelectDropdown,
    PageLoader,
} from "../../components";

export default function EditEmailCampaignGroupPage() {
    const [data, setData] = useState({
        name: "",
        startDate: "",
        endDate: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.patch(`/email/campaign/group/update/${id}`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/email/campaign-groups");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get(
                `/email/campaign/group/single/${id}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const { name, startDate, endDate } = response.data;
            setData((prev) => {
                return {
                    ...prev,
                    name,
                    startDate: startDate?.slice(0, 10),
                    endDate: endDate?.slice(0, 10),
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccessChange = (selectedData) => {
        setData((prev) => {
            return { ...prev, access: selectedData };
        });
    };

    console.log(data.access, "access", data.access);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">
                    EDIT EMAIL CAMPAIGN GROUP
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link
                        to="/email/campaign-groups"
                        className="text-textColor"
                    >
                        Email Campagin Group{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Edit</span>
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
                                    <label htmlFor="">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter  name"
                                        name="name"
                                        value={data.name || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>{" "}
                                {/* <div>
                                    <label htmlFor="">Start Date</label>
                                    <input
                                        type="date"
                                        placeholder="Enter date"
                                        name="startDate"
                                        value={data.startDate || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">End Date</label>
                                    <input
                                        type="date"
                                        placeholder="Enter  name"
                                        name="endDate"
                                        value={data.endDate || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div> */}
                            </div>
                            {error && (
                                <span className="text-sm block text-red-500 mt-2">
                                    {error}
                                </span>
                            )}
                            <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                <button className="w-[130px]">
                                    {isLoading ? <BtnLoader /> : "Update "}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
