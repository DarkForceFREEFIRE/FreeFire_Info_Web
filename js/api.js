
export class FreeFireAPI {
  constructor(baseUrl = "https://wzapi.vercel.app") {
    this.baseUrl = baseUrl;
  }

  buildUrl(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "AUTO") {
        url.searchParams.append(key, val);
      }
    });
    return url.toString();
  }

  async fetchJson(endpoint, params = {}) {
    try {
      const response = await fetch(this.buildUrl(endpoint, params));
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.warn(`[API] Endpoint /${endpoint} request failed:`, e);
      return null;
    }
  }

  async fetchFullProfile(uid, region = "AUTO") {
    if (!uid) throw new Error("Provide a valid numeric player UID.");

    const [allData, banData] = await Promise.all([
      this.fetchJson("get_all", { uid, region }),
      this.fetchJson("check_ban", { uid, lang: "en" })
    ]);

    const root = allData?.data || allData;
    const personalShow = root?.personal_show || root?.personalShow || root;
    const basic = personalShow?.basic_info || personalShow?.basicInfo;

    if (!allData || allData.status === "error" || allData.msg === "T_P_WRONG_ACCOUNT" || !basic) {
      throw new Error(allData?.msg || allData?.error || "Free Fire player profile was not found.");
    }

    return {
      info: personalShow,
      outfit: root?.outfit || null,
      ban: banData || { data: { is_banned: 0, period: 0 } },
      brStats: root?.stats || null,
      csStats: root?.cs_stats?.cs_stats || root?.cs_stats || null,
      heroicHistory: root?.heroic_history || root?.heroicHistory || null,
      weaponGlory: root?.weapon_glory || root?.weaponGlory || null,
      wishlist: root?.wishlist?.items || (Array.isArray(root?.wishlist) ? root.wishlist : []),
      clanFull: personalShow?.clan_basic_info || null,
      occupation: root?.occupation?.infos || (Array.isArray(root?.occupation) ? root.occupation : [])
    };
  }

  async searchPlayer(name, region = "AUTO") {
    return await this.fetchJson("search", { name, region });
  }
}