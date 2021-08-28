
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
        containerContent = containerContent + getDiv(currentAngle);
        /* increment the angle incrementer */
        currentAngle = currentAngle + degreeAngle;
    }

    container.innerHTML = containerContent;
}

function getDiv(currentAngle, distanceFromTheCenterOfTheCircle) {
    const style = "style='transform: rotate(" + currentAngle + "deg)" +
    "translate(24em) rotate(-" + Math.random()*360 + "deg); opacity:0.8;'"

    return "<img src='/assets/arrow.jpg' class='circle'" + 
    style + ">"
    + "</img>";

}

export const name = 'circlesExperiment'
export { startTheCircleTest }