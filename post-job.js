// js/post-job.js
document.addEventListener("DOMContentLoaded", () => {
    const jobForm = document.getElementById("post-job-form");

    jobForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const jobData = {
            title: document.getElementById("title").value,
            department: document.getElementById("department").value,
            description: document.getElementById("description").value,
        };

        dbSaveJob(jobData);

        // Redirect back to the dashboard
        window.location.href = "index.html";
    });
});