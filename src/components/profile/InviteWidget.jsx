import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Pagination,
  Button,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { Add_Commas, En_To_Fa } from "persian_util/build/parser";
import JalaliDateConverter from "../../utils/PersianDateConverter.jsx";
import { fetchUserInvitesByProjectUUid } from "../../api/profile.js"; // Adjust this import according to your project structure
import { XMarkIcon } from "@heroicons/react/16/solid";

const InviteWidget = ({ user, projects }) => {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const fontSize = isMobile ? "10px" : "12px";

  const [selectedProject, setSelectedProject] = useState("");
  const [invites, setInvites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5); // Number of invites per page
  const [totalInvites, setTotalInvites] = useState(0); // Total invites for pagination

  useEffect(() => {
    setInvites(user.invites);
    setTotalInvites(user.invites.length); // Set total invites based on user's data
  }, [user]);

  const handleProjectChange = async (event) => {
    const projectUUID = event.target.value;
    setSelectedProject(projectUUID);
    fetchInvitesForProject(projectUUID, 1); // Fetch first page when project changes
  };

  const clearSelectedProject = () => {
    setSelectedProject("");
    setInvites(user.invites); // Reset invites to user's invites
    setTotalInvites(user.invites.length);
    setCurrentPage(1); // Reset page
  };

  const fetchInvitesForProject = async (projectUUID, page) => {
    try {
      const fetchedInvites = await fetchUserInvitesByProjectUUid(
        projectUUID,
        perPage,
        page
      );
      setInvites(fetchedInvites.data);
      setCurrentPage(fetchedInvites.current_page);
      setTotalInvites(fetchedInvites.total); // Update total invites for pagination
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    if (selectedProject) {
      fetchInvitesForProject(selectedProject, page);
    }
  };

  return (
    <Box
      sx={{
        pr: 2,
        overflow: "hidden",
        fontSize,
        transition: "height 0.4s ease-in-out",
      }}
    >
      {user.roles != [] &&
        user.roles.length > 0 &&
        user.roles[0].name == "inviter" && (
          <div
            style={{
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            <>
              <FormControl
                fullWidth
                sx={{ mb: 2, mt: 2, position: "relative" }}
                variant="outlined"
              >
                <Box display="flex" alignItems="center">
                  <InputLabel id="project-select-label">انتخاب طرح</InputLabel>
                  <Select
                    labelId="project-select-label"
                    sx={{ fontSize, flexGrow: 1 }}
                    value={selectedProject}
                    label="انتخاب طرح"
                    onChange={handleProjectChange}
                  >
                    {projects.map((project) => (
                      <MenuItem
                        key={project.uuid}
                        value={project.uuid}
                        sx={{ fontSize }}
                      >
                        {project.title}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </FormControl>
              {selectedProject && (
                <Button
                  sx={{
                    position: "absolute",
                    right: "-40px",
                    fontSize,
                    scale: "0.6",
                  }}
                  onClick={clearSelectedProject}
                >
                  <XMarkIcon size={20} color="primary" />
                </Button>
              )}
            </>
          </div>
        )}

      <List sx={{ fontSize }}>
        {invites.length == 0 ? (
          <div
            style={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize }}>
              برای این طرح دعوتی نداشته اید.
            </Typography>
          </div>
        ) : (
          invites.map((invite, index) => {
            const badge =
              invite.projects &&
              invite.projects.length > 0 &&
              user.roles.length > 0;
            return (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon
                      sx={{ fontSize: "30px" }}
                      color={badge ? "primary" : "action"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ fontSize }}
                    primary={invite.full_name}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: fontSize,
                        fontWeight: "bold",
                        color: "GrayText",
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: { display: "flex", flexDirection: "row" },
                    }}
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "9px", lineHeight: "20px" }}
                          color="textSecondary"
                        >
                          تاریخ ثبت نام:{" "}
                          <JalaliDateConverter isoDate={invite.created_at} />
                        </Typography>
                        <Typography
                          sx={{ fontSize: "9px" }}
                          color="textSecondary"
                        >
                          وضعیت: {badge ? "سرمایه گذاری داشته" : "ثبت نام کرده"}
                        </Typography>
                        {badge && (
                          <>
                            <Typography
                              sx={{ fontSize: "9px" }}
                              color="textSecondary"
                            >
                              میزان سرمایه گذاری:{" "}
                              {Add_Commas(
                                invite.projects[0].pivot.amount.toString()
                              )}{" "}
                              تومان
                            </Typography>
                          </>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            );
          })
        )}
      </List>

      {/* Pagination */}
      <>
      <div style={{textAlign:'center' }}>
        <Typography  sx={{fontSize}}>
        تعداد دعوت شده <Typography variant="span" color="primary" sx={{backgroundColor:'primary' , fontSize:'14px'}}>{totalInvites}</Typography> نفر
        </Typography>
      </div>
      <div style={{alignItems:'center' , margin:'0 auto' , display:'flex' , justifyContent:'center' , paddingBottom:'20px'}}>
      {selectedProject && (
        <Pagination
          count={Math.ceil(totalInvites / perPage)}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          variant="outlined"
          color="primary"
          size="small"
          sx={{ mt: 2, fontSize }}
        />
      )}
      </div>
    
      </>
    </Box>
  );
};

export default InviteWidget;
