import React from 'react'
export default class ChildFolder extends React.Component{

    constructor(props){
        super(props)

        this.stepInto = props.stepInto
        this.state = {
            folder:props.folder
        }
    }

    render(){
        let folder=this.state.folder
        return (
            <a href="#" onClick={this.stepInto.bind(null, folder.id)}>{folder.name}</a>
        )
    }

}