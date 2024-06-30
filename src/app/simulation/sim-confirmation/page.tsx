"use client";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ArrowButton from "@/components/ArrowButton";

export default function SimConfirmation() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [agreement, setAgreement] = useState<string>("");

  const urlNextPage = "/simulation/category";

  const handleClick = async () => {
    if (agreement !== "iya") {
      alert("Mohon setuju terlebih dahulu");
      return;
    }
    router.push(urlNextPage);
  };

  return (
    <section className="wrapper">
      <div className="title">Simulasi Pemilihan</div>
      <div className="content">
        <label>
          Apakah Anda Bersedia untuk Mengikuti Penelitian Ini hingga Selesai?
        </label>
        <select
          id="dropdown"
          className="input-style"
          value={agreement}
          onChange={(e) => setAgreement(e.target.value)}
        >
          <option value="">Pilih Jawaban</option>
          <option value="tidak">Tidak</option>
          <option value="iya">Iya</option>
        </select>
      </div>

      <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
    </section>
  );
}
