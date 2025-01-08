import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { config } from "../../constants";
import axios from "../../axios";


function StandAloneTableList({ ele }) {

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate()


    const deleteStandAlone = async (id) => {
        try {

            const isConfirm = window.confirm("Are you sure to delete")

            if(isConfirm){
                const res = await axios.patch(`/attractions/standalone/delete/${id}`,  {} ,{
                    headers: { Authorization: `Bearer ${jwtToken}` },
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <tr className="border-b border-tableBorderColor">
            <td className="p-3">{ele?.title}</td>
            <td className="p-3 capitalize">{ele?.slug}</td>
            <td className="p-3 capitalize">
                {
                    ele?.attraction?.map((item)=>(
                        <h1>{item?.title}</h1>
                    ))
                }
            </td>
            <td className="p-3 capitalize">
                <img className="w-44 h-12 object-fill" src={config.SERVER_URL + ele?.images[0]} alt="" />
            </td>
            <td className="p-3">
                <div className="flex gap-[10px]">
                    <button
                        className="h-auto bg-transparent text-grayColor text-xl"
                        onClick={""}
                    >
                     
                    </button>
                    <button
                        className="h-auto bg-transparent text-red-500 text-xl"
                        onClick={()=>deleteStandAlone(ele?._id)}
                    >
                        <MdDelete />
                    </button>
                    
                        <button className="h-auto bg-transparent text-green-500 text-xl" 
                        onClick={()=> navigate(`/standalone/edit/${ele?._id}`)}
                        >
                            <BiEditAlt />
                        </button>
                </div>
            </td>
        </tr>
  )
}

export default StandAloneTableList