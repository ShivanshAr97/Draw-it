"use client";

import { tools } from "@/assets";
import { TwitterPicker, SliderPicker } from "react-color";
import { useEffect,useState } from "react";
import { LuUndo2, LuRedo2 } from "react-icons/lu";
import { FaRegSave } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { RxBorderWidth } from "react-icons/rx";
import { VscColorMode } from "react-icons/vsc";
import Login from "./Login";

const Toolbar = ({
  color,
  tool,
  setColor,
  setTool,
  elements,
  setElements,
  history,
  setHistory,
  canvasRef,
  strokeWidth,
  setStrokeWidth,
  canvasColor,
  setCanvasColor,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  

  const saveCanvas = (event) => {
    let link = event.currentTarget;
    link.setAttribute("download", "canvas.png");
    let image = canvasRef.current.toDataURL("image/png", 0.5);
    console.log(image);
    link.setAttribute("href", image);
  };

  const handleCanvasColorChange = (color) => {
    setCanvasColor(color);
    localStorage.setItem('canvasColor', color); // Save the color to local storage
  };

  useEffect(() => {
    const savedColor = localStorage.getItem('canvasColor');
    if (savedColor) {
      setCanvasColor(savedColor);
    }
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = canvasColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
    setHistory([]);
    localStorage.removeItem('elements')
  };

  const undo = () => {
    if (elements.length < 1) return;
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.filter((ele, index) => index !== elements.length - 1)
    );
  };

  const redo = () => {
    if (history.length < 1) return;
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) =>
      prevHistory.filter((ele, index) => index !== history.length - 1)
    );
  };

  return (
    <div className="border z-20">
      <div className=" p-5 justify-between w-[8rem] border-r h-screen bg-white gap-5 md:gap-8 ">
        <h1 className=" select-none hidden md:block ml-2 font-bold text-ld">
          Draw It !
        </h1>
        <div className=" gap-4 md:gap-8">
          <div className="grid grid-cols-2 rounded-lg p-1 gap-1">
            {tools.map((item, index) => (
              <>
                <button
                  title={item.title}
                  key={index}
                  className={`border mt-3 flex text-xl flex-row items-center rounded-lg justify-center p-2 border-black  cursor-pointer ${
                    item.value === tool
                      ? "bg-green-400 text-black"
                      : "text-[#464a53] hover:bg-slate-400"
                  }`}
                  onClick={() => setTool(item.value)}
                >
                  {item.icon}
                </button>
              </>
            ))}
            <div
              className=" relative flex items-center my-2 border border-[#464a53] rounded-md w-[5rem] justify-center "
              title="Pick color"
            >
              <div
                style={{ backgroundColor: color }}
                className="rounded-md h-8 border-black w-[5rem] cursor-pointer"
                onClick={() => setShowColorPicker(true)}
              ></div>
              {showColorPicker && (
                <div className="absolute top-12 left-0 flex flex-col ">
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowColorPicker(false)}
                  ></div>
                  <TwitterPicker
                    className=" z-40 border"
                    color={color}
                    onChangeComplete={(color) => setColor(color.hex)}
                    colors={[
                      "#f44336",
                      "#e91e63",
                      "#f70707",
                      "#9c27b0",
                      "#673ab7",
                      "#3f51b5",
                      "#2196f3",
                      "#03a9f4",
                      "#00bcd4",
                      "#009688",
                      "#4caf50",
                      "#8bc34a",
                      "#cddc39",
                      "#ffeb3b",
                      "#ffc107",
                      "#ff9800",
                      "#ff5722",
                      "#795548",
                      "#607d8b",
                      "#000000",
                      "#ffffff",
                    ]}
                  />
                  <SliderPicker
                    width="276px"
                    className=" z-40"
                    color={color}
                    onChangeComplete={(color) => setColor(color.hex)}
                  />
                </div>
              )}
            </div>
          </div>
          <div className=" border border-[#464a53] flex mb-4 rounded-lg px-1 gap-1">
            <button
              onClick={undo}
              className="flex -ml-1 flex-col text-xl items-center rounded-lg justify-center p-2 border-black  cursor-pointer  text-[#464a53] hover:bg-slate-400"
            >
              <LuUndo2 />
            </button>
            <div className="border-[#464a53] border-r h-6 mt-[5px]" />
            <button
              onClick={redo}
              className="flex text-xl flex-col items-center rounded-lg justify-center p-2 border-black  cursor-pointer text-[#464a53] hover:bg-slate-400"
            >
              <LuRedo2 />
            </button>
          </div>

          <div className="rounded-lg p-1 gap-1">
            <div className="flex">
              <button
                onClick={clearCanvas}
                className="border border-[#464a53] bg-red-400 items-center rounded-lg justify-center p-2 cursor-pointer text-[#464a53] text-md hover:bg-slate-400"
              >
                <MdDeleteOutline/>
              </button>

              <a
                onClick={saveCanvas}
                className="border border-[#464a53] bg-green-500 mx-1 items-center align-middle rounded-lg justify-center p-2 cursor-pointer text-[#464a53] text-md hover:bg-slate-400"
              >
                <FaRegSave />
              </a>
            </div>

            <div className="  my-4" />
            <div className="flex text-[#464a53] my-2 gap-2 w-fit mx-auto items-center align-middle">
              <RxBorderWidth size="20px" />
              <p className="">{strokeWidth}</p>
            </div>
            <input
              className="w-20 -ml-[0.2rem] bg-[#464a53] cursor-pointer"
              onChange={(e) => setStrokeWidth(e.target.value)}
              type="range"
              value={strokeWidth}
              min={0}
              max="50"
            />
            <div
              className="text-sm font-semibold ml-2 items-center rounded-lg justify-center py-2 text-[#464a53]
            "
            >
              <p className="mb-2 ">Bg Color</p>
              <div className="grid grid-cols-2 gap-1 -mx-1">
                <button
                  onClick={() => handleCanvasColorChange("#effaf6")}
                  className={`w-8 h-8 rounded-lg border border-black bg-[#effaf6] cursor-pointer ${
                    canvasColor === "#effaf6" ? " border-black border" : ""
                  }`}
                ></button>
                <button
                  onClick={() => handleCanvasColorChange("#0c0c0d")}
                  className={`w-8 h-8 rounded-lg bg-[#0c0c0d] cursor-pointer ${
                    canvasColor === "#0c0c0d" ? " border-black border" : ""
                  }`}
                ></button>
                <button
                  onClick={() => handleCanvasColorChange("#3a393f")}
                  className={`w-8 h-8 rounded-lg bg-[#3a393f] cursor-pointer ${
                    canvasColor === "#3a393f" ? " border-black border" : ""
                  }`}
                ></button>
                <button
                  onClick={() => handleCanvasColorChange("#121212")}
                  className={`w-8 h-8 rounded-lg bg-[#121212] cursor-pointer ${
                    canvasColor === "#121212" ? " border-black border" : ""
                  }`}
                ></button>
              </div>
            </div>
            <Login/>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
};

export default Toolbar;
