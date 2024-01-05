import { useState, useEffect } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function getDocumentDimensions() {
  const { scrollWidth, offsetWidth, scrollHeight, offsetHeight } =
    document.body;
  return {
    width: Math.max(scrollWidth, offsetWidth),
    height: Math.max(scrollHeight, offsetHeight),
  };
}

export function useDocumentDimensions() {
  const [documentDimensions, setDocumentDimensions] = useState(
    getDocumentDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setDocumentDimensions(getDocumentDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return documentDimensions;
}
