import { useEffect, useState } from "react";
import { fetchBusiness } from "./api";

const FALLBACK = {
  phone: "+91 9220770110",
  whatsapp: "919220770110",
  email: "aquaticajay@gmail.com",
  address:
    "Ganpatipada, Old Thane-Belapur Road, Near Hindalco Company, Opp. Vitawa, Thane - 400605",
  working_hours: "",
};

export default function useBusiness() {
  const [business, setBusiness] = useState(FALLBACK);

  useEffect(() => {
    let active = true;

    fetchBusiness()
      .then((data) => {
        if (active) setBusiness(data);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return business;
}