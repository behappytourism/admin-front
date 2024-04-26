import React from "react";
import { Link } from "react-router-dom";
import { config } from "../../../constants";

export default function TopSellingActivitiesCard({ data }) {
    return (
        <div className="bg-white rounded shadow-sm h-max">
            <div className="p-4 border-b border-b-dashed">
                <h1 className="font-[600]">Top Selling Activities</h1>
            </div>
            <div>
                {data?.length < 1 ? (
                    <div className="p-6 flex flex-col items-center">
                        <span className="text-sm text-grayColor block mt-[6px]">
                            Oops.. No Items Found
                        </span>
                    </div>
                ) : (
                    <div>
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">#</th>
                                    <th className="font-[500] p-3">Activity</th>
                                    <th className="font-[500] p-3">Count</th>
                                    <th className="font-[500] p-3">Volume</th>
                                    <th className="font-[500] p-3">Cost</th>
                                    <th className="font-[500] p-3">Profit</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {data?.map((item, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="border-b border-tableBorderColor"
                                        >
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3">
                                                {/* <Link
                                                    to={`/attractions/${item?.attraction?._id}/edit?section=2`}
                                                > */}
                                                <div className="flex items-center gap-[10px]">
                                                    <img
                                                        src={
                                                            config.SERVER_URL +
                                                            item?.attraction
                                                                ?.images[0]
                                                        }
                                                        alt=""
                                                        className="w-[40px] h-[30px] object-cover rounded"
                                                    />
                                                    <span>
                                                        {item?.activity?.name}
                                                    </span>
                                                </div>
                                                {/* </Link> */}
                                            </td>
                                            <td className="p-3">
                                                {item?.count}
                                            </td>
                                            <td className="p-3">
                                                {item?.grandTotal?.toFixed(2)}{" "}
                                                AED
                                            </td>
                                            <td className="p-3">
                                                {item?.totalCost?.toFixed(2)}{" "}
                                                AED
                                            </td>
                                            <td
                                                className={
                                                    "p-3 " +
                                                    (item?.profit >= 0
                                                        ? "text-green-500"
                                                        : "text-red-500")
                                                }
                                            >
                                                {item?.profit?.toFixed(2)} AED
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
