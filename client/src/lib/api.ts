import axios from 'axios';
import { supabase } from './supabaseClient';
import { toast } from "@/hooks/use-toast"; // Import from hooks instead of components

const API_URL = 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interface for ATM analysis data
export interface ATMAnalysis {
  id?: string;
  user_id?: string;
  location_lat: number;
  location_lng: number;
  
  // Raw factors
  population_density: number;
  competing_atms: number;
  commercial_activity: number;
  traffic_flow: number;
  public_transport: number;
  land_rate: number;
  
  // Scores
  overall_score: number;
  population_density_score: number;
  competing_atms_score: number;
  commercial_activity_score: number;
  traffic_flow_score: number;
  public_transport_score: number;
  land_rate_score: number;
  
  // Weights
  population_density_weight: number;
  competing_atms_weight: number;
  commercial_activity_weight: number;
  traffic_flow_weight: number;
  public_transport_weight: number;
  land_rate_weight: number;
  
  // Other fields
  recommendations: any;
  created_at?: string;
  is_favorite?: boolean;
}

// Function to get user ID from Supabase session
async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id || null;
}

// API functions
export const ATMAnalysisAPI = {
  // Save analysis
  saveAnalysis: async (analysisData: ATMAnalysis): Promise<any> => {
    const userId = await getUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { data } = await api.post('/analysis/v1/save', {
      ...analysisData,
      user_id: userId
    });
    
    return data;
  },
  
  // Get user's analysis history
  getAnalysisHistory: async (): Promise<ATMAnalysis[]> => {
    const userId = await getUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { data } = await api.get(`/analysis/v1/history/${userId}`);
    return data.data || [];
  },
  
  // Get specific analysis
  getAnalysisById: async (analysisId: string): Promise<ATMAnalysis | null> => {
    const userId = await getUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { data } = await api.get(`/analysis/v1/detail/${analysisId}/${userId}`);
    return data.data || null;
  },
  
  // Toggle favorite status
  toggleFavorite: async (analysisId: string, isFavorite: boolean): Promise<boolean> => {
    const userId = await getUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { data } = await api.post(`/analysis/v1/favorite`, {
      analysis_id: analysisId,
      user_id: userId,
      is_favorite: isFavorite
    });
    
    return data.success || false;
  }
};

// Export the API functions
export default api;