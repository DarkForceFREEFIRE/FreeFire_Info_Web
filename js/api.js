export class FreeFireAPI {
  constructor(baseUrl = "https://wzapiinfo.vercel.app") {
    this.baseUrl = baseUrl;
  }

  async fetchProfile(uid, region = "AUTO", useMock = false) {
    if (!uid) {
      throw new Error("Provide a valid numeric player UID.");
    }

    // Build API URL with region parameter if selected
    let infoUrl = `${this.baseUrl}/get?uid=${encodeURIComponent(uid)}`;
    if (region && region !== "AUTO") {
      infoUrl += `&region=${encodeURIComponent(region)}`;
    }

    try {
      // 1. Fetch Profile Data from wzapiinfo.vercel.app
      const infoRequest = await fetch(infoUrl);
      if (!infoRequest.ok) {
        const errData = await infoRequest.json().catch(() => ({}));
        throw new Error(errData.error || `API server error (${infoRequest.status})`);
      }

      const infoData = await infoRequest.json();

      // Verify that profile data exists
      const hasBasicInfo =
        infoData && (infoData.basic_info || infoData.basicInfo || infoData.info);

      if (
        infoData.status === "error" ||
        infoData.msg === "T_P_WRONG_ACCOUNT" ||
        !hasBasicInfo
      ) {
        throw new Error(
          infoData.msg || infoData.error || "Free Fire player profile was not found."
        );
      }

      // 2. Fetch Anti-Cheat / Ban Status
      let banData = null;
      try {
        const banRequest = await fetch(
          `${this.baseUrl}/check_ban?uid=${encodeURIComponent(uid)}`
        );
        if (banRequest.ok) {
          banData = await banRequest.json();
        }
      } catch (e) {
        console.warn("Anti-cheat retrieval request was unsuccessful:", e);
      }

      // Fallback default ban data if ban endpoint fails
      if (!banData || banData.status === "error") {
        banData = {
          data: { is_banned: 0, period: 0 },
          status: "success",
        };
      }

      // Return unified structure required by renderDashboard
      return {
        info: infoData,
        ban: banData,
      };
    } catch (err) {
            throw new Error(err.message || "Could not establish a stable connection with network servers.");
        }
    }
}