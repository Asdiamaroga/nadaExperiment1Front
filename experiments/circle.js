import { noBorderImages } from './modules/circleImages.js'
import { noBorders } from './modules/circleColors.js'

const NUMBER_OF_IMAGES = 12;
const experimentResults = []
let indexOfColorCombination = 0;
let indexOfSteps = 0;
let text;

// #lazy, i just cant
const toBeSelectedImages = [
    {
        name: 'bez okvira-43.svg',
        wasSelected: false
    },
    {
        name: 'bez okvira-44.svg',
        wasSelected: false
    },
    {
        name: 'bez okvira-47.svg',
        wasSelected: false
    },
    {
        name: 'bez okvira-48.svg',
        wasSelected: false
    },
    {
        name: 'bez okvira-51.svg',
        wasSelected: false
    },
    {
        name: 'bez okvira-52.svg',
        wasSelected: false
    },
]

function startTheCircleTest(textRecieved) {
    text = textRecieved
    showContainer()
    setUpExperiment()
}

function showContainer() {
    const container = document.querySelector(".circle-container");
    container.style.display = 'block'
}

function setUpExperiment() {
    experimentResults.push({})
    
    


    setUpCircles()
}

function setUpCircles() {
    const container = document.querySelector(".circle-container");


    let degreeAngle = 360 / NUMBER_OF_IMAGES;
    let currentAngle = 0;

    for (var index = 0; index < NUMBER_OF_IMAGES; index++) {
        /* add to the wrapper */
        container.appendChild(
            createImageWithColors(currentAngle, index)
        );
        /* increment the angle incrementer */
        currentAngle = currentAngle + degreeAngle;
    }
}

function createImageWithColors(currentAngle, index) {
    const circleElement = document.createElement('div')
    circleElement.innerHTML = addColors(
        cleanUpSvgContent(noBorderImages[index].content),
        index
    )





    circleElement.classList = ['circle']
    circleElement.style = "transform: rotate(" + currentAngle + "deg)" +
        "translate(24em)" +
        "rotate(-" + currentAngle + "deg);"

    return circleElement;

}

function addColors(svgContent, index) {
    const colorForCurrentTest = noBorders[text];
    const currentColorCombo = colorForCurrentTest[indexOfColorCombination];

    const currentIndex = index % 6
    const colorsToAdd = currentColorCombo[currentIndex]
    return svgContent
        .replace('#box', colorsToAdd.filler)
        .replace('#phone', colorsToAdd.phone)
}

function cleanUpSvgContent(svgContent) {
    const startStyleTag = svgContent.indexOf('<style')
    const endStyleTag = svgContent.indexOf('</style>')

    return svgContent.substring(0, startStyleTag) + svgContent.substring(endStyleTag, svgContent.length)
}

export const name = 'circlesExperiment'
export { startTheCircleTest }