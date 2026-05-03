import { isAxiosError } from "axios";

export const extractErrorMessage = (error: unknown, fallback: string) => {
    if (isAxiosError<{ message?: string | string[] }>(error)) {
        const responseMessage = error.response?.data?.message;
        const responseData = error.response?.data as unknown;

        if (typeof responseMessage === "string" && responseMessage.trim()) {
            return responseMessage;
        }

        if (Array.isArray(responseMessage) && responseMessage.length > 0) {
            return responseMessage.join(", ");
        }

        if (typeof responseData === "string" && responseData.trim()) {
            return responseData;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
};