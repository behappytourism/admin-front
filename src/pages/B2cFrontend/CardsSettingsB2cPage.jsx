import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { PageLoader } from "../../components";
import { config } from "../../constants";

export default function CardsSettingsB2cPage() {
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchCards = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get("/frontend/b2c/home/cards", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setCards(response.data?.cards);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setCards([]);
            console.log(err);
        }
    };

    const deleteCard = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/frontend/b2c/home/cards/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                const filteredCards = cards?.filter((card) => {
                    return card?._id !== id;
                });
                setCards(filteredCards);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Cards Setting
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
                    <span>Cards</span>
                </div>
            </div>

            {isLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Cards</h1>
                            <Link to="add">
                                <button className="px-3">+ Add Card</button>
                            </Link>
                        </div>
                        {cards?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Cards found
                                </span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Title
                                        </th>
                                        <th className="font-[500] p-3">
                                            Description
                                        </th>
                                        <th className="font-[500] p-3">
                                            Bg Image
                                        </th>
                                        <th className="font-[500] p-3">Icon</th>
                                        <th className="font-[500] p-3">Url</th>
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {cards?.map((card, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">
                                                    {card?.title}
                                                </td>
                                                <td className="p-3">
                                                    {card?.description}
                                                </td>
                                                <td className="p-3">
                                                    {card?.backgroundImage ? (
                                                        <div className="">
                                                            <img
                                                                src={
                                                                    config.SERVER_URL +
                                                                    card?.backgroundImage
                                                                }
                                                                alt=""
                                                                className="w-[30px]"
                                                            />
                                                        </div>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {card?.icon ? (
                                                        <div className="">
                                                            <img
                                                                src={
                                                                    config.SERVER_URL +
                                                                    card?.icon
                                                                }
                                                                alt=""
                                                                className="w-[30px]"
                                                            />
                                                        </div>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {card?.url}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteCard(
                                                                    card?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`${card?._id}/edit`}
                                                        >
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BiEditAlt />
                                                            </button>
                                                        </Link>
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
