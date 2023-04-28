import React from "react";
import * as d3 from "d3";

export function set_report_form_visible(){

}

function set_report_form_unvisible(){
    d3.select(".report_form").style("visibility", "hidden");
}

export class SignIn extends React.Component{
    render() {
        return (
            <div className={"report_form"}>
                <p className={"report_form_text"}></p>
                <p><button onMouseDown={set_report_form_unvisible}>Закрыть отчёт</button></p>
            </div>
        );
    }
}