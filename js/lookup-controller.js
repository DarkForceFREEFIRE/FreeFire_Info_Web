import { FreeFireAPI } from "./api.js";
import { RankMapper } from "./mapper.js";

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
  const socialHighlightsContainer = document.getElementById(
    "social-highlights-container",
  );

  const sparkStatusText = document.getElementById("spark-status-text");
  const sparkLevelBadge = document.getElementById("spark-level-badge");
  const sparkStreakDays = document.getElementById("spark-streak-days");
  const sparkDescText = document.getElementById("spark-desc-text");
  const sparkPyroImg = document.getElementById("spark-pyro-img");
  const bpHistoryContainer = document.getElementById("bp-history-container");
  const valCareerHeroic = document.getElementById("val-career-heroic");
  const valCareerMaxscore = document.getElementById("val-career-maxscore");

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
  const creditProgressFill = document.getElementById(
    "credit-progress-ring-fill",
  );

  const permBr = document.getElementById("perm-br");
  const permCs = document.getElementById("perm-cs");
  const permCasual = document.getElementById("perm-casual");

  const captainName = document.getElementById("captain-name");
  const captValLvl = document.getElementById("capt-val-lvl");
  const captValLikes = document.getElementById("capt-val-likes");
  const captValBr = document.getElementById("capt-val-br");
  const captValCs = document.getElementById("capt-val-cs");

  function parseSignatureToHTML(text) {
    if (!text) return '"No Profile Signature Set"';
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const tokens = escaped.split(/(\[[a-zA-Z0-9]{1,6}\]|\n)/);
    let result = "";
    let currentBold = false,
      currentItalic = false,
      currentUnderline = false,
      currentStrike = false;
    let currentColor = null,
      activeSpanCount = 0;

    function getSpans() {
      let style = "";
      if (currentBold) style += "font-weight: bold; ";
      if (currentItalic) style += "font-style: italic; ";
      let deco = [];
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

  async function loadItemLibrary() {
    if (window.location.protocol === "file:") {
      console.warn(
        "[Item Library Loader] Web Workers are blocked on file:// protocols. Please run this project using a local development server.",
      );
      return;
    }

    const myWorker = new Worker("js/w.min.js");

    try {
      const response = await fetch("data.msgpack.gz");
      if (!response.ok) throw new Error("Fetch failed: " + response.status);

      const buffer = await response.arrayBuffer();
      myWorker.postMessage(buffer, [buffer]);

      myWorker.onmessage = function (e) {
        if (e.data.success) {
          const data = e.data.data;
          for (const item of data) {
            if (item.itemID) {
              const id = String(item.itemID);
              itemsLibrary.set(id, {
                name: item.name || `Item #${id}`,
                description: item.description || "No description available",
                rare: (item.Rare || "COMMON").toUpperCase(),
              });
            }
          }
          console.log(
            `[Item Library] Loaded ${itemsLibrary.size} definitions successfully.`,
          );
          if (currentProfileData) {
            renderDashboard(currentProfileData);
          }
        }
        myWorker.terminate();
      };

      myWorker.onerror = function (err) {
        console.error("[Item Library Loader] Worker runtime error:", err);
        myWorker.terminate();
      };
    } catch (err) {
      console.warn("[Item Library Loader] Gzip fetch process failed:", err);
      myWorker.terminate();
    }
  }

  function parseUnixTimestamp(timestamp) {
    if (!timestamp || timestamp === "0") return "N/A";
    const d = new Date(Number(timestamp) * 1000);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    if (lower.includes("elite master") || lower.includes("master"))
      return "glow-badge-master";
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
      if (window.showPortalToast)
        window.showPortalToast("Provide a valid numeric player UID.");
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
      rare: "COMMON",
    };
  }

  function getTitleTierClass(rare) {
    const r = String(rare || "COMMON").toUpperCase();
    if (
      r.includes("MYTHIC") ||
      r.includes("ARTIFACT") ||
      r.includes("RED") ||
      r.includes("ORANGE_PLUS")
    ) {
      return "glow-title-great";
    } else if (
      r.includes("EPIC") ||
      r.includes("RARE") ||
      r.includes("PURPLE") ||
      r.includes("BLUE") ||
      r.includes("ORANGE")
    ) {
      return "glow-title-usual";
    } else {
      return "glow-title-weak";
    }
  }

  function renderDashboard(payload) {
    // Dual Compatibility Layer (Supports root snake_case, root camelCase, or nested info)
    const info = payload.info || payload;
    const ban = payload.ban || {};

    const basic = info.basic_info || info.basicInfo || {};
    const profile = info.profile_info || info.profileInfo || {};
    const clan = info.clan_basic_info || info.clanBasicInfo || {};
    const capt = info.captain_basic_info || info.captainBasicInfo || {};
    const social = info.social_info || info.socialInfo || {};
    const credit = info.credit_score_info || info.creditScoreInfo || {};
    const pet = info.pet_info || info.petInfo || {};

    const heroDeviceIcon = document.getElementById("hero-device-icon");
    const heroDeviceText = document.getElementById("hero-device-text");
    const showEmulator = basic.show_emulator_flag ?? basic.showEmulatorFlag;
    if (heroDeviceIcon && heroDeviceText) {
      if (showEmulator) {
        heroDeviceIcon.src = "icons/PC.svg";
        heroDeviceText.innerText = "Emulator";
      } else {
        heroDeviceIcon.src = "icons/Mobile.svg";
        heroDeviceText.innerText = "Mobile";
      }
    }

    const headPic = basic.head_pic || basic.headPic;
    const avatarId = profile.avatar_id || profile.avatarId;
    const equippedAvatarId = headPic || avatarId || 101000018;
    heroAvatar.src = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${equippedAvatarId}.png`;

    heroLevel.innerText = `Lvl.${basic.level || 0}`;
    heroNickname.innerText = basic.nickname || "Operator";

    const accountId = basic.account_id || basic.accountId || "--";
    heroUid.innerText = accountId;
    heroRegion.innerText = basic.region || "SG";

    const releaseVer = basic.release_version || basic.releaseVersion || "OB54";
    heroVersion.innerText = releaseVer;
    heroSignature.innerHTML = social.signature
      ? parseSignatureToHTML(social.signature)
      : '"No Profile Signature Set"';

    copyUidTrigger.onclick = () => {
      if (accountId && accountId !== "--") {
        navigator.clipboard.writeText(accountId).then(() => {
          if (window.showPortalToast)
            window.showPortalToast("Player UID Copied!");
        });
      }
    };

    const heroVipBadge = document.getElementById("hero-vip-badge");
    if (heroVipBadge) {
      const basicPrime =
        basic.prime_privilege_detail || basic.primePrivilegeDetail || {};
      const primeLvl = basicPrime.prime_level ?? basicPrime.primeLevel ?? 0;

      heroVipBadge.classList.remove("hidden");

      if (primeLvl > 0) {
        heroVipBadge.innerText = `PRIME LVL ${primeLvl}`;
        heroVipBadge.classList.remove("no-prime");
        heroVipBadge.classList.add("prime");

        if (heroNickname) {
          heroNickname.classList.add("prime-user");
        }
      } else {
        heroVipBadge.innerText = `PRIME LVL ${primeLvl}`;
        heroVipBadge.classList.remove("prime");
        heroVipBadge.classList.add("no-prime");

        if (heroNickname) {
          heroNickname.classList.remove("prime-user");
        }
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
    valLikes.innerText = basic.liked
      ? Number(basic.liked).toLocaleString()
      : "0";

    const badgeCnt = basic.badge_cnt ?? basic.badgeCnt ?? 0;
    valBadges.innerText = badgeCnt;

    const createAt = basic.create_at || basic.createAt;
    valCreated.innerText = parseUnixTimestamp(createAt);

    const lastLoginAt = basic.last_login_at || basic.lastLoginAt;
    valLogin.innerText = parseUnixTimestamp(lastLoginAt);

    const hasPass = basic.has_elite_pass ?? basic.hasElitePass ?? false;
    if (valPassStatus) valPassStatus.innerText = hasPass ? "Active" : "Free";

    const hippoWorth = basic.hippo_total_worth ?? basic.hippoTotalWorth ?? 0;
    if (valHippoWorth)
      valHippoWorth.innerText = hippoWorth
        ? Number(hippoWorth).toLocaleString()
        : "0";

    if (heroPassBadge) {
      if (hasPass) {
        heroPassBadge.classList.remove("hidden");
      } else {
        heroPassBadge.classList.add("hidden");
      }
    }

    const workshop =
      basic.workshop_summary_info || basic.workshopSummaryInfo || {};
    const creatorLvl = workshop.creator_level ?? workshop.creatorLevel ?? 0;
    if (heroCreatorTag) {
      if (creatorLvl > 0) {
        heroCreatorTag.innerText = `Creator Lv.${creatorLvl}`;
        heroCreatorTag.classList.remove("hidden");
      } else {
        heroCreatorTag.classList.add("hidden");
      }
    }

    // Schedule & Preferences
    const timeOnlineMap = {
      1: "Workdays",
      2: "Weekends",
      1000: "Anytime",
      TimeOnline_WORKDAY: "Workdays",
      TimeOnline_WEEKEND: "Weekends",
      TimeOnline_NONE: "Anytime",
    };
    const timeActiveMap = {
      1: "Morning",
      2: "Afternoon",
      3: "Night",
      1000: "Anytime",
      TimeActive_MORNING: "Morning",
      TimeActive_AFTERNOON: "Afternoon",
      TimeActive_NIGHT: "Night",
      TimeActive_NONE: "Anytime",
    };

    const timeOnVal = social.time_online || social.timeOnline;
    const timeActVal = social.time_active || social.timeActive;
    const timeOn = timeOnlineMap[timeOnVal] || "Anytime";
    const timeAct = timeActiveMap[timeActVal] || "Anytime";
    if (valSchedulePref) valSchedulePref.innerText = `${timeOn} • ${timeAct}`;

    // Battle Tags & Personality Badges
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
    };

    if (battleTagsContainer) {
      battleTagsContainer.innerHTML = "";
      const battleTags = social.battle_tag || social.battleTag || [];
      const socialTags = social.social_tag || social.socialTag || [];

      if (battleTags.length === 0 && socialTags.length === 0) {
        battleTagsContainer.innerHTML = `<p class="text-secondary" style="font-size: 11px; text-align: center; width: 100%; padding: 6px 0;">No personality tags selected.</p>`;
      } else {
        battleTags.forEach((id) => {
          const tag = document.createElement("span");
          tag.className = "battle-tag-pill";
          tag.innerHTML = `⚔️ ${BATTLE_TAG_MAP[id] || "Combat Tag " + id}`;
          battleTagsContainer.appendChild(tag);
        });
        socialTags.forEach((id) => {
          const tag = document.createElement("span");
          tag.className = "social-tag-pill";
          tag.innerText = SOCIAL_TAG_MAP[id] || "Social Tag " + id;
          battleTagsContainer.appendChild(tag);
        });
      }
    }

    // Activity Spark System (Pyro Mascot)

    const spark =
      info.user_spark_info ||
      info.userSparkInfo ||
      (basic.spark_info || basic.sparkInfo || {}).user_spark_info ||
      (basic.spark_info || basic.sparkInfo || {}).userSparkInfo ||
      {};
    if (sparkStatusText && sparkLevelBadge && sparkStreakDays) {
      const streak = spark.login_streak_days ?? spark.loginStreakDays ?? 0;
      const lvl = spark.level || 1;

      const rawState = spark.state;
      let stateText =
        'Active <img src="icons/Fire.png" alt="Active" style="width: 14px; height: 14px; vertical-align: middle; display: inline-block;">';
      let pyroImgSrc = "assets/pyro.png";
      let stateClass = "state-active";

      if (rawState === 2 || rawState === "SparkState_DORMANT") {
        stateText =
          'Dormant <img src="icons/Sleeping.svg" alt="Dormant" style="width: 14px; height: 14px; vertical-align: middle; display: inline-block;">';
        pyroImgSrc = "assets/pyro_sleep.png";
        stateClass = "state-dormant";
      } else if (rawState === 3 || rawState === "SparkState_EXTINGUISHED") {
        stateText =
          'Extinguished <img src="icons/Snowflake.svg" alt="Extinguished" style="width: 14px; height: 14px; vertical-align: middle; display: inline-block;">';
        pyroImgSrc = "assets/pyro_fade.png";
        stateClass = "state-extinguished";
      }

      // Set Mascot Image
      if (sparkPyroImg) {
        sparkPyroImg.src = pyroImgSrc;

        // Target avatar background container for the glow
        const sparkAvatarContainer = sparkPyroImg.closest(".spark-pyro-avatar");
        if (sparkAvatarContainer) {
          sparkAvatarContainer.classList.remove(
            "state-active",
            "state-dormant",
            "state-extinguished",
          );
          sparkAvatarContainer.classList.add(stateClass);
        }
      }

      // Set Level Badge Color
      if (sparkLevelBadge) {
        sparkLevelBadge.classList.remove(
          "state-active",
          "state-dormant",
          "state-extinguished",
        );
        sparkLevelBadge.classList.add(stateClass);
      }

      sparkStatusText.innerHTML = stateText;
      sparkLevelBadge.innerText = `Pyro Lv.${lvl}`;
      sparkStreakDays.innerText = `${streak} Days Streak`;
      if (sparkDescText) {
        sparkDescText.innerText =
          streak > 0
            ? `Pyro is evolving! Maintain daily logins to keep Pyro active.`
            : `Log in daily to keep Pyro active and evolve exclusive perks!`;
      }
    }

    // Social Highlights
    if (socialHighlightsContainer) {
      socialHighlightsContainer.innerHTML = "";
      const highlightsObj =
        basic.social_high_lights_with_basic_info ||
        basic.socialHighLightsWithBasicInfo ||
        {};
      const highlights =
        highlightsObj.social_high_lights ||
        highlightsObj.socialHighLights ||
        [];

      const highlightLabels = {
        HighLight_CS_STREAK_WIN: "CS Win Streak",
        HighLight_CS_MVP: "CS MVP",
        HighLight_CS_STREAK_WIN_EXECELLENT: "CS Streak Excellent",
        HighLight_CS_RANK_GROUP_UPGRADE: "CS Rank Up",
        HighLight_BR_WIN: "BR Booyah",
        HighLight_TEAM_ACE: "Team Ace",
        HighLight_WEAPON_POWER_TITLE: "Weapon Glory",
      };

      if (highlights.length === 0) {
        socialHighlightsContainer.innerHTML = `<p class="text-secondary" style="font-size: 11px; text-align: center; width: 100%; padding: 8px 0;">No active highlights.</p>`;
      } else {
        highlights.forEach((h) => {
          const rawHL = h.high_light || h.highLight || "";
          const label =
            highlightLabels[rawHL] || rawHL.replace("HighLight_", "");
          const pill = document.createElement("div");
          pill.className = "highlight-pill";
          pill.innerHTML = `<span>${label}</span> <span class="highlight-val">+${h.value || 1}</span>`;
          socialHighlightsContainer.appendChild(pill);
        });
      }
    }

    // Booyah Pass Season History
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

    // Career Milestones
    const modeSummary =
      info.mode_stats_summary_info || info.modeStatsSummaryInfo || {};
    const heroicCnt =
      modeSummary.reached_heroic_cnt ?? modeSummary.reachedHeroicCnt ?? 0;
    const maxScore = modeSummary.max_score ?? modeSummary.maxScore ?? 0;
    if (valCareerHeroic) valCareerHeroic.innerText = heroicCnt;
    if (valCareerMaxscore)
      valCareerMaxscore.innerText = maxScore
        ? Number(maxScore).toLocaleString()
        : "0";

    const roleIconMappings = {
      1: { name: "Rusher", icon: "icons/Rush.svg" },
      2: { name: "Sniper", icon: "icons/Sniper.svg" },
      3: { name: "Support", icon: "icons/Support.svg" },
      4: { name: "Flanker", icon: "icons/Flanker.svg" },
    };

    const teamRolesContainer = document.getElementById("team-roles-container");
    const selectOccupations =
      basic.select_occupations || basic.selectOccupations || [];
    if (teamRolesContainer) {
      teamRolesContainer.innerHTML = "";
      if (selectOccupations.length === 0) {
        teamRolesContainer.innerHTML = `<p class="text-secondary" style="font-size: 11px; text-align: center; padding: 8px 0;">No active roles mapped.</p>`;
      } else {
        selectOccupations.forEach((occupation) => {
          const occInfo = occupation.info || {};
          const occId = occInfo.occupation_id || occInfo.occupationId || 1;
          const seasonId = occupation.season_id || occupation.seasonId || "--";
          const proficientLv =
            occInfo.proficient_lv || occInfo.proficientLv || 1;
          const scores = occInfo.scores || 0;

          const roleMap = roleIconMappings[occId] || {
            name: "Flanker",
            icon: "icons/Flanker.svg",
          };

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
  <span class="tag font-mono text-success" style="font-size: 10px; padding: 2px 6px; display: flex; align-items: center; gap: 2px;">
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
    const equippedSkills =
      profile.equiped_skills || profile.equipedSkills || [];
    if (skillsContainer) {
      skillsContainer.innerHTML = "";
      if (equippedSkills.length === 0) {
        skillsContainer.innerHTML = `<p class="text-secondary" style="text-align: center; font-size: 11px; padding: 12px 0;">No active skills configured.</p>`;
      } else {
        equippedSkills.forEach((skill) => {
          const skillId = skill.skill_id || skill.skillId;
          const slotId = skill.slot_id || skill.slotId;
          const isPassive = !!slotId;

          // 1. Create a column wrapper for the card and its label
          const wrapper = document.createElement("div");
          wrapper.style.display = "flex";
          wrapper.style.flexDirection = "column";
          wrapper.style.alignItems = "center";
          wrapper.style.gap = "4px";

          // 2. Skill Card Slot
          const slotDiv = document.createElement("div");
          slotDiv.className = isPassive
            ? "skill-slot-mini"
            : "skill-slot-mini rare-artifact";
          slotDiv.style.margin = "0";

          const skillIconUrl = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${skillId}.png`;

          slotDiv.innerHTML = `
<img src="${skillIconUrl}" alt="Skill #${skillId}" onerror="this.onerror=null; this.src='icons/Settings.svg';">
<div class="wardrobe-slot-tooltip" style="width: 160px; bottom: 125%;">
  <span class="tooltip-rare-badge ${isPassive ? "rare-bg-rare" : "rare-bg-artifact"}">${isPassive ? "Passive" : "Active Skill"}</span>
  <div class="tooltip-name">Skill ID: ${skillId}</div>
  <div class="tooltip-id">Slot: ${isPassive ? "Slot " + slotId : "Active"}</div>
</div>
`;

          // 3. Label to display Skill ID under the card
          const idLabel = document.createElement("span");
          idLabel.className = "font-mono text-secondary";
          idLabel.style.fontSize = "10px";
          idLabel.style.fontWeight = "600";
          idLabel.innerText = `#${skillId}`;

          // Append elements
          wrapper.appendChild(slotDiv);
          wrapper.appendChild(idLabel);
          skillsContainer.appendChild(wrapper);
        });
      }
    }

    outfitSlots.innerHTML = "";
    const clothes = profile.clothes || [];
    if (clothes.length === 0) {
      outfitSlots.innerHTML = `<p class="text-secondary" style="grid-column: span 3; text-align: center; font-size: 11px; padding: 12px;">No equipment mapped.</p>`;
    } else {
      clothes.forEach((id) => {
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
    const weaponSkins = basic.weapon_skin_shows || basic.weaponSkinShows || [];

    if (weaponSlots) {
      weaponSlots.innerHTML = "";
      if (weaponSkins.length === 0) {
        weaponSlots.innerHTML = `<p class="text-secondary" style="text-align: center; font-size: 11px; padding: 12px;">No showcased weapons set.</p>`;
      } else {
        weaponSkins.forEach((id) => {
          const strId = String(id);
          const item = itemsLibrary.get(strId);

          const row = document.createElement("div");
          row.className = "weapon-list-row";

          const primaryUrl = `https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/${id}.png`;
          const fallbackUrl = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${id}.png`;

          const name = item ? item.name : "Weapon Skin";
          const rarity = item ? item.rare : "COMMON";

          const rareClass = item
            ? `rare-${item.rare.toLowerCase()}`
            : "rare-common";
          const rareTextClass = item
            ? `rare-text-${item.rare.toLowerCase()}`
            : "rare-text-common";

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
        playerTitleDesc.innerText =
          titleDetails.description || "No title description configured.";
        titleCard.style.display = "block";
      } else {
        titleCard.style.display = "none";
      }
    }

    const petImg = document.getElementById("pet-img");
    const petName = document.getElementById("pet-name");
    const petInfoText = document.getElementById("pet-info-text");
    const petTooltip = document.getElementById("pet-tooltip");

    const equippedSkinId = pet.id || pet.skin_id;
    const petLvl = pet.level || 1;
    const petExp = pet.exp || 0;
    if (equippedSkinId) {
      const petDetails = getItemDetails(equippedSkinId);
      const petSkinUrl = `https://raw.githubusercontent.com/ashqking/FF-Items/refs/heads/main/ICONS/${equippedSkinId}.png`;

      if (petImg) {
        petImg.src = petSkinUrl;
        petImg.style.display = "block";
      }
      if (petName) petName.innerText = petDetails.name;
      if (petInfoText)
        petInfoText.innerText = `Level ${petLvl} • Exp: ${petExp}`;

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
      if (petTooltip) {
        petTooltip.innerHTML = `
<div class="tooltip-name">No Pet Info</div>
<div class="tooltip-id">ID: --</div>
`;
      }
    }

    const brRankingPoints = basic.ranking_points ?? basic.rankingPoints ?? 0;
    const br = RankMapper.getBRRank(brRankingPoints);
    brBadgeImg.src = `./Free Fire Rank/BR/${br.file}`;
    brBadgeImg.style.display = "block";
    brBadgeImg.nextElementSibling.classList.add("hidden");
    brBadgeName.innerText = br.name;
    brBadgePoints.innerText = `${brRankingPoints.toLocaleString()} points`;
    brValCurrent.innerText = brRankingPoints;
    brValMax.innerText = basic.max_rank || basic.maxRank || "0";

    const glowClasses = [
      "glow-bronze",
      "glow-silver",
      "glow-gold",
      "glow-platinum",
      "glow-diamond",
      "glow-heroic",
      "glow-master",
      "glow-grandmaster",
    ];
    const badgeGlowClasses = [
      "glow-badge-bronze",
      "glow-badge-silver",
      "glow-badge-gold",
      "glow-badge-platinum",
      "glow-badge-diamond",
      "glow-badge-heroic",
      "glow-badge-master",
      "glow-badge-grandmaster",
    ];

    if (brRankCard) {
      brRankCard.classList.remove(...glowClasses);
      brRankCard.classList.add(getRankGlowClass(br.name));
    }

    const brBadgeDisplay = brBadgeImg.parentElement;
    if (brBadgeDisplay) {
      brBadgeDisplay.classList.remove(...badgeGlowClasses);
      brBadgeDisplay.classList.add(getRankBadgeGlowClass(br.name));
    }

    const csRankingPoints =
      basic.cs_ranking_points ?? basic.csRankingPoints ?? 0;
    const csPeakPts = basic.cs_peak_points ?? basic.csPeakPoints ?? 0;
    const csMaxR = basic.cs_max_rank || basic.csMaxRank || "0";

    const cs = RankMapper.getCSRank(csRankingPoints);
    csBadgeImg.src = `./Free Fire Rank/CS/${cs.file}`;
    csBadgeImg.style.display = "block";
    csBadgeImg.nextElementSibling.classList.add("hidden");
    csBadgeName.innerText = cs.name;

    // Display the actual Rank Stars (112 stars for 199 cumulative stars)
    csBadgePoints.innerText = `${cs.rankStars.toLocaleString()} stars`;
    csValCurrent.innerText = cs.rankStars;
    csValMax.innerText = csPeakPts ? `${csPeakPts} pts` : csMaxR;

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

    const clanId = clan.clan_id || clan.clanId;
    const clanNameVal = clan.clan_name || clan.clanName;
    const clanLvl = clan.clan_level || clan.clanLevel || "1";
    const memberNum = clan.member_num ?? clan.memberNum ?? 0;
    const capacity = clan.capacity || 0;
    const captainId = clan.captain_id || clan.captainId;

    if (clanId && clanId !== "0") {
      guildName.innerText = clanNameVal || "Guild Active";
      guildIdVal.innerText = clanId;
      guildValLvl.innerText = clanLvl;
      guildValMembers.innerText = `${memberNum} / ${capacity}`;

      guildCopyBtn.style.display = "inline-block";
      guildCopyBtn.onclick = () => {
        navigator.clipboard.writeText(clanId).then(() => {
          if (window.showPortalToast)
            window.showPortalToast("Guild ID Copied!");
        });
      };

      if (captainId && captainId !== "0") {
        guildLeaderVal.innerText = captainId;
        if (guildLeaderStrip) guildLeaderStrip.style.display = "flex";
        if (guildLeaderCopy) {
          guildLeaderCopy.onclick = () => {
            navigator.clipboard.writeText(captainId).then(() => {
              if (window.showPortalToast)
                window.showPortalToast("Guild Leader UID Copied!");
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

    const creditVal = credit.credit_score ?? credit.creditScore ?? 100;
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
        dynamicTextEl.innerHTML =
          "the player has the <strong>eligibility to play the above match modes</strong>";
      }
    } else if (creditVal >= 80) {
      valCreditScore.classList.add("warning");
      if (creditProgressFill) creditProgressFill.classList.add("warning");
      if (dynamicTextEl) {
        dynamicTextEl.innerHTML =
          "the player has <strong>restricted eligibility</strong>, leading to active queue limitations";
      }
    } else {
      valCreditScore.classList.add("danger");
      if (creditProgressFill) creditProgressFill.classList.add("danger");
      if (dynamicTextEl) {
        dynamicTextEl.innerHTML =
          "the player has <strong>major matchmaking restrictions</strong>. Competitive modes are currently locked";
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
    captValLikes.innerText = capt.liked
      ? Number(capt.liked).toLocaleString()
      : "0";

    const captRankingPts = capt.ranking_points ?? capt.rankingPoints ?? 0;
    const captBr = RankMapper.getBRRank(captRankingPts);
    captValBr.innerText = `${captBr.name} (${captRankingPts})`;

    const captCsRankingPts =
      capt.cs_ranking_points ?? capt.csRankingPoints ?? 0;
    const captCs = RankMapper.getCSRank(captCsRankingPts);
    captValCs.innerText = `${captCs.name} (${captCsRankingPts})`;

    const vipBadge = document.getElementById("captain-vip-badge");
    if (vipBadge) {
      const primeDetail =
        capt.prime_privilege_detail || capt.primePrivilegeDetail || {};
      const captPrimeLvl =
        primeDetail.prime_level ?? primeDetail.primeLevel ?? 0;
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
      const captOccupations =
        capt.select_occupations || capt.selectOccupations || [];
      if (captOccupations.length > 0) {
        const captMainRole = captOccupations[0].info || {};
        const occId =
          captMainRole.occupation_id || captMainRole.occupationId || 1;
        const proficientLv =
          captMainRole.proficient_lv || captMainRole.proficientLv || 1;
        const roleMap = roleIconMappings[occId] || {
          name: "Flanker",
          icon: "icons/Flanker.svg",
        };

        captRoleIcon.src = roleMap.icon;
        captRoleText.innerText = `${roleMap.name} (Lv.${proficientLv})`;
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
