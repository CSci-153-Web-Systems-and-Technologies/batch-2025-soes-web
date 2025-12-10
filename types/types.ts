export interface TemplateDefinition {
  id?: string; 
  title: string;
  rank: number;
  slots: number;
}

export interface PositionDefinition {
  id: string;
  created_at: string;
  name: string;
  order: number; // or position_order
  vote_limit: number; // How many candidates can be picked for this position
  template_id: string;
}

export interface PositionTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  category: string | null; // e.g., 'Student Government', 'Academic'
  status: 'active' | 'inactive' | string; // allowing string fallback for other statuses
  usage_count: number | null; // Mocked or DB column
  
  // This comes from the joined query: .select("*, template_definitions(*)")
  template_definitions?: PositionDefinition[]; 
}