import { FreeFireAPI } from './api.js';
import { RankMapper } from './mapper.js';

document.addEventListener("DOMContentLoaded", () => {
    const api = new FreeFireAPI();

    const searchBtn = document.getElementById("search-btn-field");
    const uidInput = document.getElementById("uid-input-field");
    const apiSourceInput = document.getElementById("api-source-field");

    const resultsPlaceholder = document.getElementById("results-placeholder");
    const skeletonLoader = document.getElementById("skeleton-loader");
    const resultsWorkspace = document.getElementById("results-workspace");

    const heroAvatar = document.getElementById("hero-avatar");
    const heroLevel = document.getElementById("hero-level");
    const heroNickname = document.getElementById("hero-nickname");
    const heroBanBadge = document.getElementById("hero-ban-badge");
    const heroBanIcon = document.getElementById("hero-ban-icon");
    const heroUid = document.getElementById("hero-uid");
    const heroRegion = document.getElementById("hero-region");
    const heroVersion = document.getElementById("hero-version");
    const heroSignature = document.getElementById("hero-signature");
    const copyUidTrigger = document.getElementById("copy-uid-trigger");

    const valExp = document.getElementById("val-exp");
    const valLevel = document.getElementById("val-level");
    const valLikes = document.getElementById("val-likes");
    const valBadges = document.getElementById("val-badges");
    const valCreated = document.getElementById("val-created");
    const valLogin = document.getElementById("val-login");
    const valLang = document.getElementById("val-lang");
    const outfitSlots = document.getElementById("outfit-slots");

    const brRankCard = document.getElementById("br-rank-card");
    const csRankCard = document.getElementById("cs-rank-card");

    const brBadgeImg = document.getElementById("br-badge-img");
    const brBadgeName = document.getElementById("br-badge-name");
    const brBadgePoints = document.getElementById("br-badge-points");
    const brValCurrent = document.getElementById("br-val-current");
    const brValMax = document.getElementById("br-val-max");

    const csBadgeImg = document.getElementById("cs-badge-img");
    const csBadgeName = document.getElementById("cs-badge-name");
    const csBadgePoints = document.getElementById("cs-badge-points");
    const csValCurrent = document.getElementById("cs-val-current");
    const csValMax = document.getElementById("cs-val-max");

    const guildName = document.getElementById("guild-name");
    const guildIdVal = document.getElementById("guild-id-val");
    const guildValLvl = document.getElementById("guild-val-lvl");
    const guildValMembers = document.getElementById("guild-val-members");
    const guildCopyBtn = document.querySelector(".guild-copy-btn");

    const valCreditScore = document.getElementById("val-credit-score");
    const creditProgressFill = document.getElementById("credit-progress-fill");
    const creditStatusText = document.getElementById("credit-status-text");
    
    const permBr = document.getElementById("perm-br");
    const permCs = document.getElementById("perm-cs");
    const permCasual = document.getElementById("perm-casual");

    const captainName = document.getElementById("captain-name");
    const captValLvl = document.getElementById("capt-val-lvl");
    const captValLikes = document.getElementById("capt-val-likes");
    const captValBr = document.getElementById("capt-val-br");
    const captValCs = document.getElementById("capt-val-cs");

    function parseUnixTimestamp(timestamp) {
        if (!timestamp || timestamp === "0") return "N/A";
        const d = new Date(Number(timestamp) * 1000);
        if (isNaN(d.getTime())) return "N/A";
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function getRankGlowClass(name) {
        const lower = name.toLowerCase();
        if (lower.includes("grandmaster")) return "glow-grandmaster";
        if (lower.includes("master")) return "glow-master";
        if (lower.includes("heroic")) return "glow-heroic";
        if (lower.includes("diamond")) return "glow-diamond";
        if (lower.includes("platinum")) return "glow-platinum";
        if (lower.includes("gold")) return "glow-gold";
        if (lower.includes("silver")) return "glow-silver";
        return "glow-bronze";
    }

    function getRankBadgeGlowClass(name) {
        const lower = name.toLowerCase();
        if (lower.includes("grandmaster")) return "glow-badge-grandmaster";
        if (lower.includes("elite master") || lower.includes("master")) return "glow-badge-master";
        if (lower.includes("heroic")) return "glow-badge-heroic";
        if (lower.includes("diamond")) return "glow-badge-diamond";
        if (lower.includes("platinum")) return "glow-badge-platinum";
        if (lower.includes("gold")) return "glow-badge-gold";
        if (lower.includes("silver")) return "glow-badge-silver";
        return "glow-badge-bronze";
    }

    async function runSearch() {
        const uid = uidInput.value.trim();
        if (!uid) {
            if (window.showPortalToast) window.showPortalToast("Provide a valid numeric player UID.");
            return;
        }

        resultsPlaceholder.classList.add("hidden");
        resultsWorkspace.classList.add("hidden");
        skeletonLoader.classList.remove("hidden");

        const useMock = apiSourceInput ? apiSourceInput.value === "mock" : false;

        try {
            const data = await api.fetchProfile(uid, useMock);
            renderDashboard(data);
            skeletonLoader.classList.add("hidden");
            resultsWorkspace.classList.remove("hidden");
        } catch (error) {
            skeletonLoader.classList.add("hidden");
            resultsPlaceholder.classList.remove("hidden");
            if (window.showPortalToast) window.showPortalToast(error.message);
        }
    }

    function renderDashboard(payload) {
        const { info, ban } = payload;
        const basic = info.basicInfo || {};
        const profile = info.profileInfo || {};
        const clan = info.clanBasicInfo || {};
        const capt = info.captainBasicInfo || {};
        const social = info.socialInfo || {};
        const credit = info.creditScoreInfo || {};

        heroAvatar.src = RankMapper.getClothesUrl(profile.avatarId || 101000018);
        heroLevel.innerText = `Lvl.${basic.level || 0}`;
        heroNickname.innerText = basic.nickname || "Operator";
        heroUid.innerText = basic.accountId || "--";
        heroRegion.innerText = basic.region || "SG";
        heroVersion.innerText = basic.releaseVersion || "OB54";
        heroSignature.innerText = social.signature ? `"${social.signature.replace(/\n/g, ' ')}"` : '"No Profile Signature Set"';

        copyUidTrigger.onclick = () => {
            if (basic.accountId) {
                navigator.clipboard.writeText(basic.accountId).then(() => {
                    if (window.showPortalToast) window.showPortalToast("Player UID Copied!");
                });
            }
        };

        if (ban && ban.data) {
            if (ban.data.is_banned === 1) {
                heroBanBadge.innerText = "Banned";
                heroBanBadge.className = "ban-status-badge banned";
                heroBanIcon.src = "icons/Banned.svg";
                heroBanIcon.className = "ban-icon banned";
            } else if (ban.data.period > 0) {
                heroBanBadge.innerText = "Suspended";
                heroBanBadge.className = "ban-status-badge suspended";
                heroBanIcon.src = "icons/Banned.svg";
                heroBanIcon.className = "ban-icon suspended";
            } else {
                heroBanBadge.innerText = "Active";
                heroBanBadge.className = "ban-status-badge active";
                heroBanIcon.src = "icons/NotBanned.svg";
                heroBanIcon.className = "ban-icon active";
            }
        }

        valExp.innerText = basic.exp ? Number(basic.exp).toLocaleString() : "0";
        valLevel.innerText = basic.level || "0";
        valLikes.innerText = basic.liked ? Number(basic.liked).toLocaleString() : "0";
        valBadges.innerText = basic.badgeCnt || "0";
        valCreated.innerText = parseUnixTimestamp(basic.createAt);
        valLogin.innerText = parseUnixTimestamp(basic.lastLoginAt);
        valLang.innerText = social.language ? social.language.replace("Language_", "") : "EN";

        outfitSlots.innerHTML = "";
        const clothes = profile.clothes || [];
        if (clothes.length === 0) {
            outfitSlots.innerHTML = `<p class="text-secondary" style="grid-column: span 3; text-align: center; font-size: 11px; padding: 12px;">No equipment mapped.</p>`;
        } else {
            clothes.forEach(id => {
                const slot = document.createElement("div");
                slot.className = "wardrobe-slot";
                slot.innerHTML = `<img src="${RankMapper.getClothesUrl(id)}" alt="Item" title="ID: ${id}" onerror="this.src='https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/101000018.png'">`;
                outfitSlots.appendChild(slot);
            });
        }

        const br = RankMapper.getBRRank(basic.rankingPoints || 0);
        brBadgeImg.src = `./Free Fire Rank/BR/${br.file}`;
        brBadgeImg.style.display = 'block';
        brBadgeImg.nextElementSibling.classList.add('hidden');
        brBadgeName.innerText = br.name;
        brBadgePoints.innerText = `${(basic.rankingPoints || 0).toLocaleString()} points`;
        brValCurrent.innerText = basic.rankingPoints || "0";
        brValMax.innerText = basic.maxRank || "0";

        const glowClasses = ["glow-bronze", "glow-silver", "glow-gold", "glow-platinum", "glow-diamond", "glow-heroic", "glow-master", "glow-grandmaster"];
        const badgeGlowClasses = ["glow-badge-bronze", "glow-badge-silver", "glow-badge-gold", "glow-badge-platinum", "glow-badge-diamond", "glow-badge-heroic", "glow-badge-master", "glow-badge-grandmaster"];

        if (brRankCard) {
            brRankCard.classList.remove(...glowClasses);
            brRankCard.classList.add(getRankGlowClass(br.name));
        }
        
        const brBadgeDisplay = brBadgeImg.parentElement;
        if (brBadgeDisplay) {
            brBadgeDisplay.classList.remove(...badgeGlowClasses);
            brBadgeDisplay.classList.add(getRankBadgeGlowClass(br.name));
        }

        const cs = RankMapper.getCSRank(basic.csRankingPoints || 0);
        csBadgeImg.src = `./Free Fire Rank/CS/${cs.file}`;
        csBadgeImg.style.display = 'block';
        csBadgeImg.nextElementSibling.classList.add('hidden');
        csBadgeName.innerText = cs.name;
        csBadgePoints.innerText = `${(basic.csRankingPoints || 0).toLocaleString()} stars`;
        csValCurrent.innerText = basic.csRankingPoints || "0";
        csValMax.innerText = basic.csMaxRank || "0";

        if (csRankCard) {
            csRankCard.classList.remove(...glowClasses);
            csRankCard.classList.add(getRankGlowClass(cs.name));
        }

        const csBadgeDisplay = csBadgeImg.parentElement;
        if (csBadgeDisplay) {
            csBadgeDisplay.classList.remove(...badgeGlowClasses);
            csBadgeDisplay.classList.add(getRankBadgeGlowClass(cs.name));
        }

        if (clan.clanId) {
            guildName.innerText = clan.clanName || "Guild Active";
            guildIdVal.innerText = clan.clanId;
            guildValLvl.innerText = clan.clanLevel || "1";
            guildValMembers.innerText = `${clan.memberNum || 0} / ${clan.capacity || 0}`;
            
            guildCopyBtn.style.display = "inline-block";
            guildCopyBtn.onclick = () => {
                navigator.clipboard.writeText(clan.clanId).then(() => {
                    if (window.showPortalToast) window.showPortalToast("Guild ID Copied!");
                });
            };
        } else {
            guildName.innerText = "No Guild Membership";
            guildIdVal.innerText = "--";
            guildValLvl.innerText = "--";
            guildValMembers.innerText = "--";
            guildCopyBtn.style.display = "none";
            guildCopyBtn.onclick = null;
        }

        const creditVal = credit.creditScore ?? 100;
        valCreditScore.innerText = creditVal;
        creditProgressFill.style.width = `${creditVal}%`;

        valCreditScore.className = "huge-metric-val";
        creditProgressFill.className = "fluent-progress-fill";

        if (creditVal >= 95) {
            creditStatusText.innerText = "Perfect Honor Integrity";
            valCreditScore.classList.add("success");
            creditProgressFill.classList.add("success");
        } else if (creditVal >= 80) {
            creditStatusText.innerText = "Honor Warning Status";
            valCreditScore.classList.add("warning");
            creditProgressFill.classList.add("warning");
        } else {
            creditStatusText.innerText = "Matchmaking Restriction";
            valCreditScore.classList.add("danger");
            creditProgressFill.classList.add("danger");
        }

        if (permBr && permCs && permCasual) {
            permBr.className = "permission-item";
            permCs.className = "permission-item";
            permCasual.className = "permission-item";

            if (creditVal >= 95) {
                permBr.classList.add("allowed");
                permCs.classList.add("allowed");
                permCasual.classList.add("allowed");
            } else if (creditVal >= 90) {
                permBr.classList.add("allowed");
                permCs.classList.add("restricted");
                permCasual.classList.add("allowed");
            } else {
                permBr.classList.add("restricted");
                permCs.classList.add("restricted");
                permCasual.classList.add("allowed");
            }
        }

        captainName.innerText = capt.nickname || "N/A";
        captValLvl.innerText = capt.level || "--";
        captValLikes.innerText = capt.liked ? Number(capt.liked).toLocaleString() : "0";

        const captBr = RankMapper.getBRRank(capt.rankingPoints || 0);
        captValBr.innerText = `${captBr.name} (${capt.rankingPoints || 0})`;

        const captCs = RankMapper.getCSRank(capt.csRankingPoints || 0);
        captValCs.innerText = `${captCs.name} (${capt.csRankingPoints || 0})`;
    }

    searchBtn.addEventListener("click", runSearch);
    uidInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") runSearch();
    });

    runSearch();
});