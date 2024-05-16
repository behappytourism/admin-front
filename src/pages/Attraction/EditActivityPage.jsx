import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader, PageLoader, RichTextEditor } from "../../components";
import axios from "../../axios";
import { ActivityPrivateTransfersSection } from "../../features/Attractions";
import AddQuotationDetails from "../../features/Attractions/components/AddQuotaionDetails";
import ActivityMarkupRow from "../../features/Attractions/components/ActivityMarkupRow";
import { MdDelete } from "react-icons/md";
import { config } from "../../constants";
import { isImageValid } from "../../utils";
import ActivityPricingTable from "../../features/Attractions/components/ActivityPricingTable";
import ActivitySharedPricingTable from "../../features/Attractions/components/ActivitySharedPricingTable";
import ActivityPrivatePricingTable from "../../features/Attractions/components/ActivityPrivatePricingTable";

export default function EditActivityPage() {
    const [data, setData] = useState({
        name: "",
        description: "",
        adultAgeLimit: "",
        childAgeLimit: "",
        infantAgeLimit: "",
        adultCost: "",
        childCost: "",
        infantCost: "",
        hourlyCost: "",
        isVat: false,
        vat: "",
        base: "person",
        isSharedTransferAvailable: false,
        sharedTransferPrice: "",
        sharedTransferCost: "",
        activityType: "normal",
        isPrivateTransferAvailable: false,

        isPromoCode: false,
        promoCode: "",
        promoAmountAdult: "",
        promoAmountChild: "",
        isB2bPromoCode: false,
        b2bPromoCode: "",
        b2bPromoAmountAdult: "",
        b2bPromoAmountChild: "",
        images: [],
        termsAndConditions: "",
        inculsionsAndExclusions: "",
        overview: "",
    });
    const [ticketPrice, setTicketPrice] = useState([]);
    const [sharedTransferPrice, setSharedTransferPrice] = useState([]);
    const [privateTransferPrice, setPrivateTransferPrice] = useState([]);
    const [section, setSection] = useState("activity");
    const [markupUpdate, setMarkupUpdate] = useState([]);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [attraction, setAttraction] = useState({});
    const [privateTransfers, setPrivateTransfers] = useState([]);
    const [profiles, setProfiles] = useState([]);

    const { id, activityId } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const [newImages, setNewImages] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [seasons, setSeasons] = useState([]);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleImageChange = (e) => {
        for (let i = 0; i < e.target?.files?.length; i++) {
            if (isImageValid(e.target.files[i])) {
                setNewImages([...newImages, e.target.files[i]]);
            } else {
                alert("Upload png, jpg, jpeg or webp");
            }
        }
    };

    const removeNewImage = (index) => {
        const filteredImages = newImages?.filter((_, ind) => {
            return ind !== index;
        });
        setNewImages(filteredImages);
    };

    const removeImage = (ind) => {
        const filteredImages = data?.images.filter((_, index) => {
            return index !== ind;
        });
        setData((prev) => {
            return { ...prev, ["images"]: filteredImages };
        });
    };

    const fetchProfiles = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/profile/get-all-profiles/${activityId}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setProfiles((prevProfile) => [
                ...prevProfile,

                ...response.data?.map((data) => {
                    return {
                        ...data,
                        markupType: data.markupType || "flat",
                        markup: data.markup || 0,
                    };
                }),
            ]);

            setMarkupUpdate(
                () =>
                    response.data?.map((data) => {
                        return {
                            profileId: data._id,
                            markupType: data.markupType || "flat",
                            markup: data.markup || 0,
                        };
                    }) || []
            );

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(`/transfer/veh/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setVehicles(
                response.data.map((vh) => {
                    return {
                        ...vh,
                        price: 0,
                    };
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    const fetchSeasons = async () => {
        try {
            const response = await axios.get(`/season/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setSeasons(response.data.seasons);
        } catch (err) {}
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleMarkupSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.patch(
                `/attractions/activities/profiles/update/${activityId}`,
                {
                    markupUpdate,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(-1);
        } catch (err) {
            console.log(err);
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
            const formData = new FormData();
            formData.append("attraction", id);
            formData.append("name", data?.name);
            formData.append("description", data?.description);
            formData.append("adultAgeLimit", data?.adultAgeLimit);
            formData.append("childAgeLimit", data?.childAgeLimit);
            formData.append("infantAgeLimit", data?.infantAgeLimit);
            formData.append("ticketPrice", JSON.stringify(ticketPrice || []));
            formData.append("hourlyCost", data?.hourlyCost || "");
            formData.append("isVat", data?.isVat);
            formData.append("vat", data?.vat || "");
            formData.append("base", data?.base);
            formData.append(
                "isSharedTransferAvailable",
                data?.isSharedTransferAvailable
            );
            formData.append(
                "sharedTransferPrice",
                JSON.stringify(sharedTransferPrice)
            );
            formData.append("activityType", data?.activityType);
            formData.append(
                "isPrivateTransferAvailable",
                data?.isPrivateTransferAvailable
            );
            formData.append("isPromoCode", data?.isPromoCode);
            formData.append("promoCode", data?.promoCode);
            formData.append("promoAmountAdult", data?.promoAmountAdult);
            formData.append("promoAmountChild", data?.promoAmountChild);
            formData.append("isB2bPromoCode", data?.isB2bPromoCode);
            formData.append("b2bPromoCode", data?.b2bPromoCode);
            formData.append("b2bPromoAmountAdult", data?.b2bPromoAmountAdult);
            formData.append("b2bPromoAmountChild", data?.b2bPromoAmountChild);
            formData.append("bookingType", attraction?.bookingType);
            formData.append(
                "privateTransferPrice",
                JSON.stringify(privateTransferPrice)
            );
            formData.append(
                "inculsionsAndExclusions",
                data?.inculsionsAndExclusions
            );
            formData.append("overview", data?.overview);
            formData.append("termsAndConditions", data?.termsAndConditions);

            formData.append("oldImages", JSON.stringify(data?.images));

            for (let i = 0; i < newImages?.length; i++) {
                formData.append("images", newImages[i]);
            }
            await axios.patch(
                `/attractions/activities/update/${activityId}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(-1);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchActivity = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                `/attractions/activities/${activityId}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            const {
                name,
                description,
                adultAgeLimit,
                childAgeLimit,
                infantAgeLimit,
                adultCost,
                childCost,
                infantCost,
                hourlyCost,
                isVat,
                vat,
                base,
                isSharedTransferAvailable,
                ticketPrice,
                sharedTransferPrice,
                activityType,
                isPrivateTransferAvailable,
                privateTransferPrice,
                isPromoCode,
                promoCode,
                promoAmountAdult,
                promoAmountChild,
                images,
                isB2bPromoCode,
                b2bPromoCode,
                b2bPromoAmountAdult,
                b2bPromoAmountChild,
                termsAndConditions,
                inculsionsAndExclusions,
                overview,
            } = response.data;
            setData((prev) => ({
                ...prev,
                name,
                description,
                adultAgeLimit,
                childAgeLimit,
                infantAgeLimit,

                hourlyCost: hourlyCost || "",
                isVat: isVat || false,
                vat: vat || "",
                base: base || "",
                isSharedTransferAvailable: isSharedTransferAvailable || false,

                activityType: activityType || "",
                isPrivateTransferAvailable: isPrivateTransferAvailable || false,
                images: images || [],
                isPromoCode: isPromoCode || false,
                promoCode,
                promoAmountAdult: promoAmountAdult || "",
                promoAmountChild: promoAmountChild || "",
                isB2bPromoCode: isB2bPromoCode || false,
                b2bPromoCode,
                b2bPromoAmountAdult: b2bPromoAmountAdult || "",
                b2bPromoAmountChild: b2bPromoAmountChild || "",
                termsAndConditions: termsAndConditions || "",
                overview: overview || "",
                inculsionsAndExclusions: inculsionsAndExclusions || "",
            }));

            setAttraction(response?.data?.attraction);
            // setPrivateTransfers(
            //     privateTransfers.map((privateTransfer) => {
            //         return {
            //             vehicleTypeId: privateTransfer?._id,

            //             price: privateTransfer?.price,
            //         };
            //     }) || []
            // );
            setTicketPrice(ticketPrice);
            setSharedTransferPrice(sharedTransferPrice);
            setPrivateTransferPrice(privateTransferPrice);

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchActivity();
        fetchSeasons();
        fetchVehicles();
    }, []);

    const handleSectionChange = (e, value) => {
        e.preventDefault();
        setSection(value);
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Edit Activity
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/attractions" className="text-textColor">
                        Attractions{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <Link
                        to={`/attractions/${id}/edit`}
                        className="text-textColor"
                    >
                        Edit{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Activities</span>
                    <span>{">"} </span>
                    <span>
                        {activityId?.slice(0, 3)}...
                        {activityId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded  shadow-sm">
                        <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "activity"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "activity");
                                }}
                            >
                                Activity
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "costing"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "costing");
                                }}
                            >
                                Costing
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "markup"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "markup");
                                }}
                            >
                                Markup
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "quotation"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "quotation");
                                }}
                            >
                                Quotation
                            </button>
                        </div>
                        <form className="p-6" action="" onSubmit={handleSubmit}>
                            <div
                                className={` ${
                                    section === "activity" ? "" : "hidden"
                                }`}
                            >
                                <div className="grid grid-cols-3 items-end gap-5">
                                    <div>
                                        <label htmlFor="">Name</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Pearl Heli Tour (12 Mins. Ride)"
                                            name="name"
                                            value={data.name || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 items-end gap-5 mt-2">
                                    <div className="">
                                        <label htmlFor="">
                                            Adult Age Limit
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Ex: 60"
                                            name="adultAgeLimit"
                                            value={data.adultAgeLimit || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Child Age Limit
                                        </label>
                                        <input
                                            type="number"
                                            name="childAgeLimit"
                                            value={data.childAgeLimit || ""}
                                            onChange={handleChange}
                                            required
                                            placeholder="Ex: 18"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Infant Age Limit
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="Ex: 2"
                                            name="infantAgeLimit"
                                            value={data.infantAgeLimit || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 grid grid-cols-3 gap-5 items-end">
                                    <div>
                                        <div className="flex items-center gap-[10px]">
                                            <input
                                                type="checkbox"
                                                className="w-[16px] h-[16px]"
                                                checked={data.isPromoCode}
                                                onChange={(e) =>
                                                    setData((prev) => {
                                                        return {
                                                            ...prev,
                                                            isPromoCode:
                                                                e.target
                                                                    .checked,
                                                        };
                                                    })
                                                }
                                            />
                                            <label htmlFor="" className="mb-0">
                                                PromoCode Available
                                            </label>
                                        </div>
                                        {data.isPromoCode && (
                                            <div className="mt-2">
                                                <label htmlFor="">
                                                    PromoCode
                                                </label>
                                                <input
                                                    type="text"
                                                    name="promoCode"
                                                    value={data.promoCode || ""}
                                                    onChange={handleChange}
                                                    className="uppercase"
                                                    placeholder="Enter  promo code"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {data.isPromoCode && (
                                        <div>
                                            <label htmlFor="">
                                                PromoCode Amount Adult
                                            </label>
                                            <input
                                                type="number"
                                                name="promoAmountAdult"
                                                value={
                                                    data.promoAmountAdult || ""
                                                }
                                                onChange={handleChange}
                                                placeholder="Enter promo amount"
                                                required
                                            />
                                        </div>
                                    )}
                                    {data.isPromoCode && (
                                        <div>
                                            <label htmlFor="">
                                                PromoCode Amount Child
                                            </label>
                                            <input
                                                type="number"
                                                name="promoAmountChild"
                                                value={
                                                    data.promoAmountChild || ""
                                                }
                                                onChange={handleChange}
                                                placeholder="Enter promo amount"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-5 grid grid-cols-3 gap-5 items-end">
                                    <div>
                                        <div className="flex items-center gap-[10px]">
                                            <input
                                                type="checkbox"
                                                className="w-[16px] h-[16px]"
                                                checked={data.isB2bPromoCode}
                                                onChange={(e) =>
                                                    setData((prev) => {
                                                        return {
                                                            ...prev,
                                                            isB2bPromoCode:
                                                                e.target
                                                                    .checked,
                                                        };
                                                    })
                                                }
                                            />
                                            <label htmlFor="" className="mb-0">
                                                B2b PromoCode Available
                                            </label>
                                        </div>
                                        {data.isB2bPromoCode && (
                                            <div className="mt-2">
                                                <label htmlFor="">
                                                    PromoCode
                                                </label>
                                                <input
                                                    type="text"
                                                    name="b2bPromoCode"
                                                    value={
                                                        data.b2bPromoCode || ""
                                                    }
                                                    onChange={handleChange}
                                                    className="uppercase"
                                                    placeholder="Enter  promo code"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {data.isB2bPromoCode && (
                                        <div>
                                            <label htmlFor="">
                                                PromoCode Amount Adult
                                            </label>
                                            <input
                                                type="number"
                                                name="b2bPromoAmountAdult"
                                                value={
                                                    data.b2bPromoAmountAdult ||
                                                    ""
                                                }
                                                onChange={handleChange}
                                                placeholder="Enter promo amount"
                                                required
                                            />
                                        </div>
                                    )}
                                    {data.isB2bPromoCode && (
                                        <div>
                                            <label htmlFor="">
                                                PromoCode Amount Child
                                            </label>
                                            <input
                                                type="number"
                                                name="b2bPromoAmountChild"
                                                value={
                                                    data.b2bPromoAmountChild ||
                                                    ""
                                                }
                                                onChange={handleChange}
                                                placeholder="Enter promo amount"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5">
                                    <div className="flex items-center gap-[10px]">
                                        <input
                                            type="checkbox"
                                            className="w-[16px] h-[16px]"
                                            checked={data.isVat}
                                            onChange={(e) =>
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        isVat: e.target.checked,
                                                    };
                                                })
                                            }
                                        />
                                        <label htmlFor="" className="mb-0">
                                            Enable/Add Vat
                                        </label>
                                    </div>
                                    {data.isVat && (
                                        <div className="mt-2">
                                            <label htmlFor="">Vat</label>
                                            <input
                                                type="number"
                                                name="vat"
                                                onChange={handleChange}
                                                value={data.vat || ""}
                                                placeholder="Enter Vat"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="">Images</label>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-[1.5em] mt-5">
                                    {newImages.map((image, index) => {
                                        return (
                                            <div
                                                className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                                                key={index}
                                                onClick={() =>
                                                    removeNewImage(index)
                                                }
                                            >
                                                <img
                                                    src={URL.createObjectURL(
                                                        image
                                                    )}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                                                    <MdDelete />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {data?.images?.map((image, index) => {
                                        return (
                                            <div
                                                className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                                                key={index}
                                                onClick={() =>
                                                    removeImage(index)
                                                }
                                            >
                                                <img
                                                    src={
                                                        config.SERVER_URL +
                                                        image
                                                    }
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                                                    <MdDelete />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="col-span-3 mt-5">
                                    <label htmlFor="">Description</label>
                                    <div className="border border-t-0">
                                        <RichTextEditor
                                            getValue={(value) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        description: value,
                                                    };
                                                });
                                            }}
                                            initialValue={
                                                data?.description || ""
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-span-3 mt-5">
                                    <label htmlFor="">
                                        Terms And Conditions
                                    </label>
                                    <div className="border border-t-0">
                                        <RichTextEditor
                                            getValue={(value) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        termsAndConditions:
                                                            value,
                                                    };
                                                });
                                            }}
                                            initialValue={
                                                data?.termsAndConditions || ""
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-span-3 mt-5">
                                    <label htmlFor="">Overview</label>
                                    <div className="border border-t-0">
                                        <RichTextEditor
                                            getValue={(value) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        overview: value,
                                                    };
                                                });
                                            }}
                                            initialValue={data?.overview || ""}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-3 mt-5">
                                    <label htmlFor="">
                                        Inculsions And Exclusions{" "}
                                    </label>
                                    <div className="border border-t-0">
                                        <RichTextEditor
                                            getValue={(value) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        inculsionsAndExclusions:
                                                            value,
                                                    };
                                                });
                                            }}
                                            initialValue={
                                                data?.inculsionsAndExclusions ||
                                                ""
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className={` ${
                                    section === "costing" ? "" : "hidden"
                                }`}
                            >
                                {" "}
                                <div className="grid grid-cols-3 items-end gap-5 pt-10">
                                    <div>
                                        <label htmlFor="">Activity Type</label>
                                        <select
                                            name="activityType"
                                            value={data.activityType || ""}
                                            onChange={handleChange}
                                            id=""
                                        >
                                            <option value="" hidden>
                                                Select Activity Type
                                            </option>
                                            <option value="normal">
                                                Normal Activity
                                            </option>
                                            {attraction?.bookingType ===
                                                "booking" && (
                                                <option value="transfer">
                                                    Transfer Activity
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="">Base</label>
                                        <select
                                            name="base"
                                            value={data.base || ""}
                                            onChange={handleChange}
                                            required
                                            id=""
                                        >
                                            <option value="person">
                                                Person
                                            </option>
                                            {/* <option value="private">Private</option> */}
                                            {attraction?.bookingType ===
                                                "booking" && (
                                                <option value="hourly">
                                                    Hourly
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    {data.base === "hourly" && (
                                        <>
                                            <div className="">
                                                <label htmlFor="">
                                                    Purchase Cost (Hourly)
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="Enter hours count"
                                                    name="hourlyCost"
                                                    value={
                                                        data.hourlyCost || ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="mt-2">
                                    {data.activityType === "normal" &&
                                        data.base === "person" && (
                                            <>
                                                <h1 className="text-[16px] py-2 font-[600] underline pb-4">
                                                    Price
                                                </h1>
                                                <ActivityPricingTable
                                                    setPricing={setTicketPrice}
                                                    pricing={ticketPrice}
                                                    seasons={seasons}
                                                />
                                            </>
                                        )}
                                </div>
                                <div className="flex items-center gap-[10px] pt-10">
                                    <input
                                        type="checkbox"
                                        className="w-[16px] h-[16px]"
                                        checked={data.isSharedTransferAvailable}
                                        onChange={(e) =>
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    isSharedTransferAvailable:
                                                        e.target.checked,
                                                };
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor=""
                                        className="mb-0 text-[16px] py-2 font-[600]"
                                    >
                                        Shared Transfer Available
                                    </label>
                                </div>
                                {data.isSharedTransferAvailable && (
                                    <div className="mt-2">
                                        <h1 className="text-[16px] py-2 font-[600] underline  pb-4">
                                            Shared Transfer Price
                                        </h1>
                                        <ActivitySharedPricingTable
                                            setPricing={setSharedTransferPrice}
                                            pricing={sharedTransferPrice}
                                            seasons={seasons}
                                        />{" "}
                                    </div>
                                )}
                                <div className="mt-5">
                                    <div className="flex items-center gap-[10px]">
                                        <input
                                            type="checkbox"
                                            className="w-[16px] h-[16px]"
                                            checked={
                                                data.isPrivateTransferAvailable
                                            }
                                            onChange={(e) =>
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        isPrivateTransferAvailable:
                                                            e.target.checked,
                                                    };
                                                })
                                            }
                                        />
                                        <label
                                            htmlFor=""
                                            className="mb-0 text-[16px] py-2 font-[600]"
                                        >
                                            Private Transfer Available
                                        </label>
                                    </div>
                                    {data.isPrivateTransferAvailable && (
                                        <div className="mt-2">
                                            <h1 className="text-[16px] py-2 font-[600] underline  pb-4">
                                                Private Transfer Price
                                            </h1>
                                            <ActivityPrivatePricingTable
                                                vehicles={vehicles}
                                                pricing={privateTransferPrice}
                                                setPricing={
                                                    setPrivateTransferPrice
                                                }
                                                seasons={seasons}
                                            />
                                        </div>
                                    )}
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
                                    {isLoading ? (
                                        <BtnLoader />
                                    ) : (
                                        "Update Activity"
                                    )}
                                </button>
                            </div>
                        </form>

                        <div
                            className={` ${
                                section === "markup" ? "w-full " : "hidden"
                            }`}
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Index
                                            </th>
                                            <th className="font-[500] p-3">
                                                Name
                                            </th>
                                            <th className="font-[500] p-3">
                                                Markup
                                            </th>
                                            <th className="font-[500] p-3">
                                                Markup Type
                                            </th>

                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm ">
                                        {profiles?.map((profile, index) => {
                                            return (
                                                <ActivityMarkupRow
                                                    index={index}
                                                    profile={profile}
                                                    markupUpdate={markupUpdate}
                                                    setMarkupUpdate={
                                                        setMarkupUpdate
                                                    }
                                                    // section={section}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {error && (
                                <span className="text-sm block text-red-500 mt-2">
                                    {error}
                                </span>
                            )}
                        </div>
                        <div
                            className={` ${
                                section === "quotation" ? "" : "hidden"
                            }`}
                        >
                            <div
                                className={` ${
                                    section === "quotation"
                                        ? "w-full"
                                        : "hidden"
                                }`}
                            >
                                <AddQuotationDetails
                                    data={data}
                                    setData={setData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
