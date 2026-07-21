document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const otpInputField = document.getElementById('otp-input-field');
    const loader = document.getElementById('loader');
    const tokenOutputBlock = document.getElementById('token-output-block');
    const outputOpenid = document.getElementById('output-openid');
    const outputToken = document.getElementById('output-token');

    const convertBtn = document.getElementById('convert-jwt-btn');
    const tokenInput = document.getElementById('access-token-input');
    const jwtLoader = document.getElementById('jwt-loader');
    const jwtOutputBlock = document.getElementById('jwt-output-block');
    const jwtOpenid = document.getElementById('output-jwt-openid');
    const jwtOutput = document.getElementById('output-jwt');

    function showToast(message) {
        const toast = document.getElementById('status-toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    }

    function setupCopyEvent(buttonId, dataElementId) {
        const button = document.getElementById(buttonId);
        const element = document.getElementById(dataElementId);
        if (button && element) {
            button.addEventListener('click', () => {
                const text = element.textContent.trim();
                if (text && text !== '--') {
                    navigator.clipboard.writeText(text)
                        .then(() => showToast('Copied to clipboard!'))
                        .catch(() => showToast('Unable to copy text.'));
                }
            });
        }
    }

    setupCopyEvent('copy-openid-btn', 'output-openid');
    setupCopyEvent('copy-token-btn', 'output-token');
    setupCopyEvent('copy-jwt-openid-btn', 'output-jwt-openid');
    setupCopyEvent('copy-jwt-btn', 'output-jwt');

if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
        const otpValue = otpInputField.value.trim();
        if (!otpValue) {
            showToast('Please specify a valid game OTP first.');
            return;
        }

        loader.classList.remove('hidden');
        tokenOutputBlock.classList.add('hidden');

        try {
            // Use POST to /api/fetch with JSON body
            const response = await fetch(`https://wzaccesstoken.vercel.app/api/fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp: otpValue }),
            });

            // Handle non-200 responses
            if (!response.ok) {
                let errorMsg = 'Retrieval failed.';
                if (response.status === 400) {
                    errorMsg = 'Invalid request. Check OTP format.';
                } else if (response.status === 404) {
                    errorMsg = 'OTP invalid, expired, or already used.';
                } else if (response.status === 502) {
                    errorMsg = 'Database error. Please try again later.';
                } else if (response.status === 504) {
                    errorMsg = 'Request timed out.';
                } else {
                    errorMsg = `Server error (${response.status}).`;
                }
                showToast(errorMsg);
                return;
            }

            const payload = await response.json();

            // Successful response contains "token" and "openid"
            if (payload && payload.token) {
                outputOpenid.textContent = payload.openid || '--';
                outputToken.textContent = payload.token || '--';
                tokenOutputBlock.classList.remove('hidden');

                if (tokenInput) {
                    tokenInput.value = payload.token;
                }
                showToast('Token retrieved successfully!');
            } else {
                showToast(payload.msg || 'Retrieval failed. Unexpected response format.');
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to connect to token server.');
        } finally {
            loader.classList.add('hidden');
        }
    });
}

if (convertBtn) {
    convertBtn.addEventListener('click', async () => {
        const accessToken = tokenInput.value.trim();
        if (!accessToken) {
            showToast('Please supply an active access token.');
            return;
        }

        jwtLoader.classList.remove('hidden');
        jwtOutputBlock.classList.add('hidden');

        try {
            const url = `https://wzjwt.vercel.app/api/process?mode=access_token&data=${encodeURIComponent(accessToken)}`;
            const response = await fetch(url);

            // Handle HTTP errors
            if (!response.ok) {
                let errorMsg = `Server error (${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (_) {
                    // If response is not JSON, keep the default message
                }
                showToast(errorMsg);
                return;
            }

            const payload = await response.json();

            if (payload && payload.status === 'success') {
                jwtOpenid.textContent = payload.open_id || '--';
                jwtOutput.textContent = payload.jwt || '--';
                jwtOutputBlock.classList.remove('hidden');
                showToast('JWT processed successfully!');
            } else {
                showToast(payload.message || 'The server rejected the access token payload.');
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to connect to the JWT service.');
        } finally {
            jwtLoader.classList.add('hidden');
        }
    });
}
