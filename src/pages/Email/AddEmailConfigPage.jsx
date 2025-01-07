import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, RichTextEditor } from "../../components";

export default function AddEmailConfigPage() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        host: "",
        port: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

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

            await axios.post("/email/configs/add", data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/email/configs");
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
                <h1 className="font-[600] text-[15px]">ADD EMAIL FOOTER</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email/footer" className="text-textColor">
                        Email Footer{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>
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
                            <div>
                                <label htmlFor="">Email</label>
                                <input
                                    type="text"
                                    placeholder="Enter  email"
                                    name="email"
                                    value={data.email || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>{" "}
                            <div>
                                <label htmlFor="">Password</label>
                                <input
                                    type="text"
                                    placeholder="Enter  password"
                                    name="password"
                                    value={data.password || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>{" "}
                            <div>
                                <label htmlFor="">Host</label>
                                <input
                                    type="text"
                                    placeholder="Enter host"
                                    name="host"
                                    value={data.host || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>{" "}
                            <div>
                                <label htmlFor="">Port</label>
                                <input
                                    type="text"
                                    placeholder="Enter port"
                                    name="port"
                                    value={data.port || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>{" "}
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
                                {isLoading ? <BtnLoader /> : "Add "}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
