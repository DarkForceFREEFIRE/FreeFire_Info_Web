document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('update-sig-btn');
    const jwtField = document.getElementById('sig-jwt-field');
    const bioField = document.getElementById('sig-text-field');
    const regionField = document.getElementById('sig-region-field');
    
    const loader = document.getElementById('sig-loader');
    const outputBlock = document.getElementById('sig-output-block');
    const statusCard = document.getElementById('sig-status-card');
    const statusTitle = document.getElementById('sig-status-title');
    const statusMsg = document.getElementById('sig-status-msg');

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

    if (updateBtn) {
        updateBtn.addEventListener('click', async () => {
            const token = jwtField.value.trim();
            const bioText = bioField.value.trim();
            const region = regionField.value.trim();

            if (!token) {
                showToast('Please enter your JWT Authorization token.');
                return;
            }
            if (!bioText) {
                showToast('Please provide your desired signature text.');
                return;
            }

            loader.classList.remove('hidden');
            outputBlock.classList.add('hidden');

            try {
                let url = `https://wzlongsign.vercel.app/updatebio?token=${encodeURIComponent(token)}&bio=${encodeURIComponent(bioText)}`;
                if (region) {
                    url += `&region=${encodeURIComponent(region)}`;
                }

                const response = await fetch(url);
                const data = await response.json();

                if (data && data.success === true) {
                    statusCard.style.background = 'rgba(16, 185, 129, 0.05)';
                    statusCard.style.borderColor = 'rgba(16, 185, 129, 0.25)';
                    statusTitle.textContent = 'Signature Updated Successfully';
                    statusTitle.style.color = 'var(--text-success)';
                    statusMsg.textContent = `Server responded with code ${data.status_code || 200}. Updated value: "${data.bio_submitted}"`;
                    showToast('Profile configuration saved.');
                } else {
                    statusCard.style.background = 'rgba(239, 68, 68, 0.05)';
                    statusCard.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                    statusTitle.textContent = 'Update Denied';
                    statusTitle.style.color = 'var(--text-error)';
                    statusMsg.textContent = data.msg || 'The API endpoint rejected the submission payload.';
                    showToast('Error: Failed to save changes.');
                }
                outputBlock.classList.remove('hidden');
            } catch (err) {
                console.error(err);
                statusCard.style.background = 'rgba(239, 68, 68, 0.05)';
                statusCard.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                statusTitle.textContent = 'Network Timeout';
                statusTitle.style.color = 'var(--text-error)';
                statusMsg.textContent = 'Could not communicate with Garena update server.';
                outputBlock.classList.remove('hidden');
                showToast('Update failed.');
            } finally {
                loader.classList.add('hidden');
            }
        });
    }
});