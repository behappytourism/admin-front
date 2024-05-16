import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "../../../axios";
import { SelectDropdown } from "../../../components";

import { useHandleClickOutside } from "../../../hooks";

export default function AddPrivateTransferModal({
    addPvtTranferModal,
    setAddPvtTransferModal,
    selectedTransfer,
    addNewPvtTransfer,
    updatePvtTransfer,
}) {
    const [data, setData] = useState({
        vehicleTypeId: addPvtTranferModal?.isEdit
            ? selectedTransfer.vehicleTypeId
            : "",
        price: addPvtTranferModal?.isEdit ? selectedTransfer?.price : "",
        cost: addPvtTranferModal?.isEdit ? selectedTransfer?.cost : "",
        name: addPvtTranferModal?.isEdit ? selectedTransfer.name : "",
        maxCapacity: addPvtTranferModal?.isEdit
            ? selectedTransfer.maxCapacity
            : "",
    });
    const { jwtToken } = useSelector((state) => state.admin);
    const [vehicles, setVehicles] = useState([]);
    const wrapperRef = useRef();

    useHandleClickOutside(wrapperRef, () =>
        setAddPvtTransferModal({ isOpen: false, isEdit: false })
    );

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = () => {
        if (addPvtTranferModal?.isEdit) {
            updatePvtTransfer(data, addPvtTranferModal?.editIndex);
        } else {
            addNewPvtTransfer(data);
        }
        setAddPvtTransferModal({ isOpen: false, isEdit: false });
    };

    const fetchVehicleType = async () => {
        try {
            const response = await axios.get(
                `/transfers/vehicles/vehicle-type/list`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setVehicles(response?.data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchVehicleType();
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {addPvtTranferModal?.isEdit
                            ? "Edit PVT Transfer"
                            : "Add PVT Transfer"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setAddPvtTransferModal({
                                isOpen: false,
                                isEdit: false,
                            })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <div className="mt-4">
                        <label htmlFor="vehcileTypeId">Vehcile</label>
                        <SelectDropdown
                            data={vehicles}
                            valueName={"_id"}
                            displayName={"name"}
                            placeholder="Select Vehicle"
                            selectedData={data.vehicleTypeId || ""}
                            setSelectedData={(val) => {
                                setData((prev) => {
                                    return {
                                        ...prev,
                                        ["vehicleTypeId"]: val,
                                    };
                                });

                                const findVeh = vehicles.find(
                                    (v) => v._id == val
                                );

                                setData((prev) => {
                                    return {
                                        ...prev,
                                        ["name"]: findVeh.name,
                                    };
                                });
                                setData((prev) => {
                                    return {
                                        ...prev,
                                        ["maxCapacity"]:
                                            findVeh.normalOccupancy,
                                    };
                                });
                            }}
                            // disabled={!isEditPermission}
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Price</label>
                        <input
                            type="number"
                            value={data.price || ""}
                            onChange={handleChange}
                            name="price"
                            placeholder="Enter price"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Cost</label>
                        <input
                            type="number"
                            value={data.cost || ""}
                            onChange={handleChange}
                            name="cost"
                            placeholder="Enter cost"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-end mt-6">
                        <button
                            className="px-3"
                            disabled={
                                !data.name ||
                                !data.maxCapacity ||
                                !data.price ||
                                !data.cost
                            }
                            onClick={handleSubmit}
                        >
                            {addPvtTranferModal?.isEdit
                                ? "Edit PVT Transfer"
                                : "Add PVT Transfer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
