import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const { data } = await req.json();

    // Validate the necessary fields from the webhook payload
    if (
      !data ||
      !data.email_addresses ||
      !data.email_addresses[0]?.email_address
    ) {
      return new Response("Invalid webhook payload", { status: 400 });
    }

    const email = data.email_addresses[0].email_address;
    const firstName = data.first_name || "Unknown";
    const lastName = data.last_name || "";
    const imageUrl = data.image_url || null;
    const id = data.id || crypto.randomUUID(); // Fallback to a random ID if `id` is missing
    const name = `${firstName} ${lastName}`.trim();

    // Upsert user
    await db.user.upsert({
      where: { id },
      update: { email, name, imageUrl },
      create: { id, email, name, imageUrl },
    });

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
