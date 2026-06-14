import { NextResponse } from "next/server";
import { Resend } from "resend";



export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();

    const { name, phone, email, address, notes } = body;

    console.log("=================================");
    console.log("New Enquiry Received");
    console.log("Name:", name);
    console.log("Phone:", phone);
    console.log("Email:", email);
    console.log("Address:", address);
    console.log("Notes:", notes);
    console.log("=================================");

    // ADMIN EMAIL
    const adminMail = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["manisha@tito.org.in"],
      subject: "New Enquiry Received - Menmai Foods",
      html: `
        <h2>New Enquiry Received</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Notes:</strong> ${notes}</p>

        <hr/>

        <p>This enquiry was submitted from the Menmai Foods website.</p>
      `,
    });

    console.log("Admin Mail Response:");
    console.log(adminMail);

    // CUSTOMER ACKNOWLEDGEMENT EMAIL
    const customerMail = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Thank You for Contacting Menmai Foods",
      html: `
        <h2>Thank You, ${name}!</h2>

        <p>We have received your enquiry successfully.</p>

        <p>
          Our team will review your request and reach out to you shortly.
        </p>

        <p>
          If you have any further questions, please call or WhatsApp us at
          <strong>9987738883</strong>.
        </p>

        <br/>

        <p>Thanks & Regards,</p>
        <p><strong>Menmai Foods</strong></p>
      `,
    });

    console.log("Customer Mail Response:");
    console.log(customerMail);

    return NextResponse.json({
      success: true,
      adminMail,
      customerMail,
    });
  } catch (error) {
    console.error("=================================");
    console.error("RESEND ERROR");
    console.error(error);
    console.error("=================================");

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        error,
      },
      { status: 500 }
    );
  }
}