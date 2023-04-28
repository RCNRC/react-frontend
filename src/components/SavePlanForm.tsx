import "./SavePlanFormStyle.css"
import React from "react";
import {store_plan} from "./CanvasField";

interface SaveProps {
    name?: any;
    value?: any;
}

interface SaveState {
    planName: string,
    planMetadata: string,
    errors: {
        planName: string,
        planMetadata: string,
    }
}

export class SavePlanForm extends React.Component<SaveProps, SaveState> {
    constructor(props: SaveProps) {
        super(props);
        const initialState = {
            planName: '',
            planMetadata: '',
            errors: {
                planName: '',
                planMetadata: '',
            }
        }
        this.state = initialState;
        this.handleChange_save = this.handleChange_save.bind(this);
    }

    handleChange_save = (event: any) => {
        event.preventDefault();
        const {name, value} = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'username':
                errors.planName = value.length < 5 ? 'Username must be 5 characters long!' : '';
                break;
            default:
                break;
        }
        this.setState(Object.assign(this.state, {errors, [name]: value}));
        console.log(this.state.errors);
    }
    handleSubmit_save = (event: any) => {
        event.preventDefault();
        let is_validate = true;
        Object.values(this.state.errors).forEach(
            (val) => val.length > 0 && (is_validate = false)
        );
        if (is_validate) {
            store_plan(this.state.planName, this.state.planMetadata);
            console.log("Registering can be done");
        } else {
            console.log("You cannot be registered!!!")
        }
    }

    render() {
        const {errors} = this.state
        return (
            <form className={"save_plan_form"} onSubmit={this.handleSubmit_save} noValidate>Сохранить план:
                <p>
                    <div className='save_plan_name'>
                        <label htmlFor="planName">Название плана:</label>
                        <input type='text' name='planName' onChange={this.handleChange_save}/>
                        {errors.planName.length > 0 && <span style={{color: "red"}}>{errors.planName}</span>}
                    </div>
                </p>
                <p>
                    <div className='save_plan_metadata'>
                        <label htmlFor="planMetadata">Метаданные:</label>
                        <input type='text' name='planMetadata' onChange={this.handleChange_save}/>
                        {errors.planMetadata.length > 0 && <span style={{color: "red"}}>{errors.planMetadata}</span>}
                    </div>
                </p>
                <p>
                    <div className='submit'>
                        <button>Сохранить</button>
                    </div>
                </p>
            </form>
        )
    }
}