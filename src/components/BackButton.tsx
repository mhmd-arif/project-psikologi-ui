import { useRouter } from "next/navigation";
import { ButtonProps } from "react-bootstrap";
import Image from "next/image";

const BackButton = ({ ...rest }) => {
  const handleClick = () => {
    window.history.back();
  };

  return (
    <button className="custom-btn self-start" onClick={handleClick}>
      Kembali
      <Image
        src={"/arrow-back.svg"}
        alt="arrow"
        width={100}
        height={100}
        className="w-full flip-x"
      />
    </button>
  );
};

export default BackButton;
