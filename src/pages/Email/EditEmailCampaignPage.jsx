import React, { useEffect, useState } from "react";
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

export default function EditEmailCampaginPage() {
    const [data, setData] = useState({
        name: "",
        subject: "",
        date: "",
        hour: "",
        min: "",
        emailListId: "",
        emailTemplateId: "",
        campaignGroupId: "",
        emailConfigId: "",
        emailFooterId: "",
    });
    const [emailLists, setEmailsLists] = useState([]);
    const [emailTemplates, setEmailTemplates] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
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

    const [emailFooters, setEmailFooters] = useState([]);
    const [emailConfigs, setEmailsConfigs] = useState([]);
    const [prevEmailTemplate, setPrevEmailTemplate] = useState(true);
    const [error, setError] = useState("");
    const [keyValue, setKeyValue] = useState([]);
    const [emails, setEmails] = useState([]);
    const goForward = async () => {
        if (
            Object.keys(sections).indexOf(selectedSection) <
            Object.keys(sections).length - 1
        ) {
            try {
                setIsPageLoading(true);
                setError("");

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
                if (!prevEmailTemplate) {
                    setKeyValue(
                        response?.data?.emailTemplate?.type === "manual"
                            ? response?.data?.emailTemplate?.tags
                            : []
                    );
                }
                setSelectedEmailConfig(response.data.emailConfig);
                setSelectedEmailFooter(response?.data?.emailFooter);
                setIsPageLoading(false);

                setSelectedSection(
                    Object.keys(sections)[
                        Object.keys(sections).indexOf(selectedSection) + 1
                    ]
                );
            } catch (err) {
                setError(
                    err?.response?.data?.error ||
                        "Something went wrong, Try again"
                );

                setIsPageLoading(false);
            }
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
    const { id } = useParams();

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

            await axios.patch(
                `/email/campaign/update/${id}`,
                { ...data, tags: keyValue },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(
                `/email/campaign-groups/${data?.campaignGroupId}/campaigns`
            );
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get(`/email/campaign/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const {
                name,
                subject,
                hour,
                min,
                emailListId,
                emailTemplateId,
                tags,
                campaignGroupId,
                date,
                emailConfigId,
                emailFooterId,
            } = response.data;
            setData((prev) => {
                return {
                    ...prev,
                    name,
                    subject,
                    date: date?.slice(0, 10) || "",
                    hour,
                    min,
                    emailListId,
                    emailTemplateId,
                    campaignGroupId,
                    emailConfigId,
                    emailFooterId,
                };
            });

            setKeyValue(tags || []);

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

            setKeyValue(tags);

            setEmailsLists(lists?.data);
            setEmailTemplates(templates?.data);
            setEmailsConfigs(configs?.data || []);
            setEmailFooters(footers.data || []);
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

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

    useEffect(() => {
        fetchData();
    }, []);

    const [searchParams] = useSearchParams();

    const groupName = searchParams.get("name");
    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">EDIT EMAIL </h1>
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
                    <span>Edit</span>
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
                                setPrevEmailTemplate={setPrevEmailTemplate}
                                emailConfigs={emailConfigs}
                                emailFooters={emailFooters}
                            />
                            <EmailPreview
                                selectedSection={selectedSection}
                                emailLists={selectedEmailList}
                                emailTemplate={selectedEmailTemplate}
                                data={data}
                                keyValue={keyValue}
                                setKeyValue={setKeyValue}
                                handleInpChange={handleInpChange}
                                handleImageSet={handleImageSet}
                                emails={emails}
                                setEmails={setEmails}
                                emailFooter={selectedEmailFooter}
                                emailConfig={selectedEmailConfig}
                            />
                            <div className="mt-8">
                                {error && (
                                    <span className="text-sm text-red-500 block mt-4">
                                        {error}
                                    </span>
                                )}

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
