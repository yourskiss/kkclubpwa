"use client";
import { useEffect, useState } from "react";
import { getUserID  } from "@/config/userauth";
import { _get } from "@/config/apiClient";

export default function TotalrewardpointsComponent() {
    const [points, setPoints] = useState(0);
    const userID = getUserID();
 
        useEffect(() => {
            _get("Customer/UserTotalRewardPoints?userid="+ userID)
            .then((res) => {
               // console.log("UserTotalRewardPoints response - ", res);
                setPoints(res.data.result[0].totalpoints);
            }).catch((error) => {
                console.log(error.message);
            });
        }, [userID]);

        return points;
  }