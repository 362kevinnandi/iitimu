import DailyTmEmailTemplate from "@/emails/mail-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// TODO: email verification and rate limiting

export async function POST(req: Request) {
  try {
    const { name, message, subject, email, link, buttonText } =
      await req.json();

    const { data, error } = await resend.emails.send({
      from: "TM-iitimu <onboarding@resend.dev>",
      to: ["codewavewithasante@gmail.com"],
      subject: subject,
      react: DailyTmEmailTemplate({ name, message, buttonText, link }),
    });

    if (error) {
      console.log(error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
