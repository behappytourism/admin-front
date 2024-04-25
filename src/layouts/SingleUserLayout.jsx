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
import { AddMoneyModal, RemoveMoenyModal } from "../features/Resellers";
import AddCreditModal from "../features/Resellers/components/AddCreditModal";

export default function SingleUserLayout() {
    const [user, setUser] = useState({});
    const [data, setData] = useState({});
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    const { id } = useParams();
    const location = useLocation();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchUser = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/users/single/${id}/details`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const { user, totalClicks, totalPoints, totalTransation } =
                response.data;

            setUser(response.data.user);

            setData({ totalClicks, totalPoints, totalTransation });

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    // const handleStatusChange = async (status) => {
    //     try {
    //         setIsStatusLoading(true);
    //         await axios.patch(
    //             `/resellers/update/${reseller?._id}/status`,
    //             { status },
    //             {
    //                 headers: { authorization: `Bearer ${jwtToken}` },
    //             }
    //         );

    //         setReseller((prev) => {
    //             return { ...prev, status };
    //         });
    //         setIsStatusLoading(false);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    useEffect(() => {
        fetchUser();
    }, [id]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    User Details
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/users" className="text-textColor">
                        users{" "}
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
                                    {user?.name}
                                </span>
                                <span className="block text-sm text-grayColor">
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-5"></div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white shadow-sm rounded p-4 flex items-start justify-between">
                            <div>
                                <span className="block text-lg font-[600]">
                                    {data.totalClicks || 0} AED
                                </span>
                                <span className="block text-sm text-grayColor font-medium mt-[2px]">
                                    Total Clicks
                                </span>
                            </div>
                            <span className="text-3xl">
                                <MdAccountBalanceWallet />
                            </span>
                        </div>
                        <div className="bg-white shadow-sm rounded p-4 flex items-start justify-between">
                            <div>
                                <span className="block text-lg font-[600]">
                                    {data.totalPoints || 0}
                                </span>
                                <span className="block text-sm text-grayColor font-medium mt-[2px]">
                                    Balance Points{" "}
                                </span>
                            </div>
                            <span className="text-3xl">
                                <GiTakeMyMoney />
                            </span>
                        </div>
                        <div className="bg-white shadow-sm rounded p-4 flex items-start justify-between">
                            <div>
                                <span className="block text-lg font-[600]">
                                    {data.totalTransation || 0}
                                </span>
                                <span className="block text-sm text-grayColor font-medium mt-[2px]">
                                    Total Transation
                                </span>
                            </div>
                            <span className="text-3xl">
                                <GrMoney />
                            </span>
                        </div>
                        {/* <div className="bg-white shadow-sm rounded p-4 flex items-start justify-between">
                            <div>
                                <span className="block text-lg font-[600]">
                                    {data?.creditAmount || 0} AED
                                </span>

                                <span className="block text-lg font-[600]"></span>
                                <span className="block text-sm text-grayColor font-medium mt-[2px]">
                                    Wallet Credit Used({data?.creditUsed || 0}{" "}
                                    AED )
                                </span>
                            </div>
                            <span className="text-3xl">
                                <GrCurrency />
                            </span>
                        </div> */}
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
                            <Link to="./transactions">
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
                                        "orders"
                                            ? "border-b border-b-orange-500"
                                            : "")
                                    }
                                >
                                    Orders
                                </button>
                            </Link>
                        </div>

                        <Outlet context={{ user }} />
                    </div>
                </div>
            )}
        </div>
    );
}
