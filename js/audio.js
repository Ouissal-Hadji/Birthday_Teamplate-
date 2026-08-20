/**
 * Audio Logic — YouTube NO-COOKIE embed (privacy-enhanced mode)
 * Last resort for blocked/regional YouTube issues.
 */

(function () {
    const playSongBtn = document.getElementById('playSongBtn');
    const musicTrigger = document.getElementById('musicTrigger');
    const bgPlayer = document.getElementById('bgPlayer');
    const bgPlayerFrame = document.getElementById('bgPlayerFrame');
    const bgPlayerClose = document.getElementById('bgPlayerClose');
    const vinylDisc = document.getElementById('vinylDisc');
    const vinylArm = document.getElementById('vinylArm');
    const audioToggle = document.getElementById('audioToggle');
    const widgetPlayIcon = document.querySelector('.audio-play');
    const widgetPauseIcon = document.querySelector('.audio-pause');

    let isPlaying = false;

    // Use NO-COOKIE domain + clean URL (no si token)
    const VIDEO_ID = '0-p5EbAsxUM';

    function startMusic() {
        if (musicTrigger) musicTrigger.style.display = 'none';

        // nocookie domain + autoplay + clean params
        const src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`;

        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = src;
        iframe.title = 'Birthday Song';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.style.border = 'none';
        iframe.style.display = 'block';

        if (bgPlayerFrame) {
            bgPlayerFrame.innerHTML = '';
            bgPlayerFrame.appendChild(iframe);
        }

        if (bgPlayer) bgPlayer.classList.add('active');

        if (vinylDisc) vinylDisc.style.animationPlayState = 'running';
        if (vinylArm) vinylArm.style.transform = 'rotate(-5deg)';
        if (audioToggle) audioToggle.classList.add('playing');
        if (widgetPlayIcon) widgetPlayIcon.hidden = true;
        if (widgetPauseIcon) widgetPauseIcon.hidden = false;

        isPlaying = true;
        console.log('🎵 nocookie player started');
    }

    function closePlayer() {
        if (bgPlayer) bgPlayer.classList.remove('active');
        if (bgPlayerFrame) bgPlayerFrame.innerHTML = '';
        if (musicTrigger) musicTrigger.style.display = 'block';
        if (vinylDisc) vinylDisc.style.animationPlayState = 'paused';
        if (vinylArm) vinylArm.style.transform = 'rotate(-25deg)';
        if (audioToggle) audioToggle.classList.remove('playing');
        if (widgetPlayIcon) widgetPlayIcon.hidden = false;
        if (widgetPauseIcon) widgetPauseIcon.hidden = true;
        isPlaying = false;
    }

    function toggleVisuals() {
        if (!isPlaying) {
            startMusic();
        } else {
            // Just toggle vinyl visuals since we can't control cross-origin iframe
            isPlaying = !isPlaying;
            if (vinylDisc) vinylDisc.style.animationPlayState = isPlaying ? 'running' : 'paused';
            if (widgetPlayIcon) widgetPlayIcon.hidden = isPlaying;
            if (widgetPauseIcon) widgetPauseIcon.hidden = !isPlaying;
        }
    }

    if (playSongBtn) playSongBtn.addEventListener('click', startMusic);
    if (bgPlayerClose) bgPlayerClose.addEventListener('click', closePlayer);
    document.addEventListener('toggleMusic', toggleVisuals);
    if (audioToggle) audioToggle.addEventListener('click', toggleVisuals);

    if (vinylDisc) vinylDisc.style.animationPlayState = 'paused';
    if (vinylArm) vinylArm.style.transform = 'rotate(-25deg)';

    console.log('🎵 Nocookie Audio Ready');
})();