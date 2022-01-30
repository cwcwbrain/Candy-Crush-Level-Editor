const colors = {"055": "red", "056": "yellow", "057": "blue", "058": "green", "059": "orange", "060": "purple"}
const coloredCandy = {"002": "random", "018": "pepper_candy", "045": "striped_horizontal", "046": "striped_vertical", "047": "wrapped", "049":"jellyfish", "051": "key", "052": "lucky", "091": "jellyfish_striped", "092": "jellyfish_wrapped", "093": "jellyfish_colorbomb"}
const candy = {"044": "bomb", "043": "coconut_wheel", "061": "ufo"}
const blockers = {"008": "licorice", "009": "chocolate", "017": "licorice_square", "019": "block_multi_frosting1", "020": "block_multi_frosting2", "021": "block_multi_frosting3", "022": "block_multi_frosting4", "023": "block_multi_frosting5", "024": "chocolate_spawner", "025": "marmalade", "054": "shell_1", "079": "block_waffle1", "080": "block_waffle2", "081": "block_waffle3", "082": "block_waffle4", "083": "block_waffle5", "087": "horizontal", "094": "dark_chocolate_1", "095": "dark_chocolate_2", "096": "dark_chocolate_3", "097": "dark_chocolate_4", "098": "dark_chocolate_5", "122": "glass_tile_1", "123": "glass_tile_2", "124": "glass_tile_3", "129": "chain_layer1_c", "130": "chain_layer2_c", "131": "chain_layer3_c", "132": "chain_layer4_c", "133": "chain_layer5_c", "134": "sugarcoat_1", "135": "sugarcoat_2", "136": "sugarcoat_3", "157": "shell_3", "158": "shell_2", "159": "bubble_pop_1", "160": "bubble_pop_2", "161": "bubble_pop_3", "162": "bubble_pop_4", "163": "bubble_pop_5", "211": "dark_chocolate_spawner_1", "212": "dark_chocolate_spawner_2", "213": "dark_chocolate_spawner_3", "220": "jelly_jar_1", "221": "jelly_jar_2"}
const tiles = {"empty": "empty", "000": "none", "001": "grid", "003": "jelly", "004": "jelly2", "064": "blueTile", "065": "blackTile"}
const ingredients = {"125": "cherry", "126": "hazelnut"}

const elements_ids = Object.assign({}, colors, coloredCandy, candy, blockers, tiles, ingredients, {"010": "ingredients_exit", "005": "candy_entrance"})
const elements_names = _.invert(elements_ids)

const stretched = ["009", "019", "020", "021", "022", "023", "025", "122", "123", "124", "134", "135", "136", "054", "157", "158", "024", "211", "212", "213", "220", "221", "159", "160", "161", "162", "163"]
const small = [].concat(Object.keys(colors), Object.keys(coloredCandy), ["017", "002", "079", "080", "081", "082", "083", "044", "043", "125", "126"]);

const elementsFolder = "elements/"
var selectedColor = "002"
var selectedElement = "002"
var elementLayer = "normal"

var currentMode = "Classic moves"

//Order of the layers
const layers = [
    "tile",
    "normal",
    "sugarcoat",
    "overlay_blocker",
    "glass",
    "ingredients_exit",
    "candy_entrance",
    "selectimg"
]

var preferredColors = [0,1,2,3,4,5]

var isDown = false

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

function selectMode(){
    mode = document.querySelector('input[name="leveltype"]:checked').value
    if (mode === "Classic"){
        document.getElementById("moves-section").style.display = "none"
        document.getElementById("time-section").style.display = "flex"
    }
    else{
        document.getElementById("moves-section").style.display = "flex"
        document.getElementById("time-section").style.display = "none"
    }

    if (mode === "Drop down"){
        document.getElementById("ingredients-options-section").style.display = "block"
    }
    else{
        document.getElementById("ingredients-options-section").style.display = "none"
    }

    currentMode = mode
}

function togglePreferred(object){
    color = Number(object.getAttribute("value"))

    if (!preferredColors.includes(color)){
        if (!(object.classList.contains("preferredselected"))){
            object.classList.add("preferredselected")
        }

        preferredColors.push(color)
    }
    else{
        object.classList.remove("preferredselected")

        preferredColors.splice(preferredColors.indexOf(color), 1)
    }
}

