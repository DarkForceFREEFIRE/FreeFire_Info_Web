import { FreeFireAPI } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const api = new FreeFireAPI();
  const searchBtn = document.getElementById("search-clan-btn");
  const clanInput = document.getElementById("clan-id-input");
  const regionSelect = document.getElementById("clan-region-select");

  const loader = document.getElementById("clan-loader");
  const workspace = document.getElementById("clan-workspace");

  const urlParams = new URLSearchParams(window.location.search);
  const qId = urlParams.get("id");
  const qRegion = urlParams.get("region");
  if (qId) clanInput.value = qId;
  if (qRegion) regionSelect.value = qRegion;

  function parseUnix(ts) {
    if (!ts || ts === "0") return "N/A";
    const d = new Date(Number(ts) * 1000);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  async function loadClan() {
    const clanId = clanInput.value.trim();
    const region = regionSelect ? regionSelect.value : "SG";

    if (!clanId) {
      if (window.showPortalToast) window.showPortalToast("Provide a valid numeric Clan ID.");
      return;
    }

    loader.classList.remove("hidden");
    workspace.classList.add("hidden");

    try {
      const data = await api.fetchJson("clan", { clan_id: clanId, region });
      if (!data || !data.clan_info) {
        throw new Error("Clan record not found on this server region.");
      }

      renderClan(data, region);
      loader.classList.add("hidden");
      workspace.classList.remove("hidden");
    } catch (err) {
      loader.classList.add("hidden");
      if (window.showPortalToast) window.showPortalToast(err.message || "Failed to load clan data.");
    }
  }

  function renderClan(payload, region) {
    const clan = payload.clan_info || {};
    const records = payload.activeness_records || [];

    document.getElementById("clan-name-text").innerText = clan.clan_name || "Clan";
    document.getElementById("clan-level-tag").innerText = `LEVEL ${clan.clan_level || 1}`;
    document.getElementById("clan-id-tag").innerText = clan.clan_id || "--";
    document.getElementById("clan-region-tag").innerText = clan.region || region;
    document.getElementById("clan-created-tag").innerText = `Created: ${parseUnix(clan.create_at)}`;

    document.getElementById("clan-total-activeness").innerText = (clan.total_activeness || 0).toLocaleString();
    document.getElementById("clan-honor-points").innerText = (clan.honor_point || 0).toLocaleString();
    document.getElementById("clan-slogan-box").innerText = clan.slogan ? `"${clan.slogan}"` : '"No clan slogan configured."';

    const captId = clan.captain_id || "--";
    const depId = clan.deputy_captain || "--";
    document.getElementById("roster-captain-uid").innerText = captId;
    document.getElementById("inspect-captain-btn").href = `lookup.html?uid=${captId}&region=${region}`;

    document.getElementById("roster-deputy-uid").innerText = depId;
    document.getElementById("inspect-deputy-btn").href = `lookup.html?uid=${depId}&region=${region}`;

    const viceContainer = document.getElementById("roster-vice-container");
    viceContainer.innerHTML = "";
    let viceList = [];
    try {
      viceList = JSON.parse(clan.vice_captains || "[]");
    } catch (e) {}

    if (viceList.length === 0) {
      viceContainer.innerHTML = `<span class="text-secondary" style="font-size: 11px;">None assigned</span>`;
    } else {
      viceList.forEach(vUid => {
        const vLink = document.createElement("a");
        vLink.className = "tag copyable-uid";
        vLink.href = `lookup.html?uid=${vUid}&region=${region}`;
        vLink.innerText = `UID: ${vUid}`;
        viceContainer.appendChild(vLink);
      });
    }

    document.getElementById("clan-capacity-val").innerText = `${clan.member_num || 0} / ${clan.capacity || 50}`;
    document.getElementById("clan-weekly-activeness").innerText = (clan.weekly_activeness || 0).toLocaleString();
    document.getElementById("clan-entry-level").innerText = `Lv.${clan.entry_level || 1}`;
    document.getElementById("clan-entry-rank").innerText = clan.entry_rank ? `Rank ${clan.entry_rank}` : "Open to All";

    const tbody = document.getElementById("activeness-logs-body");
    tbody.innerHTML = "";
    if (records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-secondary" style="text-align: center; padding: 20px;">No recent activeness logs.</td></tr>`;
    } else {
      records.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><a href="lookup.html?uid=${r.account_id}&region=${region}" class="font-mono accent-text">${r.account_id}</a></td>
          <td><span class="tag font-mono text-success">+${r.activeness || 10} pts</span></td>
          <td class="text-secondary font-mono" style="font-size: 11px;">${parseUnix(r.create_at)}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  searchBtn.addEventListener("click", loadClan);
  clanInput.addEventListener("keydown", e => { if (e.key === "Enter") loadClan(); });

  loadClan();
});