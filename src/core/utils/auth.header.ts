import { getItem } from './storage.helper';

type AuthHeader = { Authorization?: string };
export default function authHeader(): AuthHeader {
  let user: { rsa: string | undefined } = getItem(
    import.meta.env.VITE_ACCESSTK
  );

  if (user && user.rsa) {
    return { Authorization: 'Bearer ' + user.rsa };
  } else {
    return {};
  }
}