function toggleDropdown(object){
    let dropped = document.getElementById(object.getAttribute("associd"))
    let p = object.querySelector(".arrow")
    
    if (dropped.style.display == "none"){
        dropped.style.display = "block"
        p.style.transform = "rotate(" + 0 + "deg)"
    }
    else{
        dropped.style.display = "none"
        p.style.transform = "rotate(" + 90 + "deg)"
    }
}

function updateColor(object, color){
    try{
        document.querySelector(".colorselected").classList.remove("colorselected")
    }
    catch{}
    object.classList.add("colorselected")
    selectedColor = elements_names[color]
}

function updateTile(object){
    if (elementLayer !== "tile" && object.getAttribute("tile") === "000"){
        //Do not update tile if its empty
        return
    }

    let image = object.querySelector("." + elementLayer)

    if (elementLayer == "tile"){
        if (selectedElement === "empty"){
            //Make space empty if empty selected
            layers.forEach(function(layer){
                if (object.hasAttribute(layer) && layer != "tile"){
                    object.setAttribute(layer, "")
                }
            })
            object.childNodes.forEach(function(node){
                if (!node.classList.contains("selectimg") && !node.classList.contains("tile")){
                    node.src = ""
                }
            })
            object.setAttribute("color", "")
            return
        }
        object.setAttribute("tile", selectedElement)
        image.src = elementsFolder + elements_ids[selectedElement] + ".png"

        //Remove all if empty
        if (selectedElement === "000"){
            layers.forEach(function(layer){
                if (object.hasAttribute(layer)){
                    object.setAttribute(layer, "")
                }
            })
            object.childNodes.forEach(function(node){
                if (!node.classList.contains("selectimg") && !node.classList.contains("tile")){
                    node.src = ""
                }
            })
            object.setAttribute("color", "")
        }
    }
    if (elementLayer == "sugarcoat"){
        if (object.getAttribute("normal") in coloredCandy){
            object.setAttribute(elementLayer, selectedElement)
            image.src = elementsFolder + elements_ids[selectedElement] + ".png"
        }
        else{
            return
        }
    }
    else if (elementLayer == "normal"){
        image = object.querySelector(".normal")
        if (selectedElement in coloredCandy){
            //Set colored Candy
            let colorName = elements_ids[selectedColor]
            let elementName = ""
            let name = ""
        
            if (selectedColor === "002" && selectedElement === "002"){
                name = "random"
            }
            else if (selectedColor !== "002" && selectedElement === "002"){
                name = colorName
            }
            else{
                elementName = elements_ids[selectedElement] + "_"
                name = elementName + colorName
            }
            
            image.src = elementsFolder + name + ".png"
            object.setAttribute("normal", selectedElement)
            object.setAttribute("color", selectedColor)
        }
        else{
            //Set non colored candy
            image.src = elementsFolder + elements_ids[selectedElement] + ".png"
            object.setAttribute("normal", selectedElement)
            object.setAttribute("color", "")
        }
    }
    else{
        object.setAttribute(elementLayer, selectedElement)
        image.src = elementsFolder + elements_ids[selectedElement] + ".png"
    }

    if (small.includes(selectedElement)){
        if (!image.classList.contains("small")){
            image.classList.add("small")
        }
    }
    else{
        try {
            image.classList.remove("small")
        } catch{}
    }
    
    if (stretched.includes(selectedElement)){
        if (!image.classList.contains("stretched")){
            image.classList.add("stretched")
        }
    }
    else{
        try {
            image.classList.remove("stretched")
        } catch{}
    }

    if (!(object.getAttribute("normal") in coloredCandy)){
        object.setAttribute("sugarcoat", "")
        object.querySelector(".sugarcoat").src = elementsFolder + "none.png"
    }
}

function updateSelection(object, element, layer){
    try{
        document.querySelector(".elementselected").classList.remove("elementselected")
    }
    catch{}
    object.classList.add("elementselected")
    selectedElement = elements_names[element]
    elementLayer = layer
}

