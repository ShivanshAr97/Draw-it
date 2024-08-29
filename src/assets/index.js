import { BsPencil } from "react-icons/bs";
import { AiOutlineLine } from "react-icons/ai";
import { MdOutlineRectangle } from "react-icons/md";
import { BsCircle } from "react-icons/bs";
import { BiEraser } from "react-icons/bi";
import { PiTextT } from "react-icons/pi";

export const tools = [
  {
    title: "Pencil",
    icon: <BsPencil />,
    value: "pencil",
  },
  {
    title:"Text",
    icon:<PiTextT />,
    value:"text"
  },
  {
    title: "Line",
    icon: <AiOutlineLine />,
    value: "line",
  },
  {
    title: "Rectangle",
    icon: <MdOutlineRectangle />,
    value: "rect",
  },
  {
    title: "Circle",
    icon: <BsCircle />,
    value: "circle",
  },
  {
    title: "Eraser",
    icon: <BiEraser />,
    value: "eraser",
  },
  
]; // tools
