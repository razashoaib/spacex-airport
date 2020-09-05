import React from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import "./main.css";
import ControlConsoleForTablet from "./ControlConsole/ControlConsoleForTablet";
import ControlConsole from "./ControlConsole/ControlConsole";
import {
  CAPSULE_DATA_DISPLAY_MODE,
  LANPAD_DATA_DISPLAY_MODE,
  setCapsulesData,
  setDisplayMode,
  setLanpadData,
  setLoading,
} from "../../redux/actions";
import { useDispatch } from "react-redux";

const MasterConsole = () => {
  const dispatch = useDispatch();

  const handleCapsulesClicked = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get("http://localhost:4000/spacex");
      console.log("👉 Returned data:", response.data);
      dispatch(setDisplayMode(CAPSULE_DATA_DISPLAY_MODE));
      dispatch(setLoading(false));
      dispatch(setCapsulesData(response.data));
    } catch (e) {
      dispatch(setDisplayMode(CAPSULE_DATA_DISPLAY_MODE));
      dispatch(setLoading(false));
      dispatch(setCapsulesData(e.message));
      console.log(`😱 Axios request failed: ${e}`);
    }
  };

  const handleLandingPadClicked = async (landingPadId) => {
    if (landingPadId.trim().length > 0) {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          `http://localhost:4000/spacex/landing_pad?id=${landingPadId}`
        );
        console.log("👉 Returned data:", response.data);
        dispatch(setDisplayMode(LANPAD_DATA_DISPLAY_MODE));
        dispatch(setLoading(false));
        dispatch(
          setLanpadData({
            id: response.data.id,
            full_name: response.data.full_name,
            status: response.data.status,
            location: response.data.location,
          })
        );
      } catch (e) {
        dispatch(setDisplayMode(LANPAD_DATA_DISPLAY_MODE));
        dispatch(setLoading(false));
        dispatch(setLanpadData(e.message));
        console.log(`😱 Axios request failed: ${e}`);
      }
    }
  };

  const validateLandingPadId = (val) => {
    return /[#.,/;$%&?]/gm.test(val);
  };

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  return (
    <div className={isDesktopOrLaptop ? "wrapper" : "wrapper-for-tablet"}>
      {isDesktopOrLaptop ? (
        <ControlConsole
          onCapsuleClick={() => handleCapsulesClicked()}
          onLandingPadClick={(id) => handleLandingPadClicked(id)}
          validateLandingPadId={(e) => validateLandingPadId(e)}
        />
      ) : (
        <ControlConsoleForTablet
          onCapsuleClick={() => handleCapsulesClicked()}
          onLandingPadClick={(id) => handleLandingPadClicked(id)}
          validateLandingPadId={(e) => validateLandingPadId(e)}
        />
      )}
    </div>
  );
};

export default MasterConsole;
