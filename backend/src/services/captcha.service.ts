import { env } from "../constants/env";

export interface ICaptchaService {
  verifyCaptcha(token: string, jsonConfig?: string): Promise<boolean>;
}

export class TurnstileCaptchaService implements ICaptchaService {
  async verifyCaptcha(token: string, jsonConfig?: string): Promise<boolean> {
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const formData = new FormData();
    formData.append("secret", env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error("Error verifying CAPTCHA:", error);
      return false;
    }
  }
}
