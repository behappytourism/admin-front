import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

export default function ActivityPricingTable({ setPricing, pricing, seasons }) {
    const [data, setData] = useState("");
    const addNewRow = (e) => {
        e.preventDefault();
        setPricing((prev) => [
            ...prev,
            {
                fromDate: "",
                toDate: "",
                adultPrice: "",
                childPrice: "",
                infantPrice: "",
            },
        ]);
    };

    const deleteRow = (e, index) => {
        e.preventDefault();

        setPricing((prev) => {
            // Create a copy of the previous array without the element at the specified index
            const updatedPricing = prev.filter((_, i) => i !== index);

            return updatedPricing;
        });
    };

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

    return (
        <div className="overflow-x-auto">
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
                        <th className="font-[500] p-2 border">Season</th>
                        <th className="font-[500] p-2 border">From Date</th>
                        <th className="font-[500] p-2 border">To Date</th>
                        <th className="font-[500] p-2 border">Adult price</th>
                        <th className="font-[500] p-2 border">
                            Child Price
                        </th>{" "}
                        <th className="font-[500] p-2 border">Infant Price</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {pricing.map((price, index) => (
                        <tr
                            key={index}
                            className="border-b border-tableBorderColor"
                        >
                            <td className="p-2 border w-[35px] min-w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-red-500"
                                        onClick={(e) => {
                                            deleteRow(e, index);
                                        }}
                                    >
                                        -
                                    </button>
                                </div>
                            </td>
                            <td className="p-2 border w-[35px] min-w-[35px]">
                                <select
                                    name="country"
                                    value={data || ""}
                                    onChange={(e) =>
                                        handleSeasonChange(e, index)
                                    }
                                    id=""
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

                            <td className="border w-[140px] min-w-[140px]">
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={formatDate(price?.fromDate) || ""}
                                    onChange={(e) => handleChange(e, index)}
                                    className="h-[100%] px-2 border-0"
                                />
                            </td>
                            <td className="border w-[140px] min-w-[140px]">
                                <input
                                    type="date"
                                    name="toDate"
                                    value={formatDate(price?.toDate) || ""}
                                    onChange={(e) => handleChange(e, index)}
                                    className="h-[100%]  px-2  border-0"
                                />
                            </td>
                            <td className="border w-[100px] min-w-[100px]">
                                <input
                                    type="number"
                                    name="adultPrice"
                                    value={price?.adultPrice}
                                    onChange={(e) => handleChange(e, index)}
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                />
                            </td>
                            <td className="border w-[100px] min-w-[100px]">
                                <input
                                    type="number"
                                    name="childPrice"
                                    value={price?.childPrice}
                                    onChange={(e) => handleChange(e, index)}
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                />
                            </td>
                            <td className="border w-[100px] min-w-[100px]">
                                <input
                                    type="number"
                                    name="childPrice"
                                    value={price?.infantPrice}
                                    onChange={(e) => handleChange(e, index)}
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
