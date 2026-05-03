import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import TabPanel from "@/components/ui/TabPanel";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CompanyInfoDTO } from "@/dto/types/companyInfo";
import { useCompanyInfoStore } from "@/store/companyInfo";
import MainSetting from "@/components/settingsCompany/MainSetting";
import ContentSetting from "@/components/settingsCompany/ContentSetting";
import AboutAsSettings from "@/components/settingsCompany/AboutAsSettings";
import BreadcrumbsList from "@/components/ui/BreadcrumbsList";
import { getSettingsBreadcrumbs } from "@/router/breadcrumbs";
import { getTabA11yProps } from "@/utils/getTabA11yProps";
import { useUrlTabs } from "@/hooks/useUrlTabs";
import type { TabConfig } from "@/types/tab";

const createCompanyInfoSchema = z.object({
    aboutDescription: z.string().min(1, "Опис обов'язковий"),
    companyLogo:
    z.object({
        src: z.string().trim().min(1, 'Логотип обов\'язковий'),
        alt: z.string().trim().min(1, 'Альтернативный текст для логотипа обязателен'),
    }),
    companyTitle: z.string().min(1, "Название компании обязательно"),
    bannerContents:
    z.array(
        z.object({
            title: z.string().min(1, "Заголовок баннера обязателен"),
            subtitle: z.string().min(1, "Подзаголовок баннера обязателен"),
            image: z.string().trim().min(1, 'Изображение баннера обязательно'),
            imageAlt: z.string().trim().min(1, 'Альтернативный текст для изображения баннера обязателен'),
            bgImage: z.string().trim().optional().default(""),
            bgImageAlt: z.string().trim().optional().default(""),
        })
    ).min(1, "Добавьте хотя бы один баннер"),
});

const getDefaultValues = (companyInfo?: CompanyInfoDTO) => ({
    aboutDescription: companyInfo?.aboutDescription ?? "",
    companyLogo: {
        src: companyInfo?.companyLogo?.src ?? "",
        alt: companyInfo?.companyLogo?.alt ?? "",
    },
    companyTitle: companyInfo?.companyTitle ?? "",
    bannerContents: companyInfo?.bannerContents?.length
        ? companyInfo.bannerContents.map((banner) => ({
            title: banner.title ?? "",
            subtitle: banner.subtitle ?? "",
            image: banner.image ?? "",
            imageAlt: banner.imageAlt ?? "",
            bgImage: banner.bgImage ?? "",
            bgImageAlt: banner.bgImageAlt ?? "",
        }))
        : [ {
            title: "",
            subtitle: "",
            image: "",
            imageAlt: "",
            bgImage: "",
            bgImageAlt: "",
        } ],
});

const Settings = () => {
    const { t } = useTranslation(["nav", "settings"]);

    const getCompanyInfo = useCompanyInfoStore((state) => state.getCompanyInfo);
    const companyInfo = useCompanyInfoStore((state) => state.companyInfo);

    const methods = useForm<CompanyInfoDTO>({
        resolver: zodResolver(createCompanyInfoSchema),
        defaultValues: getDefaultValues(),
    });

    const {
        reset,
    } = methods;


    const tabs: TabConfig[] = [
        {
            key: "main",
            label: t("settings:mainTab"),
            content: <MainSetting />,
        },
        { key: "content", label: t("settings:contentTab"), content: <ContentSetting /> },
        { key: "about", label: t("settings:aboutTab"), content: <AboutAsSettings /> },
    ];

    const { activeTab, handleTabChange } = useUrlTabs(tabs, "tab");
    const activeTabTitle = tabs[activeTab]?.label ?? tabs[0].label;

    useEffect(() => {
        void getCompanyInfo();
    }, [getCompanyInfo]);

    useEffect(() => {
        if (companyInfo) {
            reset(getDefaultValues(companyInfo));
        }
    }, [companyInfo, reset]);

    return (
        <FormProvider {...methods}>
            <Box>
                <BreadcrumbsList list={getSettingsBreadcrumbs(t, activeTabTitle)} />
                <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h4">{t("nav:companySettings")}</Typography>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="settings tabs">
                        {tabs.map((tab, index) => (
                            <Tab key={tab.key} label={tab.label} {...getTabA11yProps(index)} />
                        ))}
                    </Tabs>
                </Box>

                <Box sx={{ mt: 2 }}>
                    {tabs.map((tab, index) => (
                        <TabPanel key={tab.key} value={activeTab} index={index}>
                            {tab.content}
                        </TabPanel>
                    ))}
                </Box>
            </Box>
        </FormProvider>
    );
};

export default Settings;