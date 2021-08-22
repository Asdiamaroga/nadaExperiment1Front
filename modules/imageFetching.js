export const name = 'imageFetching';


async function fetchSvgFiles() {
    const fileNames = []
    let images = []
    for (let i = 18; i < 22; i++) {
        const name = `${i}.svg`;
        fileNames.push(name);
        images.push(
            fetch('/modules/' + name)
                .then(response => response.text())
        )
    }

    images = await Promise.all(images)

    cleanSVG(images)

    const result = []
    for(const index in fileNames) {
        result.push({
            fileName: fileNames[index],
            svgContent: images[index]
        })
    }

    return result;
}


function cleanSVG(svgArray) {
    for (const index in svgArray) {
        const svgContent = svgArray[index];
        const startOfScript = svgContent.indexOf('<script')
        const endOfScript = svgContent.indexOf('</script>')
        const lenght = svgContent.lenght
        svgArray[index] = svgContent.substring(0, startOfScript) + svgContent.substring(endOfScript, lenght)
    }
}


export {fetchSvgFiles}