import React from "react";
import * as d3 from "d3";
import "./ObjectsLibraryStyle.css";
import {add_object_on_canvas} from "./CanvasField";
import axios from "axios";

let objs_num = 0;
let first_open: boolean = true;
// rect: x, y, width, height
// circle: cx, cy, r
// ellipse: cx, cy, rx, ry
// line: x1, x2, y1, y2, stroke-width(num), stroke, fill
// polyline: points, stroke-width(num), stroke, fill
// polygon: points, stroke-width(num), stroke, fill
// path: d, stroke-width(num), stroke, fill
 /*let default_objects_library: string[][][] = [
     [["circle and circle", "metadata for circle_circle"], ["circle", "60", "60", "30"], ["circle", "10", "10", "8"]],
     [["rect and circle", "just metadata"], ["rect", "80", "60", "20", "40"], ["circle", "10", "10", "25"]],
     [["one ellipse", "just metadata"], ["ellipse", "80", "60", "20", "40"]],
     [["one line", "just metadata"], ["line", "10", "40", "30", "20", "3", "black", "black"]],
     [["one polyline", "its better then previous one"], ["polyline", "10 40 30 20 0 90 80 67", "4", "black", "transparent"], ["circle", "10", "10", "25"]],
     [["one polygon", "metadata"], ["polygon", "10 16 5 10 7 18 6 19 5 25 50 15 35 25 40 90 30 18 45 18", "3", "black", "black"]],
     [["one path", "metadata"], ["path", "M 20 23 Q 40 205, 50 230 T 90 230", "3", "black", "black"]],
 ];*/

export let default_objects: string[][][] = [[[]]]; //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function initialize_default_objects() {
    axios({
        url: 'api/v1/library',
        //params: {'data-type': 'object'}, // чтобы серверу узнать, что я присылаю на сохранение
        method: 'get',
        //headers: {'Content-Type': 'application/json'},
    })
        .then(function (response) { // READY? not checked with a real data.
            console.log("data:", response.data);
            default_objects = [];
            response.data.forEach((object:any)=>{
                default_objects.push(JSON.parse(object));
            });
            console.log("parsed data:", default_objects);
            default_objects.forEach((object:string[][]) => {
                add_object_to_library(object);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    /*let default_objects = default_objects_library; // аналогично нужно его получить, а не изначально иметь.
    default_objects.forEach((object) => {
        add_object_to_library(object);
    });*/
}

export function add_object_to_library(object: string[][]) {
    let object_name = object[0][0];
    let el = d3.select(".objects_library");
    let par = el.append("p").attr("class", `library_p_${objs_num}`);
    let p = par.append("p");
    p.append("text").text(`Название объекта: ${object_name}`);
    let div = par.append("div").attr("class", `objects_${objs_num}_body`);
    let svg = div.append("svg").attr("class", `object_${objs_num}_svg`).style("overflow", "scroll").style("background-color", "white");
    for (let j: number = 1; j < object.length; j++) {
        if (object[j][0] === "rect")
            svg.append(object[j][0]).attr("x", parseFloat(object[j][1])).attr("y", parseFloat(object[j][2])).attr("width", parseFloat(object[j][3])).attr("height", parseFloat(object[j][4]));
        else if (object[j][0] === "circle")
            svg.append(object[j][0]).attr("cx", parseFloat(object[j][1])).attr("cy", parseFloat(object[j][2])).attr("r", parseFloat(object[j][3]));
        else if (object[j][0] === "ellipse")
            svg.append(object[j][0]).attr("cx", parseFloat(object[j][1])).attr("cy", parseFloat(object[j][2])).attr("rx", parseFloat(object[j][3])).attr("ry", parseFloat(object[j][4]));
        else if (object[j][0] === "line")
            svg.append(object[j][0]).attr("x1", parseFloat(object[j][1])).attr("x2", parseFloat(object[j][2])).attr("y1", parseFloat(object[j][3])).attr("y2", parseFloat(object[j][4])).attr("stroke-width", parseFloat(object[j][5])).style("stroke", object[j][6]).attr("fill", object[j][7]);
        else if (object[j][0] === "polyline")
            svg.append(object[j][0]).attr("points", object[j][1]).attr("stroke-width", parseFloat(object[j][2])).style("stroke", object[j][3]).attr("fill", object[j][4]);
        else if (object[j][0] === "polygon")
            svg.append(object[j][0]).attr("points", object[j][1]).attr("stroke-width", parseFloat(object[j][2])).style("stroke", object[j][3]).attr("fill", object[j][4]);
        else if (object[j][0] === "path")
            svg.append(object[j][0]).attr("d", object[j][1]).attr("stroke-width", parseFloat(object[j][2])).style("stroke", object[j][3]).attr("fill", object[j][4]);
    }
    let divdiv = div.append("div");
    let metadata_p = divdiv.append("p");
    metadata_p.append("text").text(`Метаданные объекта: ${object[0][1]}`);
    let add_button_p = divdiv.append("p");
    let delete_button_p = divdiv.append("p");
    let add_button = add_button_p.append("button");
    add_button.append("text").text("Добавить объект на канвас");
    add_button.on("mousedown", () => {
        add_object_on_canvas(object);
    });
    let delete_button = delete_button_p.append("button");
    delete_button.append("text").text("Удалить объект из библиотеки");
    delete_button.on("mousedown", () => {
        par.remove();
    });

    objs_num++;
}

export function objects_library_visualize() {
    if (first_open) {
        initialize_default_objects();
        first_open = false;
    }
    let el = d3.select(".objects_library");
    let el_oth = d3.select(".plans_library");
    if (el_oth.style("visibility") === "visible")
        el_oth.style("visibility", "hidden");
    if (el.style("visibility") === "hidden")
        el.style("visibility", "visible");
    else
        el.style("visibility", "hidden");
}

export class ObjectsLibrary extends React.Component {
    render() {
        return (
            <div className={"objects_library"}>
                <p>Библиотека объектов</p>
                <p>
                    <button className={"add_new_object_to_library_button"} onMouseDown={() => {
                    }}>(ПУСТО) Добавить объект в библиотеку
                    </button>
                </p>
            </div>
        );
    }
}