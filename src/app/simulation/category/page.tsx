"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowButton from "@/components/ArrowButton";
import { TemplateContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface Kategori {
  id: number;
  nama: string;
}

export interface Kandidat {
  id: number;
  kategori: string;
  nama: string;
  partai: string;
  headline: string;
  detail: string;
  kandidat: number;
}

const fetchData = async (
  token: any,
  url: any
): Promise<{ kategori: Kategori[]; kandidat: Kandidat[] }> => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    // console.log("Fetched data:", data);
    // console.log(data.data);

    if (!data || !data.data) {
      throw new Error("Invalid data format");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default function Category() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [kandidat, setKandidat] = useState<Kandidat[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>();
  const [autoNext, setAutoNext] = useState<boolean>(false);

  const router = useRouter();
  const urlNextPage = "/simulation/information-board";

  const url = process.env.NEXT_PUBLIC_API_URL + "/information?type=simulation";
  let tempKategori;

  useEffect(() => {
    setAutoNext(JSON.parse(localStorage.getItem("autoNext") || "false"));
    const token = localStorage.getItem("access_token");
    fetchData(token, url)
      .then((fetchedData) => {
        const { kategori, kandidat } = fetchedData;

        setKategori(kategori);
        setKandidat(kandidat);

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    let tempAtvCategory = localStorage.getItem("atvCategory") || "";
    if (tempAtvCategory == "" && kategori.length > 0) {
      tempAtvCategory = kategori[0].nama;
    }
    setActiveCategory(tempAtvCategory);

    // setLoading(false);
  }, []);

  useEffect(() => {}, [kategori]);

  useEffect(() => {
    const expiryTime = localStorage.getItem("expiryTime");
    if (expiryTime) {
      const currentTime = new Date().getTime();
      const expiryDate = new Date(expiryTime).getTime();
      const timeRemaining = expiryDate - currentTime;
      if (timeRemaining > 0) {
        setTimeLeft(timeRemaining);
      } else {
        setTimeLeft(null);
      }
    }
  }, [router]);

  useEffect(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null) {
            const newTimeLeft = prev - 1000;
            if (newTimeLeft <= 0) {
              setTimeLeft(null);
              clearInterval(timer);
              if (autoNext) {
                router.push("/simulation/information-check");
              }
            }
            return newTimeLeft;
          }
          return prev;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, router, autoNext]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const colorClass =
      totalSeconds <= 30
        ? "text-red-500 animate-pulse font-[500]"
        : totalSeconds <= 60
        ? "text-yellow-500 font-[500]"
        : "";
    return (
      <p className={`${colorClass} text-center rounded-md  bg-cus-dark-gray`}>
        {minutes}m {seconds}s
      </p>
    );
  };

  const handleClick = async () => {
    if (activeCategory === "") {
      alert("Mohon pilih kategori");
      return;
    }

    router.push(urlNextPage);
  };

  const handleActiveCategory = async (category: string) => {
    const atvCategory = localStorage.getItem("atvCategory");
    const categoryStartTime = localStorage.getItem("categoryStartTime");
    setActiveCategory(category);

    if (atvCategory && categoryStartTime && atvCategory !== category) {
      const currentTime = new Date().getTime();

      const timeDifference = Math.round(
        (currentTime - new Date(categoryStartTime).getTime()) / 1000
      );

      const body = {
        kategori: atvCategory,
        durasi: timeDifference,
        urutan_test: "simulasi",
      };

      console.log(body);

      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "/record/duration/";
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        // console.log(data.data);

        if (!response.ok) {
          // console.log("not ok");
          const errorMessage = await response.text();
          console.error("Server error:", errorMessage);
          return;
        }

        if (!data || !data.data) {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error :", error);
      }

      localStorage.setItem("categoryStartTime", new Date().toString());
    }

    localStorage.setItem("atvCategory", category);
    if (!categoryStartTime) {
      localStorage.setItem("categoryStartTime", new Date().toString());
    }
  };

  return (
    <section className="wrapper">
      <h1 className="title">Papan Informasi</h1>
      <div className="w-full h-[80%] flex flex-col items-center pb-[10%]">
        <h2 className="text-center text-md mt-4">
          Silakan Pilih Kategori yang Anda Minati
        </h2>

        {loading ? (
          <nav className="w-[80%] grid grid-cols-5 my-auto text-center ">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="py-4 border border-cus-black bg-cus-dark-gray animate-pulse "
              >
                loading.. kategori
              </div>
            ))}
          </nav>
        ) : (
          <nav className="w-[80%]  grid grid-cols-5 my-auto text-center">
            {kategori.map((item, index) => (
              <div
                key={index}
                className={` py-4 border border-cus-black cursor-pointer ${
                  activeCategory === item.nama ? "bg-cus-dark-gray" : ""
                }`}
                onClick={() => handleActiveCategory(item.nama)}
              >
                {item.nama}
              </div>
            ))}
          </nav>
        )}
      </div>
      <div className="flex w-full items-center">
        {timeLeft !== null ? (
          <div className="flex flex-col w-[10rem] py-2 px-4">
            {formatTime(timeLeft)}
          </div>
        ) : (
          <></>
        )}
        <div className="ml-auto">
          <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
        </div>
      </div>
    </section>
  );
}
