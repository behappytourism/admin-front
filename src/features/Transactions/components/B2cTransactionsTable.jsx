import React from "react";

import { Pagination } from "../../../components";
import { formatDate } from "../../../utils";

export default function B2cTransactionsTable({
    transactions,
    filters,
    setFilters,
}) {
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Txn No</th>
                            <th className="font-[500] p-3">User</th>
                            <th className="font-[500] p-3">Amount</th>
                            <th className="font-[500] p-3">Transaction Type</th>
                            <th className="font-[500] p-3">
                                Payment Processor
                            </th>
                            <th className="font-[500] p-3">Date</th>
                            <th className="font-[500] p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {transactions?.map((transaction, index) => {
                            return (
                                <tr
                                    key={index}
                                    className="border-b border-tableBorderColor"
                                >
                                    <td className="p-3">
                                        #
                                        {transaction?.b2cTransactionNo ||
                                            "00000"}
                                    </td>
                                    <td className="p-3">
                                        <span className="capitalize">
                                            {transaction?.user?.name}
                                        </span>
                                        <span className="block text-grayColor mt-[2px]">
                                            {transaction?.user?.email}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {transaction?.amount} AED
                                    </td>
                                    <td className="p-3 capitalize">
                                        {transaction?.transactionType}
                                    </td>
                                    <td className="p-3 capitalize">
                                        {transaction?.paymentProcessor}
                                        {transaction?.paymentProcessor ===
                                            "bank" && (
                                            <span className="block">
                                                {transaction?.referenceNo}
                                            </span>
                                        )}
                                        {(transaction?.paymentProcessor ===
                                            "bank" ||
                                            transaction?.paymentProcessor ===
                                                "cash-in-hand") && (
                                            <span className="block">
                                                Deposited By -{" "}
                                                {transaction?.depositor?.name}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {formatDate(transaction.createdAt)}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={
                                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                (transaction?.status ===
                                                "failed"
                                                    ? "bg-[#f065481A] text-[#f06548]"
                                                    : transaction?.status ===
                                                      "success"
                                                    ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                    : "bg-[#f7b84b1A] text-[#f7b84b]")
                                            }
                                        >
                                            {transaction?.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalTransactions}
                    incOrDecSkip={(number) =>
                        setFilters((prev) => {
                            return {
                                ...prev,
                                skip: prev.skip + number,
                            };
                        })
                    }
                    updateSkip={(skip) =>
                        setFilters((prev) => {
                            return { ...prev, skip };
                        })
                    }
                />
            </div>
        </div>
    );
}
