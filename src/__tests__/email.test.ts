import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Hoisted so the mock factory can reference them — vi.mock is hoisted to the
// top of the file, before any imports.
const { sendMock, ResendCtorMock } = vi.hoisted(() => {
  const sendMock = vi.fn();
  const ResendCtorMock = vi.fn(function (this: { emails: { send: typeof sendMock } }) {
    this.emails = { send: sendMock };
  });
  return { sendMock, ResendCtorMock };
});

vi.mock("resend", () => ({
  Resend: ResendCtorMock,
}));

// Re-import the email module after mutating env so the `resend` singleton
// (instantiated at module load) picks up the new env.
async function importEmail() {
  vi.resetModules();
  return await import("@/lib/email");
}

describe("sendEmail", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    sendMock.mockReset();
    ResendCtorMock.mockClear();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("logs to console and returns true when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    const { sendEmail } = await importEmail();
    const ok = await sendEmail({
      to: "user@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
    });

    expect(ok).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalled();
    infoSpy.mockRestore();
  });

  it("calls Resend with correct args when RESEND_API_KEY is set", async () => {
    process.env.RESEND_API_KEY = "re_test_123";
    process.env.EMAIL_FROM = "Fed <noreply@getfed.com>";
    sendMock.mockResolvedValue({ data: { id: "msg_1" }, error: null });

    const { sendEmail } = await importEmail();
    const ok = await sendEmail({
      to: "user@example.com",
      subject: "Reset your password",
      html: "<p>link</p>",
    });

    expect(ok).toBe(true);
    expect(ResendCtorMock).toHaveBeenCalledWith("re_test_123");
    expect(sendMock).toHaveBeenCalledWith({
      from: "Fed <noreply@getfed.com>",
      to: "user@example.com",
      subject: "Reset your password",
      html: "<p>link</p>",
    });
  });

  it("returns false when Resend reports an error", async () => {
    process.env.RESEND_API_KEY = "re_test_123";
    sendMock.mockResolvedValue({ data: null, error: { message: "boom" } });
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { sendEmail } = await importEmail();
    const ok = await sendEmail({
      to: "user@example.com",
      subject: "Hi",
      html: "<p>Hi</p>",
    });

    expect(ok).toBe(false);
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it("returns false when Resend throws", async () => {
    process.env.RESEND_API_KEY = "re_test_123";
    sendMock.mockRejectedValue(new Error("network down"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { sendEmail } = await importEmail();
    const ok = await sendEmail({
      to: "user@example.com",
      subject: "Hi",
      html: "<p>Hi</p>",
    });

    expect(ok).toBe(false);
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });
});

describe("email templates", () => {
  beforeEach(() => {
    sendMock.mockReset();
    ResendCtorMock.mockClear();
  });

  it("passwordResetEmail builds a subject and html with the reset URL", async () => {
    const { passwordResetEmail } = await importEmail();
    const tmpl = passwordResetEmail("https://fed.app/reset?token=abc123");
    expect(tmpl.subject).toBe("Reset your Fed password");
    expect(tmpl.html).toContain("https://fed.app/reset?token=abc123");
    expect(tmpl.html).toContain("Reset password");
  });

  it("orderConfirmationEmail includes order number and total", async () => {
    const { orderConfirmationEmail } = await importEmail();
    const tmpl = orderConfirmationEmail("FED-AB12-CD34", "$45.99");
    expect(tmpl.subject).toContain("FED-AB12-CD34");
    expect(tmpl.html).toContain("FED-AB12-CD34");
    expect(tmpl.html).toContain("$45.99");
  });

  it("supportAcknowledgmentEmail includes the user's name and subject", async () => {
    const { supportAcknowledgmentEmail } = await importEmail();
    const tmpl = supportAcknowledgmentEmail("Amy Chen", "Order issue");
    expect(tmpl.subject).toContain("Order issue");
    expect(tmpl.html).toContain("Amy Chen");
    expect(tmpl.html).toContain("Order issue");
  });
});
