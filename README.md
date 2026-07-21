<p align="center">
  <img src="https://img.shields.io/badge/Walker%20Regedits-FF%20Utilities-50C8FF?style=for-the-badge&logo=fire&logoColor=white" alt="Walker Regedits" />
</p>

<h1 align="center">🔥 Walker Regedits — Free Fire Utilities</h1>

<p align="center">
  <b>A sleek, modern web portal for Free Fire player lookups, token generation, JWT conversion, and profile management.</b>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Vercel-API-000000?logo=vercel&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Theme-Dark%2FLight-50C8FF" /></a>
</p>

---

## ✨ What is Walker Regedits?

Walker Regedits is a **client-side web utility suite** for Garena Free Fire players and developers. Built with a polished, Fluent Design-inspired interface, it provides real-time player profile lookups, token utilities, and API documentation — all running directly in the browser with zero backend dependencies.

---

## 🚀 Live Tools

| Tool | Description | Page |
|------|-------------|------|
| **Player Info Lookup** | Full profile visualization — stats, ranks, outfits, weapons, guild, honor score, pet, and more | [`lookup.html`](lookup.html) |
| **Token Generator** | Exchange game OTP for Access Token & convert to JWT | [`token.html`](token.html) |
| **Signature Updater** | Update your Free Fire bio/signature via JWT authentication | [`signature.html`](signature.html) |
| **API Documentation** | Complete reference for all public endpoints with copy-ready code blocks | [`docs.html`](docs.html) |

---

## 🎨 Design Highlights

- **Dual Theme System** — Seamless dark/light mode toggle with CSS custom properties and localStorage persistence
- **Fluent Design Language** — Glassmorphic app bar, subtle shadows, smooth transitions, and responsive cards
- **Fully Responsive** — Optimized layouts from mobile (480px) to desktop (1300px+)


---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML5, CSS3 (CSS Variables), ES6+ JavaScript |
| **Styling** | Custom design system with Google Sans/Product Sans typography |
| **Data Fetching** | Native `fetch()` API with async/await |
| **Compression** | Web Workers + MessagePack + Gzip decompression for item libraries |
| **APIs** | Vercel-hosted microservices (`wzapiinfo`, `wzjwt`, `wzlongsign`) |
| **Icons** | Custom SVG icon set + external CDN assets |



## 🔌 API Endpoints Used

| Host | Endpoint | Purpose |
|------|----------|---------|
| `wzapiinfo.vercel.app` | `GET /get?uid={uid}` | Player profile data |
| `wzapiinfo.vercel.app` | `GET /check_ban?uid={uid}` | Ban/suspension status |
| `wzapiinfo.vercel.app` | `GET /get_token?otp={otp}` | OTP → Access Token |
| `wzjwt.vercel.app` | `GET /api/process?mode=access_token&data={token}` | Access Token → JWT |
| `wzlongsign.vercel.app` | `GET /updatebio?token={jwt}&bio={text}&region={region}` | Update signature |

> ⚠️ **Rate Limit**: 60 requests/minute per IP on public endpoints.

---

## 🎮 Player Lookup Features

The lookup dashboard renders a comprehensive 3-column profile view:

| Column | Cards |
|--------|-------|
| **Left** | Hero Banner (avatar, nickname, UID, region, device, ban status, signature), Guild Membership, Active Playstyle Roles, Guild Captain Stats |
| **Center** | Profile Statistics (XP, level, likes, badges, dates), Honor Score with animated ring, Equipped Profile Title, Pet Companion |
| **Right** | Equipped Outfit Grid with rarity tooltips, Showcased Weapons list, Battle Royale Rank, Clash Squad Rank |

**Rarity System**: Common → Uncommon → Rare → Epic → Epic+ → Mythic → Mythic+ → Artifact (color-coded borders & glows)

---

## 🚀 Quick Start

No build step required! Just open the files in a browser:

```bash
# Clone the repository
git clone https://github.com/DarkForceFREEFIRE/FreeFire_Info_Web.git
cd FreeFire_Info_Web

# Option 1: Open directly (limited — Web Workers blocked on file://)
open index.html

# Option 2: Use a local server (recommended for full functionality)
npx serve .
# or
python -m http.server 8080
# or
php -S localhost:8080
```

Then visit `http://localhost:8080`

## 🧩 How Token Generation Works

1. **Download** `localconfig.json` from the repo
2. **Move** it to `Android/data/com.dts.freefireth/files` (or `freefiremax`)
3. **Launch** Free Fire — a debug OTP appears on the login screen
4. **Paste** the OTP into the Token Generator to receive your Access Token
5. **Convert** the Access Token to a JWT for authenticated API calls



## ⚠️ Disclaimer

> This project is **not affiliated with, endorsed by, or connected to Garena International or Free Fire**. It is an **unofficial community tool** created for educational and informational purposes.
>
> - Player data is retrieved from publicly accessible API endpoints.
> - Please respect Garena's Terms of Service.
> - Do not use this tool for malicious purposes, harassment, or unauthorized account access.

---

## 🤝 Credits & Community

| Resource | Link |
|----------|------|
|  Service Portal | [wzservice.vercel.app](https://wzservice.vercel.app) |
|  GitHub | [DarkForceFREEFIRE](https://github.com/DarkForceFREEFIRE) |
|  Discord | [Join Community](https://discord.gg/fjkcdAVdS) |
|  Item Icons | [ShahGCreator/icon](https://github.com/ShahGCreator/icon) |
|  FF Items | [ashqking/FF-Items](https://github.com/ashqking/FF-Items) |

---

## 📜 License

This project is open-source. Feel free to fork, modify, and contribute!

---

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/DarkForceFREEFIRE"><strong>DarkForceFREEFIRE</strong></a> — Walker Regedits</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/DarkForceFREEFIRE/FreeFire_Info_Web?style=social" alt="Stars" />
  <img src="https://img.shields.io/github/forks/DarkForceFREEFIRE/FreeFire_Info_Web?style=social" alt="Forks" />
</p>


