import React from 'react'
export default class ChildFolder extends React.Component{

    constructor(props){
        super(props)

        this.showFolder = props.showFolder
        this.state = {
            folder:props.folder
        }
    }

    render(){
        let folder=this.state.folder
        return (
            <a href="#" onClick={ () => this.showFolder(folder.id)}>{folder.name}</a>
        )
    }

}