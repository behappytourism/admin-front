import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { FaHotel } from "react-icons/fa";
import { HiOutlineTemplate } from "react-icons/hi";
import { MdCampaign, MdEmail } from "react-icons/md";
import { RiFileList3Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import axios from "../../axios";
import {
    BtnLoader,
    MultipleSelectDropdown,
    PageLoader,
} from "../../components";
import EmailCampaignForm from "../../features/Email/EmailCampaignForm";
import EmailPreview from "../../features/Email/EmailPreview";
import { formatDate } from "../../utils";

export default function ViewEmailCampaginPage() {
    const [data, setData] = useState({
        name: "",
        subject: "",
        date: "",
        hour: "",
        min: "",
        emailListId: "",
        emailTemplateId: "",
        campaignGroupId: "",
        status: "",
    });

    const [template, setTemplate] = useState();
    const [mailingList, setMailingList] = useState();

    const [isPageLoading, setIsPageLoading] = useState(false);

    const [error, setError] = useState("");
    const [keyValue, setKeyValue] = useState([]);
    const [emails, setEmails] = useState([]);

    const [searchParams] = useSearchParams();

    const groupName = searchParams.get("name");
    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchData = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get(
                `/email/campaign/single/view/${id}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const {
                name,
                subject,
                hour,
                min,
                tags,
                date,
                campaignGroupId,
                status,
            } = response.data.emailCampaign;

            setData((prev) => {
                return {
                    ...prev,
                    name,
                    subject,
                    date: date?.slice(0, 10) || "",
                    hour,
                    min,
                    status,
                    campaignGroupId,
                };
            });
            setMailingList(response.data?.emailList);
            setTemplate(response.data?.emailTemplate);

            setKeyValue(tags || []);

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = async (e) => {
        try {
            const response = await axios.patch(
                `/email/campaign/status/${id}`,
                { status: e.target.value },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(response.data, "1"); // Log the API response

            setData((prev) => {
                return { ...prev, ["status"]: response.data.status };
            });
        } catch (err) {
            console.log(err, "errrrr");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log(data, "State updated");
    }, [data]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">VIEW EMAIL </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email/campaign" className="text-textColor">
                        Email{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>View</span>
                </div>
            </div>
            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        {isPageLoading ? (
                            <PageLoader />
                        ) : (
                            <div>
                                <div className="flex items-center justify-end p-5 gap-2">
                                    <div>
                                        <select
                                            className="w-full"
                                            name="status"
                                            onChange={handleChange}
                                            value={data?.status || ""}
                                            required
                                        >
                                            <option hidden>Select</option>
                                            {data?.status === "scheduled" && (
                                                <>
                                                    <option value={"paused"}>
                                                        Pause
                                                    </option>
                                                    <option
                                                        hidden
                                                        value="scheduled"
                                                    >
                                                        Schedule
                                                    </option>
                                                </>
                                            )}

                                            {data?.status === "paused" && (
                                                <>
                                                    {" "}
                                                    <option value={"scheduled"}>
                                                        Schedule
                                                    </option>{" "}
                                                    <option
                                                        hidden
                                                        value="paused"
                                                    >
                                                        Pause
                                                    </option>
                                                </>
                                            )}

                                            {/* <option value={"regular"}>Regular</option> */}
                                        </select>
                                    </div>
                                    {(data?.status === "scheduled" ||
                                        data.status === "paused") && (
                                        <div>
                                            <Link to={`edit?name=${groupName}`}>
                                                <button className="h-auto bg-transparent text-green-500 text-xl">
                                                    <BiEditAlt />
                                                </button>
                                            </Link>{" "}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {" "}
                                    <div className="border-b border-dashed mb-2 pb-2">
                                        <div>
                                            <h2 className="font-[600] text-blue-500 flex items-center gap-[10px]">
                                                <MdCampaign /> Campagin Group
                                            </h2>
                                            <div className="pl-6  ">
                                                <span className="block text-sm text-grayColor">
                                                    Name :{""}
                                                </span>
                                                <span className="inline-block text-sm text-gray-700 capitalize ">
                                                    {" "}
                                                    {
                                                        data?.campaignGroupId
                                                            ?.name
                                                    }
                                                </span>
                                                <span className="block text-sm text-grayColor">
                                                    From Date :{""}
                                                </span>
                                                <span className="inline-block text-sm text-gray-700 capitalize">
                                                    {formatDate(
                                                        data?.campaignGroupId
                                                            ?.startDate
                                                    )}
                                                </span>
                                                <span className=" block text-sm text-grayColor">
                                                    To Date :{""}
                                                </span>
                                                <span className=" block text-sm text-gray-700 capitalize">
                                                    {formatDate(
                                                        data?.campaignGroupId
                                                            ?.endDate
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-b border-dashed mb-2 pb-2">
                                        <div>
                                            <h2 className="font-[600] text-red-500 flex items-center gap-[10px]">
                                                <MdEmail /> Email
                                            </h2>
                                            <div className="pl-6  ">
                                                <span className="block text-sm text-grayColor">
                                                    Name :{""}
                                                </span>
                                                <span className="inline-block text-sm text-gray-700 capitalize ">
                                                    {" "}
                                                    {data?.name}
                                                </span>
                                                <span className="block text-sm text-grayColor">
                                                    Date :{""}
                                                </span>
                                                <span className="inline-block text-sm text-gray-700 capitalize">
                                                    {formatDate(data?.date)}
                                                </span>
                                                <span className=" block text-sm text-grayColor capitalize">
                                                    Hour / Min :{""}
                                                </span>
                                                <span className=" block text-sm text-gray-700 capitalize">
                                                    {" "}
                                                    {data?.hour} / {data?.min}
                                                </span>{" "}
                                                <span className=" block text-sm text-grayColor">
                                                    Status :{""}
                                                </span>
                                                <span
                                                    className={`${
                                                        data?.status ===
                                                        "scheduled"
                                                            ? "text-blue-800"
                                                            : data?.status ===
                                                              "completed"
                                                            ? "text-green-500"
                                                            : data?.status ===
                                                              "paused"
                                                            ? "text-red-800"
                                                            : "text-gray-800"
                                                    } block text-md text-gray-700 capitalize`}
                                                >
                                                    {" "}
                                                    {data?.status}
                                                </span>{" "}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-b border-dashed mb-2 pb-2">
                                        <div>
                                            <h2 className="font-[600] text-green-500 flex items-center gap-[10px]">
                                                <HiOutlineTemplate /> Template
                                            </h2>

                                            <div className="pl-6  ">
                                                <span className="block text-sm text-grayColor">
                                                    Name :{""}
                                                </span>
                                                <span className="inline-block text-sm text-gray-700 capitalize">
                                                    {" "}
                                                    {template?.name}
                                                </span>
                                                <span className="block text-sm text-grayColor">
                                                    Type :{""}
                                                </span>
                                                <span className="inline-block text-sm text-gray-700 capitalize">
                                                    {template?.type === "manual"
                                                        ? "Upload Template"
                                                        : "Text"}{" "}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="border-b border-dashed mb-2 pb-2">
                                        <div>
                                            <h2 className="font-[600] text-orange-500 flex items-center gap-[10px]">
                                                <RiFileList3Line /> Mailing List
                                            </h2>
                                            <div className="grid grid-cols-4 gap-4 capitalize">
                                                {mailingList?.length > 0 &&
                                                    mailingList?.map(
                                                        (
                                                            mailingListItem,
                                                            index
                                                        ) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="pl-6  "
                                                                >
                                                                    <span className="block text-sm text-grayColor">
                                                                        Name :
                                                                        {""}
                                                                    </span>
                                                                    <span className="inline-block text-sm text-gray-700 ">
                                                                        {" "}
                                                                        {
                                                                            mailingListItem?.name
                                                                        }
                                                                    </span>
                                                                    <span className="block text-sm text-grayColor">
                                                                        Type :
                                                                        {""}
                                                                    </span>
                                                                    <span className="inline-block text-sm text-gray-700">
                                                                        {mailingListItem?.type ===
                                                                        "manual"
                                                                            ? "Upload file"
                                                                            : "scheduled mailing"}{" "}
                                                                    </span>
                                                                    <span className=" block text-sm text-grayColor">
                                                                        Recipient
                                                                        Group :{" "}
                                                                    </span>
                                                                    <span className=" block text-sm text-gray-700">
                                                                        {
                                                                            mailingListItem?.recipientGroup
                                                                        }
                                                                    </span>{" "}
                                                                    {mailingListItem?.recipientGroup ===
                                                                        "b2b" && (
                                                                        <>
                                                                            <span className=" block text-sm text-grayColor">
                                                                                Products
                                                                                :
                                                                                {
                                                                                    ""
                                                                                }
                                                                            </span>
                                                                            <span className=" block text-sm text-gray-700">
                                                                                {mailingListItem?.products.map(
                                                                                    (
                                                                                        prod,
                                                                                        index
                                                                                    ) => (
                                                                                        <span
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                        >
                                                                                            {" "}
                                                                                            {
                                                                                                prod
                                                                                            }{" "}
                                                                                        </span>
                                                                                    )
                                                                                )}
                                                                            </span>{" "}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="mt-2">
                                        <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                                            <BsFillArrowRightCircleFill /> View
                                        </h1>
                                        <div className="p-5">
                                            {" "}
                                            <span className="font-[600] text-[16px]">
                                                Subject :{" "}
                                            </span>
                                            <span className=" text-[16px] pl-5 capitalize">
                                                {data?.subject}
                                            </span>
                                        </div>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: template?.html,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
