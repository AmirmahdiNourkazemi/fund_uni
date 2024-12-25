// // Investers.jsx
// import React, { useEffect, useState } from "react";
// import { getInvesters } from "../../api/project"; // Import your API function
// import {
//   Card,
//   Typography,
//   Dialog,
//   DialogContent,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   useMediaQuery,
//   Avatar,
//   ListItemAvatar,
//   DialogTitle,
//   Pagination,
// } from "@mui/material";
// // Assuming you're using phosphor icons
// import { TrendUp, User } from "@phosphor-icons/react";
// import JalaliDateConverter from "../../utils/PersianDateConverter";

// const Investers = ({ projectUuid , project}) => {
//   const [investers, setInvesters] = useState([]);
//   const [pagination, setPagination] = useState();
//   const [open, setOpen] = useState(false);
//   const [selectedProjects, setSelectedProjects] = useState([]);
//   const [selectedInvesterName, setSelectedInvesterName] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const isMobile = useMediaQuery("(max-width: 900px)");
//   const fontSize = isMobile ? "12px" : "14px";

//   useEffect(() => {
//     const fetchInvesters = async () => {
//       try {
//         const data = await getInvesters(projectUuid, 5, currentPage); // Adjust perPage and page as needed
//         setInvesters(data.data);
//         setPagination(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchInvesters();
//   }, [projectUuid, currentPage]);

//   const handleOpen = (projects, name) => {
//     setSelectedProjects(projects);
//     setSelectedInvesterName(name);
//     setOpen(true);
//   };

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };
//   const handleClose = () => {
//     setOpen(false);
//     setSelectedProjects([]);
//   };

//   return (
//     <>
//       {investers.length > 0 && (
//         <>
//           <Typography
//             style={{
//               fontWeight: "600",
//               display: "flex",
//               justifyContent: "center",
//               marginBottom: 10,
//             }}
//           >
//             سرمایه گذاران
//           </Typography>
//           <Card
//             style={{
//               padding: "20px",
//               // height: "350px",
//               borderRadius: 15,
//               boxShadow: 3,
//               mt: 1,
//             }}
//             sx={{ overflowY: 'auto' , scrollbarWidth:'2px' , '&::-webkit-scrollbar': {
//               width: '8px',
//             },
//             '&::-webkit-scrollbar-thumb': {
//               backgroundColor: '#888',
//               borderRadius: '10px',
//             },
//             '&::-webkit-scrollbar-thumb:hover': {
//               backgroundColor: '#555',
//             },
//             '&::-webkit-scrollbar-track': {
//               backgroundColor: '#f1f1f1',
//               borderRadius: '10px',
//             } }}
//           >
//            {project.users_count > 0 &&
//              <Typography
//              sx={{
//                color: "GrayText",
//                fontSize: fontSize,
//                display: "flex",
//                justifyContent: "center",
//              }}
//            >
//              تعداد کل سرمایه گذاران : {project.users_count} نفر
//            </Typography>
//            }
//             <List>
//               {investers.map((invester, index) => (
//                 <React.Fragment key={invester.id}>
//                   <ListItem
//                     button
//                     onClick={() =>
//                       handleOpen(invester.projects, invester.full_name)
//                     }
//                   >
//                     <ListItemText
//                       primary={invester.full_name}
//                       primaryTypographyProps={{
//                         sx: { fontSize, fontWeight: "bold", color: "black" },
//                       }}
//                       secondary={
//                         <Typography
//                           sx={{ fontSize, lineHeight: "20px" }}
//                           color="textSecondary"
//                         >
//                           تاریخ پیوستن:{" "}
//                           <JalaliDateConverter isoDate={invester.created_at} />
//                         </Typography>
//                       }
//                     />

//                     <Typography color="textSecondary" sx={{ fontSize }}>
//                       تعداد طرح: {invester.projects.length}
//                     </Typography>
//                   </ListItem>
//                   {index < investers.length - 1 && <Divider />}
//                 </React.Fragment>
//               ))}
//             </List>
//             <Pagination
//              shape="rounded"
//              variant="outlined"
//              color="primary"
//               size="small"
//               count={pagination.last_page}
//               page={currentPage}
//               onChange={handlePageChange}
//               sx={{ mt: 2 ,display: "flex", justifyContent: "center" }}
//             />
//           </Card>
//         </>
//       )}

//       <Dialog open={open} onClose={handleClose} sx={{ borderRadius: "15px" }}>
//         <DialogTitle
//           sx={{
//             fontSize: "13px",
//             display: "flex",
//             alignItems: "center",
//             flexDirection: "row",
//             color: "black",
//             fontWeight: "bold",
//           }}
//         >
//           {selectedInvesterName}
//         </DialogTitle>
//         <DialogContent>
//           <List>
//             {selectedProjects.map((project, index) => (
//               <React.Fragment key={project.id}>
//                 <ListItem>
//                   <TrendUp />
//                   <ListItemText
//                     primary={`نام طرح: ${project.title}`}
//                     primaryTypographyProps={{
//                       sx: {
//                         fontSize: "12px",
//                         fontWeight: "bold",
//                         color: "black",
//                       },
//                     }}
//                     secondary={
//                       <Typography
//                         sx={{
//                           fontSize: "10px",
//                           fontWeight: "bold",
//                           color: "GrayText",
//                         }}
//                       >
//                         تاریخ شروع پروژه:{" "}
//                         <JalaliDateConverter isoDate={project.created_at} />
//                       </Typography>
//                     }
//                   />
//                 </ListItem>
//                 {index < selectedProjects.length - 1 && <Divider />}
//               </React.Fragment>
//             ))}
//           </List>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Investers;
