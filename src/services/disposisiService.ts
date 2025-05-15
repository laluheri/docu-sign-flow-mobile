
export interface DisposisiResponse {
  status: boolean;
  desc: number;
  data: {
    current_page: number;
    data: DisposisiItem[];
    last_page: number;
  };
}

import { DisposisiItem } from "@/components/disposisi/DisposisiCard";

export const fetchDisposisiData = async (userId: number, page: number = 1): Promise<DisposisiResponse> => {
  const response = await fetch(`https://ttd.lombokutarakab.go.id/api/getDis?user_id=${userId}&page=${page}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch disposisi data');
  }
  
  return response.json();
};
