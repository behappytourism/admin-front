import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

import axios from "../../axios";
import { PageLoader } from "../../components";
import AddHeroModal from "../../features/Home/components/AddHeroModal";
import { config } from "../../constants";

export default function HeroSettingsB2cPage() {
    const [heros, setHeros] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [heroModal, setHeroModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedHero, setSelectedHero] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchHeros = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get("/frontend/b2c/home/heros", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            console.log(response.data);
            setHeros(response.data?.heros);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setHeros([]);
            console.log(err);
        }
    };

    const addHero = async (newHero) => {
        setHeros((prev) => {
            return [...prev, newHero];
        });
    };

    const updateHero = async (updatedHero) => {
        const objIndex = heros.findIndex((item) => {
            return item?._id === updatedHero?._id;
        });
        const tempHeros = heros;
        tempHeros[objIndex] = updatedHero;
        setHeros(tempHeros);
    };

    const deleteHero = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/frontend/b2c/home/heros/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filteredHeros = heros.filter((item) => {
                    return item?._id !== id;
                });
                setHeros(filteredHeros);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHeros();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Hero Setting
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
                    <span>Hero</span>
                </div>
            </div>

            {heroModal?.isOpen && (
                <AddHeroModal
                    heroModal={heroModal}
                    setHeroModal={setHeroModal}
                    addHero={addHero}
                    updateHero={updateHero}
                    selectedHero={selectedHero}
                />
            )}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Heros</h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setHeroModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Hero
                            </button>
                        </div>
                        {heros?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Heros Found
                                </span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Hero</th>
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
                                    {heros?.map((hero, index) => {
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
                                                                hero?.image
                                                            }
                                                            alt=""
                                                            className="w-[80px] rounded max-h-[60px]"
                                                        />
                                                        <span className="font-medium text-[15px]">
                                                            {hero?.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 max-w-[300px]">
                                                    {hero?.description}
                                                </td>
                                                <td className="p-3">
                                                    {hero?.place}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteHero(
                                                                    hero?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedHero(
                                                                    hero
                                                                );
                                                                setHeroModal({
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
