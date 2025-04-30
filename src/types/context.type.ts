import { IncomingMessage, ServerResponse } from "http";

export type MyContext = {
  req: IncomingMessage;
  res: ServerResponse;
  user?: { email: string; isConnected: boolean; type: "author" | "profil" };
  resource?: any; // pour l’objet Article ou autre
};
