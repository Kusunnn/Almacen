import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function probarDatos() {
    try {
        const todosLosUsuarios = await prisma.usuarios.findMany();
        console.log('--- Conexión con Datos Reales OK ---');
        console.table(todosLosUsuarios);
    } catch (error) {
        console.error('Error al leer de Supabase:', error);
    } finally {
        await prisma.$disconnect();
    }
}

probarDatos();