function updateElmState(object){
    if (object.getAttribute("normal") in coloredCandy){
        colorId = object.getAttribute("color")
        objectId = object.getAttribute("normal")

        if (colorId === "002"){
            colorId = "055"
        }
        else if (colorId === "055"){
            colorId = "056"
        }
        else if (colorId === "056"){
            colorId = "057"
        }
        else if (colorId === "057"){
            colorId = "058"
        }
        else if (colorId === "058"){
            colorId = "059"
        }
        else if (colorId === "059"){
            colorId = "060"
        }
        else if (colorId === "060"){
            colorId = "002"
        }


        object.setAttribute("color", colorId)

        let colorName = elements_ids[colorId]
        let elementName = ""
        let name = ""
    
        if (colorId === "002" && objectId === "002"){
            name = "random"
        }
        else if (colorId !== "002" && objectId === "002"){
            name = colorName
        }
        else{
            elementName = elements_ids[objectId] + "_"
            name = elementName + colorName
        }
        object.querySelector(".normal").src = elementsFolder + name + ".png"
    }
}

function exportLevel(){
    var levelArray = []
    level = document.getElementById("level")
    level.childNodes.forEach(function(row){
        rowArray = []
        for (var i = 0; i < row.childNodes.length; i++){
            let object = row.childNodes[i]

            if (object.getAttribute("tile") == "000"){
                rowArray.push("000")
                continue
            }

            let totalCode = []
            let toLoopThrough = [].concat(layers, ["color"])
            toLoopThrough.forEach(function(layer){
                let element = ""
                if (object.hasAttribute(layer)){
                    element = object.getAttribute(layer)
                }
                else{
                    element = ""
                }

                if (!totalCode.includes(element)){
                    totalCode.push(element)
                }
            })
            rowArray.push(totalCode.join(""))
        }
        levelArray.push(rowArray)
    })
    return levelArray
}

function exportLevelUI(){
    let level = {}
    let map = exportLevel()
    console.log(map)
    level['tileMap'] = map
    level['gameModeName'] = "Classic moves"
    level['numberOfColours'] = preferredColors.length
    level['preferredColors'] = preferredColors

    level['disablePreLevelBoosters'] = false
    level['colorWeightAdjustments'] = [0]
    level['frogStomachSize'] = 0

    level['scoreTargets'] = [100,200,300]

    level['protocolVersion'] = "0.3"
    level['randomSeed'] = 0

    level['portals'] = []
    level['gates'] = []
    level['orlocks'] = []
    level['skulls'] = []

    if (currentMode === "Classic"){
        let time = document.getElementById("time").value
        if (time === ''){
            time = 30
        }
        else{
            time = Number(time)
        }
        level['timeLimit'] = time
    }
    else{
        let moves = document.getElementById("moves").value
        if (moves === ''){
            moves = 20
        }
        else{
            moves = Number(moves)
        }

        level['moveLimit'] = moves
    }

    if (currentMode === "Drop down"){
        let cherries = document.getElementById("cherries").value
        if (cherries === ''){
            cherries = 20
        }
        else{
            cherries = Number(cherries)
        }

        let hazelnuts = document.getElementById("hazelnuts").value
        if (hazelnuts === ''){
            hazelnuts = 20
        }
        else{
            hazelnuts = Number(hazelnuts)
        }

        level['ingredients'] = [cherries, hazelnuts]
        level['numIngredientsOnScreen'] = 1
        level['ingredientSpawnDensity'] = 0
        level['maxNumIngredientsOnScreen'] = 1
    }

    level['gameModeName'] = currentMode

    level['episodeId'] = 0
    level['chameleonCandyMax'] = 0
    level['chameleonCandySpawn'] = 0
    level['fallingIcingMax'] = 0
    level['fallingIcingSpawn'] = 0
    level['fallingIcingLevel'] = 0
    level['licoriceMax'] = 0
    level['licoriceSpawn'] = 0
    level['luckyCandyMax'] = 0
    level['luckyCandySpawn'] = 0
    level['mulockCandyMax'] = 0
    level['mulockCandySpawn'] = 0
    level['mysteryCandyMax'] = 0
    level['mysteryCandySpawn'] = 0
    level['pepperCandyExplosionTurns'] = 0
    level['pepperCandyMax'] = 0
    level['pepperCandySpawn'] = 0
    level['stripedCandyMax'] = 0
    level['stripedCandySpawn'] = 0
    level['stripedRowCandyMax'] = 0
    level['stripedRowCandySpawn'] = 0
    level['stripedColumnCandyMax'] = 0
    level['stripedColumnCandySpawn'] = 0
    level['timeCandyMax'] = 0
    level['timeCandySpawn'] = 0
    level['wrappedCandyMax'] = 0
    level['wrappedCandySpawn'] = 0
    level['colorBombMax'] = 0
    level['colorBombSpawn'] = 0
    level['fishMax'] = 0
    level['fishSpawn'] = 0
    level['shieldMax'] = 0
    level['shieldSpawn'] = 0
    level['shieldLevel'] = 0


    document.getElementById("exportfield").value = JSON.stringify(level)
    document.getElementById("exportmenu").style.display = "block"
}

