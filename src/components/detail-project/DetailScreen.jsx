import React, { useState, useEffect } from "react";
import "../../styles/DetailSceen.css";
import { useParams } from "react-router-dom";
import { getProject } from "../../api/project.js";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  useMediaQuery,
  Card,
  Box,
  Button,
} from "@mui/material";
import TopContainer from "./topContainer.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Delta from "quill-delta";
import InfoContainer from "./InfoContainer.jsx";
import { fetchUserProfile } from "../../api/profile.js";
import TimeLine from "./TimeLine.jsx";
import CalculatorWidget from "./CalculatorContainer.jsx";
import CalculatorContainer from "./CalculatorContainer.jsx";
import AttachmentsContainer from "./AttachmentsContainer";
import BuildCommentWidget from "./commentContainer.jsx";
import Cookies from "js-cookie";
import Inviter from "./Inviters.jsx";
import Warranty from "./warranty.jsx";

const DetailScreen = ({ scrollController }) => {
  const { uuid } = useParams();
  const { uuidInvite } = useParams();
  console.log(uuidInvite);
  const [project, setProject] = useState(null);
  const [show, setShow] = useState(null);
  const [name, setFullName] = useState(localStorage.getItem("userFullName"));
  const token = Cookies.get("flutter.token");
  const isMobile = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectData = await getProject(uuid);
        setProject(projectData);
      } catch (error) {}
    };

    const getUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setShow(true);
      } catch (err) {
        if (
          err.message === "Unauthenticated." ||
          err.message === "No token found"
        ) {
          localStorage.clear();
          setShow(false);
        } else {
          setError(err.message);
        }
      } finally {
      }
    };
    getUserProfile();
    fetchProjectData();
  }, [uuid]);

  if (!project) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  const quillDelta = new Delta(JSON.parse(project.description));
  return (

    <Container maxWidth="lg" style={{ overflowX: "hidden" }}>
      <Grid container spacing={3} sx={{ marginTop: isMobile ? "25%" : "7%" }}>
        {isMobile ? (
          <>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <Swiper
                  pagination={{
                    dynamicBullets: true,
                  }}
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  {project.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={
                          image.original_url ||
                          "../assets/images/placeholder.jpg"
                        }
                        alt="Project"
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          justifyItems: "center",
                          display: "flex",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <TopContainer project={project} bool={show} uuidInvite={uuidInvite}/>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={4}>
              <TopContainer project={project} bool={show} uuidInvite={uuidInvite}/>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3 }}>
                <Swiper
                  pagination={{
                    dynamicBullets: true,
                  }}
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  {project.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={
                          image.original_url ||
                          "../assets/images/placeholder.jpg"
                        }
                        alt="Project"
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          justifyItems: "center",
                          display: "flex",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={2}>
        {isMobile ? (
          <>
            <Grid item xs={12}>
              <Typography className="detail-title" sx={{ my: 2 }}>
                جزئیات طرح
              </Typography>
              <Card className="detail-card" sx={{ borderRadius: "15px" }}>
                <ReactQuill
                  value={quillDelta}
                  readOnly={true}
                  className="react-quill"
                  theme="bubble"
                  modules={{ toolbar: false }}
                  style={{
                    lineHeight: 1.6,
                    textAlignLast: "right",
                    direction: "rtl",
                    backgroundColor: "#fff",
                    textAlign: "justify",
                  }}
                />
                <Button variant="contained" color="error" sx={{ ml: "20px" }}>
                  <a
                    href="https://smartfunding.ir/ticket/3"
                    style={{ color: "white", fontSize: "12px" }}
                  >
                    ثبت تخلف
                  </a>
                </Button>
              </Card>
            </Grid>

            <Grid item xs={12}>
              {project.properties.length > 0 ? (
                <Typography className="detail-title">جزییات طرح</Typography>
              ) : null}
              <InfoContainer project={project} isDesktop={!isMobile} />

              {project.time_table && project.time_table.length > 0 && (
                <>
                  <Typography className="detail-title">
                    زمان بندی طرح
                  </Typography>
                  <TimeLine project={project} />
                </>
              )}
              {project.warranty && (
                <>
                  <Typography className="detail-title">ضمانت نامه</Typography>
                  <Warranty warranty={project.warranty} />
                </>
              )

              }
              <Typography className="detail-title">محاسبه گر</Typography>
              <CalculatorContainer
                project={project}
                width="100%"
                height="auto"
              />
              <Inviter projectUuid={project.uuid} project={project} />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={4} sx={{ marginTop: 8 }}>
              <InfoContainer project={project} isDesktop={!isMobile} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
              >
                {project.warranty && (
                  <>
                   <Typography className="detail-title" sx={{ my: 2 }}>
                ضمانت نامه
              </Typography>
                <Warranty warranty={project.warranty} />
                  </>
                )

                }
                {project.time_table && project.time_table.length > 0 && (
                  <>
                    <Typography className="detail-title" sx={{ my: 2 }}>
                      زمان بندی طرح
                    </Typography>
                    <TimeLine project={project} />
                  </>
                )}
                
                <Typography className="detail-title" sx={{ my: 2 }}>
                  محاسبه گر
                </Typography>
                <CalculatorContainer
                  project={project}
                  width="100%"
                  height="auto"
                />
                <Inviter projectUuid={project.uuid} project={project} />
              </div>
            </Grid>
            <Grid item xs={12} md={8} sx={{ marginBottom: "10px" }}>
              <Typography className="detail-title" sx={{ my: 2 }}>
                جزئیات طرح
              </Typography>
              <Card
                className="detail-card"
                sx={{
                  borderRadius: "15px",
                  textAlign: "justify",
                  justifyItems: "",
                }}
              >
                <ReactQuill
                  value={quillDelta}
                  readOnly={true}
                  className="react-quill"
                  theme="bubble"
                  modules={{ toolbar: false }}
                />
                <Button variant="contained" color="error">
                  <a
                    href="https://smartfunding.ir/ticket/3"
                    style={{ color: "white", fontSize: "14px" }}
                  >
                    ثبت تخلف
                  </a>
                </Button>
              </Card>
              {show ? (
                <AttachmentsContainer attachments={project.attachments} />
              ) : null}
              {show && name ? <BuildCommentWidget project={project} /> : null}
            </Grid>
          </>
        )}
      </Grid>
      {isMobile && (
        <>
          {show ? (
            <AttachmentsContainer attachments={project.attachments} />
          ) : null}
          {show && name ? <BuildCommentWidget project={project} /> : null}
        </>
      )}

      <Box sx={{ height: 90 }} />
    </Container>
  );
};

export default DetailScreen;
