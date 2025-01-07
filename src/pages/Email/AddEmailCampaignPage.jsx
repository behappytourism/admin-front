import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, PageLoader } from "../../components";
import { useImageChange } from "../../hooks";
import { MultipleSelectDropdown } from "../../components";
import EmailCampaignForm from "../../features/Email/EmailCampaignForm";
import EmailPreview from "../../features/Email/EmailPreview";
const hours = [1, 2];
export default function AddEmailCampaignPage() {
    const [data, setData] = useState({
        name: "",
        subject: "",
        date: "",
        hour: "",
        min: "",
        emailListId: [],
        emailTemplateId: "",
        emailConfigId: "",
        emailFooterId: "",
    });

    const [emails, setEmails] = useState([]);

    const { id } = useParams();

    const [emailLists, setEmailsLists] = useState([]);
    const [emailTemplates, setEmailTemplates] = useState([]);
    const [emailFooters, setEmailFooters] = useState([]);
    const [emailConfigs, setEmailsConfigs] = useState([]);

    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const sections = {
        "-details": "Details",
        "-preview": "Preview",
    };
    const [selectedSection, setSelectedSection] = useState("-details");
    const [selectedEmailList, setSelectedEmailList] = useState();
    const [selectedEmailTemplate, setSelectedEmailTemplate] = useState();
    const [selectedEmailFooter, setSelectedEmailFooter] = useState();
    const [selectedEmailConfig, setSelectedEmailConfig] = useState();

    const [error, setError] = useState("");
    const [keyValue, setKeyValue] = useState([]);
    const goForward = async () => {
        if (
            Object.keys(sections).indexOf(selectedSection) <
            Object.keys(sections).length - 1
        ) {
            setSelectedSection(
                Object.keys(sections)[
                    Object.keys(sections).indexOf(selectedSection) + 1
                ]
            );

            let response = await axios.post(
                "/email/campaign/preview",
                {
                    emailListId: data.emailListId,
                    emailTemplateId: data.emailTemplateId,
                    emailConfigId: data.emailConfigId,
                    emailFooterId: data.emailFooterId,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setSelectedEmailList(response?.data?.emailLists);
            setSelectedEmailTemplate(response?.data?.emailTemplate);
            setKeyValue(
                response?.data?.emailTemplate.type === "manual"
                    ? response?.data?.emailTemplate?.tags
                    : []
            );
            setSelectedEmailConfig(response.data.emailConfig);
            setSelectedEmailFooter(response?.data?.emailFooter);
        }
    };

    const goBack = () => {
        if (Object.keys(sections).indexOf(selectedSection) > 0) {
            setSelectedSection(
                Object.keys(sections)[
                    Object.keys(sections).indexOf(selectedSection) - 1
                ]
            );
        }
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.post(
                "/email/campaign/add",
                { ...data, tags: keyValue, campaignGroupId: id },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(`/email/campaign-groups/${id}/campaigns`);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setIsPageLoading(true);

            let lists = await axios.get("/email/list", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            let templates = await axios.get("/email/template", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            let configs = await axios.get("/email/configs/list", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            let footers = await axios.get("/email/footers/list", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setEmailsLists(lists?.data);
            setEmailTemplates(templates?.data);
            setEmailsConfigs(configs?.data || []);
            setEmailFooters(footers.data || []);
            setIsPageLoading(false);
        } catch (err) {
            console.log(err, "errrrr");
        }
    };

    useEffect(() => {
        console.log("useEffect");
        fetchData();
    }, []);

    const handleInpChange = (e, index) => {
        console.log(index, "index");
        setKeyValue((prev) => {
            const updatedTags = [...prev];
            updatedTags[index] = {
                ...updatedTags[index],
                [e.target.name]: e.target.value,
            };

            return updatedTags;
        });
    };

    const handleImageSet = (id, index) => {
        setKeyValue((prev) => {
            const updatedTags = [...prev];
            updatedTags[index] = {
                ...updatedTags[index],
                image: id,
            };

            return updatedTags;
        });
    };
    console.log(keyValue, "keyvalue");
    const [searchParams] = useSearchParams();

    const groupName = searchParams.get("name");
    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">ADD EMAIL </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email/campaign" className="text-textColor">
                        Email{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <div className="p-4">
                        <ul className="dir-btn">
                            {Object.keys(sections)?.map((section, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={
                                            selectedSection === section
                                                ? "active"
                                                : ""
                                        }
                                        // onClick={() => {
                                        //     setSelectedSection(section);
                                        // }}
                                    >
                                        <span>{sections[section]}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {isPageLoading ? (
                        <PageLoader />
                    ) : (
                        <div className="p-4">
                            <EmailCampaignForm
                                data={data}
                                handleChange={handleChange}
                                selectedSection={selectedSection}
                                emailLists={emailLists}
                                emailTemplates={emailTemplates}
                                setData={setData}
                                groupName={groupName}
                                emailConfigs={emailConfigs}
                                emailFooters={emailFooters}
                            />
                            <EmailPreview
                                selectedSection={selectedSection}
                                emailLists={selectedEmailList}
                                emailTemplate={selectedEmailTemplate}
                                keyValue={keyValue}
                                data={data}
                                setKeyValue={setKeyValue}
                                handleInpChange={handleInpChange}
                                handleImageSet={handleImageSet}
                                emails={emails}
                                setEmails={setEmails}
                                emailFooter={selectedEmailFooter}
                                emailConfig={selectedEmailConfig}
                            />
                            <div className="mt-8">
                                {/* {error && (
                                <span className="text-sm text-red-500 block mt-4">
                                    {error}
                                </span>
                            )} */}

                                <div className="mt-4 flex items-center justify-end gap-[12px]">
                                    {Object.keys(sections).indexOf(
                                        selectedSection
                                    ) !== 0 ? (
                                        <button
                                            className="bg-slate-300 text-textColor px-[15px]"
                                            type="button"
                                            onClick={goBack}
                                        >
                                            Back
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-slate-300 text-textColor px-[15px]"
                                            type="button"
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    {Object.keys(sections).indexOf(
                                        selectedSection
                                    ) <
                                    Object.keys(sections).length - 1 ? (
                                        <button
                                            className="w-[100px] bg-primaryColor"
                                            type="button"
                                            onClick={goForward}
                                        >
                                            next
                                        </button>
                                    ) : isLoading ? (
                                        <button
                                            className="w-[100px] bg-primaryColor"
                                            onClick={handleSubmit}
                                            // disabled={isLoading}
                                        >
                                            <BtnLoader />
                                        </button>
                                    ) : (
                                        <button
                                            className="w-[100px] bg-primaryColor"
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
