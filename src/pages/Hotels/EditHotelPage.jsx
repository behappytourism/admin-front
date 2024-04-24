import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import axios from "../../axios";
import { PageLoader } from "../../components";
import {
    HotelAmenityForm,
    HotelConfigurationForm,
    HotelContactInfoForm,
    HotelDescriptionForm,
    HotelDetailsForm,
    HotelEditFormButtons,
    HotelMediaForm,
    HotelRestAndBarForm,
} from "../../features/AddHotel";
import {
    fetchInitialData,
    initiateHotelFormFields,
    resetHotelForm,
} from "../../redux/slices/hotelFormSlice";
import { hasPermission } from "../../utils";

const sections = {
    "-details": "Details",
    // "-configuration": "Configuration",
    // "-description": "Description",
    // "-amenities": "Amenities",
    // "-rest-and-bar": "Restaurant & Bar",
    // "-contact": "Contact Info",
    // "-media": "Media",
};

export default function EditHotelPage() {
    const [selectedSection, setSelectedSection] = useState("-details");
    const [newImages, setNewImages] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const dispatch = useDispatch();
    const { id } = useParams();
    const { jwtToken, admin } = useSelector((state) => state.admin);

    const isEditPermission = hasPermission({
        roles: admin?.roles,
        name: "hotels",
        permission: "update",
    });

    const fetchHotel = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/hotels/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            dispatch(initiateHotelFormFields(response?.data));
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const goForward = () => {
        if (
            Object.keys(sections).indexOf(selectedSection) <
            Object.keys(sections).length - 1
        ) {
            setSelectedSection(
                Object.keys(sections)[
                    Object.keys(sections).indexOf(selectedSection) + 1
                ]
            );
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

    useEffect(() => {
        fetchHotel();
        dispatch(fetchInitialData());
    }, []);

    useEffect(() => {
        return () => dispatch(resetHotelForm());
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Edit Hotel</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}
                    </span>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="p-4">
                            <ul className="dir-btn">
                                {Object.keys(sections)?.map(
                                    (section, index) => {
                                        return (
                                            <li
                                                key={index}
                                                className={
                                                    selectedSection === section
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() => {
                                                    setSelectedSection(section);
                                                }}
                                            >
                                                <span>{sections[section]}</span>
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        </div>

                        <div className="p-4">
                            <HotelDetailsForm
                                selectedSection={selectedSection}
                                isEditPermission={isEditPermission}
                            />
                            {/* <HotelConfigurationForm
                                selectedSection={selectedSection}
                                isEditPermission={isEditPermission}
                            />
                            <HotelDescriptionForm
                                selectedSection={selectedSection}
                                isEditPermission={isEditPermission}
                            />
                            <HotelAmenityForm
                                selectedSection={selectedSection}
                                isEditPermission={isEditPermission}
                            />
                            <HotelRestAndBarForm
                                selectedSection={selectedSection}
                                isEditPermission={isEditPermission}
                            />
                            <HotelContactInfoForm
                                selectedSection={selectedSection}
                                isEditPermission={isEditPermission}
                            />
                            <HotelMediaForm
                                selectedSection={selectedSection}
                                newImages={newImages}
                                setNewImages={setNewImages}
                                isEditPermission={isEditPermission}
                            /> */}
                            <HotelEditFormButtons
                                newImages={newImages}
                                next={
                                    Object.keys(sections).indexOf(selectedSection) <
                                    Object.keys(sections).length - 1
                                }
                                goForward={goForward}
                                goBack={goBack}
                                prev={Object.keys(sections).indexOf(selectedSection) !== 0}
                                isEditPermission={isEditPermission}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
