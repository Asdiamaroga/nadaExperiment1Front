import { images } from "./modules/circleImages.js";


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

    let containerContent = '';
    for (var i = 0; i < NUMBER_OF_IMAGES; i++) {
        /* add to the wrapper */
        container.appendChild(getElement(currentAngle));
        /* increment the angle incrementer */
        currentAngle = currentAngle + degreeAngle;
    }

    // container.innerHTML = containerContent;
}

function getElement(currentAngle, distanceFromTheCenterOfTheCircle) {
    const circleElement = document.createElement('div')
    circleElement.innerHTML = images[0].content
    circleElement.classList=['circle']
    circleElement.style = "transform: rotate(" + currentAngle + "deg)" +
                          "translate(24em)" + 
                          "rotate(-" + Math.random()*360 + "deg);"

    return circleElement;

}

export const name = 'circlesExperiment'
export { startTheCircleTest }