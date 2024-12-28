import { getItem } from './storage.helper';

type AuthhHeader = { Authorization?: string };
export default function authhHeader(): AuthhHeader {
  let user: { rsa: string | undefined } = getItem(
    import.meta.env.VITE_ACCESSTOKEN
  );
  // const hardcodedToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjQ4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoicmFscGhpZ2Fib3JAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IiAiLCJPcmdhbmlzYXRpb25JZCI6MzksImV4cCI6MTcyMDk4MDE0MCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzI4MyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcyODMifQ.rctHvW7PGivqV-duO_YFIcLjxBOoVo24el1gCGABho8`;
  if (user && user.rsa) {
    return { Authorization: 'Bearer ' + user.rsa};
  } else {
    return {};
  }
}
