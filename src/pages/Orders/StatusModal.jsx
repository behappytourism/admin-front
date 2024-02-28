import React, { useState } from "react";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { BtnLoader } from "../../components";

function StatusModal({ order, orderItem, setIsModal, isModal, fetchorder }) {
  const { jwtToken } = useSelector((state) => state.admin);

  const [data, setData] = useState({
    bookingConfirmationNumber: "",
    note: "",
    orderId: order?.attractionOrder?._id,
    bookingId: orderItem?._id,
    orderedBy:
      order?.attractionOrder?.orderType === "b2b-portal" ? "b2b" : "b2c",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const res = await axios.patch(
        `/attractions/orders/bookings/confirm`,
        data,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setIsLoading(false);
      setIsModal(false);
      fetchorder();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20">
      <div className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto">
        <div className="flex justify-end py-2 px-2">
          <h1
            className="text-xl cursor-pointer"
            onClick={() => {
              setIsModal(!isModal);
            }}
          >
            <IoMdClose />
          </h1>
        </div>
        <div className="py-3 px-3">
          <h1 className="text-lg font-bold">Booking Confirmation</h1>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Confirmation Number</label>
              <input
                type="text"
                name="bookingConfirmationNumber"
                onChange={handleChange}
                className="w-full h-12 outline-none"
              />
            </div>
            <div className="pt-2">
              <label>Note</label>
              <textarea
                onChange={handleChange}
                name="note"
                className="outline-none w-full"
                id=""
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="flex justify-end py-4">
              <button className="w-32">
                {isLoading ? <BtnLoader /> : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StatusModal;
