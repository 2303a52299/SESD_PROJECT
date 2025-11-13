// js/job-details.js
document.addEventListener("DOMContentLoaded", () => {
    const jobDetailsContainer = document.getElementById("job-details-container");
    const applicantListContainer = document.getElementById("applicant-list");
    const noApplicantsMessage = document.getElementById("no-applicants");

    // Get job ID from URL (e.g., job-details.html?id=job_123)
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (!jobId) {
        jobDetailsContainer.innerHTML = "<h2>Error: Job ID not found.</h2>";
        return;
    }

    function renderJobDetails() {
        const job = dbGetJobById(jobId);
        if (!job) {
            jobDetailsContainer.innerHTML = "<h2>Error: Job not found.</h2>";
            return;
        }
        
        jobDetailsContainer.innerHTML = `
            <div class="card-header">
                <h2>${job.title}</h2>
                <a href="apply.html?jobId=${job.id}" class="btn btn-secondary" target="_blank">Public Link</a>
            </div>
            <div class="card-content">
                <p><strong>Department:</strong> ${job.department}</p>
                <p><strong>Description:</strong></p>
                <p>${job.description.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }

    function renderApplicants() {
        const applicants = dbGetApplicationsForJob(jobId);
        applicantListContainer.innerHTML = ""; // Clear list

        if (applicants.length === 0) {
            noApplicantsMessage.style.display = "block";
            return;
        }
        
        noApplicantsMessage.style.display = "none";
        
        // Sort by status: new -> shortlisted -> rejected
        applicants.sort((a, b) => {
            const order = { 'new': 1, 'shortlisted': 2, 'rejected': 3 };
            return order[a.status] - order[b.status];
        });

        applicants.forEach(app => {
            const appCard = document.createElement("div");
            appCard.className = "card";
            
            let statusBadge = '';
            switch(app.status) {
                case 'new': statusBadge = 'badge-new'; break;
                case 'shortlisted': statusBadge = 'badge-shortlisted'; break;
                case 'rejected': statusBadge = 'badge-rejected'; break;
            }

            appCard.innerHTML = `
                <div class="card-header">
                    <h3>${app.name}</h3>
                    <span class="badge ${statusBadge}">${app.status.toUpperCase()}</span>
                </div>
                <div class="card-content">
                    <p><strong>Email:</strong> ${app.email}</p>
                    <p><strong>Resume/Cover Letter:</strong></p>
                    <p>${app.resume.replace(/\n/g, '<br>')}</p>
                </div>
                <div class="card-footer" data-appid="${app.id}">
                    ${app.status !== 'shortlisted' ? '<button class="btn btn-primary btn-shortlist">Shortlist</button>' : ''}
                    ${app.status !== 'rejected' ? '<button class="btn btn-danger btn-reject">Reject</button>' : ''}
                </div>
            `;
            applicantListContainer.appendChild(appCard);
        });
    }

    // --- Event Listeners for Status Buttons ---
    applicantListContainer.addEventListener("click", (e) => {
        const appId = e.target.closest(".card-footer").dataset.appid;
        if (!appId) return;

        if (e.target.classList.contains("btn-shortlist")) {
            dbUpdateApplicationStatus(appId, 'shortlisted');
        } else if (e.target.classList.contains("btn-reject")) {
            dbUpdateApplicationStatus(appId, 'rejected');
        }

        // Re-render the list to show the change
        renderApplicants();
    });

    // --- Initial Load ---
    renderJobDetails();
    renderApplicants();
});