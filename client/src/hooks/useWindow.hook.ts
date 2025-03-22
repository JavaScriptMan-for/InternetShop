import { WindowSize } from "../../types/hooks.type";
import { useState, useEffect } from "react";


export const useWindow = () => {
      const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    useEffect(()=> {
        const handleResize = () => {
          setWindowSize(prevSize => ({ 
            ...prevSize,
            width: window.innerWidth,
            height: window.innerHeight,
        }));
        };
      
        window.addEventListener('resize', handleResize);
      
        return () => {
            window.removeEventListener('resize', handleResize);
        };
      }, []);
      return windowSize;
}