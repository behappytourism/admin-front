import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { config } from "../../constants";
import AddReviewModal from "../../features/Home/components/AddReviewModal";

export default function reviewsettingsB2cPage() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewModal, setReviewModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedReview, setSelectedReview] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchreviews = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get("/frontend/b2c/home/reviews", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            console.log(response.data);
            setReviews(response.data?.reviews);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setReviews([]);
            console.log(err);
        }
    };

    const addReview = async (newReview) => {
        setReviews((prev) => {
            return [...prev, newReview];
        });
    };

    const updateReview = async (updatedReview) => {
        const objIndex = reviews.findIndex((item) => {
            return item?._id === updatedReview?._id;
        });
        const tempreviews = reviews;
        tempreviews[objIndex] = updatedReview;
        setReviews(tempreviews);
    };

    const deleteReview = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/frontend/b2c/home/reviews/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filteredreviews = reviews.filter((item) => {
                    return item?._id !== id;
                });
                setReviews(filteredreviews);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchreviews();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Review Setting
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Home </span>
                    <span>{">"} </span>
                    <span>Settings </span>
                    <span>{">"} </span>
                    <span>Review</span>
                </div>
            </div>

            {reviewModal?.isOpen && (
                <AddReviewModal
                    reviewModal={reviewModal}
                    setReviewModal={setReviewModal}
                    addReview={addReview}
                    updateReview={updateReview}
                    selectedReview={selectedReview}
                />
            )}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All reviews</h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setReviewModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Review
                            </button>
                        </div>
                        {reviews?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No reviews Found
                                </span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">
                                            Description
                                        </th>
                                        <th className="font-[500] p-3">
                                            Place
                                        </th>
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {reviews?.map((Review, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">
                                                    <div className="flex items-center gap-[10px]">
                                                        <img
                                                            src={
                                                                config.SERVER_URL +
                                                                Review?.image
                                                            }
                                                            alt=""
                                                            className="w-[80px] rounded max-h-[60px]"
                                                        />
                                                        <span className="font-medium text-[15px]">
                                                            {Review?.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 max-w-[300px]">
                                                    {Review?.description}
                                                </td>
                                                <td className="p-3">
                                                    {Review?.place}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteReview(
                                                                    Review?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedReview(
                                                                    Review
                                                                );
                                                                setReviewModal({
                                                                    isOpen: true,
                                                                    isEdit: true,
                                                                });
                                                            }}
                                                        >
                                                            <BiEditAlt />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
