import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material"; // Assuming you're using MUI
import GaugeComponent from "react-gauge-component";
import { useMediaQuery } from "@mui/material";
import WarrantyDialog from "./warrantyDialog";
import { getWarranty } from "../../api/warranty";

const Warranty = ({ warranty }) => {
  const [open, setOpen] = useState(false);
  const [allWarranties, setAllWarranties] = useState([]);
  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const data = await getWarranty();
        setAllWarranties(data);
      } catch (error) {
        console.error("Failed to fetch warranties:", error);
      }
    };

    fetchWarranties();
  }, []);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const isMobile = useMediaQuery("(max-width: 900px)");
  const fontSize = isMobile ? "12px" : "14px";
  // Assume warranty.position is between 1 and 6
  const gaugeValue = warranty.position; // Position 1 to 6

  // Reverse the color mapping (1 = red, 6 = green)
  const colorArray = [
    "#3b93f7",
    "#2385f6",
    "#0a78f5",
    "#096cdc",
    "#0860c4",
    "#0754ab",
  ];

  // Adjust the subArcs to cover equal portions of the gauge (each position corresponds to ~16.6% of the arc)
  const subArcs = [
    { limit: 16.6 }, // Represents ~1/6th of the gauge (Position 1)
    { limit: 33.3 }, // Represents ~2/6th of the gauge (Position 2)
    { limit: 50 }, // Represents ~3/6th of the gauge (Position 3)
    { limit: 66.6 }, // Represents ~4/6th of the gauge (Position 4)
    { limit: 83.3 }, // Represents ~5/6th of the gauge (Position 5)
    { limit: 100 }, // Represents full gauge (Position 6)
  ];

  // Calculate the midpoint for the pointer within the corresponding arc
  const gaugeValueMidPoint = (6 - gaugeValue) * (100 / 6) + 100 / 12;

  return (
    <>
      <Box
        onClick={handleClickOpen}
        style={{ padding: "10px", cursor: "pointer" }}
        sx={{
          borderRadius: 5,
          boxShadow: 2,
          marginBottom: "20px",
          textAlign: "center",
          position: "relative",
          backgroundColor: "white",
        }}
      >
         <Typography sx={{ fontSize: fontSize, fontWeight: "bold" }}>
              {warranty.title}
            </Typography>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            width: "80%",
          }}
        >
          <GaugeComponent
            labels={{
              tickLabels: {
                hideMinMax: true,
              },
              valueLabel: {
                hide: true,
              },
            }}
            type="semicircle"
            arc={{
              width: 0.15,
              colorArray: colorArray, // Custom colors for each position
              padding: 0.02, // Space between arcs
              subArcs: subArcs, // Define 6 sub-arc sections covering the full range of the gauge
            }}
            pointer={{
              type: "needle", // Blob style pointer
              animationDelay: 0, // Instant pointer movement
              color: colorArray[gaugeValue - 1], // Pointer color changes based on position
            }}
            value={gaugeValueMidPoint} // Middle point of the gauge section based on the position
            minValue={0} // Minimum value of the gauge (0%)
            maxValue={100} // Maximum value of the gauge (100%)
          />

          {/* Overlay warranty.title on top of the gauge */}
          <div
            style={{
              position: "absolute",
              top: "70%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
            }}
          >
           
          </div>
        </div>
      </Box>

      <WarrantyDialog
        open={open}
        onClose={handleClose}
        warranties={allWarranties}
      />
    </>
  );
};

export default Warranty;
