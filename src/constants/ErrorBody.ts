interface ErrorInterface {
  statusCode: number[];
  messages: string[];
  color: string;
  title: string;
}
export const authError: ErrorInterface = {
  statusCode: [401, 403],
  messages: ["Email or Password is invalid."],
  color: "text-[#9155FD]",
  title: "Authentication Error",
};
export const bigTimeTechError: ErrorInterface = {
  title: "Server Downtime Error",
  messages: [""],
  statusCode: [505, 508, 510, 507, 502, 500],
  color: "text-[#FF4C51]",
};
export const serverError: ErrorInterface = {
  statusCode: [503, 504, 511],
  messages: [""],
  color: "text-[#FFAB00]",
  title: "Server Error",
};
export const technicalError: ErrorInterface = {
  statusCode: [413, 414, 431, 451],
  messages: [""],
  color: "text-[#000000]",
  title: "Technical Error",
};
export const userError: ErrorInterface = {
  statusCode: [400, 404, 429, 415, 411, 405, 402],
  messages: ["No Company linked to this account yet!"],
  color: "text-[#0960CD]",
  title: "User Error",
};
