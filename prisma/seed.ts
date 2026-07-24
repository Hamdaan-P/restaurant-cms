// A seed script populates the database with sample/starter data, run manually (or on setup) rather than as part of normal app code.
import { prisma } from "../src/lib/prisma";
import { Status } from "@prisma/client";

async function main() {
  await prisma.menuItem.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.staffMember.deleteMany();
  await prisma.home.deleteMany();
  await prisma.about.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.siteSettings.deleteMany();

  await prisma.menuItem.createMany({
    data: [
      {
        name: "Butter Chicken",
        description:
          "Tender tandoori chicken simmered in a rich, creamy tomato gravy with butter and fenugreek.",
        price: 450,
        image: "https://placehold.co/600x400.png?text=Butter+Chicken",
        order: 1,
        featured: true,
        status: Status.PUBLISHED,
      },
      {
        name: "Paneer Tikka Masala",
        description:
          "Chargrilled paneer cubes tossed in a spiced onion-tomato masala with bell peppers.",
        price: 380,
        image: "https://placehold.co/600x400.png?text=Paneer+Tikka+Masala",
        order: 2,
        featured: false,
        status: Status.PUBLISHED,
      },
      {
        name: "Lamb Rogan Josh",
        description:
          "Slow-cooked lamb in a fragrant Kashmiri chili and yogurt gravy with warm spices.",
        price: 520,
        image: "https://placehold.co/600x400.png?text=Lamb+Rogan+Josh",
        order: 3,
        featured: true,
        status: Status.PUBLISHED,
      },
      {
        name: "Hyderabadi Biryani",
        description:
          "Fragrant basmati rice layered with marinated chicken, saffron, and fried onions.",
        price: 420,
        image: "https://placehold.co/600x400.png?text=Hyderabadi+Biryani",
        order: 4,
        featured: false,
        status: Status.PUBLISHED,
      },
      {
        name: "Masala Dosa",
        description:
          "Crisp fermented rice-and-lentil crepe filled with spiced potato masala, served with sambar and chutney.",
        price: 220,
        image: "https://placehold.co/600x400.png?text=Masala+Dosa",
        order: 5,
        featured: false,
        status: Status.PUBLISHED,
      },
      {
        name: "Gulab Jamun",
        description:
          "Warm milk-solid dumplings soaked in rose and cardamom scented sugar syrup.",
        price: 150,
        image: "https://placehold.co/600x400.png?text=Gulab+Jamun",
        order: 6,
        featured: false,
        status: Status.PUBLISHED,
      },
    ],
  });

  await prisma.galleryImage.createMany({
    data: [
      {
        image: "https://placehold.co/600x400.png?text=Dining+Hall",
        caption: "Our warmly lit main dining hall",
        order: 1,
        status: Status.PUBLISHED,
      },
      {
        image: "https://placehold.co/600x400.png?text=Tandoor+Kitchen",
        caption: "Fresh naan straight from the tandoor",
        order: 2,
        status: Status.PUBLISHED,
      },
      {
        image: "https://placehold.co/600x400.png?text=Outdoor+Seating",
        caption: "Evenings on our outdoor patio",
        order: 3,
        status: Status.PUBLISHED,
      },
      {
        image: "https://placehold.co/600x400.png?text=Chefs+Table",
        caption: "Chef's table plating a biryani",
        order: 4,
        status: Status.PUBLISHED,
      },
    ],
  });

  await prisma.staffMember.createMany({
    data: [
      {
        name: "Ravi Shankar",
        designation: "Executive Chef",
        photo: "https://placehold.co/600x400.png?text=Ravi+Shankar",
        order: 1,
        status: Status.PUBLISHED,
      },
      {
        name: "Priya Nair",
        designation: "Head of Front of House",
        photo: "https://placehold.co/600x400.png?text=Priya+Nair",
        order: 2,
        status: Status.PUBLISHED,
      },
      {
        name: "Arjun Mehta",
        designation: "Sous Chef",
        photo: "https://placehold.co/600x400.png?text=Arjun+Mehta",
        order: 3,
        status: Status.PUBLISHED,
      },
    ],
  });

  await prisma.home.create({
    data: {
      headline: "Authentic Indian Flavors, Cooked with Heart",
      subtext:
        "From tandoori classics to slow-simmered curries, join us for a taste of India in every dish.",
      buttonText: "View Our Menu",
      status: Status.PUBLISHED,
    },
  });

  await prisma.about.create({
    data: {
      story:
        "Founded by a family of home cooks, our restaurant brings recipes passed down through generations to the table, blending traditional spice-blending techniques with a modern dining experience.",
      photo: "https://placehold.co/600x400.png?text=Our+Story",
      status: Status.PUBLISHED,
    },
  });

  await prisma.contact.create({
    data: {
      address: "42 Curry Lane, Spice Market District, Mumbai 400001",
      phone: "+91 98765 43210",
      email: "hello@spicehouse.example",
      hours: "Mon–Sun: 11:00 AM – 11:00 PM",
      status: Status.PUBLISHED,
    },
  });

  await prisma.siteSettings.create({
    data: {
      restaurantName: "Spice House",
      tagline: "A Taste of India, Served with Love",
      status: Status.PUBLISHED,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
