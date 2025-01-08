import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RichTextEditor } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { addAttractionStandAloneDatas } from "../../redux/slices/attrStandAloneSlice";
import SuggestionsModal from "./SuggestionsModal";
import axios from "../../axios";
import { config } from "../../constants";
import { BtnLoader } from "../../components";
import { useNavigate } from "react-router-dom";
import {
    clearAttractionStandAloneDataAfterAdding,
    deleteAddedAttractions,
} from "../../redux/slices/attrStandAloneSlice";
import { MdCancel } from "react-icons/md";

function AddStandAlone() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { attrData } = useSelector((state) => state.attrStandAlone);
    const { jwtToken } = useSelector((state) => state.admin);

    const [value, setValue] = useState("");
    const [dropdown, setDropdown] = useState(false);
    const [suggestions, setSuggestion] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const getSuggestions = async (value) => {
        try {
            const res = await axios.get(
                `/attractions/all-suggestions?search=${value}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setSuggestion(res?.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (value?.length) {
            getSuggestions(value);
        }
    }, [value]);

    const imageChangeHandler = (e) => {
        const files = e.target.files;
        let img = [];

        for (let i = 0; i < files.length; i++) {
            img.push(files[i]);
        }
        dispatch(addAttractionStandAloneDatas({ name: "gallery", value: img }));
        setGallery(img);
    };

    const handleFocus = () => {
        setDropdown(true);
        setValue("");
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData();

            let attractions = [];

            if (attrData?.attractions?.length) {
                for (let i = 0; i < attrData?.attractions?.length; i++) {
                    attractions.push(attrData?.attractions[i]?._id);
                }
            }
            formData.append("attractions[]", JSON.stringify(attractions));
            formData.append("title", attrData?.title);
            formData.append("description", attrData?.description);
            for (let i = 0; i < gallery.length; i++) {
                formData.append("images", gallery[i]);
            }

            setIsLoading(true);
            const res = await axios.post(
                "/attractions/standalone/create",
                formData,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            dispatch(clearAttractionStandAloneDataAfterAdding());
            setIsLoading(false);
            navigate("/standalone");
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            setError(error?.response?.data?.error);
        }
    };

    return (
        <div className="">
            <div className="bg-white flex items-center  justify-between gap-[10px] px-6 shadow-sm border-t  py-2">
                <div>
                    <h1 className="font-[600] text-[15px] uppercase">
                        Add Attraction Stand Alone
                    </h1>
                </div>
                <div>
                    <div className="text-sm text-grayColor">
                        <Link to="/" className="text-textColor">
                            Dashboard{" "}
                        </Link>
                        <span>{">"} </span>
                        <Link to="/attractions" className="text-textColor">
                            Attractions
                        </Link>
                        <span>{">"} </span>
                        <span>StandAlone </span>
                        <span>{">"} </span>
                        <span>Add</span>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white p-6">
                    <form action="" onSubmit={handleSubmit}>
                        <div className=" gap-2">
                            <div>
                                <label>Title</label>
                                <input
                                    onChange={(e) => {
                                        dispatch(
                                            addAttractionStandAloneDatas({
                                                name: "title",
                                                value: e.target.value,
                                            })
                                        );
                                        setError("");
                                    }}
                                    type="text"
                                    className="w-full h-10 outline-none border"
                                />
                            </div>
                            <div className="relative pt-3">
                                <label htmlFor="">Attractions</label>
                                <input
                                    type="text"
                                    onFocus={handleFocus}
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value);
                                        setError("");
                                    }}
                                    className="w-full h-10 outline-none border"
                                />
                                <SuggestionsModal
                                    value={value}
                                    setValue={setValue}
                                    dropdown={dropdown}
                                    setDropdown={setDropdown}
                                    suggestions={suggestions}
                                    setSuggestion={setSuggestion}
                                />
                            </div>
                            <div>
                                {attrData?.attractions?.length ? (
                                    <div className="grid md:grid-cols-8 pt-2 gap-2">
                                        {attrData?.attractions?.map((ele) => {
                                            return (
                                                <div className="bg-white shadow-md  xl:h-44 w-full border overflow-hidden">
                                                    <div className="relative">
                                                        <img
                                                            className="w-full h-32 object-cover"
                                                            src={
                                                                config.SERVER_URL +
                                                                ele?.images[1]
                                                            }
                                                            alt=""
                                                        />
                                                        <div className="absolute  right-0 top-0 ">
                                                            <p
                                                                className="text-xl text-red-500 cursor-pointer"
                                                                onClick={() => {
                                                                    dispatch(
                                                                        deleteAddedAttractions(
                                                                            ele?._id
                                                                        )
                                                                    );
                                                                }}
                                                            >
                                                                <MdCancel />
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <h1 className="text-sm text-center">
                                                            {ele?.title}
                                                        </h1>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div
                                className={
                                    attrData?.attractions?.length
                                        ? "pt-6"
                                        : "pt-3"
                                }
                            >
                                <label htmlFor="">Gallery</label>
                                <input
                                    onChange={imageChangeHandler}
                                    multiple
                                    type="file"
                                    className="w-full h-10 outline-none border"
                                />
                            </div>
                            <div className="pt-2">
                                {gallery?.length ? (
                                    <div className="flex gap-2 w-full h-20">
                                        {gallery?.map((ele) => (
                                            <div className="w-36 h-28">
                                                <img
                                                    className="w-full h-full object-fill"
                                                    src={URL.createObjectURL(
                                                        ele
                                                    )}
                                                    alt=""
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        <div
                            className={`${gallery?.length ? "pt-16" : "pt-3"}`}
                        >
                            <div className="mb-1">
                                <h1>Description</h1>
                            </div>
                            <RichTextEditor
                                initialValue={""}
                                getValue={(value) => {
                                    dispatch(
                                        addAttractionStandAloneDatas({
                                            name: "description",
                                            value: value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <div className="pt-5">
                            {error ? (
                                <h1 className="text-red-500">{error}</h1>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="pt-5 flex justify-end">
                            <button className="w-24">
                                {isLoading ? <BtnLoader /> : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddStandAlone;
