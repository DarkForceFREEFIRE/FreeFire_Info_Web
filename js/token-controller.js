
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

function handleCopy(dataElementId, buttonElement) {
    const element = document.getElementById(dataElementId);
    if (element) {
        const text = element.textContent.trim();
        if (text && text !== '--') {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast('Copied to clipboard!');
                    if (buttonElement) {
                        buttonElement.classList.add('copied');
                        setTimeout(() => {
                            buttonElement.classList.remove('copied');
                        }, 2000);
                    }
                })
                .catch(() => showToast('Unable to copy text.'));
        }
    }
}

async function handleTokenGeneration() {
    const otpInputField = document.getElementById('otp-input-field');
    const loader = document.getElementById('loader');
    const tokenOutputBlock = document.getElementById('token-output-block');
    const outputOpenid = document.getElementById('output-openid');
    const outputToken = document.getElementById('output-token');
    const tokenInput = document.getElementById('access-token-input');

    if (!otpInputField) return;

    const otpValue = otpInputField.value.trim();
    if (!otpValue) {
        showToast('Please specify a valid game OTP first.');
        return;
    }

    if (loader) loader.classList.remove('hidden');
    if (tokenOutputBlock) tokenOutputBlock.classList.add('hidden');

    try {
        const response = await fetch('https://wzaccesstoken.vercel.app/api/fetch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp: otpValue }),
        });

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

        if (payload && payload.token) {
            if (outputOpenid) outputOpenid.textContent = payload.openid || '--';
            if (outputToken) outputToken.textContent = payload.token || '--';
            if (tokenOutputBlock) tokenOutputBlock.classList.remove('hidden');

            if (tokenInput) {
                tokenInput.value = payload.token;
            }
            
            const step2Badge = document.getElementById('step-2-badge');
            const step2Pipeline = document.getElementById('step-2-pipeline');
            if (step2Badge) {
                step2Badge.style.background = 'var(--accent)';
                step2Badge.style.color = 'var(--accent-text)';
            }
            if (step2Pipeline) {
                step2Pipeline.style.borderColor = 'var(--accent)';
            }

            showToast('Token retrieved successfully!');
        } else {
            showToast(payload.msg || 'Retrieval failed. Unexpected response format.');
        }
    } catch (err) {
        console.error(err);
        showToast('Failed to connect to token server.');
    } finally {
        if (loader) loader.classList.add('hidden');
    }
}

async function handleJwtConversion() {
    const tokenInput = document.getElementById('access-token-input');
    const jwtLoader = document.getElementById('jwt-loader');
    const jwtOutputBlock = document.getElementById('jwt-output-block');
    const jwtOpenid = document.getElementById('output-jwt-openid');
    const jwtOutput = document.getElementById('output-jwt');

    if (!tokenInput) return;

    const accessToken = tokenInput.value.trim();
    if (!accessToken) {
        showToast('Please supply an active access token.');
        return;
    }

    if (jwtLoader) jwtLoader.classList.remove('hidden');
    if (jwtOutputBlock) jwtOutputBlock.classList.add('hidden');

    try {
        const response = await fetch(`/api/jwt?token=${encodeURIComponent(accessToken)}`);

        if (!response.ok) {
            showToast(`Server error (${response.status})`);
            return;
        }

        const payload = await response.json();

        if (payload && (payload.status === 'success' || payload.jwt)) {
            if (jwtOpenid) jwtOpenid.textContent = payload.open_id || payload.openid || '--';
            if (jwtOutput) jwtOutput.textContent = payload.jwt || '--';
            if (jwtOutputBlock) jwtOutputBlock.classList.remove('hidden');

            showToast('JWT processed successfully!');
        } else {
            showToast(payload.message || payload.msg || 'The server rejected the access token payload.');
        }
    } catch (err) {
        console.error(err);
        showToast('Failed to connect to the JWT service.');
    } finally {
        if (jwtLoader) jwtLoader.classList.add('hidden');
    }
}

document.addEventListener('click', (event) => {
    const target = event.target.closest('button, a');
    if (!target) return;

    if (target.id === 'generate-btn') {
        event.preventDefault();
        handleTokenGeneration();
    }

    if (target.id === 'convert-jwt-btn') {
        event.preventDefault();
        handleJwtConversion();
    }

    if (target.id === 'copy-openid-btn') handleCopy('output-openid', target);
    if (target.id === 'copy-token-btn') handleCopy('output-token', target);
    if (target.id === 'copy-jwt-openid-btn') handleCopy('output-jwt-openid', target);
    if (target.id === 'copy-jwt-btn') handleCopy('output-jwt', target);
});