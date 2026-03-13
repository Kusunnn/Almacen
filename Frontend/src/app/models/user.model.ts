export interface PrestamoUsuario {
  id: number;
  id_usuario: number | null;
  id_herramienta: number | null;
  fecha_prestamo: string | null;
  fecha_devolucion_estimada: string | null;
  fecha_devolucion_real: string | null;
  estado: string | null;
  observaciones: string | null;
  herramienta: {
    id: number;
    nombre: string;
    estado: string | null;
    disponibilidad: boolean | null;
  } | null;
}

export interface UserTool {
  brand: string;
  name: string;
  id: string;
  date: string;
  status: 'disponible' | 'reservada' | 'mantenimiento';
}

export interface UserProfileView {
  id: string;
  name: string;
  role: string;
  employeeId: string;
  location: string;
  tools: UserTool[];
}
