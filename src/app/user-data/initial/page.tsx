"use client";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import ArrowButton from "@/components/ArrowButton";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function Initial() {
  const { user, updateUser } = useGlobalContext();
  const [initial, setInitial] = useState<string>("");
  const router = useRouter();

  const handleClick = () => {
    if (initial === "") {
      alert("Mohon isikan inisial anda");
      return;
    }
    updateUser("inisial", initial);
    router.push("/user-data/age");
  };

  return (
    <section className="wrapper">
      <div className="spacer"></div>
      <div className="content">
        <label>Kode Peserta</label>
        <input
          type="text"
          id="input-initial"
          className="input-style "
          placeholder="contoh: KODEPESERTA"
          value={initial}
          onChange={(e) => setInitial(e.target.value)}
        />
      </div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="w-full flex justify-between">
        <BackButton />
        <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
      </div>
    </section>
  );
}
