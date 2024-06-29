"use client";
import ArrowButton from "@/components/ArrowButton";
import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NationalElection() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [polParties, setPolParties] = useState<string>("");
  const { user, updateUser, setUser } = useGlobalContext();

  const url = process.env.NEXT_PUBLIC_API_URL + "/participant/";
  const urlNextPage = "/simulation/sim-confirmation";

  useEffect(() => {
    if (user) {
      console.log("user", user);
    }
  }, [user]);

  const handleClick = async () => {
    if (polParties === "") {
      alert("Mohon pilih partai politik anda");
      return;
    }

    setLoading(true);
    if (!user) {
      console.log("user undefined");
      setLoading(false);
      return;
    }

    console.log("user", user);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // const test = await response.json();
      // console.log("Fetched data:", test);

      const data = await response.json();
      // console.log("Fetched data:", data);

      if (!response.ok) {
        console.log("not ok");
        const errorMessage = await response.text();
        console.error("Server error:", errorMessage);
        setLoading(false);
        return;
      }

      const resData = data.data;
      localStorage.setItem("access_token", resData.access_token);
      localStorage.setItem("type", resData.type);
      router.push(urlNextPage);

      setLoading(false);

      if (!data || !data.data) {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const handleInput = (newValue: string) => {
    setPolParties(newValue);
    updateUser("partai_nasional", newValue);
  };

  return (
    <section className="wrapper">
      <div className="spacer"></div>
      <div className="content">
        <label>Partai Yang Anda Pilih Pada Pemilu Nasional Sebelumnya</label>
        <select
          id="dropdown"
          className="input-style"
          value={polParties}
          onChange={(e) => handleInput(e.target.value)}
        >
          <option value="" className="text-cus-dark-gray">
            Kotak Jawaban
          </option>
          <option value="PDIP" className="text-cus-dark-gray">
            PDIP
          </option>
          <option value="PAN" className="text-cus-dark-gray">
            PAN
          </option>
          <option value="Gerindra" className="text-cus-dark-gray">
            Gerindra
          </option>
        </select>
      </div>

      {loading ? (
        <p className="self-end">Loading...</p>
      ) : (
        <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
      )}
    </section>
  );
}