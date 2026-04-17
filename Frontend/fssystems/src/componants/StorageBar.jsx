import { useEffect, useState } from "react";

function StorageBar({ username }) {
    const [used, setUsed] = useState(0);

    const MAX = 5 * 1024 * 1024 * 1024; // 5GB

    const fetchStorage = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/storage/${username}`);
        const data = await res.json();
        setUsed(data.totalBytes);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStorage();

        //refresh every 3 sec
        const interval = setInterval(fetchStorage, 3000);

        return () => clearInterval(interval);
    }, []);

    const percent = (used / MAX) * 100;

    const format = (bytes) => {
        const mb = bytes / (1024 * 1024);
        if (mb >= 1024) return (mb / 1024).toFixed(2) + " GB";
        return mb.toFixed(2) + " MB";
    };

    return (
        <div style={{ width: "300px" }}>
            <p>
                {format(used)} / 5 GB    {/* 5gb is fixed for now */}
            </p>

            <div style={{
                width: "100%",
                height: "10px",
                background: "#ddd",
                borderRadius: "5px"
            }}>
                <div style={{
                    width: `${percent}%`,
                    height: "100%",
                    background: percent > 80 ? "red" : "green",
                    borderRadius: "5px"
                }} />
            </div>
        </div>
    );
}

export default StorageBar;