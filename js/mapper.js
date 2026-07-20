export const RankMapper = {
    getBRRank(points) {
        if (points < 1300) return { name: "Bronze I-III", file: "B (1).png" };
        if (points < 1400) return { name: "Silver I", file: "S (1).png" };
        if (points < 1500) return { name: "Silver II", file: "S (2).png" };
        if (points < 1600) return { name: "Silver III", file: "S (3).png" };
        if (points < 1725) return { name: "Gold I", file: "G (1).png" };
        if (points < 1850) return { name: "Gold II", file: "G (2).png" };
        if (points < 1975) return { name: "Gold III", file: "G (3).png" };
        if (points < 2100) return { name: "Gold IV", file: "G (4).png" };
        if (points < 2225) return { name: "Platinum I", file: "P (1).png" };
        if (points < 2350) return { name: "Platinum II", file: "P (2).png" };
        if (points < 2474) return { name: "Platinum III", file: "P (3).png" };
        if (points < 2599) return { name: "Platinum IV", file: "P (4).png" };
        if (points < 2749) return { name: "Platinum V", file: "P (5).png" };
        
        if (points < 2899) return { name: "Diamond I", file: "D (1).png" };
        if (points < 3049) return { name: "Diamond II", file: "D (2).png" };
        if (points < 3199) return { name: "Diamond III", file: "D (3).png" };
        if (points < 3349) return { name: "Diamond IV", file: "D (4).png" };
        if (points < 3499) return { name: "Diamond V", file: "D (5).png" };
        
        if (points < 3799) return { name: "Heroic", file: "H (1).png" };
        if (points < 4299) return { name: "Heroic", file: "H (2).png" };
        if (points < 4899) return { name: "Elite Heroic", file: "H (3).png" };
        if (points < 5499) return { name: "Elite Heroic", file: "H (4).png" };
        if (points < 6299) return { name: "Elite Heroic", file: "H (5).png" };
        
        if (points < 7099) return { name: "Master", file: "M (1).png" };
        if (points < 7999) return { name: "Master", file: "M (2).png" };
        if (points < 8999) return { name: "Elite Master", file: "M (3).png" };
        if (points < 9999) return { name: "Elite Master", file: "M (4).png" };
        return { name: "Grandmaster", file: "GM (1).png" };
    },

    getCSRank(stars) {
        if (stars <= 1) return { name: "Bronze 1", file: "B1.png" };
        if (stars === 2) return { name: "Bronze 2", file: "B2.png" };
        if (stars === 3) return { name: "Bronze 3", file: "B3.png" };
        if (stars <= 4) return { name: "Silver 1", file: "S1.png" };
        if (stars === 5) return { name: "Silver 2", file: "S2.png" };
        if (stars === 6) return { name: "Silver 3", file: "S3.png" };
        if (stars <= 7) return { name: "Gold 1", file: "G1.png" };
        if (stars === 8) return { name: "Gold 2", file: "G2.png" };
        if (stars === 9) return { name: "Gold 3", file: "G3.png" };
        if (stars === 10) return { name: "Gold 4", file: "G4.png" };
        if (stars <= 11) return { name: "Platinum 1", file: "P1.png" };
        if (stars === 12) return { name: "Platinum 2", file: "P2.png" };
        if (stars === 13) return { name: "Platinum 3", file: "P3.png" };
        if (stars === 14) return { name: "Platinum 4", file: "P4.png" };
        if (stars === 15) return { name: "Platinum 5", file: "P5.png" };
        if (stars <= 16) return { name: "Diamond 1", file: "D1.png" };
        if (stars === 17) return { name: "Diamond 2", file: "D2.png" };
        if (stars === 18) return { name: "Diamond 3", file: "D3.png" };
        if (stars === 19) return { name: "Diamond 4", file: "D5.png" };
        if (stars === 20) return { name: "Diamond 5", file: "D5.png" };
        
        if (stars <= 24) return { name: "Heroic", file: "CS-H1.png" };
        if (stars <= 49) return { name: "Elite Heroic", file: "CS-H2.png" };
        
        if (stars <= 99) return { name: "Master", file: "M.png" };
        if (stars <= 199) return { name: "Elite Master", file: "EM.png" };
        if (stars <= 299) return { name: "Grandmaster I", file: "CSGM1.png" };
        if (stars <= 399) return { name: "Grandmaster II", file: "CSGM2.png" };
        if (stars <= 499) return { name: "Grandmaster III", file: "CSGM3.png" };
        if (stars <= 699) return { name: "Grandmaster IV", file: "CSGM4.png" };
        if (stars <= 799) return { name: "Grandmaster V", file: "CSGM5.png" };
        return { name: "Grandmaster VI", file: "CSGM6.png" };
    },
    /**
     * @param {number|string} id 
     */
    getClothesUrl(id) {
        return `https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/${id}.png`;
    }
};