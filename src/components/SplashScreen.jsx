import React, {useEffect, useState} from "react";

export default function SplashScreen({ onFinish }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onFinish();
        }, 2000); // Display for 2 seconds

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!visible) return null;

 return (
<div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-amber-200 to-amber-400 text-brown-800 text-3xl font-bold">
    <div className="animate-pulse">Sudoku by Mabyyy</div>
</div>
 );
}