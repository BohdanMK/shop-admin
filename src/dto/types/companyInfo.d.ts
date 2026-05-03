export interface CompanyInfoBannerContentDTO {
    title: string;
    subtitle: string;
    image: string;
    imageAlt: string;
    bgImage?: string;
	bgImageAlt?: string;
}

export interface CompanyInfoLogoDTO {
    src: string;
    alt: string;
}

export interface CompanyInfoDTO {
    _id?: string;
    aboutDescription: string;
    bannerContents: CompanyInfoBannerContentDTO[];
    companyLogo: CompanyInfoLogoDTO;
    companyTitle: string;
}