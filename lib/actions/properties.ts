"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6)
  );
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/dashboard/propiedades");
  revalidatePath("/dashboard");
}

export async function createProperty(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("El título es obligatorio");

  const images = String(formData.get("images") ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);

  const property = await prisma.property.create({
    data: {
      title,
      slug: slugify(title),
      address: String(formData.get("address") ?? ""),
      city: String(formData.get("city") ?? "Ciudad"),
      type: String(formData.get("type") ?? "CASA"),
      operation: String(formData.get("operation") ?? "VENTA"),
      price: Number(formData.get("price") ?? 0),
      currency: String(formData.get("currency") ?? "USD"),
      status: String(formData.get("status") ?? "DISPONIBLE"),
      bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null,
      bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
      areaM2: formData.get("areaM2") ? Number(formData.get("areaM2")) : null,
      description: String(formData.get("description") ?? ""),
      coverImage: images[0] ?? "",
      images: JSON.stringify(images),
      panoramaUrl: String(formData.get("panoramaUrl") ?? "") || null,
      featured: formData.get("featured") === "on",
    },
  });

  revalidateAll();
  redirect("/dashboard/propiedades");
}

export async function updatePropertyStatus(id: string, status: string) {
  await prisma.property.update({ where: { id }, data: { status } });
  revalidateAll();
}

export async function updateProperty(id: string, formData: FormData) {
  const images = String(formData.get("images") ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);

  await prisma.property.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? ""),
      address: String(formData.get("address") ?? ""),
      city: String(formData.get("city") ?? ""),
      type: String(formData.get("type") ?? "CASA"),
      operation: String(formData.get("operation") ?? "VENTA"),
      price: Number(formData.get("price") ?? 0),
      currency: String(formData.get("currency") ?? "USD"),
      status: String(formData.get("status") ?? "DISPONIBLE"),
      bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null,
      bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
      areaM2: formData.get("areaM2") ? Number(formData.get("areaM2")) : null,
      description: String(formData.get("description") ?? ""),
      coverImage: images[0] ?? "",
      images: JSON.stringify(images),
      panoramaUrl: String(formData.get("panoramaUrl") ?? "") || null,
      featured: formData.get("featured") === "on",
    },
  });

  revalidateAll();
  redirect("/dashboard/propiedades");
}

export async function deleteProperty(id: string) {
  await prisma.property.deleteMany({ where: { id } });
  revalidateAll();
  redirect("/dashboard/propiedades");
}
