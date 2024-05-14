import React, { useEffect, useState } from "react";
import { FiCheck, FiEdit, FiSettings } from "react-icons/fi";
import { GiTakeMyMoney } from "react-icons/gi";
import { GrCurrency, GrMoney } from "react-icons/gr";
import { MdAccountBalanceWallet, MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

import { avatarImg } from "../assets/images";
import axios from "../axios";
import { PageLoader } from "../components";
import {
    AddMoneyModal,
    AddWalletUsedCreditModal,
    RemoveMoenyModal,
} from "../features/Resellers";
import AddCreditModal from "../features/Resellers/components/AddCreditModal";

export default function SingleVendorLayout() {
    const [reseller, setReseller] = useState({});
    const [data, setData] = useState({});
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
    const [isAddCreditModalOpen, setIsAddCreditModalOpen] = useState(false);
    const [isRemoveMoneyModalOpen, setIsRemoveMoneyModalOpen] = useState(false);
    const [totalSubAgents, setTotalSubAgents] = useState(0);
    const [usedCreditModalOpen, setUsedCreditModalOpen] = useState(false);

    const { id } = useParams();
    const location = useLocation();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchReseller = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/vendor/single/${id}/details`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const {
                vendor,
                balance,
                creditUsed,
                creditAmount,
                totalEarnings,
                pendingEarnings,
            } = response.data;
            setReseller(vendor);
            setData((prev) => {
                return {
                    ...prev,
                    totalEarnings,
                    balance,
                    pendingEarnings,
                    creditUsed,
                    creditAmount,
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleStatusChange = async (status) => {
        try {
            setIsStatusLoading(true);
            await axios.patch(
                `/resellers/update/${reseller?._id}/status`,
                { status },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setReseller((prev) => {
                return { ...prev, status };
            });
            setIsStatusLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchReseller();
    }, [id]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Vendor Details
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vendor" className="text-textColor">
                        vendor{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span className="capitalize">
                        {location.pathname.split("/")[3]}{" "}
                    </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[15px]">
                            <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
                                <img
                                    src={avatarImg}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <span className="block font-[600] text-lg">
                                    {reseller?.b2bUserId?.companyName} -{" "}
                                    {reseller?.vendorCode}
                                </span>
                                <span className="block text-sm text-grayColor">
                                    {reseller?.b2bUserId?.website}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            {(reseller?.status === "ok" ||
                                reseller?.status === "disabled") && (
                                <>
                                    <select
                                        className="px-4"
                                        value=""
                                        onChange={(e) => {
                                            if (e.target.value === "add") {
                                                setIsAddMoneyModalOpen(true);
                                            } else if (
                                                e.target.value === "remove"
                                            ) {
                                                setIsRemoveMoneyModalOpen(true);
                                            } else if (
                                                e.target.value === "credit"
                                            ) {
                                                setIsAddCreditModalOpen(true);
                                            } else if (
                                                e.target.value === "used-credit"
                                            ) {
                                                setUsedCreditModalOpen(true);
                                            }
                                        }}
                                    >
                                        <option value="" hidden>
                                            Select Option
                                        </option>
                                        <option value="add">Add Money</option>
                                        <option value="remove">
                                            Remove Money
                                        </option>
                                        <option value="credit">
                                            Update Credit
                                        </option>
                                        <option value="used-credit">
                                            Add Used Credit
                                        </option>
                                    </select>
                                    {isAddCreditModalOpen && (
                                        <AddCreditModal
                                            setIsAddCreditModalOpen={
                                                setIsAddCreditModalOpen
                                            }
                                            data={data}
                                            setData={setData}
                                        />
                                    )}
                                    {isAddMoneyModalOpen && (
                                        <AddMoneyModal
                                            setIsAddMoneyModalOpen={
                                                setIsAddMoneyModalOpen
                                            }
                                            setData={setData}
                                        />
                                    )}
                                    {isRemoveMoneyModalOpen && (
                                        <RemoveMoenyModal
                                            setIsRemoveMoneyModalOpen={
                                                setIsRemoveMoneyModalOpen
                                            }
                                            setData={setData}
                                            data={data}
                                        />
                                    )}
                                    {usedCreditModalOpen && (
                                        <AddWalletUsedCreditModal
                                            setUsedCreditModalOpen={
                                                setUsedCreditModalOpen
                                            }
                                            setData={setData}
                                        />
                                    )}
                                </>
                            )}
                            <div>
                                {isStatusLoading ? (
                                    <div>
                                        <div className="w-[25px] h-[25px] rounded-full border-4 border-primaryColor border-r-transparent animate-spin"></div>
                                    </div>
                                ) : reseller?.status === "pending" ? (
                                    <div className="flex items-center gap-[10px]">
                                        <button
                                            className="h-[35px] w-[35px] bg-green-500 flex items-center justify-center text-xl"
                                            onClick={() =>
                                                handleStatusChange("ok")
                                            }
                                        >
                                            <FiCheck />
                                        </button>
                                        <button
                                            className="h-[35px] w-[35px] bg-red-500 flex items-center justify-center text-xl"
                                            onClick={() =>
                                                handleStatusChange("cancelled")
                                            }
                                        >
                                            <MdClose />
                                        </button>
                                    </div>
                                ) : reseller?.status === "cancelled" ? (
                                    <div>
                                        <span className="py-1 px-2 text-[12px] font-medium rounded text-[#f06548] bg-[#f065481a]">
                                            Cancelled
                                        </span>
                                    </div>
                                ) : (
                                    <div className="max-w-[120px]">
                                        <select
                                            name=""
                                            id=""
                                            value={reseller?.status || ""}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    e.target.value
                                                )
                                            }
                                            className="min-w-[100px]"
                                        >
                                            <option value="ok">Enable</option>
                                            <option value="disabled">
                                                Disable
                                            </option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Link to={`/vendor/${id}/edit`}>
                                    <button className="h-[35px] w-[35px] flex items-center justify-center text-lg">
                                        <FiEdit />
                                    </button>
                                </Link>
                                <Link to={`/vendor/${id}/edit/configurations`}>
                                    <button className="h-[35px] w-[35px] flex items-center justify-center text-lg">
                                        <FiSettings />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white shadow-sm rounded p-4 flex items-start justify-between">
                            <div>
                                <span className="block text-lg font-[600]">
                                    {(data.balance - data?.creditUsed)?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED
                                </span>
                                <span className="block text-sm text-grayColor font-medium mt-[2px]">
                                    Available Balance
                                </span>
                            </div>
                            <span className="text-3xl">
                                <MdAccountBalanceWallet />
                            </span>
                        </div>
                        <div className="bg-white shadow-sm rounded p-4 flex items-start justify-between">
                            <div>
                                <span className="block text-lg font-[600]">
                                    {data.totalEarnings?.toFixed(2) || 0} AED
                                </span>
                                <span className="block text-sm text-grayColor font-medium mt-[2px]">
                                    Total Earnings
                                </span>
                            </div>
                            <span className="text-3xl">
                                <GiTakeMyMoney />
                            </span>
                        </div>
                        <div className="bg-white shadow-sm rounded p-4 flex items-start justify-between">
                            <div>
                                <span className="block text-lg font-[600]">
                                    {data.pendingEarnings?.toFixed(2) || 0} AED
                                </span>
                                <span className="block text-sm text-grayColor font-medium mt-[2px]">
                                    Pending Earnings
                                </span>
                            </div>
                            <span className="text-3xl">
                                <GrMoney />
                            </span>
                        </div>
                        <div className="bg-white shadow-sm rounded p-4 flex items-start justify-between">
                            <div>
                                <span className="block text-lg font-[600]">
                                    {data?.creditAmount?.toFixed(2) || 0} AED
                                </span>

                                <span className="block text-lg font-[600]"></span>
                                <span className="block text-sm text-grayColor font-medium mt-[2px]">
                                    Wallet Credit Used (
                                    {data?.creditUsed?.toFixed(2) || 0} AED)
                                </span>
                            </div>
                            <span className="text-3xl">
                                <GrCurrency />
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow-sm mt-6">
                        <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                            <Link to="./details">
                                <button
                                    className={
                                        "px-2 py-4 h-auto bg-transparent text-textColor font-medium rounded-none " +
                                        (location.pathname.split("/")[3] ===
                                        "details"
                                            ? "border-b border-b-orange-500"
                                            : "")
                                    }
                                >
                                    Details
                                </button>
                            </Link>
                            {/* <Link to="./transactions">
                                <button
                                    className={
                                        "px-2 py-4 h-auto bg-transparent text-textColor font-medium rounded-none " +
                                        (location.pathname.split("/")[3] ===
                                        "transactions"
                                            ? "border-b border-b-orange-500"
                                            : "")
                                    }
                                >
                                    Transactions
                                </button>
                            </Link>
                            <Link to="./orders">
                                <button
                                    className={
                                        "px-2 py-4 h-auto bg-transparent text-textColor font-medium rounded-none " +
                                        (location.pathname.split("/")[3] ===
                                        "attractions-ticket-orders"
                                            ? "border-b border-b-orange-500"
                                            : "")
                                    }
                                >
                                    Orders
                                </button>
                            </Link> */}
                        </div>

                        <Outlet context={{ reseller, setTotalSubAgents }} />
                    </div>
                </div>
            )}
        </div>
    );
}
