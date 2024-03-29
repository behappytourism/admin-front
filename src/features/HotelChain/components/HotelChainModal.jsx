import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function HotelChainModal({
    hotelChainModal,
    setHotelChainModal,
    selectedChain,
    chains,
    setChains,
    hotelGroups,
}) {
    const [data, setData] = useState({
        chainCode: (hotelChainModal?.isEdit && selectedChain?.chainCode) || "",
        chainName: (hotelChainModal?.isEdit && selectedChain?.chainName) || "",
        hotelGroup:
            (hotelChainModal?.isEdit && selectedChain?.hotelGroup?._id) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setHotelChainModal({ isEdit: false, isOpen: false })
    );
    const { jwtToken } = useSelector((state) => state.admin);

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

            if (hotelChainModal?.isEdit) {
                const response = await axios.patch(
                    `/hotels/chains/update/${selectedChain?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                const tempChains = chains;
                const objIndex = tempChains?.findIndex((item) => {
                    return item?._id === response?.data?._id;
                });
                tempChains[objIndex] = response.data;
                setChains(tempChains);
            } else {
                const response = await axios.post("/hotels/chains/add", data, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setChains((prev) => {
                    return [response.data, ...prev];
                });
            }
            setHotelChainModal({ isOpen: false, isEdit: false });
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {hotelChainModal?.isEdit ? "Update Chian" : "Add Chain"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setHotelChainModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Hotel Group</label>
                            <select
                                name="hotelGroup"
                                id=""
                                value={data.hotelGroup || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select Hotel Group</option>
                                {hotelGroups?.map((item, index) => {
                                    return (
                                        <option value={item?._id} key={index}>
                                            {item?.groupName} -{" "}
                                            {item?.groupCode}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Chain Code *</label>
                            <input
                                type="text"
                                placeholder="Ex: BKD"
                                name="chainCode"
                                value={data.chainCode || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Chain Name *</label>
                            <input
                                type="text"
                                placeholder="Ex: Abc Network"
                                name="chainName"
                                value={data.chainName || ""}
                                onChange={handleChange}
                                required
                            />
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
                                onClick={() =>
                                    setHotelChainModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : hotelChainModal?.isEdit ? (
                                    "Update Chain"
                                ) : (
                                    "Add Chain"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
