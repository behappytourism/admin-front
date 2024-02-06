import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { MdClose } from "react-icons/md";
import { BtnLoader, MultipleSelectDropdown } from "../../components";

export default function EdiGroupAreaPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [areas, setAreas] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [name, setName] = useState("");
    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchAreas = async () => {
        try {
            const response = await axios.get(`/group-area/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            console.log(response, "response");
            setAreas(response.data.areas);
            setSelectedAreas(response.data.group.areas);
            setName(response.data.group.name);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.patch(
                `/group-area/update/${id}`,
                { name, areas: selectedAreas },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/transfers/area-group");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const removeSelectedArea = (id) => {
        const filteredArea = selectedAreas.filter((selArea) => selArea !== id);

        setSelectedAreas(filteredArea);
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">Edit Group</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/transfers/area-group" className="text-textColor">
                        Area Group{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">Group Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    name="name"
                                    value={name || ""}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Select Area </label>

                                <MultipleSelectDropdown
                                    data={areas}
                                    displayName={"areaName"}
                                    valueName={"_id"}
                                    selectedData={selectedAreas}
                                    setSelectedData={(selAccess) => {
                                        setSelectedAreas(selAccess);
                                    }}
                                    randomIndex={"areaName"}
                                />
                            </div>
                        </div>
                        <div className="mt-[20px]">
                            <div>Selected Areas</div>
                            <div className="py-[15px]">
                                {areas.map((area) => {
                                    return selectedAreas.includes(area._id) ? (
                                        <div className="flex items-center gap-4 mt-2 ">
                                            <span
                                                className="text-base cursor-pointer text-white rounded-full bg-red-500  h-6 w-6 flex items-center justify-center"
                                                onClick={() => {
                                                    removeSelectedArea(
                                                        area._id
                                                    );
                                                }}
                                            >
                                                <MdClose />
                                            </span>
                                            <label key={area}>
                                                {area.areaName}
                                            </label>
                                        </div>
                                    ) : (
                                        ""
                                    );
                                })}
                            </div>
                        </div>

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button className="w-[120px]">
                                {isLoading ? <BtnLoader /> : "Update Group"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
