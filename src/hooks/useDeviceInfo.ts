import { useState, useEffect } from "react";

type DeviceInfo = {
  deviceType: "phone" | "tablet" | "desktop";
  orientation: "portrait" | "landscape";
};

const useDeviceInfo = (): DeviceInfo => {
  const getDeviceInfo = (): DeviceInfo => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    let deviceType: "phone" | "tablet" | "desktop";
    if (width <= 480) {
      deviceType = "phone";
    } else if (width <= 1024) {
      deviceType = "tablet";
    } else {
      deviceType = "desktop";
    }

    const orientation = height >= width ? "portrait" : "landscape";

    return { deviceType, orientation };
  };

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo);

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceInfo;
};

export default useDeviceInfo;
