// js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    const jobListContainer = document.getElementById("job-list");
    const noJobsMessage = document.getElementById("no-jobs");

    function renderJobs() {
        const jobs = dbGetJobs();
        jobListContainer.innerHTML = ""; // Clear list

        if (jobs.length === 0) {
            noJobsMessage.style.display = "block";
            return;
        }

        noJobsMessage.style.display = "none";

        // Sort by most recent first
        jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

        jobs.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.className = "card";
            
            // Get applicant count
            const applicants = dbGetApplicationsForJob(job.id);

            jobCard.innerHTML = `
                <div class="card-header">
                    <h2>${job.title}</h2>
                    <span class="badge badge-new">${applicants.length} Applicant(s)</span>
                </div>
                <div class="card-content">
                    <p><strong>Department:</strong> ${job.department}</p>
                    <p>${job.description.substring(0, 150)}...</p>
                </div>
                <div class="card-footer">
                    <a href="job-details.html?id=${job.id}" class="btn">Manage Applicants</a>
                    <a href="apply.html?jobId=${job.id}" class="btn btn-secondary" target="_blank">View Public Link</a>
                </div>
            `;
            jobListContainer.appendChild(jobCard);
        });
    }

    renderJobs();
});