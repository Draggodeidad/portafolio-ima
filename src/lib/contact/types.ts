export interface EmailPayload {
  name: string;
  email: string;
  message: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailAdapter {
  send(payload: EmailPayload, token: string, ip: string): Promise<EmailResult>;
}
