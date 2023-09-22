import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "../../../axios";
import QuotationTransferTable from "./QuotationTransferTable";

export default function AddQuotationDetails({ data, setData }) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleDataChange = (e, name) => {
        setData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name],
                [e.target.name]: e.target.value,
            },
        }));
    };

    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);
            console.log("tokens", jwtToken);

            await axios.post(`/quotation/excursion/add`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            navigate("/admin/excursions");
        } catch (err) {
            setError(err?.response?.data?.error || "something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(`/transfer/vehicle/list/all`, {
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

            // const mapVehicleData = (vehicleData) =>
            //     vehicleData?.map((veh) => ({
            //         vehicle: veh?._id,
            //         adultPrice: 0,
            //         childPrice: 0,
            //     }));

            // console.log(mapVehicleData, "mapped data");

            // setData((prev) => ({
            //     ...prev,
            //     ticketPricing: {
            //         ...prev.ticketPricing,
            //         vehicleType: mapVehicleData(response?.data),
            //     },
            //     transferPricing: {
            //         ...prev.transferPricing,
            //         vehicleType: mapVehicleData(response?.data),
            //     },
            // }));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <div className="">
            <div className="">
                <form action="" onSubmit={submitHandler}>
                    <div className="flex items-center gap-[10px] pb-6">
                        <input
                            type="checkbox"
                            name="isQuotation"
                            checked={data?.isQuotation || false}
                            onChange={(e) => {
                                setData((prev) => {
                                    return {
                                        ...prev,
                                        isQuotation: e.target.checked,
                                    };
                                });
                            }}
                            className="w-[17px] h-[17px]"
                            id="isQuotation"
                        />
                        <label htmlFor="isQuotation" className="mb-0 font-[600px]">
                            Do you need to add this activity to quotation ??
                        </label>
                    </div>
                    <div>
                        <div className="flex items-center gap-[10px] pb-6">
                            <input
                                type="checkbox"
                                name="isCarousel"
                                checked={data?.isCarousel || false}
                                onChange={(e) => {
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            isCarousel: e.target.checked,
                                        };
                                    });
                                }}
                                className="w-[17px] h-[17px]"
                                id="isCarousel"
                            />

                            <label htmlFor="isCarousel" className="mb-0 font-[600px]">
                                Do you need to add this to carousel ??
                            </label>
                        </div>
                        {data.isCarousel && (
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <div className="price mb-5">
                                    <label htmlFor="input-price">Carousel Position </label>
                                    <input
                                        type="number"
                                        placeholder="Enter position of carousel"
                                        id="input-price"
                                        name="carouselPosition"
                                        value={data?.carouselPosition || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {data?.isQuotation ? (
                        <>
                            <h1 className="text-[16px] py-2 font-[600] underline pb-4">
                                Select Excursion Type
                            </h1>

                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <div>
                                    <label htmlFor="input-descriptions">Excursion Type</label>
                                    <select
                                        className="w-full"
                                        name="qtnActivityType"
                                        onChange={(e) => {
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    qtnActivityType: e.target.value,
                                                };
                                            });
                                        }}
                                        value={data.qtnActivityType}
                                        required
                                    >
                                        <option value={"transfer"}>Transfer</option>
                                        <option value={"ticket"}>Ticket</option>
                                        {/* <option value={"regular"}>Regular</option> */}
                                    </select>
                                </div>
                            </div>
                            {data.qtnActivityType === "transfer" && (
                                <>
                                    <h1 className="text-[16px] py-2 font-[600] underline pb-4">
                                        Shared Transfer Price
                                    </h1>

                                    <div className="grid grid-cols-3 gap-4 mb-5">
                                        <div className="price mb-5">
                                            <label htmlFor="input-price">Price</label>
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                id="input-price"
                                                name="sicPrice"
                                                value={data?.transferPricing?.sicPrice}
                                                onChange={(e) => {
                                                    handleDataChange(e, "transferPricing");
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {data.qtnActivityType === "ticket" && (
                                <>
                                    <h1 className="text-[16px] py-2 font-[600] underline pb-4">
                                        Ticket Price
                                    </h1>
                                    <div className="grid grid-cols-3 gap-4 mb-5">
                                        <div className="price mb-5">
                                            <label htmlFor="input-price">Adult Price </label>
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                id="input-price"
                                                name="adultPrice"
                                                value={data?.ticketPricing?.adultPrice || ""}
                                                onChange={(e) => {
                                                    handleDataChange(e, "ticketPricing");
                                                }}
                                            />
                                        </div>
                                        <div className="price mb-5">
                                            <label htmlFor="input-price">Child Price </label>
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                id="input-price"
                                                name="childPrice"
                                                value={data?.ticketPricing?.childPrice || ""}
                                                onChange={(e) => {
                                                    handleDataChange(e, "ticketPricing");
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <h1 className="text-[16px] py-2 font-[600] underline  pb-4">
                                        Shared Transfer With Ticket Price
                                    </h1>
                                    <div className="grid grid-cols-3 gap-4 mb-5">
                                        <div className="price mb-5">
                                            <label htmlFor="input-price">Adult Price </label>
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                id="input-price"
                                                name="sicWithTicketAdultPrice"
                                                value={
                                                    data?.ticketPricing?.sicWithTicketAdultPrice ||
                                                    ""
                                                }
                                                onChange={(e) => {
                                                    handleDataChange(e, "ticketPricing");
                                                }}
                                            />
                                        </div>
                                        <div className="price mb-5">
                                            <label htmlFor="input-price">Child Price</label>
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                id="input-price"
                                                name="sicWithTicketChildPrice"
                                                value={
                                                    data?.ticketPricing?.sicWithTicketChildPrice ||
                                                    ""
                                                }
                                                onChange={(e) => {
                                                    handleDataChange(e, "ticketPricing");
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <h1 className="text-[16px] py-2 font-[600] underline pb-4">
                                Private Transfer Price
                            </h1>

                            <QuotationTransferTable
                                vehicles={vehicles}
                                setVehicles={setVehicles}
                                data={data}
                                setData={setData}
                            />
                        </>
                    ) : (
                        ""
                    )}

                    {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                    {/* <div className="mt-4 flex items-center justify-end gap-[12px]">
                        <button
                            className="bg-slate-300 text-textColor px-[15px]"
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        <button className="w-[120px]">
                            {isLoading ? <BtnLoader /> : "Add Transfer"}
                        </button>
                    </div> */}
                </form>
            </div>
        </div>
    );
}
