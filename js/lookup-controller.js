import { FreeFireAPI } from "./api.js";
import { RankMapper } from "./mapper.js";

const FF_WEAPON_MAP = {
  0: "AK47", 1: "Fist", 2: "M4A1", 3: "USP", 4: "AWM", 5: "M1014",
  6: "AK47", 7: "UMP", 8: "MP5", 9: "Desert Eagle", 10: "G18",
  11: "M14", 12: "SCAR", 13: "VSS", 14: "GROZA", 15: "MP40",
  16: "Pan", 17: "Machete", 18: "SKS", 19: "M249", 20: "M1873",
  21: "Kar98k", 24: "FAMAS", 25: "M500", 26: "SVD", 27: "Bat",
  28: "XM8", 29: "SPAS12", 30: "M60", 32: "P90", 33: "AN94",
  34: "Katana", 35: "CG15", 39: "Plasma", 41: "M1887", 43: "Thompson",
  45: "M82B", 46: "AUG", 47: "PARAFAL", 48: "Woodpecker", 49: "Vector",
  50: "MAG-7", 51: "Scythe", 54: "Kord", 55: "M1917", 56: "USP-2",
  57: "Kingfisher", 58: "Mini Uzi", 60: "MP5-I", 62: "VSS-I", 65: "AWM-Y",
  67: "FAMAS-I", 70: "GROZA-X", 71: "M249-X", 72: "SVD-Y", 73: "G36",
  75: "M24", 78: "Treatment Laser Gun", 80: "M4A1-I", 81: "M4A1-II",
  82: "M4A1-III", 86: "Charge Buster", 88: "MAC10", 89: "AC80",
  93: "Treatment Pistol", 99: "Shield Gun", 100: "Flamethrower",
  119: "M1887-X", 120: "MP5-II", 121: "MP5-III", 124: "VSS-II",
  125: "VSS-III", 130: "FAMAS-II", 131: "FAMAS-III", 150: "Bizon",
  178: "SCAR-I", 179: "SCAR-II", 180: "SCAR-III", 181: "Trogon",
  182: "Trogon (Grenade)", 184: "M1014-I", 185: "M1014-II", 186: "M1014-III",
  193: "AUG-I", 194: "AUG-II", 195: "AUG-III", 197: "VSK94",
  228: "MAC10-I", 229: "MAC10-II", 230: "MAC10-III", 602: "Flashbang",
  608: "Ice Grenade", 1201: "Gloo Wall", 21001: "Treatment Pistol-Y", 21002: "M590"
};

const RARITY_MAP = {
  "WHITE": "COMMON", "GREEN": "UNCOMMON", "BLUE": "RARE",
  "PURPLE": "EPIC", "PURPLE_PLUS": "EPIC_PLUS", "ORANGE": "MYTHIC",
  "ORANGE_PLUS": "MYTHIC_PLUS", "RED": "LEGENDARY", "NONE": "COMMON"
};

const ROLE_MAP = {
  1: { name: "Rusher", icon: "icons/Rush.svg" },
  2: { name: "Sniper", icon: "icons/Sniper.svg" },
  3: { name: "Support", icon: "icons/Support.svg" },
  4: { name: "Flanker", icon: "icons/Flanker.svg" }
};

const ALL_ROLES_MAP = {
  1: { name: "Rusher", icon: "icons/Rush.svg" },
  2: { name: "Sniper", icon: "icons/Sniper.svg" },
  3: { name: "Support", icon: "icons/Support.svg" },
  4: { name: "Flanker", icon: "icons/Flanker.svg" },
  5: { name: "Bomber", icon: "icons/Items.svg" }
};

const TIME_ONLINE_MAP = {
  1: "Workdays", 2: "Weekends", 1000: "Anytime",
  TimeOnline_WORKDAY: "Workdays", TimeOnline_WEEKEND: "Weekends", TimeOnline_NONE: "Anytime"
};

const TIME_ACTIVE_MAP = {
  1: "Morning", 2: "Afternoon", 3: "Night", 1000: "Anytime",
  TimeActive_MORNING: "Morning", TimeActive_AFTERNOON: "Afternoon", TimeActive_NIGHT: "Night", TimeActive_NONE: "Anytime"
};

const BATTLE_TAG_MAP = {
  1101: "Domination",
  1102: "Uncrown",
  1103: "Best Partner",
  1104: "Sniper",
  1105: "Melee",
  1106: "Peacemaker",
  1107: "Ambush",
  1108: "Shortstop",
  1109: "Rampage",
  1110: "Leader",

  PlayerBattleTagID_DOMINATION: "Domination",
  PlayerBattleTagID_UNCROWN: "Uncrown",
  PlayerBattleTagID_BESTPARTNER: "Best Partner",
  PlayerBattleTagID_SNIPER: "Sniper",
  PlayerBattleTagID_MELEE: "Melee",
  PlayerBattleTagID_PEACEMAKER: "Peacemaker",
  PlayerBattleTagID_AMBUSH: "Ambush",
  PlayerBattleTagID_SHORTSTOP: "Shortstop",
  PlayerBattleTagID_RAMPAGE: "Rampage",
  PlayerBattleTagID_LEADER: "Leader"
};

const SOCIAL_TAG_MAP = {
  
  2101: "Fashionista",
  2102: "Social Butterfly",
  2103: "Veteran",
  2104: "Newbie",
  2105: "Play for Win",
  2106: "Play for Fun",
  2107: "Voice On",
  2108: "Voice Off",

  SocialTag_FASHION: "Fashionista",
  SocialTag_SOCIAL: "Social Butterfly",
  SocialTag_VETERAN: "Veteran",
  SocialTag_NEWBIE: "Newbie",
  SocialTag_PLAYFORWIN: "Play for Win",
  SocialTag_PLAYFORFUN: "Play for Fun",
  SocialTag_VOICEON: "Voice On",
  SocialTag_VOICEOFF: "Voice Off"
};

const HIGHLIGHT_LABELS = {
  1: "BR Booyah",
  2: "CS MVP",
  3: "BR Win Streak",
  4: "CS Win Streak",
  5: "CS Rank Up",
  6: "Team Ace",
  7: "Weapon Glory",
  9: "BR Rank Up",
  10: "BR Streak Excellent",
  11: "CS Streak Excellent",
  12: "Veteran Player",
  13: "Ranking Title",
  14: "CS Peak Title",

  HighLight_BR_WIN: "BR Booyah",
  HighLight_CS_MVP: "CS MVP",
  HighLight_BR_STREAK_WIN: "BR Win Streak",
  HighLight_CS_STREAK_WIN: "CS Win Streak",
  HighLight_CS_RANK_GROUP_UPGRADE: "CS Rank Up",
  HighLight_TEAM_ACE: "Team Ace",
  HighLight_WEAPON_POWER_TITLE: "Weapon Glory",
  HighLight_BR_RANK_GROUP_UPGRADE: "BR Rank Up",
  HighLight_BR_STREAK_WIN_EXECELLENT: "BR Streak Excellent",
  HighLight_CS_STREAK_WIN_EXECELLENT: "CS Streak Excellent",
  HighLight_VETERAN: "Veteran Player",
  HighLight_RANKING_TITLE: "Ranking Title",
  HighLight_CS_PEAK_TITLE: "CS Peak Title"
};

