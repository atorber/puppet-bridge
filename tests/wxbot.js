import axios  from 'axios';

// POST /api/syncurl
async function syncurl() {
    const data = {
        "url": 'http://localhost:8081/qrcode-callback',
        "timeout": 60,
        "type": "general-msg"
    };
    try {
        const response = await axios.post('http://127.0.0.1:8080/api/syncurl', data);
        console.log("success:", response.data);
    } catch (error) {
        console.error("failed:", error.response.data);
    }
}

async function getSyncurl() {
    try {
        const response = await axios.get('http://127.0.0.1:8080/api/syncurl');
        console.log("success:", JSON.stringify(response.data, undefined, 2));
    } catch (error) {
        console.error("failed:", error.response.data);
    }
}

// DELETE /api/syncurl
async function deleteSyncurl() {
    const data = {
        "url": 'http://localhost:8081/qrcode-callback',
        "timeout": 60,
        "type": "general-msg"
    };
    try {
        const response = await axios.delete('http://localhost:8080/api/syncurl', { data });
        console.log("success:", JSON.stringify(response.data, undefined, 2));
    } catch (error) {
        console.error("failed:", error.response.data);
    }
}

// 测试回调地址是否正常 http://127.0.0.1:8081/qrcode-callback
async function test() {
    try {
        const getResponse = await axios.get('http://localhost:8081/qrcode-callback');
        console.log("success:", getResponse.data);
    } catch (error) {
        console.error("failed:", error.response.data);
    }

    try {
        const postResponse = await axios.post('http://127.0.0.1:8081/qrcode-callback');
        console.log("success:", postResponse.data);
    } catch (error) {
        console.error("failed:", error.response.data);
    }
}

// GET /api/dbchatroom?wxid=xxxx
async function dbchatroom(wxid) {
    try {
        const response = await axios.get(`http://127.0.0.1:8080/api/dbchatroom?wxid=${wxid}`);
        console.log("success:", JSON.stringify(response.data, undefined, 2));
    } catch (error) {
        console.error("failed:", error.response.data);
    }
}

async function main() {
    // Uncomment the function calls you need
    // await test();
    // await deleteSyncurl();
    // await getSyncurl();
    // await syncurl();
    // await getSyncurl();
    await dbchatroom('21341182572@chatroom');
}

main().catch(console.error);
