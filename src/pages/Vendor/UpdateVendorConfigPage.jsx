import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import {
    BtnLoader,
    MultipleSelectDropdown,
    PageLoader,
    Toggle,
} from "../../components";

export default function UpdateVendorConfigPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        showAttraction: false,
        showInsurance: false,
        showHotel: false,
        showFlight: false,
        showVisa: false,
        showA2a: false,
        showQuotaion: false,
        reseller: {},
        allowedPaymentMethods: [],
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError("");

            await axios.patch(
                `/vendor/update/${id}/configurations`,
                {
                    showAttraction: data.showAttraction,
                    showInsurance: data.showInsurance,
                    showHotel: data.showHotel,
                    showFlight: data.showFlight,
                    showVisa: data.showVisa,
                    showA2a: data.showA2a,
                    showQuotaion: data.showQuotaion,
                    allowedPaymentMethods: data.allowedPaymentMethods,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(`/b2b/${id}/details`);
        } catch (err) {
            setIsLoading(false);
            setError(
                err?.response?.data?.error || "Something went wrong, try again"
            );
        }
    };

    const fetchReseller = async (e) => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                `/vendor/single/${id}/configurations`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setData((prev) => {
                return {
                    ...prev,
                    vendor: response.data.vendor,
                    showAttraction: response.data?.showAttraction || false,
                    showInsurance: response.data?.showInsurance || false,
                    showHotel: response.data?.showHotel || false,
                    showFlight: response.data?.showFlight || false,
                    showVisa: response.data?.showVisa || false,
                    showA2a: response.data?.showA2a || false,
                    showQuotaion: response.data?.showQuotaion || false,

                    allowedPaymentMethods:
                        response?.data?.allowedPaymentMethods || [],
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleToggleChange = (name, value) => {
        setData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    useEffect(() => {
        fetchReseller();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Vendor Configuration
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vendor" className="text-textColor">
                        vendor{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link
                        to={`/vendor/${id}/details`}
                        className="text-textColor"
                    >
                        {id?.slice(0, 3)}...{id?.slice(-3)}
                    </Link>
                    <span>{">"} </span>
                    <Link to={`/vendor/${id}/edit`} className="text-textColor">
                        Edit{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Configurations</span>
                </div>
            </div>
            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="p-4 bg-white rounded shadow-sm">
                        <div className="mb-5">
                            <h2 className="font-[600]">
                                {data.vendor?.name} - ({data.vendor?.vendorCode}
                                )
                            </h2>
                            <span className="text-sm text-grayColor block">
                                {data?.vendor?.email}
                            </span>
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            <div>
                                <label htmlFor="">Show Attraction</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange(
                                            "showAttraction",
                                            e.target.checked
                                        )
                                    }
                                    value={data.showAttraction || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Show Hotel</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange(
                                            "showHotel",
                                            e.target.checked
                                        )
                                    }
                                    value={data.showHotel || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Show Flight</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange(
                                            "showFlight",
                                            e.target.checked
                                        )
                                    }
                                    value={data.showFlight || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Show Visa</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange(
                                            "showVisa",
                                            e.target.checked
                                        )
                                    }
                                    value={data.showVisa || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Show A2A</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange(
                                            "showA2a",
                                            e.target.checked
                                        )
                                    }
                                    value={data.showA2a || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Show Quotaion</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange(
                                            "showQuotaion",
                                            e.target.checked
                                        )
                                    }
                                    value={data.showQuotaion || false}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="">Show Insurance</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange(
                                            "showInsurance",
                                            e.target.checked
                                        )
                                    }
                                    value={data.showInsurance || false}
                                />
                            </div>
                        </div>

                        {/* <div className="mt-8 grid grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="">
                                    Allowed Payment Methods *
                                </label>
                                <MultipleSelectDropdown
                                    data={[
                                        { value: "wallet" },
                                        { value: "ccavenue" },
                                        { value: "pay-later" },
                                    ]}
                                    valueName="value"
                                    displayName="value"
                                    selectedData={data.allowedPaymentMethods}
                                    setSelectedData={(val) => {
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                allowedPaymentMethods: val,
                                            };
                                        });
                                    }}
                                    randomIndex={"allowedPaymentMethods0001"}
                                />
                            </div>
                        </div> */}

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
                            <button
                                className="w-[200px]"
                                onClick={handleSubmit}
                            >
                                {isLoading ? (
                                    <BtnLoader />
                                ) : (
                                    "Update Configuration"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
