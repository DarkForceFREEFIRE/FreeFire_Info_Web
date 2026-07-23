
document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('update-sig-btn');
    const jwtField = document.getElementById('sig-jwt-field');
    const bioField = document.getElementById('sig-text-field');
    const regionField = document.getElementById('sig-region-field');
    const previewField = document.getElementById('sig-preview');
    
    const customColorPicker = document.getElementById('custom-color-picker');
    
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

    function injectTagAtCursor(tagString) {
        if (!bioField) return;
        
        const start = bioField.selectionStart;
        const end = bioField.selectionEnd;
        const text = bioField.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);

        const updatedContent = before + tagString + text.substring(start, end) + after;
        bioField.value = updatedContent;

        bioField.selectionStart = start + tagString.length;
        bioField.selectionEnd = end + tagString.length;
        bioField.focus();

        bioField.dispatchEvent(new Event('input'));
    }

    function parseSignatureToHTML(text) {
        if (!text) return '"No Profile Signature Set"';
        
        let escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        const tokens = escaped.split(/(\[[a-zA-Z0-9]{1,6}\]|\n)/);
        
        let result = '';
        let currentBold = false;
        let currentItalic = false;
        let currentUnderline = false;
        let currentStrike = false;
        let currentColor = null;
        let activeSpanCount = 0;

        function getSpans() {
            let style = '';
            if (currentBold) style += 'font-weight: bold; ';
            if (currentItalic) style += 'font-style: italic; ';
            
            let deco = [];
            if (currentUnderline) deco.push('underline');
            if (currentStrike) deco.push('line-through');
            if (deco.length > 0) style += `text-decoration: ${deco.join(' ')}; `;
            
            if (currentColor) {
                style += `color: #${currentColor}; `;
            }
            return style ? `<span style="${style}">` : '<span>';
        }

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (!token) continue;

            if (token === '\n') {
                result += '<br>';
                continue;
            }

            const tagMatch = token.match(/^\[([a-zA-Z0-9]{1,6})\]$/);
            if (tagMatch) {
                const tagVal = tagMatch[1].toLowerCase();
                if (tagVal === 'b') {
                    currentBold = true;
                } else if (tagVal === 'i') {
                    currentItalic = true;
                } else if (tagVal === 'u') {
                    currentUnderline = true;
                } else if (tagVal === 's') {
                    currentStrike = true;
                } else if (/^[0-9a-fA-F]{6}$/.test(tagVal)) {
                    currentColor = tagVal;
                } else if (tagVal === 'c') {
                    currentColor = null;
                    currentBold = false;
                    currentItalic = false;
                    currentUnderline = false;
                    currentStrike = false;
                }
                
                if (activeSpanCount > 0) {
                    result += '</span>';
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
            result += '</span>';
            activeSpanCount--;
        }

        return result;
    }

    if (bioField && previewField) {
        const updatePreview = () => {
            previewField.innerHTML = parseSignatureToHTML(bioField.value);
        };
        bioField.addEventListener('input', updatePreview);
        updatePreview();
    }

    document.querySelectorAll('.format-tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tag = btn.getAttribute('data-tag');
            injectTagAtCursor(`[${tag}]`);
        });
    });

    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            e.preventDefault();
            const hex = swatch.getAttribute('data-hex');
            injectTagAtCursor(`[${hex}]`);
        });
    });

    if (customColorPicker) {
        customColorPicker.addEventListener('change', (e) => {
            const cleanHex = e.target.value.replace('#', '').toUpperCase();
            injectTagAtCursor(`[${cleanHex}]`);
        });
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
                let url = `/api/update-bio?token=${encodeURIComponent(token)}&bio=${encodeURIComponent(bioText)}`;
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