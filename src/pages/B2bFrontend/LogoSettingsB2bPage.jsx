import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { useImageChange } from "../../hooks";
import { BtnLoader } from "../../components";
import { config } from "../../constants";

export default function LogoSettingsB2bPage() {
    const [logoUrl, setLogoUrl] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const {
        image: logoImg,
        handleImageChange: handleLogoImgChange,
        error: logoImgError,
    } = useImageChange();

    const fetchLogo = async () => {
        try {
            const response = await axios.get("/frontend/b2b/home/logo", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setLogoUrl(response.data?.logo);
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogoUpdate = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("logo", logoImg);

            const response = await axios.patch(
                "/frontend/b2b/home/logo/update",
                formData,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setLogoUrl(response?.data?.logo);
            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogo();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Logo Setting
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
                    <span>Logo</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleLogoUpdate}>
                        <div>
                            <label htmlFor="">Logo</label>
                            <input type="file" onChange={handleLogoImgChange} />
                        </div>
                        <div className="mt-6">
                            <img
                                src={
                                    logoImg
                                        ? URL.createObjectURL(logoImg)
                                        : config.SERVER_URL + logoUrl
                                }
                                className="w-[250px]"
                                alt=""
                            />
                            {logoImgError && (
                                <span className="block text-sm text-red-500 mt-4">
                                    {logoImgError}
                                </span>
                            )}
                        </div>
                        {error && (
                            <span className="block text-sm text-red-500 mt-4">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end">
                            <button className="w-[100px]" disabled={isLoading}>
                                {isLoading ? <BtnLoader /> : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
