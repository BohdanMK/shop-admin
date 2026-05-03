import { create } from 'zustand'
import type { CompanyInfoDTO } from '@/dto/types/companyInfo'
import { getCompanyInfoApi, updateCompanyInfoApi } from '@/api/companyInfo'
import { t } from 'i18next';

interface CompanyInfoState {
    companyInfo: CompanyInfoDTO | null;
    getCompanyInfo: () => Promise<void>;
    updateCompanyInfo: (data: CompanyInfoDTO) => Promise<void>;
}

export const useCompanyInfoStore = create<CompanyInfoState>((set) => ({
    companyInfo: null,
    getCompanyInfo: async () => {
        try {
            const data = await getCompanyInfoApi();
            set({ companyInfo: data });
        } catch (error) {
            console.error("Failed to fetch company info:", error);
        }
    },
    updateCompanyInfo: async (data: CompanyInfoDTO) => {
        try {
            const updatedInfo = await updateCompanyInfoApi(data);
            set({ companyInfo: updatedInfo });
        } catch (error) {
            console.error("Failed to update company info:", error);
            throw error;
        }
    },
}))