export type OtpPurpose = "REGISTER" | "CHANGE_EMAIL";
export type OtpChannel = "EMAIL" | "SMS";
export type OtpPolicy = {
  /** Thời gian sống của otp (miliseconds) */
  ttlMs: number;
  /** Kênh gửi otp */
  channels: OtpChannel[];
  /** Object chứa định dạng thư hiển thị cho client theo từng channel */
  templates: Partial<{
    [K in OtpChannel]: (ttlMinutes: number, code: string) => string;
  }>;
};
