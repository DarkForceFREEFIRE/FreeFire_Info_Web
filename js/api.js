export class FreeFireAPI {
    constructor(baseUrl = "https://wzapiinfo.vercel.app") {
        this.baseUrl = baseUrl;
    }

    async fetchProfile(uid, useMock = false) {
        if (useMock) {
            try {
                const res = await fetch("get.json");
                if (!res.ok) throw new Error("Local mock data (get.json) not found.");
                const mockData = await res.json();
                return {
                    info: mockData,
                    ban: {
                        data: { is_banned: 0, period: 0 },
                        status: "success"
                    }
                };
            } catch (err) {
                throw new Error("Could not load local mock data: " + err.message);
            }
        }

        try {
            const infoRequest = await fetch(`${this.baseUrl}/get?uid=${uid}`);
            if (!infoRequest.ok) {
                throw new Error("API server returned an error status.");
            }
            const infoData = await infoRequest.json();

            const hasBasicInfo = infoData && (infoData.basic_info || infoData.basicInfo || infoData.info);

            if (infoData.status === "error" || infoData.msg === "T_P_WRONG_ACCOUNT" || !hasBasicInfo) {
                throw new Error(infoData.msg || "Free Fire player profile was not found.");
            }

            let banData = null;
            try {
                const banRequest = await fetch(`${this.baseUrl}/check_ban?uid=${uid}`);
                if (banRequest.ok) {
                    banData = await banRequest.json();
                }
            } catch (e) {
                console.warn("Anti-cheat retrieval request was unsuccessful:", e);
            }

            if (!banData || banData.status === "error") {
                banData = {
                    data: { is_banned: 0, period: 0 },
                    status: "success"
                };
            }

            return {
                info: infoData,
                ban: banData
            };
        } catch (err) {
            throw new Error(err.message || "Could not establish a stable connection with network servers.");
        }
    }
}