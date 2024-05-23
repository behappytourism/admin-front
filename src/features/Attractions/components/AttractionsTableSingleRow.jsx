import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { GrStatusGood } from "react-icons/gr";
import axios from "../../../axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { RiCloseCircleFill } from "react-icons/ri";
export default function AttractionsTableSingleRow({
    setAttractions,
    attractions,
    code,
    title,
    bookingType,
    isOffer,
    offerAmount,
    offerAmountType,
    destination,
    markup,
    averageRating,
    totalReviews,
    _id,
    isB2cActive,
    isB2bActive,
}) {
    const [isB2cActiveStatus, setIsB2cActiveStatus] = useState(isB2cActive);
    const [isB2bActiveStatus, setIsB2bActiveStatus] = useState(isB2bActive);

    const { jwtToken } = useSelector((state) => state.admin);

    const deleteAttraction = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/attractions/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filteredAttractions = attractions.filter((attr) => {
                    return attr?._id !== id;
                });
                setAttractions(filteredAttractions);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeActiveStatus = async () => {
        try {
            const response = await axios.patch(
                `/attractions/update/${_id}/is-active`,
                {
                    isB2cActive: !isB2cActiveStatus,
                    isB2bActive: isB2bActiveStatus,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setIsB2cActiveStatus(response?.data?.isB2cActive);
            setIsB2bActiveStatus(response?.data?.isB2bActive);
        } catch (err) {
            console.log(err);
        }
    };
    const changeActiveStatusB2b = async () => {
        try {
            const response = await axios.patch(
                `/attractions/update/${_id}/is-active`,
                { isB2cActive: isB2cActive, isB2bActive: !isB2bActiveStatus },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setIsB2cActiveStatus(response?.data?.isB2cActive);
            setIsB2bActiveStatus(response?.data?.isB2bActive);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3">{code}</td>
            <td className="p-3">{title}</td>
            <td className="p-3 capitalize">{bookingType}</td>
            <td className="p-3 capitalize">
                {isOffer
                    ? `${offerAmount} ${
                          offerAmountType === "flat" ? "AED" : "%"
                      }`
                    : "N/A"}
            </td>
            <td className="p-3 capitalize">{destination?.name}</td>
            <td className="p-3">
                <Link
                    to={`/attractions/${_id}/reviews`}
                    className="text-blue-500 underline"
                >
                    {totalReviews}
                </Link>{" "}
                ({averageRating?.toFixed(1)}) &#9734;
            </td>
            {/* <th className="font-[500] p-3 text-left">
                <div className="flex items-center gap-[15px]">
                    {b2cmarkup?.markup
                        ? b2cmarkup?.markup +
                          (b2cmarkup?.markupType === "percentage"
                              ? "%"
                              : " AED")
                        : "N/A"}

                    <button
                        className="h-auto bg-transparent text-blue-500 text-sm underline font-normal "
                        onClick={() => setIsMarkupModalOpen(true)}
                    >
                        Edit
                    </button>

                    {isMarkupModalOpen && (
                        <B2cAttractionMarkupEditModal
                            b2cmarkup={b2cmarkup}
                            setB2cMarkup={setB2cMarkup}
                            setIsMarkupModalOpen={setIsMarkupModalOpen}
                            attraction={_id}
                        />
                    )}
                </div>
            </th> */}
            <td className="p-3">
                {" "}
                <div className="flex gap-[10px]">
                    <button
                        className="h-auto bg-transparent  text-xl"
                        onClick={changeActiveStatus}
                    >
                        {isB2cActiveStatus === true ? (
                            <TiTick className="text-green-500" />
                        ) : (
                            <RiCloseCircleFill className="text-red-500" />
                        )}
                    </button>
                </div>
            </td>
            <td className="p-3">
                {" "}
                <div className="flex gap-[10px]">
                    <button
                        className="h-auto bg-transparent  text-xl"
                        onClick={changeActiveStatusB2b}
                    >
                        {isB2bActiveStatus === true ? (
                            <TiTick className="text-green-500" />
                        ) : (
                            <RiCloseCircleFill className="text-red-500" />
                        )}
                    </button>
                </div>
            </td>
            <td className="p-3">
                <div className="flex gap-[10px]">
                    <button
                        className="h-auto bg-transparent text-red-500 text-xl"
                        onClick={() => {
                            deleteAttraction(_id);
                        }}
                    >
                        <MdDelete />
                    </button>
                    <Link to={`${_id}/edit`}>
                        <button className="h-auto bg-transparent text-green-500 text-xl">
                            <BiEditAlt />
                        </button>
                    </Link>
                </div>
            </td>
        </tr>
    );
}
