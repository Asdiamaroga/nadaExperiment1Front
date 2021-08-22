export const name = 'arrayUtils';


function shuffleArray(array) {
    let shuffleMania = shuffleSomeMore(shuffleSomeMore(array));
    return shuffleMania.sort(function () {
        return Math.random() - 0.5
    });
}

//thx stack overflow
function shuffleSomeMore(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


export {shuffleArray}