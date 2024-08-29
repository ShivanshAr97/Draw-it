"use client";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import rough from "roughjs/bundled/rough.esm.js";

const generator = rough.generator();

const Board = ({
  canvasRef,
  ctx,
  color,
  setElements,
  elements,
  tool,
  canvasColor,
  strokeWidth,
  updateCanvas,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [eraser, setEraser] = useState(false);
  const [textInput, setTextInput] = useState({ text: "", x: 0, y: 0 });
  const [isTextMode, setIsTextMode] = useState(false);
  const inputRef = useRef(null);


function drawRectangle(ele) {
  roughCanvas.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
    strokeWidth: ele.strokeWidth,
    roughness: 1,
    stroke: ele.stroke,
  });
}

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    const context = canvas.getContext("2d");

    context.strokeWidth = 30;
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = 5;
    ctx.current = context;
  }, [color]);

  useEffect(() => {
    const savedElements = JSON.parse(localStorage.getItem("elements"));
    if (savedElements) {
      setElements(savedElements);
    }
  }, [setElements]);

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    if (elements.length > 0) {
      ctx.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
    elements.forEach((ele) => {
      if (ele.element === "rect") {
        
        roughCanvas.draw(
          generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: ele.strokeWidth,
          })
        );
      } else if (ele.element === "line") {
        roughCanvas.draw(
          generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: ele.strokeWidth,
          })
        );
      } else if (ele.element === "pencil") {
        roughCanvas.linearPath(ele.path, {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: ele.strokeWidth,
        });
      } else if (ele.element === "circle") {
        roughCanvas.draw(
          generator.ellipse(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: ele.strokeWidth,
          })
        );
      } else if (ele.element === "eraser") {
        roughCanvas.linearPath(ele.path, {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: ele.strokeWidth,
        });
      } else if (ele.element === "text") {
        ctx.current.font = `${ele.fontSize}px Serif`;
        ctx.current.fillStyle = ele.stroke;
        ctx.current.fillText(ele.text, ele.offsetX, ele.offsetY);
      }
    });
  }, [elements]);

  const handleMouseDown = (e) => {
    let offsetX;
    let offsetY;
    if (e.touches) {
      const bcr = e.target.getBoundingClientRect();
      offsetX = e.targetTouches[0].clientX - bcr.x;
      offsetY = e.targetTouches[0].clientY - bcr.y;
    } else {
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }

    if (tool === "pencil" || tool === "eraser") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: tool === "eraser" ? canvasColor : color,
          element: tool,
          strokeWidth: tool === "eraser" ? Math.max(strokeWidth, 30) : strokeWidth,
        },
      ]);
    } else if (tool === "text") {
      setTextInput({ text: "", x: offsetX, y: offsetY });
      setIsTextMode(true);
    } else {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          stroke: color,
          element: tool,
          strokeWidth,
        },
      ]);
    }
    setIsDrawing(true);
  };

  const handleTextSubmit = () => {
    if (textInput.text.trim() !== "") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX: textInput.x,
          offsetY: textInput.y,
          text: textInput.text,
          stroke: color,
          element: "text",
          fontSize: strokeWidth*1.5,
        },
      ]);
      setTextInput({ text: "", x: 0, y: 0 });
      setIsTextMode(false);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    localStorage.setItem("elements", JSON.stringify(elements));
  };

  const handleMouseMove = (e) => {
    setEraser({
      x: e.clientX,
      y: e.clientY,
    });

    if (!isDrawing) return;

    let offsetX;
    let offsetY;
    if (e.touches) {
      const bcr = e.target.getBoundingClientRect();
      offsetX = e.targetTouches[0].clientX - bcr.x;
      offsetY = e.targetTouches[0].clientY - bcr.y;
    } else {
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }

    if (tool === "rect") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
                stroke: ele.stroke,
                element: ele.element,
                strokeWidth: ele.strokeWidth,
              }
            : ele
        )
      );
    } else if (tool === "line") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX,
                height: offsetY,
                stroke: ele.stroke,
                element: ele.element,
                strokeWidth: ele.strokeWidth,
              }
            : ele
        )
      );
    } else if (tool === "pencil" || tool === "eraser") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                path: [...ele.path, [offsetX, offsetY]],
                stroke: ele.stroke,
                element: ele.element,
                strokeWidth: ele.strokeWidth,
              }
            : ele
        )
      );
    } else if (tool === "circle") {
      const radius = Math.sqrt(
        Math.pow(offsetX - elements[elements.length - 1].offsetX, 2) +
          Math.pow(offsetY - elements[elements.length - 1].offsetY, 2)
      );
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: 2 * radius,
                height: 2 * radius,
                stroke: ele.stroke,
                element: ele.element,
                strokeWidth: ele.strokeWidth,
              }
            : ele
        )
      );
    }
  };

  useEffect(() => {
    if (isTextMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTextMode]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      className="absolute top-0 left-0 w-screen h-screen"
    >
      <canvas
        ref={canvasRef}
        className={`absolute w-screen h-screen ${
          tool === "eraser" ? "cursor-none" : "cursor-crosshair"
        } `}
        style={{ backgroundColor: canvasColor }}
      />
      {isTextMode && (
        <input
          ref={inputRef}
          type="text"
          style={{
            position: "absolute",
            left: textInput.x,
            top: textInput.y-strokeWidth*1.5,
            fontSize: strokeWidth*1.5,
            fontFamily:"serif",
            color: color,
            background: "transparent",
            border: "none",
            outline: "none",
            zIndex: 10,
          }}
          autoFocus
          className=""
          value={textInput.text}
          onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
          onBlur={handleTextSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTextSubmit();
            }
          }}
        />
      )}

      <div
        className="eraser pointer-events-none bg-black"
        style={{
          display: tool === "eraser" ? "block" : "none",
          left: eraser.x,
          top: eraser.y,
          minHeight: `30px`,
          minWidth: `30px`,
          height: `${strokeWidth}px`,
          width: `${strokeWidth}px`,
        }}
      />
    </div>
  );
};

export default Board;