function resized(){
    let container = document.getElementById("level")
    let width = window.innerWidth * .0008
    let height = window.innerHeight * .0008

    document.documentElement.style.setProperty("--scaleWidth", width)
    document.documentElement.style.setProperty("--scaleHieght", height)
}

window.onresize = function() {
    resized()
}

resized()

function createNewTable(){
    var levelTable = document.getElementById('level')
    levelTable.innerHTML = ""
    for (let i=0; i < 9; i++) {
            var row = document.createElement("tr")
            levelTable.appendChild(row)
            for (let g=0; g < 9; g++) {
                var object = document.createElement("td")
                object.setAttribute("style", "position: relative; left: 0; top: 0;")


                object.addEventListener('contextmenu', function(ev) {
                    ev.preventDefault()
                    let object = ev.target
                    if (object.nodeType != "td"){
                        object = object.parentNode
                    }
                    updateElmState(object)
                }, false)

                object.onmouseover = function(event) {  
                    event.preventDefault();  
                    this.classList.add("selected")
                    if (isDown){
                        updateTile(this)
                    }
                  }  

                  object.onmousedown = function(event){
                    event.preventDefault()
                    if (event.button === 0) {
                        event.preventDefault()
                        isDown = true
                        updateTile(this)

                    }
                  }
                  object.onmouseout = function(event) {  
                    event.preventDefault();  
                    try{
                        this.classList.remove("selected")
                    }
                    catch{}
                  }

                object.setAttribute('normal', "002")
                object.setAttribute('color', "002")
                object.setAttribute('tile', "001")
                

                layers.forEach(function(layer){
                    let image = document.createElement("img")
                    image.setAttribute('draggable', false)
                    // image.style.display = "block"
                    image.classList.add(layer)
                    image.classList.add("default")
                    object.appendChild(image)
                })

                image = object.querySelector(".tile")
                image.src = 'elements/grid.png'
                image.classList.remove("default")

                if (i === 0){
                    image = object.querySelector(".candy_entrance")
                    image.src = elementsFolder + "candy_entrance.png"
                    object.setAttribute("candy_entrance", "005")
                }
                
                image = object.querySelector(".normal")
                image.src = elementsFolder + elements_ids["002"] + ".png"
                image.classList.add("small")

                image = object.querySelector(".selectimg")
                image.src = elementsFolder + "select.png"
                image.style.display = "none"

                row.appendChild(object)
        }
    }
}

createNewTable()

document.addEventListener('mouseup', function() {
    isDown = false;
}, true);

//Auto set up left GUI colors
document.querySelectorAll(".selectcolor").forEach(function(element){
    let color = element.getAttribute("color")
    let parent = element.parentElement

    let button = document.createElement('button')
    let image = button.appendChild(document.createElement("img"))
    image.classList.add("selectionimage")
    image.src = elementsFolder + color + ".png"

    button.setAttribute("onclick", "updateColor(this, \"" + color + "\")")

    element.remove()
    parent.appendChild(button)
})

//Auto set up left GUI colored elements
document.querySelectorAll(".selectcoloredelement").forEach(function(element){
    let elementName = element.getAttribute('element')
    let parent = element.parentElement

    let button = document.createElement('button')
    let image = button.appendChild(document.createElement("img"))
    image.classList.add("selectionimage")
    image.src = elementsFolder + elementName + "_random.png"

    button.setAttribute("onclick", "updateSelection(this, '" + elementName + "', 'normal')")

    element.remove()
    parent.appendChild(button)
})

//Auto set up left GUI elements
document.querySelectorAll(".selectelement").forEach(function(element){
    let elementName = element.getAttribute('element')
    let parent = element.parentElement

    let button = document.createElement('button')
    let image = button.appendChild(document.createElement("img"))
    image.classList.add("selectionimage")
    image.src = elementsFolder + elementName + ".png"

    button.setAttribute("onclick", "updateSelection(this, \"" + elementName + "\", '" + element.getAttribute("gamelayer") + "')")

    element.remove()
    parent.appendChild(button)
})