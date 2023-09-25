import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import QuotationVehiclePricingRow from "./QuotationVehiclePricingRow";

export default function QuotationVehiclePricingTable({
    setPricing,
    pricing,
    vehicles,
}) {
    const addNewRow = (e) => {
        e.preventDefault();
        setPricing((prev) => [
            ...prev,
            {
                fromDate: "",
                toDate: "",
                vehicles: [],
            },
        ]);
    };

  

    return (
        <div className="mt-4">
            <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                    <tr>
                        <th className="p-2 border w-[35px]">
                            <div className="flex items-center justify-center">
                                <button
                                    className="w-[25px] h-[25px] rounded-full bg-green-500"
                                    onClick={addNewRow}
                                    type="button"
                                >
                                    +
                                </button>
                            </div>
                        </th>
                        <th className="font-[500] p-2 border">From Date</th>
                        <th className="font-[500] p-2 border">To Date</th>
                        <th className="font-[500] p-2 border">
                            Vehicle Details
                        </th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {pricing?.map((price, index) => {
                        return (
                            <QuotationVehiclePricingRow
                                key={index}
                                price={price}
                                setPricing={setPricing}
                                vehicles={vehicles}
                                pricing={pricing}
                                index={index}
                                addNewRow={addNewRow}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
