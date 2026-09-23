import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PANORAMA_URL = "https://cdn.jsdelivr.net/gh/mpetroff/pannellum@master/examples/examplepano.jpg";

function img(seed: string, w = 1200, h = 800) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(12, 0, 0, 0);
  return d;
}

async function main() {
  console.log("Limpiando datos existentes...");
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.utilityBill.deleteMany();
  await prisma.rentalContract.deleteMany();
  await prisma.property.deleteMany();
  await prisma.adminUser.deleteMany();

  console.log("Creando usuario admin...");
  await prisma.adminUser.create({
    data: {
      email: "admin@inmobiliariabataglia.com",
      passwordHash: await bcrypt.hash("bataglia2026", 10),
      name: "Equipo Bataglia",
    },
  });

  console.log("Creando propiedades...");
  const casaDevoto = await prisma.property.create({
    data: {
      slug: "casa-jardin-villa-devoto",
      title: "Casa con jardín en Villa Devoto",
      address: "Av. Francisco Beiró 3200",
      city: "CABA",
      type: "CASA",
      operation: "VENTA",
      price: 185000,
      currency: "USD",
      status: "DISPONIBLE",
      bedrooms: 3,
      bathrooms: 2,
      areaM2: 210,
      featured: true,
      description:
        "Casa de dos plantas con jardín propio, parrilla y cochera para dos autos. A 5 cuadras de la estación de tren. Ideal para familia.",
      coverImage: img("bataglia-devoto-1"),
      images: JSON.stringify([img("bataglia-devoto-1"), img("bataglia-devoto-2"), img("bataglia-devoto-3")]),
      panoramaUrl: PANORAMA_URL,
    },
  });

  const deptoPalermo = await prisma.property.create({
    data: {
      slug: "depto-2-ambientes-palermo",
      title: "Depto 2 ambientes a estrenar en Palermo",
      address: "Gorriti 4800",
      city: "CABA",
      type: "DEPARTAMENTO",
      operation: "VENTA",
      price: 98000,
      currency: "USD",
      status: "DISPONIBLE",
      bedrooms: 1,
      bathrooms: 1,
      areaM2: 45,
      featured: true,
      description:
        "A estrenar, piso alto con balcón, amenities: piscina, gimnasio y SUM. A 3 cuadras del subte D.",
      coverImage: img("bataglia-palermo-1"),
      images: JSON.stringify([img("bataglia-palermo-1"), img("bataglia-palermo-2"), img("bataglia-palermo-3")]),
      panoramaUrl: PANORAMA_URL,
    },
  });

  const phVillaCrespo = await prisma.property.create({
    data: {
      slug: "ph-reciclado-villa-crespo",
      title: "PH reciclado en Villa Crespo",
      address: "Camargo 750",
      city: "CABA",
      type: "CASA",
      operation: "VENTA",
      price: 145000,
      currency: "USD",
      status: "RESERVADA",
      bedrooms: 2,
      bathrooms: 2,
      areaM2: 120,
      description:
        "PH totalmente reciclado, terraza propia, muy luminoso. Reserva de seña recibida, a la espera de escritura.",
      coverImage: img("bataglia-crespo-1"),
      images: JSON.stringify([img("bataglia-crespo-1"), img("bataglia-crespo-2")]),
    },
  });

  const localCorrientes = await prisma.property.create({
    data: {
      slug: "local-comercial-av-corrientes",
      title: "Local comercial en Av. Corrientes",
      address: "Av. Corrientes 2450",
      city: "CABA",
      type: "LOCAL",
      operation: "VENTA",
      price: 210000,
      currency: "USD",
      status: "DISPONIBLE",
      areaM2: 90,
      description: "Local a la calle, doble vidriera, apto cualquier rubro. Excelente esquina.",
      coverImage: img("bataglia-corrientes-1"),
      images: JSON.stringify([img("bataglia-corrientes-1"), img("bataglia-corrientes-2")]),
    },
  });

  const casaPilar = await prisma.property.create({
    data: {
      slug: "casa-quinta-pilar",
      title: "Casa quinta en Pilar",
      address: "Ruta 8 Km 52, Barrio Los Aromos",
      city: "Pilar",
      type: "CASA",
      operation: "VENTA",
      price: 260000,
      currency: "USD",
      status: "DISPONIBLE",
      bedrooms: 4,
      bathrooms: 3,
      areaM2: 400,
      featured: true,
      description: "Casa quinta en barrio cerrado, pileta, quincho con parrilla y cancha de fútbol 5.",
      coverImage: img("bataglia-pilar-1"),
      images: JSON.stringify([img("bataglia-pilar-1"), img("bataglia-pilar-2"), img("bataglia-pilar-3")]),
      panoramaUrl: PANORAMA_URL,
    },
  });

  const terrenoEscobar = await prisma.property.create({
    data: {
      slug: "terreno-escobar",
      title: "Terreno en Escobar",
      address: "Barrio Abril, Lote 45",
      city: "Escobar",
      type: "TERRENO",
      operation: "VENTA",
      price: 60000,
      currency: "USD",
      status: "DISPONIBLE",
      areaM2: 500,
      description: "Lote en esquina, listo para construir, servicios en la puerta.",
      coverImage: img("bataglia-escobar-1"),
      images: JSON.stringify([img("bataglia-escobar-1")]),
    },
  });

  const deptoCaballito = await prisma.property.create({
    data: {
      slug: "depto-3-ambientes-caballito",
      title: "Depto 3 ambientes con balcón en Caballito",
      address: "Av. Rivadavia 5400",
      city: "CABA",
      type: "DEPARTAMENTO",
      operation: "ALQUILER",
      price: 620000,
      currency: "ARS",
      status: "ALQUILADA",
      bedrooms: 2,
      bathrooms: 1,
      areaM2: 65,
      featured: true,
      description: "3 ambientes con balcón corrido, cocina separada, muy luminoso. A metros del subte A.",
      coverImage: img("bataglia-caballito-1"),
      images: JSON.stringify([img("bataglia-caballito-1"), img("bataglia-caballito-2")]),
      panoramaUrl: PANORAMA_URL,
    },
  });

  const deptoRecoleta = await prisma.property.create({
    data: {
      slug: "depto-2-ambientes-recoleta",
      title: "Depto 2 ambientes en Recoleta",
      address: "Junín 1200",
      city: "CABA",
      type: "DEPARTAMENTO",
      operation: "ALQUILER",
      price: 580000,
      currency: "ARS",
      status: "ALQUILADA",
      bedrooms: 1,
      bathrooms: 1,
      areaM2: 50,
      description: "2 ambientes al frente, edificio con portero. Cerca de Plaza Francia.",
      coverImage: img("bataglia-recoleta-1"),
      images: JSON.stringify([img("bataglia-recoleta-1"), img("bataglia-recoleta-2")]),
    },
  });

  const monoambienteBelgrano = await prisma.property.create({
    data: {
      slug: "monoambiente-belgrano",
      title: "Monoambiente luminoso en Belgrano",
      address: "Cabildo 2100",
      city: "CABA",
      type: "DEPARTAMENTO",
      operation: "ALQUILER",
      price: 320000,
      currency: "ARS",
      status: "DISPONIBLE",
      bathrooms: 1,
      areaM2: 32,
      description: "Monoambiente a estrenar, apto profesional, excelente ubicación sobre Cabildo.",
      coverImage: img("bataglia-belgrano-1"),
      images: JSON.stringify([img("bataglia-belgrano-1"), img("bataglia-belgrano-2")]),
    },
  });

  console.log("Creando contratos de alquiler y facturas...");
  const contratoCaballito = await prisma.rentalContract.create({
    data: {
      propertyId: deptoCaballito.id,
      tenantName: "Ana Martínez",
      tenantPhone: "+54 9 11 4444-1122",
      monthlyRent: 620000,
      currency: "ARS",
      dueDay: 10,
      startDate: new Date("2025-03-01"),
      status: "ACTIVO",
    },
  });

  await prisma.utilityBill.createMany({
    data: [
      {
        rentalContractId: contratoCaballito.id,
        type: "LUZ",
        period: "2026-08",
        amount: 9800,
        dueDate: daysFromNow(-25),
        status: "PAGADO",
        paidAt: daysFromNow(-24),
      },
      {
        rentalContractId: contratoCaballito.id,
        type: "GAS",
        period: "2026-09",
        amount: 5200,
        dueDate: daysFromNow(-2),
        status: "PAGADO",
        paidAt: daysFromNow(-3),
      },
      {
        rentalContractId: contratoCaballito.id,
        type: "AGUA",
        period: "2026-09",
        amount: 8500,
        dueDate: daysFromNow(3),
        status: "PENDIENTE",
      },
      {
        rentalContractId: contratoCaballito.id,
        type: "EXPENSAS",
        period: "2026-09",
        amount: 45000,
        dueDate: daysFromNow(-8),
        status: "VENCIDO",
      },
    ],
  });

  const contratoRecoleta = await prisma.rentalContract.create({
    data: {
      propertyId: deptoRecoleta.id,
      tenantName: "Marcos Ibarra",
      tenantPhone: "+54 9 11 4444-3399",
      monthlyRent: 580000,
      currency: "ARS",
      dueDay: 5,
      startDate: new Date("2025-06-01"),
      status: "ACTIVO",
    },
  });

  await prisma.utilityBill.createMany({
    data: [
      {
        rentalContractId: contratoRecoleta.id,
        type: "EXPENSAS",
        period: "2026-09",
        amount: 38000,
        dueDate: daysFromNow(-5),
        status: "PAGADO",
        paidAt: daysFromNow(-6),
      },
      {
        rentalContractId: contratoRecoleta.id,
        type: "LUZ",
        period: "2026-09",
        amount: 6200,
        dueDate: daysFromNow(6),
        status: "PENDIENTE",
      },
      {
        rentalContractId: contratoRecoleta.id,
        type: "AGUA",
        period: "2026-09",
        amount: 4100,
        dueDate: daysFromNow(9),
        status: "PENDIENTE",
      },
    ],
  });

  console.log("Creando leads de ejemplo...");
  await prisma.lead.createMany({
    data: [
      {
        name: "Rodrigo Pereyra",
        phone: "+54 9 11 5555-0111",
        source: "WhatsApp",
        status: "NUEVO",
        interest: `Consulta por ${deptoPalermo.title}`,
        propertyId: deptoPalermo.id,
      },
      {
        name: "Sofía Aguirre",
        phone: "+54 9 11 5555-0222",
        source: "WhatsApp",
        status: "CALIFICANDO",
        interest: `Preguntó disponibilidad de ${monoambienteBelgrano.title}`,
        propertyId: monoambienteBelgrano.id,
      },
      {
        name: "Diego Suárez",
        phone: "+54 9 11 5555-0333",
        source: "WhatsApp",
        status: "CALIFICADO",
        interest: `Interesado en ${casaDevoto.title}, ya visitó fotos y quiere agendar visita`,
        budget: "USD 180.000 - 200.000",
        qualificationNotes: "Presupuesto confirmado, busca mudarse en 2 meses.",
        propertyId: casaDevoto.id,
      },
      {
        name: "Valentina Ríos",
        phone: "+54 9 11 5555-0444",
        source: "WhatsApp",
        status: "DERIVADO",
        interest: `Quiere comprar ${localCorrientes.title} para su negocio`,
        budget: "USD 210.000 al contado",
        qualificationNotes: "Pide reunión presencial esta semana.",
        assignedAgent: "Juan (ventas)",
        propertyId: localCorrientes.id,
      },
      {
        name: "Nicolás Paz",
        phone: "+54 9 11 5555-0555",
        source: "Referido",
        status: "CONVERTIDO",
        interest: `Compró ${phVillaCrespo.title}`,
        budget: "USD 145.000",
        propertyId: phVillaCrespo.id,
      },
      {
        name: "Bruno Castro",
        phone: "+54 9 11 5555-0666",
        source: "WhatsApp",
        status: "DESCARTADO",
        interest: "Buscaba algo fuera de nuestra zona de cobertura",
        qualificationNotes: "No calificado: busca en zona sur, fuera de cartera.",
      },
    ],
  });

  console.log("Creando conversaciones de ejemplo...");
  await prisma.conversation.create({
    data: {
      contactName: "Julieta Romero",
      contactPhone: "+54 9 11 5555-0777",
      kind: "VENTA",
      status: "ATENDIDA",
      messages: {
        create: [
          {
            direction: "IN",
            type: "TEXT",
            content: `Hola! Vi "${casaPilar.title}" en Instagram, ¿tienen fotos del interior?`,
          },
          {
            direction: "OUT",
            type: "TEXT",
            content: "¡Hola Julieta! Sí, te paso más fotos y el tour 360° en un momento.",
          },
          {
            direction: "IN",
            type: "TEXT",
            content: "Genial, gracias! ¿Podemos coordinar una visita el sábado?",
          },
          {
            direction: "OUT",
            type: "TEXT",
            content: "Dale, te derivo con Juan de nuestro equipo para coordinar el horario.",
          },
        ],
      },
    },
  });

  await prisma.conversation.create({
    data: {
      contactName: "Ana Martínez",
      contactPhone: contratoCaballito.tenantPhone,
      kind: "INQUILINO",
      status: "CERRADA",
      messages: {
        create: [
          {
            direction: "IN",
            type: "IMAGE",
            content: "📎 Foto del comprobante — Luz (2026-08)",
          },
          {
            direction: "OUT",
            type: "TEXT",
            content: "¡Gracias Ana! Registramos tu pago de luz (2026-08) ✅",
          },
        ],
      },
    },
  });

  console.log("Listo ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
