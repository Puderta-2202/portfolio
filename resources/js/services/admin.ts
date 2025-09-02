// Base URL (rapihin: hilangin trailing slash biar ga dobel)
const RAW_API =
    (typeof import.meta !== "undefined" &&
        (import.meta as any).env?.VITE_API_URL) ||
    "http://127.0.0.1:8000";
const API = RAW_API.replace(/\/+$/, "");

// Helper header: selalu attach X-Admin-Key + Accept
const hdr = (extra?: Record<string, string>) => {
    const key = (localStorage.getItem("admin_key") || "").trim();
    if (!key) {
        // biar kelihatan di DevTools kenapa 401
        // (cuma warning, gak ngeganggu produksi)
        console.warn(
            "[admin] X-Admin-Key kosong. Set dulu via AdminPanel sebelum panggil API."
        );
    }
    return {
        Accept: "application/json",
        "X-Admin-Key": key,
        ...(extra ?? {}),
    };
};

/* Portfolios */
export async function listPortfoliosSimple() {
    const r = await fetch(`${API}/api/admin/portfolios?simple=1`, {
        headers: hdr(),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function syncPortfolioSkills(id: number, skillIds: number[]) {
    const r = await fetch(`${API}/api/admin/portfolios/${id}/skills/sync`, {
        method: "POST",
        headers: hdr({ "Content-Type": "application/json" }),
        body: JSON.stringify({ skill_ids: skillIds }),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}

/* Projects */
export async function listProjects(page = 1) {
    const r = await fetch(`${API}/api/admin/projects?page=${page}`, {
        headers: hdr(),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function createProject(fd: FormData) {
    const r = await fetch(`${API}/api/admin/projects`, {
        method: "POST",
        headers: hdr(), // JANGAN set Content-Type saat pakai FormData
        body: fd,
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function updateProject(id: number, fd: FormData) {
    const r = await fetch(`${API}/api/admin/projects/${id}`, {
        method: "PUT",
        headers: hdr(),
        body: fd,
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function deleteProject(id: number) {
    const r = await fetch(`${API}/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: hdr(),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}

/* Experiences */
export async function listExperiences(page = 1) {
    const r = await fetch(`${API}/api/admin/experiences?page=${page}`, {
        headers: hdr(),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function createExperience(payload: any) {
    const r = await fetch(`${API}/api/admin/experiences`, {
        method: "POST",
        headers: hdr({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function updateExperience(id: number, payload: any) {
    const r = await fetch(`${API}/api/admin/experiences/${id}`, {
        method: "PUT",
        headers: hdr({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function deleteExperience(id: number) {
    const r = await fetch(`${API}/api/admin/experiences/${id}`, {
        method: "DELETE",
        headers: hdr(),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}

/* Education */
export async function listEducation(page = 1) {
    const r = await fetch(`${API}/api/admin/education?page=${page}`, {
        headers: hdr(),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function createEducation(payload: any) {
    const r = await fetch(`${API}/api/admin/education`, {
        method: "POST",
        headers: hdr({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function updateEducation(id: number, payload: any) {
    const r = await fetch(`${API}/api/admin/education/${id}`, {
        method: "PUT",
        headers: hdr({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function deleteEducation(id: number) {
    const r = await fetch(`${API}/api/admin/education/${id}`, {
        method: "DELETE",
        headers: hdr(),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}

/* Skills */
export async function listSkills(page = 1) {
    const r = await fetch(`${API}/api/admin/skills?page=${page}`, {
        headers: hdr(),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function createSkill(payload: any) {
    const r = await fetch(`${API}/api/admin/skills`, {
        method: "POST",
        headers: hdr({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function updateSkill(id: number, payload: any) {
    const r = await fetch(`${API}/api/admin/skills/${id}`, {
        method: "PUT",
        headers: hdr({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
export async function deleteSkill(id: number) {
    const r = await fetch(`${API}/api/admin/skills/${id}`, {
        method: "DELETE",
        headers: hdr(),
        credentials: "same-origin",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}
