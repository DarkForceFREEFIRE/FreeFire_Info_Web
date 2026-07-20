document.addEventListener("DOMContentLoaded", () => {
    const otpInput = document.getElementById("otp-input-field");
    const generateBtn = document.getElementById("generate-btn");
    const loader = document.getElementById("loader");
    const outputBlock = document.getElementById("token-output-block");
    
    const outputOpenId = document.getElementById("output-openid");
    const outputToken = document.getElementById("output-token");
    
    const copyOpenIdBtn = document.getElementById("copy-openid-btn");
    const copyTokenBtn = document.getElementById("copy-token-btn");

    async function verifyOtp() {
        const otpValue = otpInput.value.trim();
        if (!otpValue) {
            if (window.showPortalToast) {
                window.showPortalToast("Please enter a valid OTP.");
            }
            return;
        }

        outputBlock.classList.add("hidden");
        loader.classList.remove("hidden");

        generateBtn.disabled = true;
        generateBtn.style.opacity = "0.6";
        generateBtn.innerText = "Querying Server...";

        try {
            const response = await fetch('https://wzaccesstoken.vercel.app/api/fetch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ otp: otpValue })
            });

            const data = await response.json();

            loader.classList.add("hidden");
            generateBtn.disabled = false;
            generateBtn.style.opacity = "1";
            generateBtn.innerText = "Exchange OTP for Token";

            if (response.ok) {
                const token = data.token || data.accessToken || "No Token Received";
                const openid = data.openid || data.openId || "No OpenID Received";

                outputOpenId.innerText = openid;
                outputToken.innerText = token;
                
                outputBlock.classList.remove("hidden");

                if (window.showPortalToast) {
                    window.showPortalToast("Access credentials parsed successfully!");
                }
            } else {
                const errMsg = data.detail || data.error || "Generation request refused by API server.";
                if (window.showPortalToast) {
                    window.showPortalToast(`Error: ${errMsg}`);
                }
            }
        } catch (error) {
            loader.classList.add("hidden");
            generateBtn.disabled = false;
            generateBtn.style.opacity = "1";
            generateBtn.innerText = "Exchange OTP for Token";

            if (window.showPortalToast) {
                window.showPortalToast("Network connection timed out.");
            }
            console.error('Network Error:', error);
        }
    }

    if (copyOpenIdBtn) {
        copyOpenIdBtn.addEventListener("click", () => {
            const textToCopy = outputOpenId.innerText;
            if (textToCopy && textToCopy !== "--") {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    if (window.showPortalToast) window.showPortalToast("OpenID copied!");
                });
            }
        });
    }

    if (copyTokenBtn) {
        copyTokenBtn.addEventListener("click", () => {
            const textToCopy = outputToken.innerText;
            if (textToCopy && textToCopy !== "--") {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    if (window.showPortalToast) window.showPortalToast("Access Token copied!");
                });
            }
        });
    }

    generateBtn.addEventListener("click", verifyOtp);
    otpInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") verifyOtp();
    });
});