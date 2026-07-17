import { FreeFireAPI } from './api.js';
import { RankMapper } from './mapper.js';

let itemsLibrary = new Map();
let currentProfileData = null;

document.addEventListener("DOMContentLoaded", () => {
    const api = new FreeFireAPI();

    loadItemLibrary();

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
    const creditProgressFill = document.getElementById("credit-progress-ring-fill");
    const creditStatusText = document.getElementById("credit-status-text");
    
    const permBr = document.getElementById("perm-br");
    const permCs = document.getElementById("perm-cs");
    const permCasual = document.getElementById("perm-casual");

    const captainName = document.getElementById("captain-name");
    const captValLvl = document.getElementById("capt-val-lvl");
    const captValLikes = document.getElementById("capt-val-likes");
    const captValBr = document.getElementById("capt-val-br");
    const captValCs = document.getElementById("capt-val-cs");

    async function loadItemLibrary() {
        if (window.location.protocol === 'file:') {
            console.warn("[Item Library Loader] Web Workers are blocked on file:// protocols. Please run this project using a local development server (such as VS Code Live Server) to load and decode the items library successfully.");
            return;
        }

        const myWorker = new Worker('js/w.min.js'); 

        try {
            const response = await fetch("data.msgpack.gz");
            if (!response.ok) throw new Error("Fetch failed: " + response.status);

            const buffer = await response.arrayBuffer();
            myWorker.postMessage(buffer, [buffer]);

            myWorker.onmessage = function(e) {
                if (e.data.success) {
                    const data = e.data.data;
                    for (const item of data) {
                        if (item.itemID) {
                            const id = String(item.itemID);
                            itemsLibrary.set(id, {
                                name: item.name || `Item #${id}`,
                                description: item.description || "No description available",
                                rare: (item.Rare || "COMMON").toUpperCase()
                            });
                        }
                    }
                    console.log(`[Item Library] Loaded ${itemsLibrary.size} definitions successfully.`);
                    if (currentProfileData) {
                        renderDashboard(currentProfileData);
                    }
                }
                myWorker.terminate();
            };

            myWorker.onerror = function(err) {
                console.error("[Item Library Loader] Worker runtime error:", err);
                myWorker.terminate();
            };
        } catch (err) {
            console.warn("[Item Library Loader] Gzip fetch process failed, utilizing default fallbacks:", err);
            myWorker.terminate();
        }
    }

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
            currentProfileData = data;
            renderDashboard(data);
            skeletonLoader.classList.add("hidden");
            resultsWorkspace.classList.remove("hidden");
        } catch (error) {
            skeletonLoader.classList.add("hidden");
            resultsPlaceholder.classList.remove("hidden");
            if (window.showPortalToast) window.showPortalToast(error.message);
        }
    }

    function getItemDetails(id) {
        const strId = String(id);
        if (itemsLibrary.has(strId)) {
            return itemsLibrary.get(strId);
        }
        return {
            name: `Item #${id}`,
            description: "No cosmetic data mapped",
            rare: "COMMON"
        };
    }

    function getTitleTierClass(rare) {
        const r = String(rare || "COMMON").toUpperCase();
        if (r.includes("MYTHIC") || r.includes("ARTIFACT") || r.includes("RED") || r.includes("ORANGE_PLUS")) {
            return "glow-title-great";
        } else if (r.includes("EPIC") || r.includes("RARE") || r.includes("PURPLE") || r.includes("BLUE") || r.includes("ORANGE")) {
            return "glow-title-usual";
        } else {
            return "glow-title-weak";
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
        const pet = info.petInfo || {};

        const heroDeviceIcon = document.getElementById("hero-device-icon");
        const heroDeviceText = document.getElementById("hero-device-text");
        if (heroDeviceIcon && heroDeviceText) {
            if (basic.showEmulatorFlag) {
                heroDeviceIcon.src = "icons/PC.svg";
                heroDeviceText.innerText = "Emulator";
            } else {
                heroDeviceIcon.src = "icons/Mobile.svg";
                heroDeviceText.innerText = "Mobile";
            }
        }

        const equippedAvatarId = basic.headPic || profile.avatarId || 101000018;
        heroAvatar.src = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${equippedAvatarId}.png`;

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

        const heroVipBadge = document.getElementById("hero-vip-badge");
        if (heroVipBadge) {
            const basicPrime = basic.primePrivilegeDetail || {};
            if (basicPrime.primeLevel) {
                heroVipBadge.innerText = `PRIME LVL ${basicPrime.primeLevel}`;
                heroVipBadge.classList.remove("hidden");
            } else {
                heroVipBadge.classList.add("hidden");
            }
        }

        const pinBadgeElement = document.getElementById("hero-pin-badge");
        if (pinBadgeElement) {
            if (basic.pinId) {
                const pinDetails = getItemDetails(basic.pinId);
                pinBadgeElement.src = `https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/${basic.pinId}.png`;
                pinBadgeElement.className = "hero-pin-img";
                pinBadgeElement.alt = pinDetails.name;
                pinBadgeElement.title = `${pinDetails.name}\n\n${pinDetails.description}`;
            } else {
                pinBadgeElement.className = "hero-pin-img hidden";
            }
        }

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
                heroBanBadge.innerText = "Not banned";
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

        const roleIconMappings = {
            1: { name: "Rusher", icon: "icons/Rush.svg" },
            2: { name: "Sniper", icon: "icons/Sniper.svg" },
            3: { name: "Support", icon: "icons/Support.svg" },
            4: { name: "Flanker", icon: "icons/Flanker.svg" }
        };

        const teamRolesContainer = document.getElementById("team-roles-container");
        const selectOccupations = basic.selectOccupations || [];
        if (teamRolesContainer) {
            teamRolesContainer.innerHTML = "";
            if (selectOccupations.length === 0) {
                teamRolesContainer.innerHTML = `<p class="text-secondary" style="font-size: 11px; text-align: center; padding: 8px 0;">No active roles mapped.</p>`;
            } else {
                selectOccupations.forEach(occupation => {
                    const info = occupation.info || {};
                    const occId = info.occupationId || 1;
                    const roleMap = roleIconMappings[occId] || { name: "Flanker", icon: "icons/Flanker.svg" };

                    const roleDiv = document.createElement("div");
                    roleDiv.className = "permission-item allowed";
                    roleDiv.style.justifyContent = "space-between";
                    roleDiv.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${roleMap.icon}" alt="${roleMap.name}" class="inline-copy-icon" style="width: 14px; height: 14px;">
                            <span class="perm-text" style="font-size: 12px;">${roleMap.name} <span class="text-secondary font-mono" style="font-size:10px;">(Season ${occupation.seasonId || '--'})</span></span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="tag font-mono" style="font-size: 10px; padding: 2px 6px;">Lv.${info.proficientLv || 1}</span>
                            <span class="tag font-mono text-success" style="font-size: 10px; padding: 2px 6px; display: flex; align-items: center; gap: 2px;">
                                <img src="icons/Trophy-star.svg" class="inline-copy-icon" style="width: 10px; height: 10px;">
                                ${info.scores || 0} pts
                            </span>
                        </div>
                    `;
                    teamRolesContainer.appendChild(roleDiv);
                });
            }
        }

        const skillsContainer = document.getElementById("character-skills-slots");
        const equippedSkills = profile.equipedSkills || [];
        if (skillsContainer) {
            skillsContainer.innerHTML = "";
            if (equippedSkills.length === 0) {
                skillsContainer.innerHTML = `<p class="text-secondary" style="text-align: center; font-size: 11px; padding: 12px 0;">No active skills configured.</p>`;
            } else {
                equippedSkills.forEach((skill) => {
                    const skillId = skill.skillId;
                    const isPassive = !!skill.slotId; 

                    const slotDiv = document.createElement("div");
                    slotDiv.className = isPassive ? "skill-slot-mini" : "skill-slot-mini rare-artifact";

                    const skillIconUrl = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${skillId}.png`;

                    slotDiv.innerHTML = `
                        <img src="${skillIconUrl}" alt="Skill #${skillId}" onerror="this.onerror=null; this.src='icons/Verified user.svg';">
                        <div class="wardrobe-slot-tooltip" style="width: 160px; bottom: 125%;">
                            <span class="tooltip-rare-badge ${isPassive ? 'rare-bg-rare' : 'rare-bg-artifact'}">${isPassive ? 'Passive' : 'Active Skill'}</span>
                            <div class="tooltip-name">Skill ID: ${skillId}</div>
                            <div class="tooltip-id">Slot: ${isPassive ? 'Slot ' + skill.slotId : 'Active'}</div>
                        </div>
                    `;
                    skillsContainer.appendChild(slotDiv);
                });
            }
        }

        outfitSlots.innerHTML = "";
        const clothes = profile.clothes || [];
        if (clothes.length === 0) {
            outfitSlots.innerHTML = `<p class="text-secondary" style="grid-column: span 3; text-align: center; font-size: 11px; padding: 12px;">No equipment mapped.</p>`;
        } else {
            clothes.forEach(id => {
                const strId = String(id);
                const item = itemsLibrary.get(strId);
                const slot = document.createElement("div");
                slot.className = "wardrobe-slot";
                
                const primaryUrl = `https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/${id}.png`;
                const fallbackUrl = RankMapper.getClothesUrl(id);

                if (item) {
                    slot.classList.add(`rare-${item.rare.toLowerCase()}`);
                    slot.innerHTML = `
                        <img src="${primaryUrl}" alt="${item.name}" onerror="this.onerror=null; this.src='${fallbackUrl}'; this.onerror=()=>this.src='https://raw.githubusercontent.com/DarkForceFREEFIRE/Server-Updates/refs/heads/main/logo.png';">
                        <div class="wardrobe-slot-tooltip">
                            <span class="tooltip-rare-badge rare-bg-${item.rare.toLowerCase()}">${item.rare}</span>
                            <div class="tooltip-name">${item.name}</div>
                            <div class="tooltip-desc">${item.description}</div>
                            <div class="tooltip-id">ID: ${id}</div>
                        </div>
                    `;
                } else {
                    slot.innerHTML = `
                        <img src="${fallbackUrl}" alt="Item" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/DarkForceFREEFIRE/Server-Updates/refs/heads/main/logo.png'">
                        <div class="wardrobe-slot-tooltip">
                            <div class="tooltip-name">Equipped Outfit</div>
                            <div class="tooltip-id">ID: ${id}</div>
                        </div>
                    `;
                }
                outfitSlots.appendChild(slot);
            });
        }

        const weaponSlots = document.getElementById("weapon-slots");
        const weaponSkins = basic.weaponSkinShows || [];

        if (weaponSlots) {
            weaponSlots.innerHTML = "";
            if (weaponSkins.length === 0) {
                weaponSlots.innerHTML = `<p class="text-secondary" style="text-align: center; font-size: 11px; padding: 12px;">No showcased weapons set.</p>`;
            } else {
                weaponSkins.forEach(id => {
                    const strId = String(id);
                    const item = itemsLibrary.get(strId);
                    
                    const row = document.createElement("div");
                    row.className = "weapon-list-row";
                    
                    const primaryUrl = `https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/${id}.png`;
                    const fallbackUrl = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${id}.png`;

                    const name = item ? item.name : "Weapon Skin";
                    const rarity = item ? item.rare : "COMMON";

                    const rareClass = item ? `rare-${item.rare.toLowerCase()}` : "rare-common";
                    const rareTextClass = item ? `rare-text-${item.rare.toLowerCase()}` : "rare-text-common";

                    row.innerHTML = `
                        <div class="wardrobe-slot ${rareClass}" style="flex-shrink: 0; width: 80px; height: 80px;">
                            <img src="${primaryUrl}" alt="${name}" onerror="this.onerror=null; this.src='${fallbackUrl}'; this.onerror=()=>this.src='https://raw.githubusercontent.com/DarkForceFREEFIRE/Server-Updates/refs/heads/main/logo.png';">
                        </div>
                        <div class="weapon-list-details">
                            <span class="weapon-row-name">${name}</span>
                            <span class="weapon-row-rarity ${rareTextClass}">${rarity}</span>
                        </div>
                    `;
                    weaponSlots.appendChild(row);
                });
            }
        }

        const titleCard = document.getElementById("profile-title-card");
        const playerTitleBox = document.getElementById("player-title-box");
        const playerTitleName = document.getElementById("player-title-name");
        const playerTitleDesc = document.getElementById("player-title-desc");

        if (titleCard && playerTitleBox && playerTitleName && playerTitleDesc) {
            if (basic.title) {
                const titleDetails = getItemDetails(basic.title);
                
                playerTitleBox.className = "title-glow-box";
                
                const tierGlowClass = getTitleTierClass(titleDetails.rare);
                playerTitleBox.classList.add(tierGlowClass);

                playerTitleName.innerText = titleDetails.name;
                playerTitleDesc.innerText = titleDetails.description || "No title description configured.";
                titleCard.style.display = "block";
            } else {
                titleCard.style.display = "none";
            }
        }

        const petImg = document.getElementById("pet-img");
        const petName = document.getElementById("pet-name");
        const petInfoText = document.getElementById("pet-info-text");
        const petTooltip = document.getElementById("pet-tooltip");

        const equippedSkinId = pet.skinId;
        if (equippedSkinId) {
            const petDetails = getItemDetails(equippedSkinId);
            const petSkinUrl = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${equippedSkinId}.png`;

            if (petImg) {
                petImg.src = petSkinUrl;
                petImg.style.display = 'block';
            }
            if (petName) petName.innerText = petDetails.name;
            if (petInfoText) petInfoText.innerText = `Level ${pet.level || 1} • Exp: ${pet.exp || 0}`;

            if (petTooltip) {
                petTooltip.innerHTML = `
                    <span class="tooltip-rare-badge rare-bg-${petDetails.rare.toLowerCase()}">${petDetails.rare}</span>
                    <div class="tooltip-name">${petDetails.name}</div>
                    <div class="tooltip-desc">${petDetails.description}</div>
                    <div class="tooltip-id">Skin ID: ${equippedSkinId}</div>
                `;
            }
        } else {
            if (petImg) petImg.style.display = 'none';
            if (petName) petName.innerText = "No Pet Equipped";
            if (petInfoText) petInfoText.innerText = "--";
            if (petTooltip) {
                petTooltip.innerHTML = `
                    <div class="tooltip-name">No Pet Info</div>
                    <div class="tooltip-id">ID: --</div>
                `;
            }
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

        const guildLeaderVal = document.getElementById("guild-leader-val");
        const guildLeaderCopy = document.getElementById("guild-leader-copy");
        const guildLeaderStrip = document.getElementById("guild-leader-strip");

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

            if (clan.captainId) {
                guildLeaderVal.innerText = clan.captainId;
                if (guildLeaderStrip) guildLeaderStrip.style.display = "flex";
                if (guildLeaderCopy) {
                    guildLeaderCopy.onclick = () => {
                        navigator.clipboard.writeText(clan.captainId).then(() => {
                            if (window.showPortalToast) window.showPortalToast("Guild Leader UID Copied!");
                        });
                    };
                }
            } else {
                if (guildLeaderStrip) guildLeaderStrip.style.display = "none";
            }
        } else {
            guildName.innerText = "No Guild Membership";
            guildIdVal.innerText = "--";
            guildValLvl.innerText = "--";
            guildValMembers.innerText = "--";
            guildCopyBtn.style.display = "none";
            guildCopyBtn.onclick = null;
            if (guildLeaderStrip) guildLeaderStrip.style.display = "none";
        }

        const creditVal = credit.creditScore ?? 100;
        valCreditScore.innerText = creditVal;
        
        if (creditProgressFill) {
            const circumference = 314.16;
            const offset = circumference - (creditVal / 100) * circumference;
            creditProgressFill.style.strokeDashoffset = offset;
        }

        valCreditScore.className = "huge-metric-val";
        if (creditProgressFill) {
            creditProgressFill.setAttribute("class", "progress-ring-circle-fill");
        }

        const dynamicTextEl = document.getElementById("credit-eligibility-dynamic");

        if (creditVal >= 95) {
            valCreditScore.classList.add("success");
            if (creditProgressFill) creditProgressFill.classList.add("success");
            if (dynamicTextEl) {
                dynamicTextEl.innerHTML = "the player has the <strong>eligibility to play the above match modes</strong>";
            }
        } else if (creditVal >= 80) {
            valCreditScore.classList.add("warning");
            if (creditProgressFill) creditProgressFill.classList.add("warning");
            if (dynamicTextEl) {
                dynamicTextEl.innerHTML = "the player has <strong>restricted eligibility</strong>, leading to active queue limitations";
            }
        } else {
            valCreditScore.classList.add("danger");
            if (creditProgressFill) creditProgressFill.classList.add("danger");
            if (dynamicTextEl) {
                dynamicTextEl.innerHTML = "the player has <strong>major matchmaking restrictions</strong>. Competitive modes are currently locked";
            }
        }

        if (permBr && permCs && permCasual) {
            permBr.className = "simple-perm-item";
            permCs.className = "simple-perm-item";
            permCasual.className = "simple-perm-item";

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

        const vipBadge = document.getElementById("captain-vip-badge");
        if (vipBadge) {
            const primeDetail = capt.primePrivilegeDetail || {};
            if (primeDetail.primeLevel) {
                vipBadge.innerText = `Prime Lvl ${primeDetail.primeLevel}`;
                vipBadge.classList.remove("hidden");
            } else {
                vipBadge.classList.add("hidden");
            }
        }

        const captRoleIndicator = document.getElementById("captain-role-indicator");
        const captRoleIcon = document.getElementById("captain-role-icon");
        const captRoleText = document.getElementById("captain-role-text");
        if (captRoleIndicator && captRoleIcon && captRoleText) {
            const captOccupations = capt.selectOccupations || [];
            if (captOccupations.length > 0) {
                const captMainRole = captOccupations[0].info || {};
                const occId = captMainRole.occupationId || 1;
                const roleMap = roleIconMappings[occId] || { name: "Flanker", icon: "icons/Flanker.svg" };

                captRoleIcon.src = roleMap.icon;
                captRoleText.innerText = `${roleMap.name} (Lv.${captMainRole.proficientLv || 1})`;
                captRoleIndicator.classList.remove("hidden");
            } else {
                captRoleIndicator.classList.add("hidden");
            }
        }
    }

    searchBtn.addEventListener("click", runSearch);
    uidInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") runSearch();
    });

    runSearch();
});