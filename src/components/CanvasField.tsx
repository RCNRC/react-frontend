import React from "react";
import * as d3 from "d3";
import "./CanvasFieldStyle.css"
import {add_plan_to_library, default_plans} from "./PlansLibrary";
import axios from "axios";
import {default_objects} from "./ObjectsLibrary";

let gG: any;
export let width: number;
export let height: number;

export function clean_canvas() {
    let main_g = d3.select(".main_g_for_grid");
    main_g.selectAll(".for_rotating").each(
        function (d, i) {
            d3.select(this).remove();
        }
    );
}

export function store_plan(plan_name: string, plan_metadata: string) {
    let plan: string[][][] = [[[plan_name, plan_metadata]]];
    let main_g = d3.select(".main_g_for_grid");
    main_g.selectAll(".for_rotating").each(
        function (d, i) { // для каждого объекта
            let svg = d3.select(this);
            let g = svg.select("g");
            plan.push([[svg.attr("object_name"), svg.attr("object_metadata"), g.attr("transform")]]);

            g.selectAll("rect").each(function (d, i) {
                let rect = d3.select(this);
                plan[plan.length - 1].push(["rect", rect.attr("x"), rect.attr("y"), rect.attr("width"), rect.attr("height")]);
            });
            g.selectAll("circle").each(function (d, i) {
                let circle = d3.select(this);
                plan[plan.length - 1].push(["circle", circle.attr("cx"), circle.attr("cy"), circle.attr("r")]);
            });
            g.selectAll("ellipse").each(function (d, i) {
                let ellipse = d3.select(this);
                plan[plan.length - 1].push(["ellipse", ellipse.attr("cx"), ellipse.attr("cy"), ellipse.attr("rx"), ellipse.attr("ry")]);
            });
            g.selectAll("line").each(function (d, i) {
                let line = d3.select(this);
                plan[plan.length - 1].push(["line", line.attr("x1"), line.attr("x2"), line.attr("y1"), line.attr("y2"), line.attr("stroke-width"), line.style("stroke"), line.attr("fill")]);
            });
            g.selectAll("polyline").each(function (d, i) {
                let polyline = d3.select(this);
                plan[plan.length - 1].push(["polyline", polyline.attr("points"), polyline.attr("stroke-width"), polyline.style("stroke"), polyline.attr("fill")]);
            });
            g.selectAll("polygon").each(function (d, i) {
                let polygon = d3.select(this);
                plan[plan.length - 1].push(["polygon", polygon.attr("points"), polygon.attr("stroke-width"), polygon.style("stroke"), polygon.attr("fill")]);
            });
            g.selectAll("path").each(function (d, i) {
                let path = d3.select(this);
                plan[plan.length - 1].push(["path", path.attr("d"), path.attr("stroke-width"), path.attr("stroke"), path.style("fill")]);
            });
        }
    );

    add_plan_to_library(plan, false);


    let to_serer_data: string[][] = [];
    for(let i=1;i<plan.length;i++){
        for(let j=0; j<default_objects.length;j++){
            if(default_objects[j][0][0]===plan[i][0][0]){
                to_serer_data.push([`${j}`, plan[i][0][2]]);
                break;
            }
        }
    }
    console.log("plan: ", plan); // default_objects
    console.log("to_server_data", to_serer_data);
    axios({ // READY
        url: 'api/v1/plan/add',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        data: {
            valid: [`${default_plans.length-1}`, `${height}`, `${width}`, "Office Mephi", `${plan[0][0][0]}`, `${plan[0][0][1]}`],
            objects: to_serer_data,
        },
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function add_object_on_canvas(object: any/*:string[][]*/) {
    let svg = gG.append("svg").attr("class", "for_rotating").attr("object_name", object[0][0]).attr("object_metadata", object[0][1]);
    let g = svg.append("g").attr("cursor", "grab");
    g.attr("transform", object[0][2] ? object[0][2] : `translate(0,0) rotate(0) scale(1)`);
    let elements: any[] = [];
    for (let j: number = 1; j < object.length; j++) {
        if (object[j][0] === "rect")
            elements.push(g.append(object[j][0]).attr("x", parseFloat(object[j][1])).attr("y", parseFloat(object[j][2])).attr("width", parseFloat(object[j][3])).attr("height", parseFloat(object[j][4])));
        else if (object[j][0] === "circle")
            elements.push(g.append(object[j][0]).attr("cx", parseFloat(object[j][1])).attr("cy", parseFloat(object[j][2])).attr("r", parseFloat(object[j][3])));
        else if (object[j][0] === "ellipse")
            elements.push(g.append(object[j][0]).attr("cx", parseFloat(object[j][1])).attr("cy", parseFloat(object[j][2])).attr("rx", parseFloat(object[j][3])).attr("ry", parseFloat(object[j][4])));
        else if (object[j][0] === "line")
            elements.push(g.append(object[j][0]).attr("x1", parseFloat(object[j][1])).attr("x2", parseFloat(object[j][2])).attr("y1", parseFloat(object[j][3])).attr("y2", parseFloat(object[j][4])).attr("stroke-width", parseFloat(object[j][5])).style("stroke", object[j][6]).attr("fill", object[j][7]));
        else if (object[j][0] === "polyline")
            elements.push(g.append(object[j][0]).attr("points", object[j][1]).attr("stroke-width", parseFloat(object[j][2])).style("stroke", object[j][3]).attr("fill", object[j][4]));
        else if (object[j][0] === "polygon")
            elements.push(g.append(object[j][0]).attr("points", object[j][1]).attr("stroke-width", parseFloat(object[j][2])).style("stroke", object[j][3]).attr("fill", object[j][4]));
        else if (object[j][0] === "path")
            elements.push(g.append(object[j][0]).attr("d", object[j][1]).attr("stroke-width", parseFloat(object[j][2])).style("stroke", object[j][3]).attr("fill", object[j][4]));
    }
    g.call(d3.drag() //SVGCircleElement - это для круга. Вот забава - для каждого типа элемента прописывать свои типы. !!!!!!!!!!!!!!!!!!!!!
        .on("start", (event, d) => { // event.sourceEvent.stopPropagation(); // если будут проблемы с тем, что при удалении одного не удаляется другой.
            let angle = parseFloat(g.attr("transform").split("otate(")[1].split(")")[0]);
            let translt = g.attr("transform").split("ranslate(")[1].split(")")[0];
            let scale = parseFloat(g.attr("transform").split("cale(")[1].split(")")[0]);
            if (event.sourceEvent.altKey && event.sourceEvent.shiftKey)
                scale *= 1.1;
            else if (event.sourceEvent.altKey)
                scale *= 0.9;
            else if (event.sourceEvent.shiftKey)
                svg.remove();
            g.attr("transform", `translate(${translt}) rotate(${angle}) scale(${scale})`);
            elements.forEach((element) => {
                element.raise();
                element.attr("cursor", "grabbing");
            });
        })
        .on("drag", (event, d) => {
            let angle = parseFloat(g.attr("transform").split("tate(")[1].split(")")[0]) % 360;
            let scale = parseFloat(g.attr("transform").split("cale(")[1].split(")")[0]);
            if (event.sourceEvent.ctrlKey)
                angle += 1;
            g.attr("transform", `translate(${event.x},${event.y}) rotate(${angle}) scale(${scale})`);
        })
        .on("end", (event, d) => {
            elements.forEach((element) => {
                element.attr("cursor", "grab");
            });
        })
    );
}

export function add_circle_to_grid() {
    let g = gG.append("g").attr("cursor", "grab");
    let circle = g.append("circle").attr("cx", 60).attr("cy", 60).attr("r", 50).attr("stroke", "black").attr("fill", "transparent");
    g.call(d3.drag() //SVGCircleElement - это для круга. Вот забава - для каждого типа элемента прописывать свои типы. !!!!!!!!!!!!!!!!!!!!!
        .on("start", (event, d) => {
            circle.raise();
            circle.attr("cursor", "grabbing");
            if (event.sourceEvent.shiftKey)
                circle.remove();
        })
        .on("drag", (event, d) => {
            circle.attr("cx", event.x).attr("cy", event.y);
        })
        .on("end", (event, d) => {
            circle.attr("cursor", "grab");
        })
    );
}

export function creating_grid_and_zoom() { // создаёт сетку и g для всех от него создающихся. нужно вызвать всего лишь раз.
    width = 800;
    height = 800;
    let svg = d3.select(".unreal_canvas").append("svg").attr("class", "real_canvas")
        .attr("viewBox", [0, 0, width, height]);
    let x = d3.scaleLinear().domain([-1, width + 1]).range([-1, width + 1]);
    let y = d3.scaleLinear().domain([-1, height + 1]).range([-1, height + 1]);
    let xAxis = d3.axisBottom(x).ticks(10).tickSize(height).tickPadding(8 - height);
    let yAxis = d3.axisRight(y).ticks(10).tickSize(width).tickPadding(8 - width);
    let gX = svg.append("g").attr("class", "axis axis--x").call(xAxis);
    let yX = svg.append("g").attr("class", "axis axis--y").call(yAxis);

    gG = svg.append("g").attr("cursor", "grab").attr("class", "main_g_for_grid");
    svg.call(d3.zoom<SVGSVGElement, unknown>()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 800])
        .on("zoom", (event, d) => {
            gX.call(xAxis.scale(event.transform.rescaleX(x)));
            yX.call(yAxis.scale(event.transform.rescaleY(y)));
            gG.attr("transform", event.transform);
        })
    );
}

export class CanvasField extends React.Component {
    render() {
        return (
            <div className={"unreal_canvas"}>
            </div>
        );
    }
}