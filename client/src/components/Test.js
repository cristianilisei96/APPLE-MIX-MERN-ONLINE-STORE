import React, { useEffect, useState } from "react";
import Avatar from "react-avatar-edit";

const Test = () => {
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);

  return (
    <>
      <img src="" />
      <Avatar widhth={400} height={300} src={src} />{" "}
    </>
  );
};

// const [file, setFile] = useState("");
//   const [fileURL, setFileURL] = useState("");
//   const [filename, setFilename] = useState("Choose File");
//   const [uploadedFile, setUploadedFile] = useState("");
//   const [message, setMessage] = useState("");
//   const [uploadPercentage, setUploadPercentage] = useState(0);
//   const [typeOfImg, setTypeOfImg] = useState("");

// const onChangeImage = (e) => {
//   setFile(e.target.files[0]);
//   setFileURL(URL.createObjectURL(e.target.files[0]));

//   setFilename(user.first_name + user.last_name);

//   setTypeOfImg(
//     e.target.files[0].type.substring(e.target.files[0].type.indexOf("/") + 1)
//   );
// };

// const onUploadImage = async (e) => {
//   e.preventDefault();

//   const newFileName =
//     user.first_name +
//     user.last_name +
//     "-" +
//     new Date().getTime() +
//     `.${typeOfImg}`;
//   const formData = new FormData();
//   formData.append("file", file, newFileName);

//   const res = await axios.post("/users/uploadavatar", formData, user, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//     onUploadProgress: (progressEvent) => {
//       setUploadPercentage(
//         parseInt(
//           Math.round((progressEvent.loaded * 100) / progressEvent.total)
//         )
//       );
//     },
//   });

//   // Clear percentage
//   // setTimeout(() => setUploadPercentage(0), 10000);

//   const { fileName } = user.first_name + "%" + user.last_name;
//   const { filePath } = res.data;

//   setUploadedFile({ fileName, filePath });

//   setMessage("Image uploaded");

//   setFile("");
//   const pathImg = {
//     pathImg: filePath,
//   };

//   dispatch(updateAvatarField(pathImg));
//   dispatch(loadingUserConnected());
// };

{
  /* <input
                                      type="file"
                                      className="form-control firstInputChangeAvatar"
                                      onChange={onChangeImage}
                                    /> */
}

// export const updateAvatarField = (pathImg) => (dispatch, getState) => {
//   axios.put("/users/updateAvatarField", pathImg, tokenConfig(getState));
//   console.log(pathImg);
// };

// router.post("/uploadavatar", (req, res) => {
//   if (req.files === null) {
//     return res.status(400).json({ msg: "No file uploaded" });
//   } else {
//     console.log(req.body);
//     const file = req.files.file;

//     let correctDirname = path.join(__dirname, "../../../");

//     file.mv(
//       `${correctDirname}/client/public/images/users/avatars/${file.name}`,
//       (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send(err);
//         } else {
//           res.json({
//             fileName: file.name,
//             filePath: `/images/users/avatars/${file.name}`,
//           });
//         }
//       }
//     );
//   }
// });

// router.put("/updateAvatarField", auth, (req, res) => {
//   const userId = req.user.id;
//   const { pathImg } = req.body;

//   db.query(
//     `UPDATE users SET avatar = '${pathImg}' WHERE id = ${userId}`,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.json({
//           msg: `Path of avatar to user ${userId} was successfully changed!`,
//         });
//       }
//     }
//   );
// });

export default Test;
