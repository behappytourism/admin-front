import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader } from "../../components";
import { useImageChange } from "../../hooks";

export default function AddEmailConfigPage() {
    const [data, setData] = useState({
        email: "",
        password: "",
        host: "",
        port: "",
        secure: false,
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

            await axios.patch("/email-config/update", data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/email-config");
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
                <h1 className="font-[600] text-[15px]">ADD EMAIL CONFIG</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email-config" className="text-textColor">
                        Email-config{" "}
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
                                <label htmlFor=""> Type *</label>
                                <select
                                    value={data.type || ""}
                                    name="type"
                                    onChange={handleChange}
                                >
                                    <option hidden>Select Type</option>
                                    <option value="products">Products</option>
                                    <option value="action">Action</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Email</label>
                                <input
                                    type="text"
                                    placeholder="Enter email "
                                    name="email"
                                    value={data.email || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Password</label>
                                <input
                                    type="text"
                                    placeholder="Enter password "
                                    name="password"
                                    value={data.password || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Host</label>
                                <input
                                    type="text"
                                    placeholder="Enter Host code"
                                    name="host"
                                    value={data.host || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Port</label>
                                <input
                                    type="number"
                                    placeholder="Enter port code"
                                    name="port"
                                    value={data.port || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <label htmlFor="" className="mb-0">
                                    Secure
                                </label>
                                <input
                                    type="checkbox"
                                    className="w-[16px] h-[16px]"
                                    checked={data.secure}
                                    onChange={(e) =>
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                secure: e.target.checked,
                                            };
                                        })
                                    }
                                />
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
                                {isLoading ? <BtnLoader /> : "Add Config"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
