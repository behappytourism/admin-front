import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { updateAttractionActivity } from "../../../redux/slices/attractionFormSlice";
import BalanceModal from "./BalanceModal";
import SingleActivityRow from "./SingleActivityRow";

export default function AttrActivitiesTable({ section }) {
    const { activities, data } = useSelector((state) => state.attractionForm);
    const [balanceDetail, setBalanceDetail] = useState();
    const { jwtToken } = useSelector((state) => state.admin);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnetLoading, setIsConnetLoading] = useState(false);
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();

    const onHandleConnect = async () => {
        try {
            setIsConnetLoading(true);

            let response = await axios.post(
                `/attractions/connect/api/${id}`,
                {
                    attraction: data.attraction,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(response.data.activities, "response.data.activities");

            dispatch(
                updateAttractionActivity({
                    activities: activities,
                    newActivities: response.data.activities,
                })
            );

            setIsConnetLoading(false);
        } catch (err) {}
    };

    const onHandleBalance = async () => {
        try {
            setIsLoading(true);

            let response = await axios.get(
                `/attractions/balance/${id}`,

                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(
                response.data.balanceDetails,
                "response.data.balanceDetails"
            );

            setBalanceDetail(response.data.balanceDetails);
            setIsBalanceModalOpen(true);
            setIsLoading(false);
        } catch (err) {}
    };
    return (
        <>
            <div className={section === 2 ? "block" : "hidden"}>
                <div className="flex items-center justify-between border-b border-dashed p-4">
                    <h1 className="font-medium">All Activities</h1>
                    <div className="flex gap-4">
                        {data.isApiConnected === true ? (
                            <div>
                                <button
                                    className="px-3 bg-orange-500"
                                    onClick={onHandleConnect}
                                >
                                    {isConnetLoading ? (
                                        <BtnLoader />
                                    ) : (
                                        "Connect"
                                    )}{" "}
                                </button>
                            </div>
                        ) : (
                            <Link to="activities/add">
                                <button className="px-3 bg-orange-500">
                                    + Add Activity
                                </button>
                            </Link>
                        )}
                        {data.isApiConnected === true ? (
                            <div>
                                <button
                                    className="px-3 bg-orange-500"
                                    onClick={onHandleBalance}
                                >
                                    {isLoading ? <BtnLoader /> : "Balance"}
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>

                {activities?.length < 1 ? (
                    <span className="text-sm text-grayColor font-medium block text-center mt-5">
                        No activities found!!!
                    </span>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">Name</th>
                                <th className="font-[500] p-3">Type</th>
                                <th className="font-[500] p-3">Adult Cost</th>
                                <th className="font-[500] p-3">Child Cost</th>
                                <th className="font-[500] p-3">Infant Cost</th>
                                <th className="font-[500] p-3">Hourly Cost</th>
                                {/* <th className="font-[500] p-3">Vat</th>
                                <th className="font-[500] p-3">
                                    Shared Transfer
                                </th>
                                <th className="font-[500] p-3">
                                    Private Transfer
                                </th> */}
                                {data?.bookingType === "ticket" && (
                                    <th className="font-[500] p-3">Tickets</th>
                                )}
                                {/* <th className="font-[500] p-3">Promo Code</th> */}
                                <th className="font-[500] p-3">B2c Markup</th>
                                <th className="font-[500] p-3">B2c </th>
                                <th className="font-[500] p-3">B2b </th>

                                <th className="font-[500] p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {activities?.map((activity, index) => {
                                return (
                                    <SingleActivityRow
                                        activity={activity}
                                        key={index}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {isBalanceModalOpen ? (
                <BalanceModal
                    balanceDetail={balanceDetail}
                    setIsBalanceModalOpen={setIsBalanceModalOpen}
                />
            ) : null}
        </>
    );
}
