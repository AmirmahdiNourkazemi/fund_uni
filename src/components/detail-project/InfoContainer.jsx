import React from "react";
import { Card, Typography, Divider } from "@mui/material";

const InfoContainer = ({ project, isDesktop }) => {
  if (!project || !project.properties || project.properties.length === 0) {
    return null;
  }

  return (
    <div>
      <Card
        style={{ padding: "20px", marginBottom: "20px", boxShadow: 3 }}
        sx={{ borderRadius: 5 }}
      >
        {project.properties.map((property, index) => (
          <div key={index}>
            {property.value.length > 30 ? (
              <>
                {index !== 0 && <Divider style={{ margin: "10px 0" }} />}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: isDesktop ? "14px" : "12px",
                    }}
                  >
                    {property.key}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: isDesktop ? "14px" : "12px",
                      color: "GrayText",
                    }}
                  >
                    {property.value}
                  </Typography>
                </div>
              </>
            ) : (
              <>
                {index !== 0 && <Divider style={{ margin: "10px 0" }} />}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: isDesktop ? "14px" : "12px",
                    }}
                  >
                    {property.key}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: isDesktop ? "14px" : "12px",
                      color: "GrayText",
                    }}
                  >
                    {property.value}
                  </Typography>
                </div>
              </>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
};

export default InfoContainer;
