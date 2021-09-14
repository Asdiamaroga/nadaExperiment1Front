export const name = 'arrayUtils';


function getQueryParamFromUrl() {
    const params = new URLSearchParams(window.location.search)
    const seconds = params.get('t');
    return seconds ? 1000 * seconds : 3000;
}

function isPractice() {
    return window.location.href.includes('practice');
}

export { getQueryParamFromUrl, isPractice }