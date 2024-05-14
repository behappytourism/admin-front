import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, SelectDropdown } from "../../components";

export default function AddVendorPage() {
    const [data, setData] = useState({
        companyName: "",
        address: "",
        website: "",
        country: "",
        city: "",
        zipCode: "",
        designation: "",
        name: "",
        phoneNumber: "",
        email: "",
        skypeId: "",
        whatsappNumber: "",
        trnNumber: "",
        companyRegistration: "",
        telephoneNumber: "",
        status: "pending",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
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

            await axios.post(`/vendor/add`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            navigate(-1);
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
                <h1 className="font-[600] text-[15px] uppercase">Add Vendor</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vendor" className="text-textColor">
                        vendor{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        <h2 className="font-[600] mb-3">Company Information</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">Company Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter Company Name"
                                    name="companyName"
                                    value={data.companyName || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Address *</label>
                                <input
                                    type="text"
                                    placeholder="Enter Company Address"
                                    name="address"
                                    value={data.address || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Website *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: www.abc.com"
                                    name="website"
                                    value={data.website || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Country *</label>
                                <SelectDropdown
                                    data={countries}
                                    displayName={"countryName"}
                                    placeholder={"Select Country"}
                                    valueName={"_id"}
                                    selectedData={data.country || ""}
                                    setSelectedData={(val) =>
                                        setData((prev) => {
                                            return { ...prev, country: val };
                                        })
                                    }
                                />
                            </div>
                            {countries?.find(
                                (item) => item?._id === data.country
                            )?.isocode === "AE" && (
                                <>
                                    <div>
                                        <label htmlFor="">TRN Number</label>
                                        <input
                                            type="text"
                                            placeholder="Enter TRN Number"
                                            name="trnNumber"
                                            value={data.trnNumber || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Company Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Company Registration Number"
                                            name="companyRegistration"
                                            value={
                                                data.companyRegistration || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label htmlFor="">City *</label>
                                <input
                                    type="text"
                                    placeholder="Enter City"
                                    name="city"
                                    value={data.city || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Zipcode</label>
                                <input
                                    type="number"
                                    placeholder="Enter Zipcode"
                                    name="zipCode"
                                    value={data.zipCode || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">TNR No</label>
                                <input
                                    type="text"
                                    placeholder="TNR7789"
                                    name="trnNumber"
                                    value={data.trnNumber || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">
                                    Company Registration No
                                </label>
                                <input
                                    type="text"
                                    placeholder="TCTT14654"
                                    name="companyRegistration"
                                    value={data.companyRegistration || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <h2 className="font-[600] mb-3 mt-8">
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">Agent Name *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: John Deo"
                                    name="name"
                                    value={data.name || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Phone Number *</label>
                                <div className="flex items-center gap-[10px]">
                                    <input
                                        type="text"
                                        disabled
                                        value={
                                            data.country &&
                                            countries?.length > 0
                                                ? countries.find(
                                                      (item) =>
                                                          item?._id ===
                                                          data.country
                                                  )?.phonecode
                                                : "+0"
                                        }
                                        className="w-[70px] text-center"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Enter Phone Number"
                                        name="phoneNumber"
                                        value={data.phoneNumber || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="">Telephone Number</label>
                                <div className="flex items-center gap-[10px]">
                                    <input
                                        type="text"
                                        disabled
                                        value={
                                            data.country &&
                                            countries?.length > 0
                                                ? countries.find(
                                                      (item) =>
                                                          item?._id ===
                                                          data.country
                                                  )?.phonecode
                                                : "+0"
                                        }
                                        className="w-[70px] text-center"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Enter Telephone Number"
                                        name="telephoneNumber"
                                        value={data.telephoneNumber || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="">Email *</label>
                                <input
                                    type="email"
                                    placeholder="Ex: john@gmail.com"
                                    name="email"
                                    value={data.email || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Designation *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Manager"
                                    name="designation"
                                    value={data.designation || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Skype Id</label>
                                <input
                                    type="text"
                                    placeholder="Enter Skype Id"
                                    name="skypeId"
                                    value={data.skypeId || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Whatsapp *</label>
                                <input
                                    type="text"
                                    placeholder="Enter Whatsapp"
                                    name="whatsappNumber"
                                    value={data.whatsappNumber || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <h2 className="font-[600] mb-3 mt-8">Other Info</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">Status *</label>
                                <select
                                    name="status"
                                    id=""
                                    value={data.status || ""}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" hidden>
                                        Select Status
                                    </option>
                                    <option value="ok">Ok</option>
                                    <option value="pending">Pending</option>
                                    <option value="disabled">Disabled</option>
                                </select>
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
                            <button className="w-[150px]">
                                {isLoading ? <BtnLoader /> : "Add Reseller"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
