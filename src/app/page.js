"use client";
import Board from "@/components/Board";
import Toolbar from "@/components/Toolbar";
import { useRef, useState, useEffect } from "react";
import Loading from "./loading";

export default function Home({ params }) {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#ffffff");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");
  const [canvasColor, setCanvasColor] = useState("#0c0c0d");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
  
      return () => clearTimeout(timeout);
    }, []);
  
    if (isLoading) {
      return <Loading />;
    }

    
  return (
    <div className=" relative">
      <div className=" fixed top-0 z-20">
        <Toolbar
          color={color}
          setColor={setColor}
          tool={tool}
          setTool={setTool}
          history={history}
          setHistory={setHistory}
          elements={elements}
          setElements={setElements}
          canvasRef={canvasRef}
          canvasColor={canvasColor}
          setCanvasColor={setCanvasColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          params={params}
        />
      </div>
      <Board
        canvasRef={canvasRef}
        ctx={ctx}
        color={color}
        tool={tool}
        elements={elements}
        setElements={setElements}
        history={history}
        setHistory={setHistory}
        canvasColor={canvasColor}
        strokeWidth={strokeWidth}
      />
    </div>
  );
}
