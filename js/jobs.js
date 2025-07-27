
function encodeBase64(str) {
    try {

        const utf8Encoder = new TextEncoder();
        const utf8Bytes = utf8Encoder.encode(str);

        let binaryString = '';
        utf8Bytes.forEach(byte => {
            binaryString += String.fromCharCode(byte);
        });


        return btoa(binaryString);
    } catch (e) {
        // console.error("Base64 encoding error:", e);
        showStatus("Error encoding data to Base64. Please check for invalid characters.", "error");
        throw new Error("Base64 encoding failed: " + e.message);
    }
}

function decodeBase64(base64) {
    try {
        if (!base64 || typeof base64 !== 'string') {
            throw new Error("Invalid input: not a string");
        }

        base64 = base64.replace(/[\r\n\t\s]/g, '').replace(/^[^,]*,/, '');
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }

        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    } catch (e) {
        // console.error("Base64 decoding error:", e);
        showStatus("Error decoding Base64 data. The data may be corrupted.", "error");
        throw new Error("Base64 decoding failed: " + e.message);
    }
}

const getToken = ()  => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}


const getJobs = async () => {

    const token = getToken();
    // console.log(token)

    const res = await fetch("https://api.github.com/repos/AivaraTechSolutions/aivar_admin/contents/jobs.json?ref=main", {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (res.status === 200) {
        const data = await res.json();
        var sha = data.sha;
        var jobs = JSON.parse(decodeBase64(data.content));
        return {
            data: jobs,
            sha: sha
        }
    } else {
        return {
            data: undefined,
            sha
        }
    }

}

const deleteFromJobs = async (id) => {

    const token = getToken();

    const jobsRes = await getJobs(token);

    if (jobsRes.data) {
        let jobs = jobsRes.data;

        let jobData = jobs.find(job => job.id === id);
        jobs = jobs.filter(job => job.id !== id);

        const payload = {
            message: `Deleting Job: ${jobData.title}`,
            content: encodeBase64(JSON.stringify(jobs, null, 2)),
            branch: "main",
            sha: jobsRes.sha,
        };

        const res = await fetch("https://api.github.com/repos/AivaraTechSolutions/aivar_admin/contents/jobs.json?ref=main", {
            method: "PUT",
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(payload)

        });


        return {
            status: 200,
            sha: res.sha
        }
    } else {
    }

}

const putJob = async (payload) => {
    const token = getToken();

    const res = await fetch("https://api.github.com/repos/AivaraTechSolutions/aivar_admin/contents/jobs.json?ref=main", {
        method: "PUT",
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(payload)
    });

    return res;
}