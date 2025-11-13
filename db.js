// js/db.js

// Our "database" is two keys in localStorage
const JOBS_KEY = 'hr_jobs';
const APPS_KEY = 'hr_applications';

// --- Helper Functions ---
function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// --- Job Functions ---

/** Gets all jobs from storage */
function dbGetJobs() {
    return getFromStorage(JOBS_KEY);
}

/** Gets a single job by its ID */
function dbGetJobById(jobId) {
    const jobs = dbGetJobs();
    return jobs.find(job => job.id === jobId);
}

/** Saves a new job */
function dbSaveJob(jobData) {
    const jobs = dbGetJobs();
    const newJob = {
        id: `job_${new Date().getTime()}`, // Unique ID
        title: jobData.title,
        department: jobData.department,
        description: jobData.description,
        postedDate: new Date().toISOString()
    };
    jobs.push(newJob);
    saveToStorage(JOBS_KEY, jobs);
    return newJob;
}

// --- Application Functions ---

/** Gets all applications */
function dbGetApplications() {
    return getFromStorage(APPS_KEY);
}

/** Gets all applications for a specific job */
function dbGetApplicationsForJob(jobId) {
    const allApps = dbGetApplications();
    return allApps.filter(app => app.jobId === jobId);
}

/** Saves a new application */
function dbSaveApplication(appData) {
    const applications = dbGetApplications();
    const newApp = {
        id: `app_${new Date().getTime()}`, // Unique ID
        jobId: appData.jobId,
        name: appData.name,
        email: appData.email,
        resume: appData.resume, // In a real app, this would be a file path
        status: 'new' // Default status
    };
    applications.push(newApp);
    saveToStorage(APPS_KEY, applications);
    return newApp;
}

/** Updates the status of an application */
function dbUpdateApplicationStatus(appId, newStatus) {
    const applications = dbGetApplications();
    const appIndex = applications.findIndex(app => app.id === appId);

    if (appIndex > -1) {
        applications[appIndex].status = newStatus;
        saveToStorage(APPS_KEY, applications);
        return true;
    }
    return false;
}