import { Avatar } from "@mui/material";
import { MY_LINKEDIN_PROFILE } from "../utils/Constants";
import { useEffect, useState } from "react";

/**
 * Component that displays an Avatar that is only visible when the user
 * has scrolled to the top of the page.
 **/
const ScrollSensitiveAvatar: React.FC = () => {
  const [showAvatar, setShowAvatar] = useState(true);

  useEffect(() => {
    const scrollDiv = document.getElementById("root");
    const handleScroll = () => {
      // Update state based on scroll position
      if (scrollDiv?.scrollTop === 0) {
        setShowAvatar(true);
      } else {
        setShowAvatar(false);
      }
    };

    console.log("ADDING SCROLL EVENT LISTENER");
    scrollDiv?.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      scrollDiv?.removeEventListener("scroll", handleScroll);
    };
  }, []);
  console.log("showAvatar:", showAvatar);

  if (showAvatar) {
    return (
      <Avatar
        alt="Ignacio Santos"
        sx={{ bgcolor: "lightblue" }}
        className="avatar"
      >
        <a href={MY_LINKEDIN_PROFILE}>IS</a>
      </Avatar>
    );
  }
};

export default ScrollSensitiveAvatar;
