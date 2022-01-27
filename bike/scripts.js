window.addEventListener('DOMContentLoaded', function () {

});

// get the canvas DOM element
var canvas = document.getElementById('renderCanvas');

// load the 3D engine
var engine = new BABYLON.Engine(canvas, true);

var offMaterial, onMaterial;
var meshIndex = {};
var meshes;

function offMeshes() {
    for (mesh of meshes) {
        mesh.material = offMaterial;
    }
}

function onMesh(meshName) {
    meshes[meshIndex[meshName]].material = onMaterial;
}

function emphasizeMesh(meshName, buttonObject) {
    offMeshes();
    onMesh(meshName);
    var buttons = document.getElementsByClassName("bike-item");
    for(var i=0; i<buttons.length; i++) {
        buttons[i].classList.remove("selected");
    }
    buttonObject.classList.add("selected");
}

BABYLON.SceneLoader.Load("assets/", "bike.glb", engine, function (scene) {

    // CAMERA:

    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera",
        BABYLON.Tools.ToRadians(-60), BABYLON.Tools.ToRadians(90),
        20, new BABYLON.Vector3(0, 2, 0), scene);

    camera.attachControl(canvas, false);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 20;

    // MATERIALS:

    offMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    offMaterial.diffuseColor = new BABYLON.Color3(.1, .1, .1);
    offMaterial.specularColor = new BABYLON.Color3(.1, .1, .1);

    onMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    onMaterial.diffuseColor = new BABYLON.Color3(1, .2, 0);
    onMaterial.specularColor = new BABYLON.Color3(.1, .1, .1);
    onMaterial.emissiveColor = new BABYLON.Color3(1, .2, 0);

    // LIGHT and BG:

    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    // scene.useRightHandedSystem = true;

    var gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 0.5;

    // MESHES:

    meshes = scene.meshes;
    for (var i = 0; i < scene.geometries.length; i++) {
        var geometry = scene.geometries[i];
        meshIndex[geometry.id] = i + 1;
        scene.meshes[i + 1].material = offMaterial;
    }

    // Other:

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
});