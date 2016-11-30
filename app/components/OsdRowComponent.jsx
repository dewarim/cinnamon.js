import React from 'react'

export default class OsdRowComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {osd: props.osd}
    }

    render() {
        let osd = this.state.osd
        return (
            <tr>
                <td>{osd.id}</td>
                <td>{osd.name}</td>
                <td>{osd.type}</td>
                <td>{osd.version}</td>
                <td>{osd.contentSize}</td>
                <td>{osd.language}</td>
                <td>{osd.owner}</td>
                <td>{osd.lockedBy}</td>
            </tr>

        )
    }

}