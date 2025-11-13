// js/apply.js
document.addEventListener("DOMContentLoaded", () => {
    const applyForm = document.getElementById("apply-form");
    const jobTitleEl = document.getElementById("job-title");

    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');

    if (!jobId) {
        document.querySelector(".card").innerHTML = "<h2>Error: Job ID not specified.</h2>";
        return;
    }

    // Load job title
    const job = dbGetJobById(jobId);
    if (!job) {
        document.querySelector(".card").innerHTML = "<h2>Error: Job not found.</h2>";
        return;
    }
    jobTitleEl.textContent = `Apply for: ${job.title}`;


    // Handle form submission
    applyForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const appData = {
            jobId: jobId,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            resume: document.getElementById("resume").value,
        };

        dbSaveApplication(appData);

        // Redirect to a success page
        window.location.href = `apply-success.html?jobTitle=${encodeURIComponent(job.title)}`;
    });
});