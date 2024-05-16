import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import ActivityVehiclePricingRow from "./ActivityVehiclePricingTable";
import QuotationVehiclePricingRow from "./QuotationVehiclePricingRow";

export default function ActivityPrivatePricingTable({
    setPricing,
    pricing,
    vehicles,
    seasons,
}) {
    const addNewRow = (e) => {
        e.preventDefault();
        setPricing((prev) => [
            ...prev,
            {
                fromDate: "",
                toDate: "",
                vehicleType: [],
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
                        <th className="font-[500] p-2 border">Season</th>
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
                            <ActivityVehiclePricingRow
                                key={index}
                                price={price}
                                setPricing={setPricing}
                                vehicles={vehicles}
                                pricing={pricing}
                                index={index}
                                addNewRow={addNewRow}
                                seasons={seasons}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
