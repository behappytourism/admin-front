import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, MultipleSelectDropdown } from "../../components";
import { useImageChange } from "../../hooks";
import { formatDate } from "../../utils";

export default function AddPromoCodePage() {
    const [data, setData] = useState({
        product: "",
        code: "",
        type: "flat",
        value: "",
        isSpecific: false,
        users: [],
        isValid: false,
        fromValidity: "",
        toValidity: "",
        minPurchaseValue: "",
        maxPromoDiscount: "",
        useageCount: "",
        useagePerPersonCount: "",
    });
    const [resellers, setResellers] = useState([]);
    const products = ["attraction", "transfer"];

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

    const fetchReseller = async () => {
        try {
            setError("");

            setIsLoading(true);
            if (section === "b2b") {
                const response = await axios.get(`/resellers/all/list`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                console.log(response, "response");

                setResellers(response.data.resellers);
            } else {
                const response = await axios.get(`/users/all/list`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                console.log(response, "response");

                setResellers(response.data.users);
            }

            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.post(
                "/promo-code/add",
                { ...data, section: section },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/promo-code");
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchReseller();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">ADD PROMO CODE</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/promo-code" className="text-textColor">
                        promo-code{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-6">
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
                                <label htmlFor="">Promo Code</label>
                                <input
                                    type="string"
                                    placeholder="Enter code "
                                    name="code"
                                    value={data.code || ""}
                                    onChange={handleChange}
                                    required
                                    style={{ textTransform: "uppercase" }}
                                />
                            </div>
                            <div>
                                <label htmlFor=""> Promo Type *</label>
                                <select
                                    value={data?.type || ""}
                                    name="type"
                                    onChange={handleChange}
                                >
                                    <option hidden>Select Type</option>
                                    <option value="flat">Flat</option>{" "}
                                    <option value="percentage">
                                        Percentage
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Promo Value</label>
                                <input
                                    type="number"
                                    placeholder="Enter value "
                                    name="value"
                                    value={data.value || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6 mt-[10px] ">
                            <div>
                                <label htmlFor="">Min Purchase Value</label>
                                <input
                                    type="number"
                                    placeholder="Enter Min Purchase "
                                    name="minPurchaseValue"
                                    value={data.minPurchaseValue || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>{" "}
                            <div>
                                <label htmlFor="">Max Promo Discount </label>
                                <input
                                    type="number"
                                    placeholder="Enter Max Discount  "
                                    name="maxPromoDiscount"
                                    value={data.maxPromoDiscount || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Useage Count </label>
                                <input
                                    type="number"
                                    placeholder="Enter Useage Count  "
                                    name="useageCount"
                                    value={data.useageCount || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">
                                    Useage Count (* Per Person)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Useage Count Per Person "
                                    name="useagePerPersonCount"
                                    value={data.useagePerPersonCount || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6 mt-[10px] ">
                            <div className="flex items-center gap-[10px] mt-[10px]">
                                <label htmlFor="" className="mb-0">
                                    Is Specific
                                </label>
                                <input
                                    type="checkbox"
                                    className="w-[16px] h-[16px]"
                                    checked={data.isSpecific}
                                    onChange={(e) =>
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                isSpecific: e.target.checked,
                                            };
                                        })
                                    }
                                />
                            </div>
                            {data.isSpecific && (
                                <div>
                                    <label htmlFor="">Users</label>
                                    <div className="">
                                        <MultipleSelectDropdown
                                            data={resellers}
                                            displayName={"compnayName"}
                                            selectedData={data?.users || []}
                                            setSelectedData={(datas) =>
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        users: datas,
                                                    };
                                                })
                                            }
                                            valueName={"_id"}
                                            randomIndex={"_id"}
                                            disabled={false}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-6 mt-[10px]">
                            <div className="flex items-center gap-[10px] mt-[10px]">
                                <label htmlFor="" className="mb-0">
                                    Is Valid
                                </label>
                                <input
                                    type="checkbox"
                                    className="w-[16px] h-[16px]"
                                    checked={data.isValid}
                                    onChange={(e) =>
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                isValid: e.target.checked,
                                            };
                                        })
                                    }
                                />
                            </div>
                            {data.isValid && (
                                <>
                                    {" "}
                                    <div>
                                        <label htmlFor="">From Validity</label>
                                        <input
                                            type="date"
                                            placeholder=" "
                                            name="fromValidity"
                                            value={data.fromValidity || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">To Validity</label>
                                        <input
                                            type="date"
                                            placeholder="Enter email "
                                            name="toValidity"
                                            value={data.toValidity || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}
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
