import { fetchApi } from "../../../helpers/apiHelper";

export interface CashFlow {
  id: string;
  user_id?: string;
  type: "inflow" | "outflow";
  source: "cash" | "savings" | "loans";
  label: string;
  amount: number;
  description?: string;
  photo?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateCashFlowPayload {
  type: "inflow" | "outflow";
  source: "cash" | "savings" | "loans";
  label: string;
  amount: number;
  description?: string;
  photo?: File;
}

export interface UpdateCashFlowPayload {
  type: "inflow" | "outflow";
  source: "cash" | "savings" | "loans";
  label: string;
  amount: number;
  description?: string;
  photo?: File;
}

export interface CashFlowFilterParams {
  type?: string;
  source?: string;
  label?: string;
  start_date?: string;
  end_date?: string;
}

export interface CashFlowStats {
  total_inflow: number;
  total_outflow: number;
  balance: number;
}

export const cashFlowApi = {
  getAll: async (params?: CashFlowFilterParams): Promise<{ success: boolean; data: CashFlow[] }> => {
    const query = new URLSearchParams();
    if (params) {
      if (params.type) query.append("type", params.type);
      if (params.source) query.append("source", params.source);
      if (params.label) query.append("label", params.label);
      if (params.start_date) query.append("start_date", params.start_date);
      if (params.end_date) query.append("end_date", params.end_date);
    }
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return await fetchApi<{ success: boolean; data: CashFlow[] }>(`/cash-flows${queryString}`);
  },

  getById: async (id: string): Promise<{ success: boolean; data: CashFlow }> => {
    return await fetchApi<{ success: boolean; data: CashFlow }>(`/cash-flows/${id}`);
  },

  create: async (
    payload: CreateCashFlowPayload
  ): Promise<{ success: boolean; message: string; data: CashFlow }> => {
    const formData = new FormData();
    formData.append("type", payload.type);
    formData.append("source", payload.source);
    formData.append("label", payload.label);
    formData.append("amount", payload.amount.toString());
    if (payload.description) {
      formData.append("description", payload.description);
    }
    if (payload.photo) {
      formData.append("photo", payload.photo);
    }

    return await fetchApi<{ success: boolean; message: string; data: CashFlow }>("/cash-flows", {
      method: "POST",
      body: formData
    });
  },

  update: async (
    id: string,
    payload: UpdateCashFlowPayload
  ): Promise<{ success: boolean; message: string; data: CashFlow }> => {
    const formData = new FormData();
    formData.append("type", payload.type);
    formData.append("source", payload.source);
    formData.append("label", payload.label);
    formData.append("amount", payload.amount.toString());
    if (payload.description !== undefined) {
      formData.append("description", payload.description);
    }
    if (payload.photo) {
      formData.append("photo", payload.photo);
    }

    return await fetchApi<{ success: boolean; message: string; data: CashFlow }>(
      `/cash-flows/${id}`,
      {
        method: "PUT",
        body: formData
      }
    );
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await fetchApi<{ success: boolean; message: string }>(`/cash-flows/${id}`, {
      method: "DELETE"
    });
  },

  reset: async (): Promise<{ success: boolean; message: string }> => {
    return await fetchApi<{ success: boolean; message: string }>("/cash-flows", {
      method: "DELETE"
    });
  },

  getLabels: async (): Promise<{ success: boolean; data: string[] }> => {
    return await fetchApi<{ success: boolean; data: string[] }>("/cash-flows/labels");
  },

  getStats: async (): Promise<{ success: boolean; data: CashFlowStats }> => {
    return await fetchApi<{ success: boolean; data: CashFlowStats }>("/cash-flows/stats");
  }
};

