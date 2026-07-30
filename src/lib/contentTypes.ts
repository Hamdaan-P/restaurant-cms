/**
 * Single source of truth describing every content type editable in the admin UI.
 * Field names must match prisma/schema.prisma exactly. id, createdAt, updatedAt,
 * status and order are handled by the admin machinery and are never listed here.
 */

export type FieldInputType = "text" | "textarea" | "number" | "image" | "boolean";

export interface ContentField {
  name: string;
  label: string;
  input: FieldInputType;
  required: boolean;
  requiredMessage: string;
  helpText?: string;
  min?: number;
  max?: number;
  invalidMessage?: string;
}

/** Delegate property name on the shared Prisma client (@/lib/prisma). */
export type PrismaModelKey =
  | "menuItem"
  | "galleryImage"
  | "staffMember"
  | "home"
  | "about"
  | "contact"
  | "siteSettings";

export interface ContentType {
  key: string;
  label: string;
  singularLabel: string;
  prismaModel: PrismaModelKey;
  kind: "list" | "single";
  hasOrder: boolean;
  hasStatus: boolean;
  listDisplayField: string;
  fields: ContentField[];
}

export const contentTypes: ContentType[] = [
  {
    key: "menu-items",
    label: "Menu Items",
    singularLabel: "Menu Item",
    prismaModel: "menuItem",
    kind: "list",
    hasOrder: true,
    hasStatus: true,
    listDisplayField: "name",
    fields: [
      {
        name: "name",
        label: "Name",
        input: "text",
        required: true,
        requiredMessage: "Please add a name for this dish.",
      },
      {
        name: "description",
        label: "Description",
        input: "textarea",
        required: true,
        requiredMessage: "Please describe this dish.",
      },
      {
        name: "price",
        label: "Price",
        input: "number",
        required: true,
        requiredMessage: "Please set a price for this dish.",
        min: 0,
        max: 100000,
        invalidMessage: "Please enter a valid price for this dish.",
      },
      {
        name: "image",
        label: "Image",
        input: "image",
        required: true,
        requiredMessage: "Please add a photo of this dish.",
      },
      {
        name: "featured",
        label: "Featured",
        input: "boolean",
        required: false,
        requiredMessage: "",
        helpText: "Show this dish in the featured section on the home page.",
      },
    ],
  },
  {
    key: "gallery-images",
    label: "Gallery Images",
    singularLabel: "Gallery Image",
    prismaModel: "galleryImage",
    kind: "list",
    hasOrder: true,
    hasStatus: true,
    listDisplayField: "caption",
    fields: [
      {
        name: "image",
        label: "Image",
        input: "image",
        required: true,
        requiredMessage: "Please add a photo for this gallery entry.",
      },
      {
        name: "caption",
        label: "Caption",
        input: "text",
        required: true,
        requiredMessage: "Please add a caption for this photo.",
      },
    ],
  },
  {
    key: "staff-members",
    label: "Staff Members",
    singularLabel: "Staff Member",
    prismaModel: "staffMember",
    kind: "list",
    hasOrder: true,
    hasStatus: true,
    listDisplayField: "name",
    fields: [
      {
        name: "name",
        label: "Name",
        input: "text",
        required: true,
        requiredMessage: "Please add this staff member's name.",
      },
      {
        name: "designation",
        label: "Designation",
        input: "text",
        required: true,
        requiredMessage: "Please add this staff member's role or title.",
      },
      {
        name: "photo",
        label: "Photo",
        input: "image",
        required: true,
        requiredMessage: "Please add a photo of this staff member.",
      },
    ],
  },
  {
    key: "home",
    label: "Home Page",
    singularLabel: "Home Page",
    prismaModel: "home",
    kind: "single",
    hasOrder: false,
    hasStatus: true,
    listDisplayField: "headline",
    fields: [
      {
        name: "headline",
        label: "Headline",
        input: "text",
        required: true,
        requiredMessage: "Please add a headline for the home page.",
      },
      {
        name: "subtext",
        label: "Subtext",
        input: "textarea",
        required: true,
        requiredMessage: "Please add supporting text for the home page.",
      },
      {
        name: "buttonText",
        label: "Button Text",
        input: "text",
        required: true,
        requiredMessage: "Please add the text for the call-to-action button.",
      },
    ],
  },
  {
    key: "about",
    label: "About Page",
    singularLabel: "About Page",
    prismaModel: "about",
    kind: "single",
    hasOrder: false,
    hasStatus: true,
    listDisplayField: "story",
    fields: [
      {
        name: "story",
        label: "Story",
        input: "textarea",
        required: true,
        requiredMessage: "Please tell your restaurant's story.",
      },
      {
        name: "photo",
        label: "Photo",
        input: "image",
        required: true,
        requiredMessage: "Please add a photo for the About page.",
      },
    ],
  },
  {
    key: "contact",
    label: "Contact Details",
    singularLabel: "Contact Details",
    prismaModel: "contact",
    kind: "single",
    hasOrder: false,
    hasStatus: true,
    listDisplayField: "address",
    fields: [
      {
        name: "address",
        label: "Address",
        input: "textarea",
        required: true,
        requiredMessage: "Please add the restaurant's address.",
      },
      {
        name: "phone",
        label: "Phone",
        input: "text",
        required: true,
        requiredMessage: "Please add a contact phone number.",
      },
      {
        name: "email",
        label: "Email",
        input: "text",
        required: true,
        requiredMessage: "Please add a contact email address.",
      },
      {
        name: "hours",
        label: "Hours",
        input: "textarea",
        required: true,
        requiredMessage: "Please add the restaurant's opening hours.",
      },
    ],
  },
  {
    key: "site-settings",
    label: "Site Settings",
    singularLabel: "Site Settings",
    prismaModel: "siteSettings",
    kind: "single",
    hasOrder: false,
    hasStatus: true,
    listDisplayField: "restaurantName",
    fields: [
      {
        name: "restaurantName",
        label: "Restaurant Name",
        input: "text",
        required: true,
        requiredMessage: "Please add the restaurant's name.",
      },
      {
        name: "tagline",
        label: "Tagline",
        input: "text",
        required: true,
        requiredMessage: "Please add a short tagline for the restaurant.",
      },
    ],
  },
];

export function getContentType(key: string): ContentType | undefined {
  return contentTypes.find((contentType) => contentType.key === key);
}
