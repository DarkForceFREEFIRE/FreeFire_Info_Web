
const MOCK_INFO_RESPONSE = {
  "basicInfo": {
    "accountId": "1059768811",
    "accountType": 1,
    "nickname": "WRㅤWALKERㅤ★",
    "region": "SG",
    "level": 74,
    "exp": 2489122,
    "headPic": 902000301,
    "rank": 320,
    "rankingPoints": 3373,
    "badgeCnt": 128,
    "badgeId": 1001000098,
    "seasonId": 52,
    "liked": 8452,
    "showRank": true,
    "lastLoginAt": "1784184821",
    "csRank": 324,
    "csRankingPoints": 192,
    "weaponSkinShows": [907104019],
    "pinId": 910050001,
    "maxRank": 320,
    "csMaxRank": 324,
    "accountPrefers": {},
    "createAt": "1735382978",
    "title": 904590059,
    "externalIconInfo": {
      "status": "ExternalIconStatus_NOT_IN_USE",
      "showType": "ExternalIconShowType_FRIEND"
    },
    "releaseVersion": "OB54",
    "showBrRank": true,
    "showCsRank": true,
    "socialHighLightsWithBasicInfo": {}
  },
  "profileInfo": {
    "avatarId": 101000018,
    "skinColor": 50,
    "clothes": [208000000, 203037023, 204037023, 214000000, 205039027, 211000000],
    "equipedSkills": [16, 1206, 8, 1, 16, 3006, 8, 2, 16, 2806, 8, 3, 16, 1806],
    "isSelected": true,
    "isSelectedAwaken": true,
    "unlockTime": 1737283093,
    "isMarkedStar": true
  },
  "clanBasicInfo": {
    "clanId": "1028000098",
    "clanName": "Walker Elite",
    "captainId": "2805186338",
    "clanLevel": 5,
    "capacity": 55,
    "memberNum": 42
  },
  "captainBasicInfo": {
    "accountId": "2805186338",
    "accountType": 1,
    "nickname": "WRㅤCAPTAIN",
    "region": "SG",
    "level": 82,
    "exp": 4891002,
    "bannerId": 901035009,
    "headPic": 902026014,
    "rank": 324,
    "rankingPoints": 5122,
    "badgeCnt": 140,
    "badgeId": 1001000098,
    "seasonId": 52,
    "liked": 22452,
    "showRank": true,
    "lastLoginAt": "1784128712",
    "csRank": 324,
    "csRankingPoints": 435,
    "weaponSkinShows": [907103107],
    "pinId": 910032003,
    "maxRank": 324,
    "csMaxRank": 324,
    "accountPrefers": {},
    "createAt": "1612852843",
    "title": 904590059,
    "externalIconInfo": {
      "status": "ExternalIconStatus_NOT_IN_USE",
      "showType": "ExternalIconShowType_FRIEND"
    },
    "releaseVersion": "OB54",
    "showBrRank": true,
    "showCsRank": true,
    "socialHighLightsWithBasicInfo": {}
  },
  "petInfo": {
    "id": 1300000113,
    "level": 4,
    "exp": 503,
    "isSelected": true,
    "skinId": 1310000132,
    "selectedSkillId": 1315000012
  },
  "socialInfo": {
    "accountId": "10597688191",
    "language": "Language_EN",
    "timeActive": "TimeActive_AFTERNOON",
    "signature": "Join our official Walker channels!",
    "rankShow": "RankShow_CS"
  },
  "diamondCostRes": {
    "diamondCost": 390
  },
  "creditScoreInfo": {
    "creditScore": 100,
    "periodicSummaryEndTime": "1784181817"
  }
};

const MOCK_BAN_RESPONSE = {
  "data": {
    "is_banned": 0,
    "period": 0
  },
  "msg": "",
  "status": "success"
};

export class FreeFireAPI {
    constructor(baseUrl = "https://wzapiinfo.vercel.app") {
        this.baseUrl = baseUrl;
    }

    async fetchProfile(uid, useMock = false) {
        if (useMock) {
            await new Promise(res => setTimeout(res, 800));
            return {
                info: MOCK_INFO_RESPONSE,
                ban: MOCK_BAN_RESPONSE
            };
        }

        try {
            const infoRequest = await fetch(`${this.baseUrl}/get?uid=${uid}`);
            if (!infoRequest.ok) {
                throw new Error("API server returned an error status.");
            }
            const infoData = await infoRequest.json();

            if (infoData.status === "error" || infoData.msg === "T_P_WRONG_ACCOUNT" || !infoData.basicInfo) {
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