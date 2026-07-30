export const RankMapper = {
    getBRRank(points) {
        const p = Number(points) || 0;
        if (p < 1300) return { name: "Bronze I-III", file: "B (1).png", minPts: 0, maxPts: 1300, nextRank: "Silver I" };
        if (p < 1400) return { name: "Silver I", file: "S (1).png", minPts: 1300, maxPts: 1400, nextRank: "Silver II" };
        if (p < 1500) return { name: "Silver II", file: "S (2).png", minPts: 1400, maxPts: 1500, nextRank: "Silver III" };
        if (p < 1600) return { name: "Silver III", file: "S (3).png", minPts: 1500, maxPts: 1600, nextRank: "Gold I" };
        if (p < 1725) return { name: "Gold I", file: "G (1).png", minPts: 1600, maxPts: 1725, nextRank: "Gold II" };
        if (p < 1850) return { name: "Gold II", file: "G (2).png", minPts: 1725, maxPts: 1850, nextRank: "Gold III" };
        if (p < 1975) return { name: "Gold III", file: "G (3).png", minPts: 1850, maxPts: 1975, nextRank: "Gold IV" };
        if (p < 2100) return { name: "Gold IV", file: "G (4).png", minPts: 1975, maxPts: 2100, nextRank: "Platinum I" };
        if (p < 2225) return { name: "Platinum I", file: "P (1).png", minPts: 2100, maxPts: 2225, nextRank: "Platinum II" };
        if (p < 2350) return { name: "Platinum II", file: "P (2).png", minPts: 2225, maxPts: 2350, nextRank: "Platinum III" };
        if (p < 2474) return { name: "Platinum III", file: "P (3).png", minPts: 2350, maxPts: 2474, nextRank: "Platinum IV" };
        if (p < 2599) return { name: "Platinum IV", file: "P (4).png", minPts: 2474, maxPts: 2599, nextRank: "Platinum V" };
        if (p < 2749) return { name: "Platinum V", file: "P (5).png", minPts: 2599, maxPts: 2749, nextRank: "Diamond I" };
        
        if (p < 2899) return { name: "Diamond I", file: "D (1).png", minPts: 2749, maxPts: 2899, nextRank: "Diamond II" };
        if (p < 3049) return { name: "Diamond II", file: "D (2).png", minPts: 2899, maxPts: 3049, nextRank: "Diamond III" };
        if (p < 3199) return { name: "Diamond III", file: "D (3).png", minPts: 3049, maxPts: 3199, nextRank: "Diamond IV" };
        if (p < 3349) return { name: "Diamond IV", file: "D (4).png", minPts: 3199, maxPts: 3349, nextRank: "Diamond V" };
        if (p < 3499) return { name: "Diamond V", file: "D (5).png", minPts: 3349, maxPts: 3499, nextRank: "Heroic" };
        
        if (p < 3799) return { name: "Heroic", file: "H (1).png", minPts: 3499, maxPts: 3799, nextRank: "Heroic Stars" };
        if (p < 4299) return { name: "Heroic", file: "H (2).png", minPts: 3799, maxPts: 4299, nextRank: "Elite Heroic" };
        if (p < 4899) return { name: "Elite Heroic", file: "H (3).png", minPts: 4299, maxPts: 4899, nextRank: "Elite Heroic" };
        if (p < 5499) return { name: "Elite Heroic", file: "H (4).png", minPts: 4899, maxPts: 5499, nextRank: "Elite Heroic" };
        if (p < 6299) return { name: "Elite Heroic", file: "H (5).png", minPts: 5499, maxPts: 6299, nextRank: "Master" };
        
        if (p < 7099) return { name: "Master", file: "M (1).png", minPts: 6299, maxPts: 7099, nextRank: "Master" };
        if (p < 7999) return { name: "Master", file: "M (2).png", minPts: 7099, maxPts: 7999, nextRank: "Elite Master" };
        if (p < 8999) return { name: "Elite Master", file: "M (3).png", minPts: 7999, maxPts: 8999, nextRank: "Elite Master" };
        if (p < 9999) return { name: "Elite Master", file: "M (4).png", minPts: 8999, maxPts: 9999, nextRank: "Grandmaster" };
        return { name: "Grandmaster", file: "GM (1).png", minPts: 9999, maxPts: 9999, nextRank: "Max Rank" };
    },

    getCSRank(stars) {
        const s = Number(stars) || 0;

        // Bronze Tier (3 stars per sub-tier)
        if (s <= 3) return { name: "Bronze 1", file: "B1.png", rankStars: Math.max(0, s), totalStars: s, subTierMax: 3 };
        if (s <= 6) return { name: "Bronze 2", file: "B2.png", rankStars: s - 3, totalStars: s, subTierMax: 3 };
        if (s <= 9) return { name: "Bronze 3", file: "B3.png", rankStars: s - 6, totalStars: s, subTierMax: 3 };

        // Silver Tier (4 stars per sub-tier)
        if (s <= 13) return { name: "Silver 1", file: "S1.png", rankStars: s - 9, totalStars: s, subTierMax: 4 };
        if (s <= 17) return { name: "Silver 2", file: "S2.png", rankStars: s - 13, totalStars: s, subTierMax: 4 };
        if (s <= 21) return { name: "Silver 3", file: "S3.png", rankStars: s - 17, totalStars: s, subTierMax: 4 };

        // Gold Tier (4 stars per sub-tier)
        if (s <= 25) return { name: "Gold 1", file: "G1.png", rankStars: s - 21, totalStars: s, subTierMax: 4 };
        if (s <= 29) return { name: "Gold 2", file: "G2.png", rankStars: s - 25, totalStars: s, subTierMax: 4 };
        if (s <= 33) return { name: "Gold 3", file: "G3.png", rankStars: s - 29, totalStars: s, subTierMax: 4 };
        if (s <= 37) return { name: "Gold 4", file: "G4.png", rankStars: s - 33, totalStars: s, subTierMax: 4 };

        // Platinum Tier (5 stars per sub-tier)
        if (s <= 42) return { name: "Platinum 1", file: "P1.png", rankStars: s - 37, totalStars: s, subTierMax: 5 };
        if (s <= 47) return { name: "Platinum 2", file: "P2.png", rankStars: s - 42, totalStars: s, subTierMax: 5 };
        if (s <= 52) return { name: "Platinum 3", file: "P3.png", rankStars: s - 47, totalStars: s, subTierMax: 5 };
        if (s <= 57) return { name: "Platinum 4", file: "P4.png", rankStars: s - 52, totalStars: s, subTierMax: 5 };
        if (s <= 62) return { name: "Platinum 5", file: "P5.png", rankStars: s - 57, totalStars: s, subTierMax: 5 };

        // Diamond Tier (5 stars per sub-tier)
        if (s <= 67) return { name: "Diamond 1", file: "D1.png", rankStars: s - 62, totalStars: s, subTierMax: 5 };
        if (s <= 72) return { name: "Diamond 2", file: "D2.png", rankStars: s - 67, totalStars: s, subTierMax: 5 };
        if (s <= 77) return { name: "Diamond 3", file: "D3.png", rankStars: s - 72, totalStars: s, subTierMax: 5 };
        if (s <= 82) return { name: "Diamond 4", file: "D4.png", rankStars: s - 77, totalStars: s, subTierMax: 5 };
        if (s <= 87) return { name: "Diamond 5", file: "D5.png", rankStars: s - 82, totalStars: s, subTierMax: 5 };

        // Heroic & Above (Calculated past 87 threshold)
        const heroicStars = s - 87;

        if (s <= 112) return { name: "Heroic", file: "CS-H1.png", rankStars: heroicStars, totalStars: s };
        if (s <= 136) return { name: "Elite Heroic", file: "CS-H2.png", rankStars: heroicStars, totalStars: s };
        if (s <= 186) return { name: "Master", file: "M.png", rankStars: heroicStars, totalStars: s };
        if (s <= 286) return { name: "Elite Master", file: "EM.png", rankStars: heroicStars, totalStars: s };

        if (s <= 386) return { name: "Grandmaster I", file: "CSGM1.png", rankStars: heroicStars, totalStars: s };
        if (s <= 486) return { name: "Grandmaster II", file: "CSGM2.png", rankStars: heroicStars, totalStars: s };
        if (s <= 586) return { name: "Grandmaster III", file: "CSGM3.png", rankStars: heroicStars, totalStars: s };
        if (s <= 686) return { name: "Grandmaster IV", file: "CSGM4.png", rankStars: heroicStars, totalStars: s };
        if (s <= 786) return { name: "Grandmaster V", file: "CSGM5.png", rankStars: heroicStars, totalStars: s };
        return { name: "Grandmaster VI", file: "CSGM6.png", rankStars: heroicStars, totalStars: s };
    },

    // Reference: Google Gemini AI used to calculate the CS ranking system.
    // Reference: Garena Free Fire ranking guide for the BR ranking system.

    getClothesUrl(id) {
        return `https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/${id}.png`;
    }
};