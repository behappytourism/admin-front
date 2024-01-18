import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function HotelGroupModal({
    hotelGroupModalOpen,
    setHotelGroupModalOpen,
    selectedHotelGroup,
    setHotelGroups,
    hotelGroups,
}) {
    const [data, setData] = useState({
        groupCode:
            (hotelGroupModalOpen?.isEdit && selectedHotelGroup?.groupCode) ||
            "",
        groupName:
            (hotelGroupModalOpen?.isEdit && selectedHotelGroup?.groupName) ||
            "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setHotelGroupModalOpen({ isEdit: false, isOpen: false })
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

            if (hotelGroupModalOpen?.isEdit) {
                const response = await axios.patch(
                    `/hotels/groups/update/${selectedHotelGroup?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                const tempGroups = hotelGroups;
                const objIndex = tempGroups?.findIndex((item) => {
                    return item?._id === response?.data?._id;
                });
                tempGroups[objIndex] = response.data;
                setHotelGroups(tempGroups);
            } else {
                const response = await axios.post("/hotels/groups/add", data, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setHotelGroups((prev) => {
                    return [response.data, ...prev];
                });
            }
            setHotelGroupModalOpen({ isOpen: false, isEdit: false });
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
                        {hotelGroupModalOpen?.isEdit
                            ? "Update Group"
                            : "Add Group"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setHotelGroupModalOpen({
                                isOpen: false,
                                isEdit: false,
                            })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Group Code</label>
                            <input
                                type="text"
                                placeholder="Ex: BKD"
                                name="groupCode"
                                value={data.groupCode || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Group Name</label>
                            <input
                                type="text"
                                placeholder="Ex: Abc Group"
                                name="groupName"
                                value={data.groupName || ""}
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
                                    setHotelGroupModalOpen({
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
                                ) : hotelGroupModalOpen?.isEdit ? (
                                    "Update Group"
                                ) : (
                                    "Add Group"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
