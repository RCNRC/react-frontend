import React from "react";
import "./PlansLibraryStyle.css"
import * as d3 from "d3";
import {add_object_on_canvas, width, height} from "./CanvasField";
import axios from "axios";
import {default_objects, initialize_default_objects} from "./ObjectsLibrary";
import {Simulate} from "react-dom/test-utils";
import copy = Simulate.copy;

let default_plans_library: string[][][][] = [
    [ // 1 plan
        // name, metadata
        [["plan name", "plan metadata"]],
        // object 1
        [["circle and circle", "metadata for circle_circle", "translate(0,0) rotate(0) scale(1)"], ["circle", "60", "60", "30"], ["circle", "10", "10", "8"]],
        // object 2
        [["one polyline", "its better then previous one", "translate(46,321) rotate(45) scale(1.4)"], ["polyline", "10 40 30 20 0 90 80 67", "4", "black", "transparent"], ["circle", "10", "10", "25"]],
    ],
    [ // 2 plan
        // name of plan and metadata
        [["plan 2 name", "plan 2 metadata"]],
        // object 1
        [["my first office", "1 floor", "translate(0,0) rotate(0) scale(1)"], ["circle", "60", "60", "30"], ["circle", "10", "10", "8"], ["polyline", "10 40 30 20 0 90 80 67", "4", "black", "transparent"], ["circle", "10", "10", "25"], ["polygon", "10 16 5 10 7 18 6 19 5 25 50 15 35 25 40 90 30 18 45 18", "3", "black", "black"]],
        // object 2
        [["my first office", "2 floor", "translate(100,100) rotate(20) scale(1.5)"], ["rect", "80", "60", "20", "40"], ["circle", "10", "10", "25"], ["line", "10", "40", "30", "20", "3", "black", "black"], ["path", "M 20 23 Q 40 205, 50 230 T 90 230", "3", "black", "black"]],
    ],
]

export let default_plans: string[][][][] = [[[[]]]];

let plans_num = 0;
let first_open: boolean = true;

export function post_to_backend_default_plans() {
    default_plans_library.forEach((plan: string[][][]) => {
        //let json_file = JSON.stringify(default_plan);
        let to_serer_data: string[][] = [];
        for (let i = 1; i < plan.length; i++) {
            for (let j = 0; j < default_objects.length; j++) {
                if (default_objects[j][0][0] === plan[i][0][0]) {
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
                valid: [`${default_plans.length}`, `${height}`, `${width}`, `${plan[0][0][0]}`, `${plan[0][0][1]}`],
                objects: to_serer_data,
            },
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    });
}

function initialize_default_plans() {
    axios({
        url: 'api/v1/plan',
        method: 'get',
        //headers: {'Content-Type': 'application/json'},
    })
        .then(function (response) {
            default_plans = [[[[]]]];
            if (default_objects.length < 1) {
                initialize_default_objects();
            }
            response.data.forEach((plan_data: any) => {
                let plan = JSON.parse(plan_data);
                let plan_name = plan.valid[4], plan_metadata = plan.valid[5];
                let plan_to_client: string[][][] = [[[plan_name, plan_metadata]]];
                plan.objects.forEach((object_data: string[]) => {
                    let object: string[][] = [[]];
                    for (let i = 0; i < default_objects.length; i++) {
                        if (/*default_objects[i][0][0]*/`${i}` === object_data[0]) {
                            object = default_objects[i];
                            break;
                        }
                    }
                    plan_to_client.push(object);
                    plan_to_client[plan_to_client.length - 1][0].push(object_data[1]);
                });
                default_plans.push(plan_to_client);
            });
            default_plans.splice(0, 1);
            default_plans.forEach((plan: string[][][]) => {
                add_plan_to_library(plan, true);
            });
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

    //let default_plans = default_plans_library;

}

export function add_plan_to_library(plan: string[][][], is_initialising: boolean) {
    let plan_name = plan[0][0][0];
    let plan_metadata = plan[0][0][1];
    let el = d3.select(".plans_library");
    let par = el.append("p").attr("class", `library_p_${plans_num}`);
    let p = par.append("p");
    p.append("text").text(`Название плана: ${plan_name}`);
    let metadata_p = par.append("p");
    metadata_p.append("text").text(`Метаданные плана: ${plan_metadata}`);
    let add_button_p = par.append("p");
    let delete_button_p = par.append("p");
    let add_button = add_button_p.append("button");
    add_button.append("text").text("Добавить план на канвас");
    add_button.on("mousedown", () => {
        for (let i = 1; i < plan.length; i++)
            add_object_on_canvas(plan[i]);
    });
    let delete_button = delete_button_p.append("button");
    delete_button.append("text").text("Удалить план из библиотеки");
    let plan_id: number = parseInt(JSON.parse(JSON.stringify(plans_num)));
    delete_button.on("mousedown", () => {
        par.remove();
        axios({ // при удалении плана пост запрос на сервер с id удаляемого плана
            url: 'api/v1/plan/add',
            method: 'post',
            data: plan_id,

        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    if(!is_initialising)
        default_plans.push(plan);

    plans_num++;
}

export function plans_library_visualize() {
    if (first_open) {
        initialize_default_plans();
        first_open = false;
    }
    let el = d3.select(".plans_library");
    let el_oth = d3.select(".objects_library");
    if (el_oth.style("visibility") === "visible")
        el_oth.style("visibility", "hidden");
    if (el.style("visibility") === "hidden")
        el.style("visibility", "visible");
    else
        el.style("visibility", "hidden");
}

export class PlansLibrary extends React.Component {
    render() {
        return (
            <div className={"plans_library"}>
                <p>Библиотека планов</p>
            </div>
        );
    }
}