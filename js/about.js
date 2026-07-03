/* about.js */
document.addEventListener('DOMContentLoaded', () => {
    const content = getPageContent();
    if (content.about) {
        const story = document.getElementById('aboutStory');
        const mission = document.getElementById('aboutMission');
        const vision = document.getElementById('aboutVision');
        if (story && content.about.story) story.textContent = content.about.story;
        if (mission && content.about.mission) mission.textContent = content.about.mission;
        if (vision && content.about.vision) vision.textContent = content.about.vision;
    }
});
