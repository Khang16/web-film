// // services/handleRequest.ts
// import type { ApiResponse } from "../common/types/api-response.interface";
// import axios from "./axios";

// export const handleRequest = async <T>(
//   promise: Promise<{ data: ApiResponse<T> }>
// ): Promise<T> => {
//   const res = await promise;

//   if (res.data.status !== 200) {
//     throw new Error(res.data.message);
//   }

//   return res.data.data;
// };