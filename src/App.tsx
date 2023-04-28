import React from 'react';
import './App.css';
import {SignUp, sign_up_hide_bar} from './components/SignUpForm';
import {sign_in_hide_bar, SignIn} from './components/SignInForm';
import {CanvasField, creating_grid_and_zoom, clean_canvas} from "./components/CanvasField";
import {objects_library_visualize, ObjectsLibrary} from "./components/ObjectsLibrary";
import {plans_library_visualize, PlansLibrary, post_to_backend_default_plans} from "./components/PlansLibrary";
import {let_visible_to_none} from "./components/BaseScripts";
import {SavePlanForm} from "./components/SavePlanForm";
import {set_report_form_visible} from "./components/ReportForm";

//
function App() {
    return (
        <div>
            <div className={"buttons_field"}>
                <button className={"get_all_plans_button"} onMouseDown={plans_library_visualize}>Получить планы</button>
                <button className={"sign_in_button"} onMouseDown={sign_in_hide_bar}>Войти</button>
                <button className={"sign_up_button"} onMouseDown={sign_up_hide_bar}>Зарегистрироваться</button>
                <button className={"log_off_button"} onMouseDown={let_visible_to_none}>Выйти</button>
                <button className={"get_report"} onMouseDown={set_report_form_visible}>Получить отчёт</button>
            </div>
            <div className={"bottom_field"}>
                <div className={"buttons_for_creation_plan_field"}>
                    Кнопки по созданию плана
                    <p>
                        <button className={"objects_library_button"} onMouseDown={objects_library_visualize}>Библиотека
                            объектов
                        </button>
                    </p>
                    <p>Управление объектом / планом:<br/>Удаление:<br/>shift + ЛКМ<br/>Перемещение:<br/>Зажать и
                        тащить<br/>Кручение:<b/>Нажать на объект на ЛКМ и удерживать, нажать и удерживать ctrl, дальше
                        при движении мышки объект будет крутиться<br/>Уменьшение:<br/>Удерживая alt нажать на объект ЛКМ<br/>Увеличение:<br/>Удерживая
                        shift + alt нажать на объект ЛКМ</p>
                    <p><SavePlanForm/></p>
                </div>
                <div className={"canvas_field"}>
                    <button className={"test_button"} onMouseDown={creating_grid_and_zoom}>Запустить канвас</button>
                    <button className={"test_button"} onMouseDown={clean_canvas}>Очистить канвас</button>
                    <button className={"test_button"} onMouseDown={post_to_backend_default_plans}>Отправить все дефолтные планы в БД на сервер</button>
                    <p><CanvasField/></p>
                </div>
            </div>
            <SignUp/>
            <SignIn/>
            <ObjectsLibrary/>
            <PlansLibrary/>
        </div>
    );
}

export default App;