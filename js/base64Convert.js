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
        console.error("Base64 encoding error:", e);
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
        console.error("Base64 decoding error:", e);
        showStatus("Error decoding Base64 data. The data may be corrupted.", "error");
        throw new Error("Base64 decoding failed: " + e.message);
    }
}