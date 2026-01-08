// import { Platform } from "react-native";
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";
// import RNFS from "react-native-fs";
// import {
//   PERMISSIONS,
//   check,
//   request,
//   requestMultiple,
// } from "react-native-permissions";

// async function hasAndroidPermission() {
//   const getCheckPermissionPromise = () => {
//     if (Number(Platform.Version) >= 33) {
//       return Promise.all([
//         check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES),
//         check(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO),
//       ]).then(
//         ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
//           hasReadMediaImagesPermission && hasReadMediaVideoPermission
//       );
//     } else {
//       return check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
//     }
//   };

//   const hasPermission = await getCheckPermissionPromise();
//   if (hasPermission) {
//     return true;
//   }
//   const getRequestPermissionPromise = () => {
//     if (Number(Platform.Version) >= 33) {
//       return requestMultiple([
//         PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
//         PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
//       ]);
//     } else {
//       return request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(
//         (status) => status === "granted"
//       );
//     }
//   };

//   return await getRequestPermissionPromise();
// }

// export const savePicture = async (fileName: string) => {
//   if (Platform.OS === "android" && !(await hasAndroidPermission())) {
//     return;
//   }
//   return CameraRoll.saveToCameraRoll(
//     RNFS.CachesDirectoryPath + fileName,
//     "photo"
//   );
// };
