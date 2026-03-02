// Modelo para una unidad individual
export interface Unit {
  id: string; // ID único de la unidad física (ej: UNI-001, UNI-002, etc)
  status: 'available' | 'reserved' | 'maintenance';
  location?: string;
}

// Modelo para un modelo específico dentro de una marca
export interface Model {
  name: string; // Ej: "Plano", "Curvo"
  code: string; // Ej: "M-001", "M-002"
  units: Unit[];
}

// Modelo para una marca
export interface Brand {
  name: string; // Ej: "DeWalt", "Makita"
  models: Model[];
}

// Modelo para un tipo de herramienta
export interface ToolType {
  id: string; // Ej: "martillos", "taladros"
  name: string; // Ej: "Martillos", "Taladros"
  icon?: string;
  brands: Brand[];
}

// Interfaz plana para mostrar en cards (para iterar fácil en vistas)
export interface ToolUnit {
  unitId: string;
  toolTypeName: string;
  brandName: string;
  modelName: string;
  modelCode: string;
  status: 'available' | 'reserved' | 'maintenance';
  location?: string;
}
