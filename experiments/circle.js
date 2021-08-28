import { noBorderImages } from "./modules/circleImages.js";


const NUMBER_OF_IMAGES = 12;


function startTheCircleTest(colors) {
    showContainer()
    setUpCircle()
}

function showContainer() {
    const container = document.querySelector(".circle-container");
    container.style.display='block'
}

function setUpCircle() {
    const container = document.querySelector(".circle-container");

    let degreeAngle = 360 / NUMBER_OF_IMAGES;
    let currentAngle = 0;

    for (var index = 0; index < NUMBER_OF_IMAGES; index++) {
        /* add to the wrapper */
        container.appendChild(getElement(currentAngle, index));
        /* increment the angle incrementer */
        currentAngle = currentAngle + degreeAngle;
    }
}

function getElement(currentAngle, index) {
    const circleElement = document.createElement('div')
    circleElement.innerHTML = noBorderImages[index].content
    circleElement.classList=['circle']
    circleElement.style = "transform: rotate(" + currentAngle + "deg)" +
                          "translate(24em)" + 
                          "rotate(-" + currentAngle + "deg);"

    return circleElement;

}

function cleanUpSvgContent(content) {

}

export const name = 'circlesExperiment'
export { startTheCircleTest }