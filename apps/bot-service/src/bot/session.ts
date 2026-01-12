import { Client } from "whatsapp-web.js";

export class BotSession {
  private client: Client | null = null;
  private static instance: BotSession;
  private qrCode: string | null = null;
  private status: "INITIALIZING" | "QR_PENDING" | "READY" | "DISCONNECTED" =
    "INITIALIZING";

  private constructor() {
    // We will initialize the client in the init method
  }

  public initialize(
    createClientFn: () => Client,
    attachHandlersFn: (client: Client) => void
  ) {
    if (this.client) return;

    this.client = createClientFn();
    this.setClient(this.client);
    attachHandlersFn(this.client);

    console.log("Initializing WhatsApp Client...");
    this.client.initialize();
  }

  public static getInstance(): BotSession {
    if (!BotSession.instance) {
      BotSession.instance = new BotSession();
    }
    return BotSession.instance;
  }

  public getStatus() {
    return this.status;
  }

  public getQrCode() {
    return this.qrCode;
  }

  public setStatus(
    status: "INITIALIZING" | "QR_PENDING" | "READY" | "DISCONNECTED"
  ) {
    this.status = status;
  }

  public setQrCode(qr: string | null) {
    this.qrCode = qr;
  }

  public getClient() {
    return this.client;
  }

  public setClient(client: Client) {
    this.client = client;
  }
}
