import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { BtnLoader, PageLoader, RichTextEditor } from "../../components";

function AddAboutUsB2bPage() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");
    const [data, setData] = useState({
        termsAndConditions: "",
        privacyAndPolicy: "",
    });
    const [isPageLoading, setIsPageLoading] = useState(true);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const { jwtToken } = useSelector((state) => state.admin);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            await axios.patch(
                "/frontend/b2b/home/about-us/upsert",
                { ...data },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setIsLoading(false);
            // navigate(`/a2a/${params.id}`);
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.error);
            setIsLoading(false);
        }
    };

    const fetchFrontend = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/frontend/b2b/home/about-us`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setData(response.data);
            setIsPageLoading(false);
        } catch (err) {
            setIsPageLoading(false);

            console.log(err);
        }
    };

    useEffect(() => {
        fetchFrontend();
    }, []);
    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">B2B ABOUT US</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/frontend" className="text-textColor">
                        Frontend{" "}
                    </Link>

                    <span>{">"} </span>
                    <span>B2C</span>
                </div>
            </div>
            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="block ">
                                <div className="mt-4">
                                    <label htmlFor=""> About Us *</label>
                                    <div className="mt-2">
                                        <div className="border border-t-0">
                                            <RichTextEditor
                                                getValue={(value) => {
                                                    setData((prev) => {
                                                        return {
                                                            ...prev,
                                                            aboutUs: value,
                                                        };
                                                    });
                                                }}
                                                initialValue={
                                                    data?.aboutUs || ""
                                                }
                                            />
                                        </div>
                                    </div>
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
                                <button className="w-[130px]">
                                    {isLoading ? <BtnLoader /> : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddAboutUsB2bPage;
