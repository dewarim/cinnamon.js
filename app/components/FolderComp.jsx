import React from "react";
export default class FolderComp extends React.Component{

    constructor(props){
        super(props)
        this.folder = props.folder
    }

    render() {
        return (
            <div className="folder">
                Name: {this.props.folder.name}
            </div>

        )

    }
}