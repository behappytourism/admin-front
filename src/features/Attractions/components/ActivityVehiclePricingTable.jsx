import React, { useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";

export default function ActivityVehiclePricingRow({
    price,
    setPricing,
    index,
    vehicles,
    pricing,
    seasons,
}) {
    const [data, setData] = useState("");
    const handleChange = (e, index) => {
        setPricing((prev) => {
            const updatedPricing = [...prev]; // Create a copy of the previous state array
            updatedPricing[index] = {
                ...updatedPricing[index], // Create a copy of the object at the specified index
                [e.target.name]: e.target.value, // Update the specific property with the new value
            };
            return updatedPricing; // Return the updated array as the new state
        });
    };

    const handleRowChange = (e, ind) => {
        setPricing((prev) => {
            const updatedPricing = [...prev];
            console.log(ind, updatedPricing[index].vehicleType);
            // Create a copy of the previous state array
            const vehicleTypeIndex = updatedPricing[
                index
            ].vehicleType.findIndex((item, i) => i === ind);
            console.log(vehicleTypeIndex, "indexxx");
            updatedPricing[index] = {
                ...updatedPricing[index], // Create a copy of the object at the specified index

                vehicleType: [
                    ...updatedPricing[index].vehicleType.slice(
                        0,
                        vehicleTypeIndex
                    ),
                    {
                        ...updatedPricing[index].vehicleType[vehicleTypeIndex],
                        [e.target.name]: e.target.value,
                    },
                    ...updatedPricing[index].vehicleType.slice(
                        vehicleTypeIndex + 1
                    ),
                ],
                // Filter out the item with the provided index from the vehicleType array
            };
            console.log(updatedPricing, "updatedPricing");
            return updatedPricing; // Return the updated array as the new state
        });
    };

    const deleteRow = (ind) => {
        setPricing((prev) => {
            // Create a copy of the previous array without the element at the specified index
            const updatedPricing = prev.filter((_, i) => i !== ind);

            return updatedPricing;
        });
    };

    const addNewRow = (e) => {
        try {
            e.preventDefault();
            console.log("callllll");
            setPricing((prev) => {
                const updatedPricing = [...prev]; // Create a copy of the previous state array
                updatedPricing[index] = {
                    ...updatedPricing[index], // Create a copy of the object at the specified index
                    vehicleType: [
                        ...updatedPricing[index].vehicleType, // Copy the existing vehicleType array
                        { vehicleTypeId: "", price: "" }, // Add the new object to the vehicleType array
                    ],
                };
                return updatedPricing; // Return the updated array as the new state
            });
        } catch (e) {
            console.log(e);
        }
    };

    const deleteNewRow = (e, ind) => {
        e.preventDefault();
        setPricing((prev) => {
            const updatedPricing = [...prev]; // Create a copy of the previous state array
            updatedPricing[index] = {
                ...updatedPricing[index], // Create a copy of the object at the specified index
                vehicleType: updatedPricing[index].vehicleType.filter(
                    (item, i) => i !== ind
                ),
                // Filter out the item with the provided index from the vehicleType array
            };
            return updatedPricing; // Return the updated array as the new state
        });
    };

    function formatDate(dateString) {
        console.log(dateString, "date string");
        const date = new Date(dateString);

        console.log(date, "date");
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        console.log(formattedDate, "formatted date");
        return formattedDate;
    }
    const handleSeasonChange = (e, index) => {
        const selectedSeason = seasons.find(
            (season) => season._id.toString() === e.target.value.toString()
        );

        if (selectedSeason) {
            setPricing((prev) => {
                const updatedPricing = [...prev]; // Create a copy of the previous state array
                updatedPricing[index] = {
                    ...updatedPricing[index], // Create a copy of the object at the specified index
                    fromDate: formatDate(selectedSeason.fromDate),
                    toDate: formatDate(selectedSeason.toDate),
                };
                return updatedPricing; // Return the updated array as the new state
            });
        }

        setData(selectedSeason._id);
    };
    console.log(pricing, "pp");

    return (
        <React.Fragment>
            <tr className="border-b border-tableBorderColor">
                <td className="p-2 border w-[35px] min-w-[35px]">
                    <div className="flex prices-center justify-center">
                        <button
                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                            onClick={() => deleteRow(index)}
                            type="button"
                        >
                            -
                        </button>
                    </div>
                </td>
                <td className="p-2 border w-[35px] min-w-[35px]">
                    <select
                        // name="country"
                        value={data || ""}
                        onChange={(e) => handleSeasonChange(e, index)}
                        id=""
                        // required
                        className="capitalize"
                    >
                        <option value="" hidden>
                            Select Season
                        </option>
                        {seasons?.map((season, index) => {
                            return (
                                <option
                                    value={season?._id}
                                    key={index}
                                    className="capitalize"
                                >
                                    {season?.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
                <td className="border w-[75px] min-w-[75px]">
                    <input
                        type="date"
                        name="fromDate"
                        value={formatDate(price?.fromDate) || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="h-[100%] px-2 border-0"
                    />
                </td>
                <td className="border w-[75px] min-w-[75px]">
                    <input
                        type="date"
                        name="toDate"
                        value={formatDate(price?.toDate) || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="h-[100%]  px-2  border-0"
                    />
                </td>
                <td className="border w-[70px] min-w-[70px]"></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td> <td></td>
                <td colSpan={4}>
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                            <tr>
                                <th className="p-2 border w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-green-500"
                                            onClick={(e) => addNewRow(e)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </th>
                                <th className="font-[500] p-2 border">
                                    Vehicle
                                </th>
                                <th className="font-[500] p-2 border">Price</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {price?.vehicleType?.map((vehicleTyp, ind) => (
                                <tr
                                    key={index}
                                    className="border-b border-tableBorderColor"
                                >
                                    <td className="p-2 border w-[35px] min-w-[35px]">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                onClick={(e) => {
                                                    deleteNewRow(e, ind);
                                                }}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-2 border w-[35px] min-w-[35px]">
                                        <select
                                            name="vehicleTypeId"
                                            value={
                                                vehicleTyp.vehicleTypeId || ""
                                            }
                                            onChange={(e) =>
                                                handleRowChange(e, ind)
                                            }
                                            id=""
                                            required
                                            className="capitalize"
                                        >
                                            <option value="" hidden>
                                                Select Vehicle
                                            </option>
                                            {vehicles?.map((vehicle, index) => {
                                                return (
                                                    <option
                                                        value={vehicle?._id}
                                                        key={index}
                                                        className="capitalize"
                                                    >
                                                        {vehicle?.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </td>

                                    <td className="border w-[100px] min-w-[100px]">
                                        <input
                                            type="number"
                                            name="price"
                                            value={vehicleTyp.price}
                                            onChange={(e) =>
                                                handleRowChange(e, ind)
                                            }
                                            className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr className="last:hidden">
                <td colSpan={8} className="p-2 border-b-4"></td>
            </tr>
        </React.Fragment>
    );
}
