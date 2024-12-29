import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const POST = async (req: Request) => {
  const { data } = await req.json();
  const email = data.email_addresses[0].email_address;
  const firstName = data.first_name;
  const lastName = data.last_name ? data.last_name : "";
  const imageUrl = data.image_url;
  const id = data.id;
  const name = `${firstName} ${lastName}`;

  await db.user.upsert({
    where: { id },
    update: { email, name, imageUrl },
    create: { id, email, name, imageUrl },
  });

  return new Response("Webhook received", { status: 200 });
};
