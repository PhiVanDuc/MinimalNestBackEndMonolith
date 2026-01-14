module.exports = async (originalUrl) => {
    const transformUrl = originalUrl.replace("/upload", "/upload/w_10,h_10,c_fill");

    const response = await fetch(transformUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const base64String = Buffer.from(arrayBuffer).toString('base64');

    return `data:${contentType};base64,${base64String}`;
}