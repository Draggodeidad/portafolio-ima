// This adapter only reports API acceptance; delivery to the inbox is not guaranteed.
export class ResendEmailAdapter {
  constructor({ apiKey, from, to }) {
    this.apiKey = apiKey;
    this.from = from;
    this.to = to;
  }

  async send({ name, email, message }) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Portafolio <${this.from}>`,
        to: [this.to],
        reply_to: email,
        subject: `Portafolio: mensaje de ${name}`,
        text: `Nombre: ${name}\nCorreo: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  }
}
