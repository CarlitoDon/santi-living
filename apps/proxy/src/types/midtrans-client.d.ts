declare module 'midtrans-client' {
  export interface SnapConstructorOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  export interface SnapTransactionResult {
    token: string;
    redirect_url?: string;
  }

  export class Snap {
    constructor(options: SnapConstructorOptions);
    createTransaction(parameter: Record<string, unknown>): Promise<SnapTransactionResult>;
  }

  export interface CoreApiConstructorOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  export interface QrisChargeResponse {
    status_code: string;
    status_message: string;
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    actions?: Array<{
      name: string;
      method: string;
      url: string;
    }>;
    qr_string: string;
  }

  export class CoreApi {
    constructor(options: CoreApiConstructorOptions);
    charge(parameter: Record<string, unknown>): Promise<QrisChargeResponse>;
  }
}
