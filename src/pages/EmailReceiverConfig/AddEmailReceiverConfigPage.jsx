import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, MultipleSelectDropdown } from "../../components";
import { useImageChange } from "../../hooks";

export default function AddEmailReceiverConfigPage() {
    const [data, setData] = useState({
        product: "",
        email: "",
        actions: [],
    });

    const products = ["orders", "general"];
    const actions = [
        { name: "confirm" },
        { name: "reject" },
        { name: "cancel" },
        { name: "order" },
    ];
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { section } = useParams();
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

            await axios.patch(
                "/email-receiver-config/update",
                { ...data, type: section },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/email-receiver-config");
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">
                    ADD EMAIL RECEIVER CONFIG
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link
                        to="/email-receiver-config"
                        className="text-textColor"
                    >
                        Email-receiver-config{" "}
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
                                <label htmlFor=""> Products *</label>
                                <select
                                    value={data.product || ""}
                                    name="product"
                                    onChange={handleChange}
                                >
                                    <option hidden>Select Type</option>
                                    {products.map((product) => {
                                        return (
                                            <option value={product}>
                                                {product}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Actions</label>
                                <div className="">
                                    <MultipleSelectDropdown
                                        data={actions}
                                        displayName={"name"}
                                        selectedData={data.actions || []}
                                        setSelectedData={(datas) =>
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    actions: datas,
                                                };
                                            })
                                        }
                                        valueName={"name"}
                                        randomIndex={"actions"}
                                        disabled={false}
                                    />
                                </div>
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
