export interface ToolUnit {
  id: number;
  unitId: string;
  toolTypeName: string;
  brandName: string;
  modelName: string;
  modelCode: string;
  status: 'available' | 'reserved' | 'maintenance';
  location?: string;
  imageUrl?: string | null;
  description?: string | null;
}
