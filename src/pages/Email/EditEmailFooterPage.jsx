import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, PageLoader, RichTextEditor } from "../../components";
import { useImageChange } from "../../hooks";
import { MultipleSelectDropdown } from "../../components";

export default function EditEmailFooterPage() {
    const [data, setData] = useState({
        name: "",
        html: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { id } = useParams();

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchData = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get(`/email/footers/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const { name, html } = response.data;
            setData((prev) => {
                return {
                    ...prev,
                    name,
                    html,
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

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.patch(`/email/footers/update/${id}`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/email/footers");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">EDIT EMAIL FOOTER</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email/footer" className="text-textColor">
                        Email Footer{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>{" "}
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
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <label className="">HTML</label>{" "}
                                    <div className="border border-t-0">
                                        <RichTextEditor
                                            getValue={(value) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        ["html"]: value,
                                                    };
                                                });
                                            }}
                                            initialValue={data?.html || ""}
                                        />
                                    </div>
                                </div>
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
                                <button className="w-[120px]">
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
