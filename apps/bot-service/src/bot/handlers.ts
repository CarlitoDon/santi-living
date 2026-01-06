import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { BotSession } from "./session";

export const attachHandlers = (client: Client) => {
  const session = BotSession.getInstance();

  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    qrcode.generate(qr, { small: true });

    session.setQrCode(qr);
    session.setStatus("QR_PENDING");
  });

  client.on("ready", () => {
    console.log("Client is ready!");
    session.setStatus("READY");
    session.setQrCode(null);
  });

  client.on("authenticated", () => {
    console.log("AUTHENTICATED");
  });

  client.on("auth_failure", (msg) => {
    console.error("AUTHENTICATION FAILURE", msg);
    session.setStatus("DISCONNECTED");
  });

  client.on("disconnected", (reason) => {
    console.log("Client was disconnected", reason);
    session.setStatus("DISCONNECTED");
  });
};
