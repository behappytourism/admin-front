import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import {
    BtnLoader,
    MultipleSelectDropdown,
    PageLoader,
    SelectDropdown,
} from "../../components";

export default function EditEmailListPage() {
    const [data, setData] = useState({
        name: "",
        type: "",
        recipientGroup: [],
        products: [],
        countries: [],
        isCountries: false,
    });
    const [recipients, setRecipients] = useState([
        { name: "b2b" },
        { name: "b2c" },
        { name: "admin" },
    ]);
    const [products, setProducts] = useState([
        { name: "all" },
        { name: "a2a" },
        { name: "attraction" },
        { name: "flight" },
        { name: "hotel" },
    ]);
    const [file, setFile] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
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

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("type", data.type);
            formData.append("recipientGroup", data.recipientGroup);
            formData.append("products", JSON.stringify(data.products));
            formData.append("filePath", file);
            formData.append("countries", JSON.stringify(data.countries));
            formData.append("isCountries", data.isCountries);

            await axios.patch(`/email/list/update/${id}`, formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/email/lists");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const fetchData = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get(`/email/list/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const {
                name,
                type,
                products,
                recipientGroup,
                isCountries,
                countries,
            } = response.data;
            setData((prev) => {
                return {
                    ...prev,
                    name,
                    type,
                    products,
                    recipientGroup,
                    isCountries,
                    countries,
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
                <h1 className="font-[600] text-[15px]">EDIT MAILING LIST</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email/lists" className="text-textColor">
                        Mailing List{" "}
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
                                </div>
                                <div>
                                    <label htmlFor="">Type</label>
                                    <select
                                        name="type"
                                        value={data.type || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                        className="capitalize"
                                    >
                                        <option value="" hidden>
                                            Select Type
                                        </option>
                                        <option value="manual">
                                            Upload File
                                        </option>{" "}
                                        <option value="custom">
                                            Configure Mailing List
                                        </option>
                                    </select>
                                </div>
                                {data.type === "manual" && (
                                    <div className="">
                                        <label htmlFor="">File</label>
                                        <input
                                            type="file"
                                            onChange={fileChange}
                                            // required
                                        />
                                    </div>
                                )}
                                {data.type === "custom" && (
                                    <>
                                        <div>
                                            <label htmlFor="">Recipient</label>
                                            <div className="">
                                                <SelectDropdown
                                                    data={recipients}
                                                    valueName={"name"}
                                                    displayName={"name"}
                                                    placeholder={
                                                        "Select Recipient Group"
                                                    }
                                                    selectedData={
                                                        data?.recipientGroup ||
                                                        ""
                                                    }
                                                    setSelectedData={(
                                                        selData
                                                    ) =>
                                                        setData((prev) => {
                                                            console.log(
                                                                selData,
                                                                "selectedData"
                                                            );

                                                            return {
                                                                ...prev,
                                                                ["recipientGroup"]:
                                                                    selData,
                                                            };
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {data?.recipientGroup == "b2b" && (
                                            <div>
                                                <label htmlFor="">
                                                    Products
                                                </label>
                                                <div className="">
                                                    <MultipleSelectDropdown
                                                        data={products}
                                                        displayName={"name"}
                                                        selectedData={
                                                            data.products || []
                                                        }
                                                        setSelectedData={(
                                                            selData
                                                        ) =>
                                                            setData((prev) => {
                                                                return {
                                                                    ...prev,
                                                                    ["products"]:
                                                                        selData,
                                                                };
                                                            })
                                                        }
                                                        valueName={"name"}
                                                        randomIndex={"name"}
                                                        // disabled={!isEditPermission}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {data?.recipientGroup == "b2b" && (
                                            <>
                                                <div className="flex items-center gap-5 justify-center">
                                                    <input
                                                        type="checkbox"
                                                        name="isCountries"
                                                        checked={
                                                            data.isCountries ||
                                                            false
                                                        }
                                                        onChange={(e) => {
                                                            handleCheckBoxChange(
                                                                e
                                                            );
                                                        }}
                                                        className="w-[17px] h-[17px]"
                                                        id="isCountries"
                                                        // disabled={!isEditPermission}
                                                    />{" "}
                                                    <label htmlFor="">
                                                        Is Countries
                                                    </label>
                                                </div>
                                                {data?.recipientGroup ==
                                                    "b2b" &&
                                                    data.isCountries && (
                                                        <div>
                                                            <label htmlFor="">
                                                                Countries
                                                            </label>
                                                            <div className="">
                                                                <MultipleSelectDropdown
                                                                    data={
                                                                        countries
                                                                    }
                                                                    displayName={
                                                                        "countryName"
                                                                    }
                                                                    valueName={
                                                                        "_id"
                                                                    }
                                                                    randomIndex={
                                                                        "name"
                                                                    }
                                                                    selectedData={
                                                                        data.countries ||
                                                                        []
                                                                    }
                                                                    setSelectedData={(
                                                                        selData
                                                                    ) =>
                                                                        setData(
                                                                            (
                                                                                prev
                                                                            ) => {
                                                                                return {
                                                                                    ...prev,
                                                                                    ["countries"]:
                                                                                        selData,
                                                                                };
                                                                            }
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                            </>
                                        )}
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
