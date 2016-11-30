import React from 'react'


export default class OsdRowComponent extends React.Component {

    constructor(props) {
        super(props)
        this.osd=props.osd
    }

    render() {
        let lockedBy
        if(this.osd.lockedBy != undefined){
            lockedBy = this.osd.lockedBy.name
        }
        return (
            <tr>
                <td>{this.osd.id}</td>
                <td>{this.osd.name}</td>
                <td>{this.osd.objectType.name}</td>
                <td>{this.osd.version}</td>
                <td>{this.osd.contentSize}</td>
                <td>{this.osd.language.name}</td>
                <td>{this.osd.owner.name}</td>
                <td>{lockedBy}</td>
            </tr>

        )
    }

}