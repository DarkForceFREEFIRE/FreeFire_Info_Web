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
                const response = await fetch(`https://wzaccesstoken.vercel.app/get_token?otp=${encodeURIComponent(otpValue)}`);
                const payload = await response.json();

                if (payload && payload.access_token) {
                    outputOpenid.textContent = payload.openid || '--';
                    outputToken.textContent = payload.access_token || '--';
                    tokenOutputBlock.classList.remove('hidden');

                    if (tokenInput) {
                        tokenInput.value = payload.access_token;
                    }
                    showToast('Token retrieved successfully!');
                } else {
                    showToast(payload.msg || 'Retrieval failed. Check the code and try again.');
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
                const response = await fetch(`https://wzjwt.vercel.app/api/process?mode=access_token&data=${encodeURIComponent(accessToken)}`);
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
                showToast('Service endpoint encountered connectivity issues.');
            } finally {
                jwtLoader.classList.add('hidden');
            }
        });
    }
});