const GLOW_CLASSES = [
  "glow-bronze", "glow-silver", "glow-gold", "glow-platinum",
  "glow-diamond", "glow-heroic", "glow-master", "glow-grandmaster"
];

const BADGE_GLOW_CLASSES = [
  "glow-badge-bronze", "glow-badge-silver", "glow-badge-gold", "glow-badge-platinum",
  "glow-badge-diamond", "glow-badge-heroic", "glow-badge-master", "glow-badge-grandmaster"
];

let itemsLibrary = new Map();
let currentProfileData = null;
let currentCombatMode = "quad";
let currentSearchType = "uid";

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

function parseUnixTimestamp(timestamp) {
  if (!timestamp || timestamp === "0") return "N/A";
  const d = new Date(Number(timestamp) * 1000);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getRankGlowClass(name) {
  const lower = (name || "").toLowerCase();
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
  const lower = (name || "").toLowerCase();
  if (lower.includes("grandmaster")) return "glow-badge-grandmaster";
  if (lower.includes("elite master") || lower.includes("master")) return "glow-badge-master";
  if (lower.includes("heroic")) return "glow-badge-heroic";
  if (lower.includes("diamond")) return "glow-badge-diamond";
  if (lower.includes("platinum")) return "glow-badge-platinum";
  if (lower.includes("gold")) return "glow-badge-gold";
  if (lower.includes("silver")) return "glow-badge-silver";
  return "glow-badge-bronze";
}

function getTitleTierClass(rare) {
  const r = String(rare || "COMMON").toUpperCase();
  if (["LEGENDARY", "MYTHIC", "MYTHIC_PLUS", "ARTIFACT"].includes(r)) {
    return "glow-title-great";
  }
  if (["EPIC", "EPIC_PLUS", "RARE"].includes(r)) {
    return "glow-title-usual";
  }
  return "glow-title-weak";
}

function parseSignatureToHTML(text) {
  if (!text) return '"No Profile Signature Set"';
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tokens = escaped.split(/(\[[a-zA-Z0-9]{1,6}\]|\n)/);
  let result = "";
  let currentBold = false, currentItalic = false, currentUnderline = false, currentStrike = false;
  let currentColor = null, activeSpanCount = 0;

  function getSpans() {
    let style = "";
    if (currentBold) style += "font-weight: bold; ";
    if (currentItalic) style += "font-style: italic; ";
    const deco = [];
    if (currentUnderline) deco.push("underline");
    if (currentStrike) deco.push("line-through");
    if (deco.length > 0) style += `text-decoration: ${deco.join(" ")}; `;
    if (currentColor) style += `color: #${currentColor}; `;
    return style ? `<span style="${style}">` : "<span>";
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;
    if (token === "\n") {
      result += "<br>";
      continue;
    }
    const tagMatch = token.match(/^\[([a-zA-Z0-9]{1,6})\]$/);
    if (tagMatch) {
      const tagVal = tagMatch[1].toLowerCase();
      if (tagVal === "b") currentBold = true;
      else if (tagVal === "i") currentItalic = true;
      else if (tagVal === "u") currentUnderline = true;
      else if (tagVal === "s") currentStrike = true;
      else if (/^[0-9a-fA-F]{6}$/.test(tagVal)) currentColor = tagVal;
      else if (tagVal === "c") {
        currentColor = null;
        currentBold = false;
        currentItalic = false;
        currentUnderline = false;
        currentStrike = false;
      }
      if (activeSpanCount > 0) {
        result += "</span>";
        activeSpanCount--;
      }
      result += getSpans();
      activeSpanCount++;
    } else {
      if (activeSpanCount === 0) {
        result += getSpans();
        activeSpanCount++;
      }
      result += token;
    }
  }

  while (activeSpanCount > 0) {
    result += "</span>";
    activeSpanCount--;
  }
  return result;
}

function initGlobalTooltip() {
  let tooltipEl = document.getElementById("global-portal-tooltip");
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "global-portal-tooltip";
    document.body.appendChild(tooltipEl);
  }

  document.addEventListener("mouseover", (e) => {
    const slot = e.target.closest(".wardrobe-slot, .pet-badge-display, .weapon-slot, .skill-slot-mini");
    if (!slot) return;

    const inlineTooltip = slot.querySelector(".wardrobe-slot-tooltip");
    if (!inlineTooltip || !inlineTooltip.innerHTML.trim()) return;

    tooltipEl.innerHTML = inlineTooltip.innerHTML;
    tooltipEl.classList.add("visible");

    const rect = slot.getBoundingClientRect();
    const tooltipWidth = 200;
    const tooltipHeight = tooltipEl.offsetHeight || 80;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(12, Math.min(window.innerWidth - tooltipWidth - 12, left));

    let top = rect.top - tooltipHeight - 8;
    if (top < 10) top = rect.bottom + 8;

    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top}px`;
  });

  document.addEventListener("mouseout", (e) => {
    const slot = e.target.closest(".wardrobe-slot, .pet-badge-display, .weapon-slot, .skill-slot-mini");
    if (slot && !slot.contains(e.relatedTarget)) {
      tooltipEl.classList.remove("visible");
    }
  });

  document.addEventListener("scroll", () => tooltipEl.classList.remove("visible"), true);
}

document.addEventListener("DOMContentLoaded", () => {
  const api = new FreeFireAPI();
  initGlobalTooltip();
  loadItemLibrary();

  const searchBtn = document.getElementById("search-btn-field");
  const searchBtnText = document.getElementById("search-btn-text");
  const uidInput = document.getElementById("uid-input-field");
  const searchInputLabel = document.getElementById("search-input-label");
  const regionSelect = document.getElementById("region-select-field");

  const byUidBtn = document.getElementById("search-by-uid-btn");
  const byNameBtn = document.getElementById("search-by-name-btn");

  const searchModal = document.getElementById("search-modal");
  const searchResultsList = document.getElementById("search-results-list");
  const closeSearchModal = document.getElementById("close-search-modal");

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
  const heroPassBadge = document.getElementById("hero-pass-badge");
  const heroCreatorTag = document.getElementById("hero-creator-tag");
  const copyUidTrigger = document.getElementById("copy-uid-trigger");

  const valExp = document.getElementById("val-exp");
  const valLevel = document.getElementById("val-level");
  const valLikes = document.getElementById("val-likes");
  const valBadges = document.getElementById("val-badges");
  const valCreated = document.getElementById("val-created");
  const valLogin = document.getElementById("val-login");
  const valHippoWorth = document.getElementById("val-hippo-worth");
  const valPassStatus = document.getElementById("val-pass-status");
  const valSchedulePref = document.getElementById("val-schedule-pref");

  const outfitSlots = document.getElementById("outfit-slots");
  const battleTagsContainer = document.getElementById("battle-tags-container");
  const socialHighlightsContainer = document.getElementById("social-highlights-container");

  const sparkStatusText = document.getElementById("spark-status-text");
  const sparkLevelBadge = document.getElementById("spark-level-badge");
  const sparkStreakDays = document.getElementById("spark-streak-days");
  const sparkPyroImg = document.getElementById("spark-pyro-img");
  const bpHistoryContainer = document.getElementById("bp-history-container");

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
  const csStarsContainer = document.getElementById("cs-stars-container");
  const csValCurrent = document.getElementById("cs-val-current");
  const csValMax = document.getElementById("cs-val-max");

  const guildName = document.getElementById("guild-name");
  const guildIdVal = document.getElementById("guild-id-val");
  const guildValLvl = document.getElementById("guild-val-lvl");
  const guildValMembers = document.getElementById("guild-val-members");
  const guildCopyBtn = document.querySelector(".guild-copy-btn");

  const valCreditScore = document.getElementById("val-credit-score");
  const creditProgressFill = document.getElementById("credit-progress-ring-fill");

  const permBr = document.getElementById("perm-br");
  const permCs = document.getElementById("perm-cs");
  const permCasual = document.getElementById("perm-casual");

  const captainName = document.getElementById("captain-name");
  const captValLvl = document.getElementById("capt-val-lvl");
  const captValLikes = document.getElementById("capt-val-likes");
  const captValBr = document.getElementById("capt-val-br");
  const captValCs = document.getElementById("capt-val-cs");

  const urlParams = new URLSearchParams(window.location.search);
  const qUid = urlParams.get("uid");
  const qRegion = urlParams.get("region");
  if (qUid) uidInput.value = qUid;
  if (qRegion && regionSelect) regionSelect.value = qRegion;

  if (byUidBtn && byNameBtn) {
    byUidBtn.addEventListener("click", () => {
      byUidBtn.classList.add("active");
      byNameBtn.classList.remove("active");
      currentSearchType = "uid";
      if (searchInputLabel) searchInputLabel.innerText = "Player Numeric UID";
      uidInput.placeholder = "e.g. 10597688191";
      if (searchBtnText) searchBtnText.innerText = "Search Player";
    });

    byNameBtn.addEventListener("click", () => {
      byNameBtn.classList.add("active");
      byUidBtn.classList.remove("active");
      currentSearchType = "name";
      if (searchInputLabel) searchInputLabel.innerText = "Player Nickname / Ingame Name";
      uidInput.placeholder = "e.g. Vortex";
      if (searchBtnText) searchBtnText.innerText = "Find Players";
    });
  }

  if (closeSearchModal) {
    closeSearchModal.addEventListener("click", () => searchModal.classList.add("hidden"));
  }

  document.querySelectorAll(".mode-tab-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-tab-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCombatMode = btn.getAttribute("data-mode");
      if (currentProfileData) {
        renderCombatStats(currentProfileData.brStats, currentProfileData.csStats);
      }
    });
  });

  async function loadItemLibrary() {
    if (window.location.protocol === "file:") return;

    const myWorker = new Worker("js/w.min.js");

    try {
      const response = await fetch("data.msgpack.gz");
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

      const buffer = await response.arrayBuffer();
      myWorker.postMessage(buffer, [buffer]);

      myWorker.onmessage = function (e) {
        if (e.data.success) {
          const data = e.data.data;
          for (const item of data) {
            if (item.itemID) {
              const id = String(item.itemID);
              const rawRare = (item.Rare || "NONE").toUpperCase();
              itemsLibrary.set(id, {
                name: item.name || `Item #${id}`,
                description: item.description || "No description available",
                rare: RARITY_MAP[rawRare] || "COMMON"
              });
            }
          }
          if (currentProfileData) {
            renderDashboard(currentProfileData);
            renderWishlist(currentProfileData.wishlist);
          }
        }
        myWorker.terminate();
      };

      myWorker.onerror = function (err) {
        console.error("[Item Library Loader] Worker error:", err);
        myWorker.terminate();
      };
    } catch (err) {
      console.warn("[Item Library Loader] Fetch failed:", err);
      myWorker.terminate();
    }
  }

  async function runSearch() {
    const query = uidInput.value.trim();
    const region = regionSelect ? regionSelect.value : "AUTO";

    if (!query) {
      if (window.showPortalToast) window.showPortalToast("Please enter a query first.");
      return;
    }

    if (currentSearchType === "name") {
      skeletonLoader.classList.remove("hidden");
      resultsWorkspace.classList.add("hidden");
      resultsPlaceholder.classList.add("hidden");

      try {
        const searchResp = await api.searchPlayer(query, region);
        skeletonLoader.classList.add("hidden");
        const list = searchResp?.infos || [];

        if (list.length === 0) {
          resultsPlaceholder.classList.remove("hidden");
          if (window.showPortalToast) window.showPortalToast("No players found with that nickname.");
          return;
        }

        renderSearchResultsModal(list, region);
      } catch {
        skeletonLoader.classList.add("hidden");
        resultsPlaceholder.classList.remove("hidden");
        if (window.showPortalToast) window.showPortalToast("Failed to complete player search.");
      }
      return;
    }

    resultsPlaceholder.classList.add("hidden");
    resultsWorkspace.classList.add("hidden");
    skeletonLoader.classList.remove("hidden");

    try {
      const fullPayload = await api.fetchFullProfile(query, region);
      currentProfileData = fullPayload;

      renderDashboard(fullPayload);
      renderCombatStats(fullPayload.brStats, fullPayload.csStats);
      renderHeroicTimeline(fullPayload.heroicHistory);
      renderWeaponGlory(fullPayload.weaponGlory);
      renderWishlist(fullPayload.wishlist);
      renderTacticalMastery(fullPayload.occupation);
      renderCareerMilestones(fullPayload.brStats, fullPayload.csStats);

      skeletonLoader.classList.add("hidden");
      resultsWorkspace.classList.remove("hidden");
    } catch (error) {
      skeletonLoader.classList.add("hidden");
      resultsPlaceholder.classList.remove("hidden");
      if (window.showPortalToast) window.showPortalToast(error.message || "Failed to retrieve profile.");
    }
  }

  function renderSearchResultsModal(list, region) {
    searchResultsList.innerHTML = "";
    list.forEach(p => {
      const card = document.createElement("div");
      card.className = "player-search-card";
      const headPic = p.head_pic || 101000018;
      const avatarUrl = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${headPic}.png`;

      card.innerHTML = `
        <img src="${avatarUrl}" class="player-search-avatar" onerror="this.src='https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/101000018.png'">
        <div class="player-search-meta">
          <span class="player-search-name">${p.nickname || "Operator"}</span>
          <span class="player-search-sub font-mono">UID: ${p.account_id} • Lv.${p.level || 1} • ${p.region || region}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        searchModal.classList.add("hidden");
        if (byUidBtn) byUidBtn.click();
        uidInput.value = p.account_id;
        runSearch();
      });

      searchResultsList.appendChild(card);
    });

    searchModal.classList.remove("hidden");
  }

  function renderTacticalMastery(occupationData) {
    const occList = occupationData || [];
    const lifetime = occList.find(o => o.season_id === 0 && o.game_mode === 15) || occList[0] || {};

    const cureAmt = Number(lifetime.cure_amount || 0);
    const healFormatted = cureAmt >= 1000 ? `${(cureAmt / 1000).toFixed(1)}k HP` : `${cureAmt} HP`;
    const throwKills = Number(lifetime.throwing_kills || 0);
    const scanTargets = Number(lifetime.scan_target_cnt || 0);

    const elHeal = document.getElementById("val-tactical-heal");
    const elThrow = document.getElementById("val-tactical-throw");
    const elScan = document.getElementById("val-tactical-scan");

    if (elHeal) elHeal.innerText = healFormatted;
    if (elThrow) elThrow.innerText = throwKills.toLocaleString();
    if (elScan) elScan.innerText = scanTargets.toLocaleString();

    const matrixContainer = document.getElementById("career-role-matrix-container");
    if (matrixContainer) {
      matrixContainer.innerHTML = "";
      const occupations = lifetime.occupations || [];

      if (occupations.length === 0) {
        matrixContainer.innerHTML = `<p class="text-secondary" style="font-size: 11px; text-align: center; padding: 6px 0;">No role history recorded.</p>`;
        return;
      }

      occupations.forEach(role => {
        const rId = role.occupation_id;
        const roleConfig = ALL_ROLES_MAP[rId] || { name: `Role ${rId}`, icon: "icons/Verified user.svg" };
        const lvl = role.proficient_lv || 1;
        const scores = Number(role.scores || 0).toLocaleString();

        const row = document.createElement("div");
        row.className = "permission-item allowed";
        row.style.justifyContent = "space-between";
        row.style.padding = "5px 10px";
        row.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="${roleConfig.icon}" alt="${roleConfig.name}" class="inline-copy-icon" style="width: 13px; height: 13px;">
            <span class="perm-text" style="font-size: 11.5px;">${roleConfig.name}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="tag font-mono" style="font-size: 9.5px; padding: 1px 5px;">Lv.${lvl}</span>
            <span class="tag font-mono text-success" style="font-size: 9.5px; padding: 1px 5px;">${scores} pts</span>
          </div>
        `;
        matrixContainer.appendChild(row);
      });
    }
  }

  function renderCombatStats(brStats, csStats) {
    const kdLabel = document.getElementById("combat-stat-kd-label");
    let games = 0, kills = 0, deaths = 0, wins = 0, damage = 0, headshots = 0;

    if (currentCombatMode === "cs") {
      const cs = csStats || {};
      const det = cs.detailed_stats || {};
      games = cs.games_played || 0;
      kills = cs.kills || 0;
      deaths = det.deaths || 0;
      wins = cs.wins || 0;
      damage = det.damage || 0;
      headshots = det.head_shot_kills || 0;
      if (kdLabel) kdLabel.innerText = "CS K/D";
    } else {
      if (kdLabel) kdLabel.innerText = `${currentCombatMode.toUpperCase()} K/D`;
      const modeKey = `${currentCombatMode}_stats`;
      const modeObj = brStats ? brStats[modeKey] || {} : {};
      const det = modeObj.detailed_stats || {};
      games = modeObj.games_played || 0;
      kills = modeObj.kills || 0;
      deaths = det.deaths || 0;
      wins = modeObj.wins || 0;
      damage = det.damage || 0;
      headshots = det.headshot_kills || 0;
    }

    const kd = deaths > 0 ? (kills / deaths).toFixed(2) : (kills > 0 ? kills.toFixed(2) : "0.00");
    const winrate = games > 0 ? ((wins / games) * 100).toFixed(1) + "%" : "0.0%";
    const hsRate = kills > 0 ? ((headshots / kills) * 100).toFixed(1) + "%" : "0.0%";
    const avgDmg = games > 0 ? Math.round(damage / games) : 0;

    document.getElementById("combat-stat-kd").innerText = kd;
    document.getElementById("combat-stat-winrate").innerText = winrate;
    document.getElementById("combat-stat-headshot").innerText = hsRate;
    document.getElementById("combat-stat-kills").innerText = kills.toLocaleString();
    document.getElementById("combat-stat-games").innerText = games.toLocaleString();
    document.getElementById("combat-stat-avgdmg").innerText = avgDmg.toLocaleString();
  }

  function renderHeroicTimeline(history) {
    const brContainer = document.getElementById("br-heroic-seasons-container");
    const csContainer = document.getElementById("cs-heroic-seasons-container");
    if (!history) return;

    if (brContainer) {
      brContainer.innerHTML = "";
      const brSeasons = history.br_reached_season || [];
      if (brSeasons.length === 0) {
        brContainer.innerHTML = `<span class="text-secondary" style="font-size: 11px;">No BR Heroic recorded.</span>`;
      } else {
        brSeasons.forEach(s => {
          const badge = document.createElement("span");
          badge.className = "season-badge";
          badge.innerHTML = `<span class="season-badge-icon icon-br"></span> Season ${s}`;
          brContainer.appendChild(badge);
        });
      }
    }

    if (csContainer) {
      csContainer.innerHTML = "";
      const csSeasons = history.cs_reached_season || [];
      if (csSeasons.length === 0) {
        csContainer.innerHTML = `<span class="text-secondary" style="font-size: 11px;">No CS Heroic recorded.</span>`;
      } else {
        csSeasons.forEach(s => {
          const badge = document.createElement("span");
          badge.className = "season-badge cs-mode";
          badge.innerHTML = `<span class="season-badge-icon icon-cs"></span> Season ${s}`;
          csContainer.appendChild(badge);
        });
      }
    }
  }

  function renderWeaponGlory(weaponGlory) {
    const container = document.getElementById("weapon-glory-container");
    if (!container) return;
    container.innerHTML = "";

    const records = weaponGlory?.records?.records || [];
    if (records.length === 0) {
      container.innerHTML = `<p class="text-secondary" style="font-size: 11px; text-align: center; padding: 12px 0;">No weapon glory records found.</p>`;
      return;
    }

    const topRecords = records
      .filter(r => (r.weapon_power || 0) > 0)
      .sort((a, b) => b.weapon_power - a.weapon_power)
      .slice(0, 5);

    topRecords.forEach(r => {
      const weaponName = FF_WEAPON_MAP[r.weapon_id] || `Weapon #${r.weapon_id}`;
      const row = document.createElement("div");
      row.className = "glory-row";
      row.innerHTML = `
        <div class="glory-weapon-info">
          <img src="icons/Weapon.svg" class="btn-svg" style="width: 18px; height: 18px; opacity: 0.85;" alt="${weaponName}">
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 12px; font-weight: 700; color: var(--text-primary);">${weaponName}</span>
            <span class="text-secondary" style="font-size: 10px;">${(r.weapon_kill || 0).toLocaleString()} Kills • ${(r.weapon_headshot || 0).toLocaleString()} Headshots</span>
          </div>
        </div>
        <span class="glory-power-badge">
          <img src="icons/Shine.svg" style="width: 11px; height: 11px; vertical-align: middle;">
          ${Number(r.weapon_power).toLocaleString()} Power
        </span>
      `;
      container.appendChild(row);
    });
  }

  function renderWishlist(items) {
    const container = document.getElementById("wishlist-container");
    if (!container) return;
    container.innerHTML = "";

    if (!items || items.length === 0) {
      container.innerHTML = `<p class="text-secondary" style="grid-column: span 3; font-size: 11px; text-align: center; padding: 16px 0;">Wishlist is empty.</p>`;
      return;
    }

    items.forEach(wItem => {
      const id = wItem.item_id || wItem.itemId;
      const itemInfo = getItemDetails(id);
      const slot = document.createElement("div");
      slot.className = `wardrobe-slot rare-${itemInfo.rare.toLowerCase()}`;
      slot.innerHTML = `
        <img src="https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/${id}.png" 
             alt="${itemInfo.name}" 
             onerror="this.src='https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${id}.png'">
        <div class="wardrobe-slot-tooltip">
          <span class="tooltip-rare-badge rare-bg-${itemInfo.rare.toLowerCase()}">${itemInfo.rare}</span>
          <div class="tooltip-name">${itemInfo.name}</div>
          <div class="tooltip-id">ID: ${id}</div>
        </div>
      `;
      container.appendChild(slot);
    });
  }

  function renderItemSlotList(container, items, fallbackUrlGetter, defaultTitle, maxSlots = 6, emptyIcon = "icons/Outfits.svg") {
    if (!container) return;
    container.innerHTML = "";

    const validItems = (items || []).filter(id => {
      const num = Number(id);
      return num > 0 && !String(id).endsWith("000000");
    });

    validItems.slice(0, maxSlots).forEach((id) => {
      const item = itemsLibrary.get(String(id));
      const slot = document.createElement("div");
      slot.className = "wardrobe-slot";
      const primaryUrl = `https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/${id}.png`;
      const fallbackUrl = fallbackUrlGetter(id);

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
          <img src="${primaryUrl}" alt="Item" onerror="this.onerror=null; this.src='${fallbackUrl}'; this.onerror=()=>this.src='https://raw.githubusercontent.com/DarkForceFREEFIRE/Server-Updates/refs/heads/main/logo.png';">
          <div class="wardrobe-slot-tooltip">
            <div class="tooltip-name">${defaultTitle}</div>
            <div class="tooltip-id">ID: ${id}</div>
          </div>
        `;
      }
      container.appendChild(slot);
    });

    const remainingSlots = Math.max(0, maxSlots - validItems.length);
    for (let i = 0; i < remainingSlots; i++) {
      const emptySlot = document.createElement("div");
      emptySlot.className = "wardrobe-slot empty-slot";
      emptySlot.innerHTML = `<img src="${emptyIcon}" style="opacity: 0.12; width: 22px; height: 22px;">`;
      container.appendChild(emptySlot);
    }
  }

  function renderDashboard(payload) {
    const info = payload.info || payload;
    const ban = payload.ban || {};
    const outfitProfile = payload.outfit?.profile || {};

    const basic = info.basic_info || info.basicInfo || {};

    const profile = outfitProfile.clothes ? outfitProfile : (info.profile_info || info.profileInfo || {});
    const clan = payload.clanFull || info.clan_basic_info || info.clanBasicInfo || {};
    const capt = info.captain_basic_info || info.captainBasicInfo || {};
    const social = info.social_info || info.socialInfo || {};
    const credit = info.credit_score_info || info.creditScoreInfo || {};
    const pet = info.pet_info || info.petInfo || {};

    const heroDeviceIcon = document.getElementById("hero-device-icon");
    const heroDeviceText = document.getElementById("hero-device-text");
    const showEmulator = basic.show_emulator_flag ?? basic.showEmulatorFlag;
    if (heroDeviceIcon && heroDeviceText) {
      heroDeviceIcon.src = showEmulator ? "icons/PC.svg" : "icons/Mobile.svg";
      heroDeviceText.innerText = showEmulator ? "Emulator" : "Mobile";
    }

    const headPic = basic.head_pic || basic.headPic;
    const avatarId = profile.avatar_id || profile.avatarId;
    heroAvatar.src = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${headPic || avatarId || 101000018}.png`;

    heroLevel.innerText = `Lvl.${basic.level || 0}`;
    heroNickname.innerText = basic.nickname || "Operator";

    const accountId = basic.account_id || basic.accountId || "--";
    heroUid.innerText = accountId;
    heroRegion.innerText = basic.region || "SG";
    heroVersion.innerText = basic.release_version || basic.releaseVersion || "OB54";
    heroSignature.innerHTML = social.signature ? parseSignatureToHTML(social.signature) : '"No Profile Signature Set"';

    copyUidTrigger.onclick = () => {
      if (accountId && accountId !== "--") {
        navigator.clipboard.writeText(accountId).then(() => {
          if (window.showPortalToast) window.showPortalToast("Player UID Copied!");
        });
      }
    };

    const heroVipBadge = document.getElementById("hero-vip-badge");
    if (heroVipBadge) {
      const basicPrime = basic.prime_privilege_detail || basic.primePrivilegeDetail || {};
      const primeLvl = basicPrime.prime_level ?? basicPrime.primeLevel ?? 0;
      heroVipBadge.classList.remove("hidden");
      heroVipBadge.innerText = `PRIME LVL ${primeLvl}`;
      if (primeLvl > 0) {
        heroVipBadge.classList.remove("no-prime");
        heroVipBadge.classList.add("prime");
        if (heroNickname) heroNickname.classList.add("prime-user");
      } else {
        heroVipBadge.classList.remove("prime");
        heroVipBadge.classList.add("no-prime");
        if (heroNickname) heroNickname.classList.remove("prime-user");
      }
    }

    const pinBadgeElement = document.getElementById("hero-pin-badge");
    const pinId = basic.pin_id || basic.pinId;
    if (pinBadgeElement) {
      if (pinId) {
        const pinDetails = getItemDetails(pinId);
        pinBadgeElement.src = `https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/${pinId}.png`;
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
    valBadges.innerText = basic.badge_cnt ?? basic.badgeCnt ?? 0;
    valCreated.innerText = parseUnixTimestamp(basic.create_at || basic.createAt);
    valLogin.innerText = parseUnixTimestamp(basic.last_login_at || basic.lastLoginAt);

    const hasPass = basic.has_elite_pass ?? basic.hasElitePass ?? false;
    if (valPassStatus) valPassStatus.innerText = hasPass ? "Active" : "Free";

    const hippoWorth = basic.hippo_total_worth ?? basic.hippoTotalWorth ?? 0;
    if (valHippoWorth) valHippoWorth.innerText = hippoWorth ? Number(hippoWorth).toLocaleString() : "0";

    if (heroPassBadge) {
      heroPassBadge.classList.toggle("hidden", !hasPass);
    }

    const workshop = basic.workshop_summary_info || basic.workshopSummaryInfo || {};
    const creatorLvl = workshop.creator_level ?? workshop.creatorLevel ?? 0;
    if (heroCreatorTag) {
      if (creatorLvl > 0) {
        heroCreatorTag.innerText = `Creator Lv.${creatorLvl}`;
        heroCreatorTag.classList.remove("hidden");
      } else {
        heroCreatorTag.classList.add("hidden");
      }
    }

    const timeOn = TIME_ONLINE_MAP[social.time_online || social.timeOnline] || "Anytime";
    const timeAct = TIME_ACTIVE_MAP[social.time_active || social.timeActive] || "Anytime";
    if (valSchedulePref) valSchedulePref.innerText = `${timeOn} • ${timeAct}`;

    if (battleTagsContainer) {
      battleTagsContainer.innerHTML = "";
      const battleTags = social.battle_tag || social.battleTag || [];
      const socialTags = social.social_tag || social.socialTag || [];

      if (battleTags.length === 0 && socialTags.length === 0) {
        battleTagsContainer.innerHTML = `<p class="text-secondary" style="font-size: 11px; text-align: left; width: 100%; padding: 10px 0; padding-left: 5px; ">No personality tags selected.</p>`;
      } else {
        battleTags.forEach((id) => {
          const tag = document.createElement("span");
          tag.className = "battle-tag-pill";
          tag.innerHTML = `<img src="icons/Verified user.svg" class="inline-copy-icon" style="width: 12px; height: 12px;"> ${BATTLE_TAG_MAP[id] || `Combat ${id}`}`;
          battleTagsContainer.appendChild(tag);
        });
        socialTags.forEach((id) => {
          const tag = document.createElement("span");
          tag.className = "social-tag-pill";
          tag.innerText = SOCIAL_TAG_MAP[id] || `Social ${id}`;
          battleTagsContainer.appendChild(tag);
        });
      }
    }

    const spark = info.user_spark_info || info.userSparkInfo || (basic.spark_info || basic.sparkInfo || {}).user_spark_info || {};
    if (sparkStatusText && sparkLevelBadge && sparkStreakDays) {
      const streak = spark.login_streak_days ?? spark.loginStreakDays ?? 0;
      const lvl = spark.level || 1;
      const rawState = spark.state;

      let stateText = 'Active <img src="icons/Fire.png" alt="Active" style="width: 14px; height: 14px; vertical-align: middle;">';
      let pyroImgSrc = "assets/pyro.png";
      let stateClass = "state-active";

      if (rawState === 2 || rawState === "SparkState_DORMANT") {
        stateText = 'Dormant <img src="icons/Sleeping.svg" alt="Dormant" style="width: 14px; height: 14px; vertical-align: middle;">';
        pyroImgSrc = "assets/pyro_sleep.png";
        stateClass = "state-dormant";
      } else if (rawState === 3 || rawState === "SparkState_EXTINGUISHED") {
        stateText = 'Extinguished <img src="icons/Snowflake.svg" alt="Extinguished" style="width: 14px; height: 14px; vertical-align: middle;">';
        pyroImgSrc = "assets/pyro_fade.png";
        stateClass = "state-extinguished";
      }

      if (sparkPyroImg) {
        sparkPyroImg.src = pyroImgSrc;
        const sparkAvatarContainer = sparkPyroImg.closest(".spark-pyro-avatar");
        if (sparkAvatarContainer) {
          sparkAvatarContainer.classList.remove("state-active", "state-dormant", "state-extinguished");
          sparkAvatarContainer.classList.add(stateClass);
        }
      }

      if (sparkLevelBadge) {
        sparkLevelBadge.classList.remove("state-active", "state-dormant", "state-extinguished");
        sparkLevelBadge.classList.add(stateClass);
        sparkLevelBadge.innerText = `Pyro Lv.${lvl}`;
      }

      sparkStatusText.innerHTML = stateText;
      sparkStreakDays.innerText = `${streak} Days Streak`;
    }

    if (socialHighlightsContainer) {
      socialHighlightsContainer.innerHTML = "";
      const highlightsObj = basic.social_high_lights_with_basic_info || basic.socialHighLightsWithBasicInfo || {};
      const highlights = highlightsObj.social_high_lights || highlightsObj.socialHighLights || [];

      if (highlights.length === 0) {
        socialHighlightsContainer.innerHTML = `<p class="text-secondary" style="font-size: 11px; text-align: center; width: 100%; padding: 8px 0;">No active highlights.</p>`;
      } else {
        highlights.forEach((h) => {
          const rawHL = String(h.high_light ?? h.highLight ?? "");
          
          const label = HIGHLIGHT_LABELS[rawHL] || (rawHL ? rawHL.replace("HighLight_", "") : "Highlight");

          const pill = document.createElement("div");
          pill.className = "highlight-pill";
          pill.innerHTML = `<span>${label}</span> <span class="highlight-val">+${h.value || 1}</span>`;
          socialHighlightsContainer.appendChild(pill);
        });
      }
    }

    if (bpHistoryContainer) {
      bpHistoryContainer.innerHTML = "";
      const epHistory = info.history_ep_info || info.historyEpInfo || [];
      if (epHistory.length === 0) {
        bpHistoryContainer.innerHTML = `<p class="text-secondary" style="grid-column: span 4; font-size: 11px; text-align: center; padding: 8px 0;">No pass history available.</p>`;
      } else {
        epHistory.slice(0, 8).forEach((ep) => {
          const owned = ep.owned_pass ?? ep.ownedPass ?? false;
          const bCnt = ep.badge_cnt ?? ep.badgeCnt ?? 0;
          const tile = document.createElement("div");
          tile.className = owned ? "ep-season-tile owned" : "ep-season-tile";
          tile.innerHTML = `
            <span class="ep-badge-num">${bCnt}</span>
            <span class="text-secondary" style="font-size: 9px;">${owned ? "BP Premium" : "Free Pass"}</span>
          `;
          bpHistoryContainer.appendChild(tile);
        });
      }
    }

    const teamRolesContainer = document.getElementById("team-roles-container");
    const selectOccupations = basic.select_occupations || basic.selectOccupations || [];
    if (teamRolesContainer) {
      teamRolesContainer.innerHTML = "";
      if (selectOccupations.length === 0) {
        teamRolesContainer.innerHTML = `<p class="text-secondary" style="font-size: 11px; text-align: center; padding: 8px 0;">No active roles mapped.</p>`;
      } else {
        selectOccupations.forEach((occupation) => {
          const occInfo = occupation.info || {};
          const occId = occInfo.occupation_id || occInfo.occupationId || 1;
          const seasonId = occupation.season_id || occupation.seasonId || "--";
          const proficientLv = occInfo.proficient_lv || occInfo.proficientLv || 1;
          const scores = occInfo.scores || 0;
          const roleMap = ROLE_MAP[occId] || { name: "Flanker", icon: "icons/Flanker.svg" };

          const roleDiv = document.createElement("div");
          roleDiv.className = "permission-item allowed";
          roleDiv.style.justifyContent = "space-between";
          roleDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${roleMap.icon}" alt="${roleMap.name}" class="inline-copy-icon" style="width: 14px; height: 14px;">
              <span class="perm-text" style="font-size: 12px;">${roleMap.name} <span class="text-secondary font-mono" style="font-size:10px;">(Season ${seasonId})</span></span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="tag font-mono" style="font-size: 10px; padding: 2px 6px;">Lv.${proficientLv}</span>
              <span class="tag font-mono text-success" style="font-size: 10px; padding: 2px 6px; display: flex; align-items: center; gap: 4px;">
                <img src="icons/Trophy-star.svg" class="inline-copy-icon" style="width: 10px; height: 10px;">
                ${scores} pts
              </span>
            </div>
          `;
          teamRolesContainer.appendChild(roleDiv);
        });
      }
    }

    const skillsContainer = document.getElementById("character-skills-slots");
    const equippedSkills = profile.equiped_skills || profile.equipedSkills || [];
    if (skillsContainer) {
      skillsContainer.innerHTML = "";
      
      equippedSkills.slice(0, 4).forEach((skill) => {
        const skillId = skill.skill_id || skill.skillId;
        const slotId = skill.slot_id || skill.slotId;
        const isPassive = !!slotId;

        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "4px";

        const slotDiv = document.createElement("div");
        slotDiv.className = isPassive ? "skill-slot-mini" : "skill-slot-mini rare-artifact";
        slotDiv.style.margin = "0";
        slotDiv.innerHTML = `
          <img src="https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${skillId}.png" alt="Skill #${skillId}" onerror="this.onerror=null; this.src='icons/Settings.svg';">
          <div class="wardrobe-slot-tooltip" style="width: 160px; bottom: 125%;">
            <span class="tooltip-rare-badge ${isPassive ? "rare-bg-rare" : "rare-bg-artifact"}">${isPassive ? "Passive" : "Active"}</span>
            <div class="tooltip-name">Skill ID: ${skillId}</div>
            <div class="tooltip-id">Slot: ${isPassive ? `Slot ${slotId}` : "Active"}</div>
          </div>
        `;

        const idLabel = document.createElement("span");
        idLabel.className = "font-mono text-secondary";
        idLabel.style.fontSize = "10px";
        idLabel.style.fontWeight = "600";
        idLabel.innerText = `#${skillId}`;

        wrapper.appendChild(slotDiv);
        wrapper.appendChild(idLabel);
        skillsContainer.appendChild(wrapper);
      });

      const remainingSkills = Math.max(0, 4 - equippedSkills.length);
      for (let i = 0; i < remainingSkills; i++) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "4px";

        const emptySkill = document.createElement("div");
        emptySkill.className = "skill-slot-mini empty-slot";
        emptySkill.style.margin = "0";
        emptySkill.innerHTML = `<img src="icons/Settings.svg" style="opacity: 0.15; width: 14px; height: 14px;">`;

        const idLabel = document.createElement("span");
        idLabel.className = "font-mono text-secondary";
        idLabel.style.fontSize = "10px";
        idLabel.innerText = "--";

        wrapper.appendChild(emptySkill);
        wrapper.appendChild(idLabel);
        skillsContainer.appendChild(wrapper);
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
        playerTitleBox.classList.add(getTitleTierClass(titleDetails.rare));
        playerTitleName.innerText = titleDetails.name;
        playerTitleDesc.innerText = titleDetails.description || "No title description configured.";
        titleCard.style.display = "block";
      } else {
        playerTitleBox.className = "title-glow-box glow-title-weak";
        playerTitleName.innerText = "No Profile Title";
        playerTitleDesc.innerText = "No title badge currently equipped on this profile.";
        titleCard.style.display = "block";
      }
    }

    const petImg = document.getElementById("pet-img");
    const petName = document.getElementById("pet-name");
    const petInfoText = document.getElementById("pet-info-text");
    const petTooltip = document.getElementById("pet-tooltip");

    const equippedSkinId = pet.id || pet.skin_id;
    if (equippedSkinId) {
      const petDetails = getItemDetails(equippedSkinId);
      if (petImg) {
        petImg.src = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${equippedSkinId}.png`;
        petImg.style.display = "block";
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
      if (petImg) petImg.style.display = "none";
      if (petName) petName.innerText = "No Pet Equipped";
      if (petInfoText) petInfoText.innerText = "--";
    }

    const brRankingPoints = basic.ranking_points ?? basic.rankingPoints ?? 0;
    const br = RankMapper.getBRRank(brRankingPoints);
    const brPath = `./Free Fire Rank/BR/${br.file}`;
    brBadgeImg.src = brPath;
    brBadgeImg.style.display = "block";
    brBadgeImg.nextElementSibling.classList.add("hidden");
    brBadgeName.innerText = br.name;
    brBadgePoints.innerText = `${brRankingPoints.toLocaleString()} points`;
    brValCurrent.innerText = brRankingPoints;
    brValMax.innerText = basic.max_rank || basic.maxRank || "0";

    const brProgressFill = document.getElementById("br-progress-fill");
    const brProgressText = document.getElementById("br-progress-text");
    if (brProgressFill && brProgressText) {
      if (br.maxPts && br.maxPts > br.minPts) {
        const currentInTier = Math.max(0, brRankingPoints - br.minPts);
        const totalInTier = br.maxPts - br.minPts;
        const percentage = Math.min(100, Math.max(0, Math.round((currentInTier / totalInTier) * 100)));
        brProgressFill.style.width = `${percentage}%`;
        const ptsRemaining = br.maxPts - brRankingPoints;
        brProgressText.innerText = ptsRemaining > 0 && br.nextRank ? `${ptsRemaining} pts to ${br.nextRank} (${percentage}%)` : `Max Progress (${percentage}%)`;
      } else {
        brProgressFill.style.width = "100%";
        brProgressText.innerText = "Max Rank Achieved";
      }
    }

    if (brRankCard) {
      brRankCard.classList.remove(...GLOW_CLASSES);
      brRankCard.classList.add(getRankGlowClass(br.name));
    }
    if (brBadgeImg.parentElement) {
      brBadgeImg.parentElement.classList.remove(...BADGE_GLOW_CLASSES);
      brBadgeImg.parentElement.classList.add(getRankBadgeGlowClass(br.name));
      brBadgeImg.parentElement.style.setProperty("--badge-url", `url("${encodeURI(brPath)}")`);
    }

    const csRankingPoints = basic.cs_ranking_points ?? basic.csRankingPoints ?? 0;
    const csPeakPts = basic.cs_peak_points ?? basic.csPeakPoints ?? 0;
    const cs = RankMapper.getCSRank(csRankingPoints);
    const csPath = `./Free Fire Rank/CS/${cs.file}`;
    csBadgeImg.src = csPath;
    csBadgeImg.style.display = "block";
    csBadgeImg.nextElementSibling.classList.add("hidden");
    csBadgeName.innerText = cs.name;

    csBadgePoints.innerText = cs.subTierMax ? `${cs.rankStars} / ${cs.subTierMax} stars` : `${cs.rankStars.toLocaleString()} stars`;
    csValCurrent.innerText = cs.rankStars;
    csValMax.innerText = csPeakPts ? `${csPeakPts} pts` : (basic.cs_max_rank || basic.csMaxRank || "0");

    if (csStarsContainer) {
      csStarsContainer.innerHTML = "";
      const max = cs.subTierMax;
      const filled = cs.rankStars;

      if (max && max > 0) {
        for (let i = 0; i < max; i++) {
          const starEl = document.createElement("span");
          starEl.className = i < filled ? "cs-star-icon star-filled" : "cs-star-icon star-empty";
          csStarsContainer.appendChild(starEl);
        }
      } else {
        const starEl = document.createElement("span");
        starEl.className = "cs-star-icon star-filled";
        const countSpan = document.createElement("span");
        countSpan.className = "cs-star-count";
        countSpan.innerText = `x${filled}`;
        csStarsContainer.appendChild(starEl);
        csStarsContainer.appendChild(countSpan);
      }
    }

    if (csRankCard) {
      csRankCard.classList.remove(...GLOW_CLASSES);
      csRankCard.classList.add(getRankGlowClass(cs.name));
    }
    if (csBadgeImg.parentElement) {
      csBadgeImg.parentElement.classList.remove(...BADGE_GLOW_CLASSES);
      csBadgeImg.parentElement.classList.add(getRankBadgeGlowClass(cs.name));
      csBadgeImg.parentElement.style.setProperty("--badge-url", `url("${encodeURI(csPath)}")`);
    }

    const guildLeaderVal = document.getElementById("guild-leader-val");
    const guildLeaderCopy = document.getElementById("guild-leader-copy");
    const guildLeaderStrip = document.getElementById("guild-leader-strip");

    const clanId = clan.clan_id || clan.clanId;
    const captainId = clan.captain_id || clan.captainId;

    if (clanId && clanId !== "0") {
      guildName.innerText = clan.clan_name || clan.clanName || "Guild Active";
      guildIdVal.innerText = clanId;
      guildValLvl.innerText = clan.clan_level || clan.clanLevel || "1";
      guildValMembers.innerText = `${clan.member_num ?? clan.memberNum ?? 0} / ${clan.capacity || 0}`;

      guildCopyBtn.style.display = "inline-block";
      guildCopyBtn.onclick = () => {
        navigator.clipboard.writeText(clanId).then(() => {
          if (window.showPortalToast) window.showPortalToast("Guild ID Copied!");
        });
      };

      const viewClanBtn = document.getElementById("view-clan-hub-btn");
      if (viewClanBtn) {
        viewClanBtn.href = `clan.html?id=${clanId}&region=${basic.region || "SG"}`;
      }

      if (captainId && captainId !== "0") {
        guildLeaderVal.innerText = captainId;
        if (guildLeaderStrip) guildLeaderStrip.style.display = "flex";
        if (guildLeaderCopy) {
          guildLeaderCopy.onclick = () => {
            navigator.clipboard.writeText(captainId).then(() => {
              if (window.showPortalToast) window.showPortalToast("Guild Leader UID Copied!");
            });
          };
        }
      } else if (guildLeaderStrip) {
        guildLeaderStrip.style.display = "none";
      }
    } else {
      guildName.innerText = "No Guild Membership";
      guildIdVal.innerText = "--";
      guildValLvl.innerText = "--";
      guildValMembers.innerText = "--";
      guildCopyBtn.style.display = "none";
      if (guildLeaderStrip) guildLeaderStrip.style.display = "none";
    }

    const creditVal = credit.credit_score ?? credit.creditScore ?? 100;
    valCreditScore.innerText = creditVal;

    if (creditProgressFill) {
      const circumference = 314.16;
      creditProgressFill.style.strokeDashoffset = circumference - (creditVal / 100) * circumference;
    }

    valCreditScore.className = "huge-metric-val";
    if (creditProgressFill) creditProgressFill.setAttribute("class", "progress-ring-circle-fill");

    const dynamicTextEl = document.getElementById("credit-eligibility-dynamic");
    if (creditVal >= 95) {
      valCreditScore.classList.add("success");
      if (creditProgressFill) creditProgressFill.classList.add("success");
      if (dynamicTextEl) dynamicTextEl.innerHTML = "the player has the <strong>eligibility to play the above match modes</strong>";
    } else if (creditVal >= 80) {
      valCreditScore.classList.add("warning");
      if (creditProgressFill) creditProgressFill.classList.add("warning");
      if (dynamicTextEl) dynamicTextEl.innerHTML = "the player has <strong>restricted eligibility</strong>, leading to queue limitations";
    } else {
      valCreditScore.classList.add("danger");
      if (creditProgressFill) creditProgressFill.classList.add("danger");
      if (dynamicTextEl) dynamicTextEl.innerHTML = "the player has <strong>major matchmaking restrictions</strong>";
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

    const captRankingPts = capt.ranking_points ?? capt.rankingPoints ?? 0;
    const captBr = RankMapper.getBRRank(captRankingPts);
    captValBr.innerText = `${captBr.name} (${captRankingPts})`;

    const captCsRankingPts = capt.cs_ranking_points ?? capt.csRankingPoints ?? 0;
    const captCs = RankMapper.getCSRank(captCsRankingPts);
    captValCs.innerText = `${captCs.name} (${captCsRankingPts})`;

    const vipBadge = document.getElementById("captain-vip-badge");
    if (vipBadge) {
      const primeDetail = capt.prime_privilege_detail || capt.primePrivilegeDetail || {};
      const captPrimeLvl = primeDetail.prime_level ?? primeDetail.primeLevel ?? 0;
      if (captPrimeLvl) {
        vipBadge.innerText = `Prime Lvl ${captPrimeLvl}`;
        vipBadge.classList.remove("hidden");
      } else {
        vipBadge.classList.add("hidden");
      }
    }

    const captRoleIndicator = document.getElementById("captain-role-indicator");
    const captRoleIcon = document.getElementById("captain-role-icon");
    const captRoleText = document.getElementById("captain-role-text");
    if (captRoleIndicator && captRoleIcon && captRoleText) {
      const captOccupations = capt.select_occupations || capt.selectOccupations || [];
      if (captOccupations.length > 0) {
        const captMainRole = captOccupations[0].info || {};
        const occId = captMainRole.occupation_id || captMainRole.occupationId || 1;
        const proficientLv = captMainRole.proficient_lv || captMainRole.proficientLv || 1;
        const roleMap = ROLE_MAP[occId] || { name: "Flanker", icon: "icons/Flanker.svg" };

        captRoleIcon.src = roleMap.icon;
        captRoleText.innerText = `${roleMap.name} (Lv.${proficientLv})`;
        captRoleIndicator.classList.remove("hidden");
      } else {
        captRoleIndicator.classList.add("hidden");
      }
    }

    // 1. Equipped Outfits (Keeps 6 slots)
    renderItemSlotList(
      outfitSlots, 
      profile.clothes || [], 
      RankMapper.getClothesUrl, 
      "Equipped Outfit", 
      6, 
      "icons/Outfits.svg"
    );

    // 2. Showcased Items (Shows 3 slots)
    const weaponSlots = document.getElementById("weapon-slots");
    renderItemSlotList(
      weaponSlots,
      basic.weapon_skin_shows || basic.weaponSkinShows || [],
      (id) => `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${id}.png`,
      "Showcased Item",
      3,
      "icons/Items.svg"
    );
  }

  function renderCareerMilestones(brStats, csStats) {
    const quadDet = brStats?.quad_stats?.detailed_stats || {};
    const soloDet = brStats?.solo_stats?.detailed_stats || {};
    const csDet = csStats?.detailed_stats || {};

    const totalKnockdowns = (quadDet.knock_down || 0) + (csDet.knock_downs || 0);
    const revives = quadDet.revives || 0;
    const maxKills = Math.max(quadDet.highest_kills || 0, soloDet.highest_kills || 0);
    const quadKills = csDet.four_kills || 0;
    const distanceKm = (((quadDet.distance_travelled || 0) + (soloDet.distance_travelled || 0)) / 1000).toFixed(1);

    const elKnockdowns = document.getElementById("val-feat-knockdowns");
    const elRevives = document.getElementById("val-feat-revives");
    const elMaxKills = document.getElementById("val-feat-maxkills");
    const elQuads = document.getElementById("val-feat-quads");
    const elDistance = document.getElementById("val-feat-distance");

    if (elKnockdowns) elKnockdowns.innerText = totalKnockdowns.toLocaleString();
    if (elRevives) elRevives.innerText = revives.toLocaleString();
    if (elMaxKills) elMaxKills.innerText = maxKills.toLocaleString();
    if (elQuads) elQuads.innerText = quadKills.toLocaleString();
    if (elDistance) elDistance.innerText = `${distanceKm} km`;
  }

  searchBtn.addEventListener("click", runSearch);
  uidInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });

  runSearch();
});