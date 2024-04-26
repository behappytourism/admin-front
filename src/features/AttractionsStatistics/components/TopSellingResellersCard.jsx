import React from "react";
import { Link } from "react-router-dom";

export default function TopSellingResellersCard({ data, section }) {
    return (
        <div className="bg-white rounded shadow-sm h-max">
            <div className="p-4 border-b border-b-dashed">
                <h1 className="font-[600]">
                    Top Selling {section === "b2b" ? "Reseller" : "Customer"}
                </h1>
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
                                    <th className="font-[500] p-3">
                                        {" "}
                                        {section === "b2b"
                                            ? "Reseller"
                                            : "Customer"}
                                    </th>
                                    <th className="font-[500] p-3">Count</th>
                                    <th className="font-[500] p-3">Volume</th>
                                    <th className="font-[500] p-3">Cost</th>
                                    <th className="font-[500] p-3">Profit</th>
                                    {/* <th className="font-[500] p-3">
                                        Reseller Profit
                                    </th> */}
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
                                            {section === "b2b" ? (
                                                <td className="p-3">
                                                    <Link
                                                        to={`/b2b/${item?.reseller?._id}/details`}
                                                    >
                                                        <span>
                                                            {
                                                                item?.reseller
                                                                    ?.companyName
                                                            }
                                                        </span>
                                                        <span className="block">
                                                            {
                                                                item?.reseller
                                                                    ?.agentCode
                                                            }
                                                        </span>
                                                    </Link>
                                                </td>
                                            ) : (
                                                <td className="p-3">
                                                    <Link
                                                        to={`/users/${item?.user?._id}/details`}
                                                    >
                                                        <span>
                                                            {item?.user?.name}
                                                        </span>
                                                        <span className="block">
                                                            {item?.user?.email}
                                                        </span>
                                                    </Link>
                                                </td>
                                            )}

                                            <td className="p-3">
                                                {item?.count}
                                            </td>
                                            <td className="p-3">
                                                {item?.grandTotal?.toFixed(2)}{" "}
                                                AED
                                            </td>
                                            <td className="p-3">
                                                {(
                                                    item?.grandTotal -
                                                    item?.profit
                                                )?.toFixed(2)}{" "}
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
                                            {/* <td className="p-3 text-green-500">
                                                {item?.reseller?.role ===
                                                "reseller"
                                                    ? `${item?.resellerMarkup?.toFixed(
                                                          2
                                                      )} AED`
                                                    : `${item?.subAgentMarkup?.toFixed(
                                                          2
                                                      )} AED`}
                                            </td> */}
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
